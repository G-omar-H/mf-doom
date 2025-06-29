import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

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

export async function POST(request: NextRequest) {
  try {
    const data: VisitorData = await request.json()

    // Validate required fields
    if (!data.sessionId || !data.pathname) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Skip if bot detected
    if (data.isBot) {
      return NextResponse.json({ success: true, skipped: 'bot detected' })
    }

    // Get IP from request if not provided
    let clientIp = data.ip
    if (!clientIp) {
      const forwarded = request.headers.get('x-forwarded-for')
      const realIp = request.headers.get('x-real-ip')
      clientIp = forwarded?.split(',')[0] || realIp || 'unknown'
    }

    // Check if database is available
    if (!prisma) {
      console.warn('Database not available, skipping visitor tracking')
      return NextResponse.json({ success: true, skipped: 'database unavailable' })
    }

    // Store visitor data in database
    await prisma.visitorAnalytics.create({
      data: {
        sessionId: data.sessionId,
        pathname: data.pathname,
        userAgent: data.userAgent,
        referrer: data.referrer,
        language: data.language,
        timezone: data.timezone,
        screenResolution: data.screenResolution,
        deviceType: data.deviceType,
        ip: clientIp,
        country: data.country || null,
        region: data.region || null,
        city: data.city || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        isp: data.isp || null,
        timestamp: new Date(data.timestamp),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Visitor tracking error:', error)
    
    // Don't fail the request if analytics fails
    return NextResponse.json({ 
      success: true, 
      skipped: 'error occurred',
      error: process.env.NODE_ENV === 'development' ? String(error) : 'internal error'
    })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Comprehensive analytics endpoint for admin use
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')
    const limit = parseInt(searchParams.get('limit') || '100')

    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    // Get visitor stats for the last N days
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    const lastHour = new Date(Date.now() - 60 * 60 * 1000) // Last hour for real-time
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours

    const [
      totalVisitors, 
      uniqueVisitors, 
      topCountries, 
      topPages, 
      deviceStats,
      realtimeVisitors,
      sessionData,
      hourlyData
    ] = await Promise.all([
      // Total page views
      prisma.visitorAnalytics.count({
        where: { timestamp: { gte: since } }
      }),

      // Unique visitors (unique sessions)
      prisma.visitorAnalytics.groupBy({
        by: ['sessionId'],
        where: { timestamp: { gte: since } },
        _count: { sessionId: true }
      }),

      // Top countries
      prisma.visitorAnalytics.groupBy({
        by: ['country'],
        where: { 
          timestamp: { gte: since },
          country: { not: null }
        },
        _count: { country: true },
        orderBy: { _count: { country: 'desc' } },
        take: 10
      }),

      // Top pages
      prisma.visitorAnalytics.groupBy({
        by: ['pathname'],
        where: { timestamp: { gte: since } },
        _count: { pathname: true },
        orderBy: { _count: { pathname: 'desc' } },
        take: 10
      }),

      // Device type stats
      prisma.visitorAnalytics.groupBy({
        by: ['deviceType'],
        where: { timestamp: { gte: since } },
        _count: { deviceType: true },
        orderBy: { _count: { deviceType: 'desc' } }
      }),

      // Real-time visitors (last hour)
      prisma.visitorAnalytics.groupBy({
        by: ['sessionId'],
        where: { timestamp: { gte: lastHour } },
        _count: { sessionId: true }
      }),

      // Session data for calculating average session duration
      prisma.visitorAnalytics.groupBy({
        by: ['sessionId'],
        where: { timestamp: { gte: since } },
        _min: { timestamp: true },
        _max: { timestamp: true },
        _count: { sessionId: true }
      }),

      // Hourly traffic data for last 24 hours
      prisma.visitorAnalytics.findMany({
        where: { timestamp: { gte: last24Hours } },
        select: {
          timestamp: true,
          sessionId: true
        }
      })
    ])

    // Calculate average session duration
    let totalSessionDuration = 0
    let validSessions = 0
    
    sessionData.forEach(session => {
      if (session._min.timestamp && session._max.timestamp && session._count.sessionId > 1) {
        const duration = session._max.timestamp.getTime() - session._min.timestamp.getTime()
        totalSessionDuration += duration
        validSessions++
      }
    })
    
    const avgSessionDuration = validSessions > 0 ? Math.round(totalSessionDuration / validSessions / 1000) : 0

    // Calculate bounce rate (sessions with only 1 page view)
    const bouncedSessions = sessionData.filter(session => session._count.sessionId === 1).length
    const bounceRate = uniqueVisitors.length > 0 ? (bouncedSessions / uniqueVisitors.length) * 100 : 0

    // Process hourly traffic data
    const hourlyTraffic = Array.from({ length: 24 }, (_, hour) => {
      const hourStart = new Date(last24Hours.getTime() + hour * 60 * 60 * 1000)
      const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000)
      
      const hourData = hourlyData.filter(record => 
        record.timestamp >= hourStart && record.timestamp < hourEnd
      )
      
      const uniqueSessionsThisHour = new Set(hourData.map(record => record.sessionId)).size
      
      return {
        hour: hour,
        visitors: uniqueSessionsThisHour,
        pageViews: hourData.length
      }
    })

    return NextResponse.json({
      period: `${days} days`,
      totalPageViews: totalVisitors,
      uniqueVisitors: uniqueVisitors.length,
      realTimeVisitors: realtimeVisitors.length,
      avgSessionDuration: avgSessionDuration,
      bounceRate: Math.round(bounceRate * 10) / 10, // Round to 1 decimal
      topCountries: topCountries.map(item => ({
        country: item.country,
        visits: item._count.country
      })),
      topPages: topPages.map(item => ({
        page: item.pathname,
        visits: item._count.pathname
      })),
      deviceTypes: deviceStats.map(item => ({
        device: item.deviceType,
        visits: item._count.deviceType
      })),
      hourlyTraffic: hourlyTraffic
    })
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
} 