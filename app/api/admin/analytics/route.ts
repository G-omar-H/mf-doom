import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if database is available
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'

    // Calculate date range
    const now = new Date()
    const daysAgo = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365
    const startDate = new Date()
    startDate.setDate(now.getDate() - daysAgo)

    // Calculate previous period for growth comparison
    const previousStartDate = new Date()
    previousStartDate.setDate(startDate.getDate() - daysAgo)

    // Simplified queries for Vercel serverless environment
    const [
      totalRevenue,
      totalOrders, 
      totalCustomers,
      previousRevenue,
      previousOrders,
      previousCustomers,
      allProducts,
      recentOrders
    ] = await Promise.all([
      // Current period revenue (simplified)
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: 'DELIVERED',
          createdAt: { gte: startDate }
        }
      }).catch(() => ({ _sum: { totalAmount: 0 } })),

      // Current period orders count
      prisma.order.count({
        where: { createdAt: { gte: startDate } }
      }).catch(() => 0),

      // Current period customers
      prisma.user.count({
        where: {
          role: 'CUSTOMER',
          createdAt: { gte: startDate }
        }
      }).catch(() => 0),

      // Previous period revenue
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: 'DELIVERED',
          createdAt: { gte: previousStartDate, lt: startDate }
        }
      }).catch(() => ({ _sum: { totalAmount: 0 } })),

      // Previous period orders
      prisma.order.count({
        where: { createdAt: { gte: previousStartDate, lt: startDate } }
      }).catch(() => 0),

      // Previous period customers
      prisma.user.count({
        where: {
          role: 'CUSTOMER',
          createdAt: { gte: previousStartDate, lt: startDate }
        }
      }).catch(() => 0),

      // Get all products for category analysis
      prisma.product.findMany({
        select: {
          id: true,
          name: true,
          category: true,
          price: true
        },
        take: 100 // Limit for performance
      }).catch(() => []),

      // Get recent orders for analysis
      prisma.order.findMany({
        where: {
          status: 'DELIVERED',
          createdAt: { gte: startDate }
        },
        select: {
          id: true,
          totalAmount: true,
          createdAt: true,
          orderItems: {
            select: {
              quantity: true,
              totalPrice: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  category: true
                }
              }
            }
          }
        },
        take: 500, // Limit for performance
        orderBy: { createdAt: 'desc' }
      }).catch(() => [])
    ])

    // Calculate metrics with fallbacks
    const currentRevenue = Number(totalRevenue._sum.totalAmount || 0)
    const prevRevenue = Number(previousRevenue._sum.totalAmount || 0)
    
    // Calculate average order value from recent orders
    const completedOrders = recentOrders.filter(order => Number(order.totalAmount) > 0)
    const averageOrderValue = completedOrders.length > 0 
      ? completedOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0) / completedOrders.length 
      : 0

    // Calculate growth percentages
    const revenueGrowth = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0
    const orderGrowth = previousOrders > 0 ? ((totalOrders - previousOrders) / previousOrders) * 100 : 0
    const customerGrowth = previousCustomers > 0 ? ((totalCustomers - previousCustomers) / previousCustomers) * 100 : 0

    // Process top products from order items
    const productStats: Record<string, { revenue: number, orders: number, name: string }> = {}
    
    recentOrders.forEach(order => {
      order.orderItems.forEach(item => {
        const productId = item.product.id
        if (!productStats[productId]) {
          productStats[productId] = {
            revenue: 0,
            orders: 0,
            name: item.product.name
          }
        }
        productStats[productId].revenue += Number(item.totalPrice)
        productStats[productId].orders += item.quantity
      })
    })

    const topProducts = Object.entries(productStats)
      .map(([id, stats]) => ({
        id,
        name: stats.name,
        revenue: stats.revenue,
        orders: stats.orders,
        views: Math.floor(stats.orders * 10) // Estimate views as 10x orders
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    // Process sales by category
    const categoryStats: Record<string, { revenue: number, orders: number }> = {}
    
    recentOrders.forEach(order => {
      order.orderItems.forEach(item => {
        const category = item.product.category
        if (!categoryStats[category]) {
          categoryStats[category] = { revenue: 0, orders: 0 }
        }
        categoryStats[category].revenue += Number(item.totalPrice)
        categoryStats[category].orders += item.quantity
      })
    })

    const salesByCategory = Object.entries(categoryStats).map(([category, data]) => ({
      category,
      revenue: data.revenue,
      orders: data.orders
    }))

    // Generate monthly data (simplified - using order creation dates)
    const monthlyStats: Record<string, { revenue: number, orders: number }> = {}
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`
      const monthName = monthNames[date.getMonth()]
      monthlyStats[monthKey] = { revenue: 0, orders: 0 }
    }

    // Populate with real data
    recentOrders.forEach(order => {
      const orderDate = new Date(order.createdAt)
      const monthKey = `${orderDate.getFullYear()}-${orderDate.getMonth()}`
      if (monthlyStats[monthKey]) {
        monthlyStats[monthKey].revenue += Number(order.totalAmount)
        monthlyStats[monthKey].orders += 1
      }
    })

    const revenueByMonth = Object.entries(monthlyStats).map(([key, data]) => {
      const [year, month] = key.split('-')
      return {
        month: monthNames[parseInt(month)],
        revenue: data.revenue,
        orders: data.orders
      }
    })

    // Calculate conversion rate (estimate)
    const totalViews = topProducts.reduce((sum, product) => sum + product.views, 0)
    const conversionRate = totalViews > 0 ? Math.min((totalOrders / totalViews) * 100, 100) : 2.5 // Default 2.5%

    const analyticsData = {
      totalRevenue: currentRevenue,
      totalOrders,
      totalCustomers,
      averageOrderValue,
      conversionRate,
      topProducts,
      salesByCategory,
      revenueByMonth,
      recentMetrics: {
        revenueGrowth: Number(revenueGrowth.toFixed(1)),
        orderGrowth: Number(orderGrowth.toFixed(1)),
        customerGrowth: Number(customerGrowth.toFixed(1))
      }
    }

    return NextResponse.json(analyticsData)

  } catch (error) {
    console.error('Analytics API error:', error)
    
    // Provide detailed error information for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorName = error instanceof Error ? error.name : 'Error'
    
    console.error('Error details:', {
      name: errorName,
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    })
    
    // Return a more generic but helpful error for production
    return NextResponse.json(
      { 
        error: 'Database query error. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
} 