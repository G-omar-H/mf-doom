'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface VisitorData {
  sessionId: string
  timestamp: number
  pathname: string
  userAgent: string
  referrer: string
  language: string
  timezone: string
  screenResolution: string
  deviceType: 'mobile' | 'tablet' | 'desktop'
  ip?: string
  country?: string
  region?: string
  city?: string
  latitude?: number
  longitude?: number
  isp?: string
  isBot: boolean
}

interface GeoLocationData {
  ip: string
  country: string
  region: string
  city: string
  latitude: number
  longitude: number
  timezone: string
  isp: string
}

// Generate session ID
function generateSessionId(): string {
  return `doom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Detect device type
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'
  
  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
  const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent)
  
  if (isTablet) return 'tablet'
  if (isMobile) return 'mobile'
  return 'desktop'
}

// Detect if visitor is a bot
function isBot(): boolean {
  if (typeof window === 'undefined') return false
  
  const botPatterns = [
    /bot/i, /spider/i, /crawler/i, /search/i, /yahoo/i, /bing/i, /google/i,
    /baidu/i, /yandex/i, /facebook/i, /twitter/i, /linkedin/i
  ]
  
  return botPatterns.some(pattern => pattern.test(navigator.userAgent))
}

// Get geolocation data from IP
async function getGeoLocation(): Promise<GeoLocationData | null> {
  try {
    // Using ipapi.co for geolocation (free tier: 1000 requests/day)
    const response = await fetch('https://ipapi.co/json/')
    if (!response.ok) throw new Error('Geolocation request failed')
    
    const data = await response.json()
    
    return {
      ip: data.ip || 'unknown',
      country: data.country_name || 'unknown',
      region: data.region || 'unknown',
      city: data.city || 'unknown',
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      timezone: data.timezone || 'unknown',
      isp: data.org || 'unknown'
    }
  } catch (error) {
    console.warn('Failed to get geolocation:', error)
    return null
  }
}

// Send visitor data to API
async function sendVisitorData(data: VisitorData) {
  try {
    await fetch('/api/analytics/visitor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  } catch (error) {
    console.warn('Failed to send visitor data:', error)
  }
}

export function VisitorTracking() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      let id = sessionStorage.getItem('doom_session_id')
      if (!id) {
        id = generateSessionId()
        sessionStorage.setItem('doom_session_id', id)
      }
      return id
    }
    return generateSessionId()
  })

  // Track page views and collect visitor data
  useEffect(() => {
    let mounted = true

    const trackVisitor = async () => {
      if (typeof window === 'undefined') return

      // Skip tracking for admin users
      if (session?.user?.role === 'ADMIN') {
        console.log('🔒 Skipping visitor tracking for admin user')
        return
      }

      // Basic visitor data
      const visitorData: VisitorData = {
        sessionId,
        timestamp: Date.now(),
        pathname,
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct',
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screenResolution: `${screen.width}x${screen.height}`,
        deviceType: getDeviceType(),
        isBot: isBot()
      }

      // Get geolocation data
      const geoData = await getGeoLocation()
      if (geoData && mounted) {
        visitorData.ip = geoData.ip
        visitorData.country = geoData.country
        visitorData.region = geoData.region
        visitorData.city = geoData.city
        visitorData.latitude = geoData.latitude
        visitorData.longitude = geoData.longitude
        visitorData.isp = geoData.isp
      }

      // Send data to API (only if not a bot and in production or debug mode)
      if (!visitorData.isBot && mounted) {
        if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ANALYTICS_DEBUG) {
          await sendVisitorData(visitorData)
        }
      }
    }

    // Delay tracking to avoid blocking initial render
    const timer = setTimeout(trackVisitor, 1000)

    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [pathname, sessionId, session?.user?.role])

  // Track user engagement (time on page)
  useEffect(() => {
    // Skip engagement tracking for admin users
    if (session?.user?.role === 'ADMIN') {
      return
    }

    let startTime = Date.now()
    let isActive = true

    const trackEngagement = () => {
      if (!isActive) return

      const timeSpent = Date.now() - startTime
      
      // Track engagement milestones
      if (timeSpent >= 30000) { // 30 seconds
        sendVisitorData({
          sessionId,
          timestamp: Date.now(),
          pathname,
          userAgent: navigator.userAgent,
          referrer: 'engagement_tracking',
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          screenResolution: `${screen.width}x${screen.height}`,
          deviceType: getDeviceType(),
          isBot: false
        })
      }
    }

    // Track when user becomes inactive
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        isActive = false
        trackEngagement()
      } else {
        isActive = true
        startTime = Date.now()
      }
    }

    // Track before page unload
    const handleBeforeUnload = () => {
      trackEngagement()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      trackEngagement()
    }
  }, [pathname, sessionId, session?.user?.role])

  // Don't render anything in development unless debug mode
  if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_ANALYTICS_DEBUG) {
    return null
  }

  return null // This component doesn't render anything visible
}

// Export tracking functions for manual use
export { sendVisitorData, getGeoLocation, getDeviceType } 