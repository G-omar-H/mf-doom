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
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Request timeout')), 25000) // 25 second timeout
  )

  try {
    const result = await Promise.race([
      getAnalyticsData(request),
      timeoutPromise
    ])
    return result as NextResponse
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { 
        error: 'Analytics data temporarily unavailable',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

async function getAnalyticsData(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get('days') || '7')
  const limit = parseInt(searchParams.get('limit') || '100')

  if (!prisma) {
    return NextResponse.json({ error: 'Database not available' }, { status: 503 })
  }

  // Calculate time ranges
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const lastFiveMinutes = new Date(Date.now() - 5 * 60 * 1000) // More accurate "real-time"
  const lastHour = new Date(Date.now() - 60 * 60 * 1000)
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)

  // Step 1: Get basic counts (fast queries)
  console.log('📊 Fetching basic analytics...')
  const [totalVisitors, deviceStats] = await Promise.all([
    prisma.visitorAnalytics.count({
      where: { timestamp: { gte: since } }
    }).catch(() => 0),

    prisma.visitorAnalytics.groupBy({
      by: ['deviceType'],
      where: { timestamp: { gte: since } },
      _count: { deviceType: true },
      orderBy: { _count: { deviceType: 'desc' } }
    }).catch(() => [])
  ])

  // Step 2: Get unique visitors and countries (simplified)
  console.log('🌍 Fetching visitor demographics...')
  const [uniqueVisitorsRaw, topCountriesRaw] = await Promise.all([
    prisma.visitorAnalytics.findMany({
      where: { timestamp: { gte: since } },
      select: { sessionId: true },
      distinct: ['sessionId']
    }).catch(() => []),

    prisma.visitorAnalytics.groupBy({
      by: ['country'],
      where: { 
        timestamp: { gte: since },
        country: { not: null }
      },
      _count: { country: true },
      orderBy: { _count: { country: 'desc' } },
      take: 10
    }).catch(() => [])
  ])

  const uniqueVisitors = uniqueVisitorsRaw.length

  // Step 3: Get page data and real-time visitors
  console.log('📄 Fetching page analytics...')
  const [topPages, realtimeVisitorsRaw] = await Promise.all([
    prisma.visitorAnalytics.groupBy({
      by: ['pathname'],
      where: { timestamp: { gte: since } },
      _count: { pathname: true },
      orderBy: { _count: { pathname: 'desc' } },
      take: 10
    }).catch(() => []),

    prisma.visitorAnalytics.findMany({
      where: { timestamp: { gte: lastFiveMinutes } },
      select: { sessionId: true },
      distinct: ['sessionId']
    }).catch(() => [])
  ])

  const realTimeVisitors = realtimeVisitorsRaw.length

  // Step 4: Get session data for duration calculation (optimized)
  console.log('⏱️ Calculating session metrics...')
  const sessionData = await prisma.visitorAnalytics.groupBy({
    by: ['sessionId'],
    where: { timestamp: { gte: since } },
    _min: { timestamp: true },
    _max: { timestamp: true },
    _count: { sessionId: true }
  }).catch(() => [])

  // Calculate session metrics
  let totalSessionDuration = 0
  let validSessions = 0
  let bouncedSessions = 0

  sessionData.forEach(session => {
    if (session._count.sessionId === 1) {
      bouncedSessions++
    } else if (session._min.timestamp && session._max.timestamp && session._count.sessionId > 1) {
      const duration = session._max.timestamp.getTime() - session._min.timestamp.getTime()
      totalSessionDuration += duration
      validSessions++
    }
  })

  const avgSessionDuration = validSessions > 0 ? Math.round(totalSessionDuration / validSessions / 1000) : 0
  const bounceRate = uniqueVisitors > 0 ? (bouncedSessions / uniqueVisitors) * 100 : 0

  // Step 5: Get hourly traffic data (simplified)
  console.log('📈 Fetching hourly traffic...')
  const hourlyDataRaw = await prisma.visitorAnalytics.findMany({
    where: { timestamp: { gte: last24Hours } },
    select: {
      timestamp: true,
      sessionId: true
    }
  }).catch(() => [])

  // Step 6: Get individual visitor locations with coordinates (optimized for Vercel)
  console.log('🗺️ Fetching visitor locations...')
  let visitorLocations: Array<{
    sessionId: string;
    latitude: number | null;
    longitude: number | null;
    country: string | null;
    city: string | null;
    timestamp: Date;
  }> = []
  
  try {
    // Optimized query: only fetch locations from last 3 days for performance
    const locationsSince = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    
    visitorLocations = await prisma.visitorAnalytics.findMany({
      where: { 
        timestamp: { 
          gte: locationsSince, // Shorter time range for performance
          lte: new Date() 
        },
        latitude: { 
          not: null,
          gte: -90,  // Valid latitude range
          lte: 90
        },
        longitude: { 
          not: null,
          gte: -180, // Valid longitude range  
          lte: 180
        }
      },
      select: {
        sessionId: true,
        latitude: true,
        longitude: true,
        country: true,
        city: true,
        timestamp: true
      },
      distinct: ['sessionId'], // One location per unique visitor
      take: 100, // Reduced limit for Vercel performance
      orderBy: { timestamp: 'desc' }
    })
    
    console.log(`📍 Found ${visitorLocations.length} visitor locations`)
  } catch (error) {
    console.warn('⚠️ Visitor locations query failed, map will show countries only:', error)
    visitorLocations = [] // Graceful fallback - map still works without individual locations
  }

  // Process hourly data efficiently
  const hourlyTraffic = Array.from({ length: 24 }, (_, hour) => {
    const hourStart = new Date(last24Hours.getTime() + hour * 60 * 60 * 1000)
    const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000)
    
    const hourData = hourlyDataRaw.filter(record => 
      record.timestamp >= hourStart && record.timestamp < hourEnd
    )
    
    const uniqueSessionsThisHour = new Set(hourData.map(record => record.sessionId)).size
    
    return {
      hour: hour,
      visitors: uniqueSessionsThisHour,
      pageViews: hourData.length
    }
  })

  console.log('✅ Analytics data compiled successfully')

  // Return the exact same data structure as before
  return NextResponse.json({
    period: `${days} days`,
    totalPageViews: totalVisitors,
    uniqueVisitors: uniqueVisitors,
    realTimeVisitors: realTimeVisitors,
    avgSessionDuration: avgSessionDuration,
    bounceRate: Math.round(bounceRate * 10) / 10,
    topCountries: topCountriesRaw.map(item => ({
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
    hourlyTraffic: hourlyTraffic,
    visitorLocations: visitorLocations
  })
} 