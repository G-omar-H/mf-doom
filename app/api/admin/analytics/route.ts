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

    // Parallel data fetching for better performance
    const [
      totalRevenue,
      totalOrders, 
      totalCustomers,
      completedOrders,
      topProducts,
      recentOrders,
      previousPeriodRevenue,
      previousPeriodOrders,
      previousPeriodCustomers
    ] = await Promise.all([
      // Total revenue (delivered orders only)
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: 'DELIVERED',
          createdAt: { gte: startDate }
        }
      }),

      // Total orders count
      prisma.order.count({
        where: { createdAt: { gte: startDate } }
      }),

      // Total customers (unique users who placed orders)
      prisma.user.count({
        where: {
          role: 'CUSTOMER',
          createdAt: { gte: startDate }
        }
      }),

      // Completed orders for AOV calculation
      prisma.order.findMany({
        where: {
          status: 'DELIVERED',
          createdAt: { gte: startDate }
        },
        select: { totalAmount: true }
      }),

      // Top performing products
      prisma.product.findMany({
        take: 10,
        select: {
          id: true,
          name: true,
          orderItems: {
            where: {
              order: {
                status: 'DELIVERED',
                createdAt: { gte: startDate }
              }
            },
            select: {
              quantity: true,
              totalPrice: true
            }
          },
          productViews: {
            where: {
              createdAt: { gte: startDate }
            },
            select: { id: true }
          }
        }
      }),

      // Recent orders for growth calculation baseline
      prisma.order.findMany({
        where: {
          createdAt: { gte: startDate }
        },
        select: {
          totalAmount: true,
          createdAt: true,
          status: true
        },
        orderBy: { createdAt: 'desc' }
      }),

      // Previous period data for growth calculations
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: 'DELIVERED',
          createdAt: {
            gte: new Date(startDate.getTime() - (daysAgo * 24 * 60 * 60 * 1000)),
            lt: startDate
          }
        }
      }),

      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(startDate.getTime() - (daysAgo * 24 * 60 * 60 * 1000)),
            lt: startDate
          }
        }
      }),

      prisma.user.count({
        where: {
          role: 'CUSTOMER',
          createdAt: {
            gte: new Date(startDate.getTime() - (daysAgo * 24 * 60 * 60 * 1000)),
            lt: startDate
          }
        }
      })
    ])

    // Calculate metrics
    const currentRevenue = Number(totalRevenue._sum.totalAmount || 0)
    const previousRevenue = Number(previousPeriodRevenue._sum.totalAmount || 0)
    const averageOrderValue = completedOrders.length > 0 
      ? completedOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0) / completedOrders.length 
      : 0

    // Calculate growth percentages
    const revenueGrowth = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
      : 0
    const orderGrowth = previousPeriodOrders > 0 
      ? ((totalOrders - previousPeriodOrders) / previousPeriodOrders) * 100 
      : 0
    const customerGrowth = previousPeriodCustomers > 0 
      ? ((totalCustomers - previousPeriodCustomers) / previousPeriodCustomers) * 100 
      : 0

    // Process top products
    const processedTopProducts = topProducts
      .map(product => {
        const totalRevenue = product.orderItems.reduce((sum, item) => sum + Number(item.totalPrice), 0)
        const totalOrders = product.orderItems.reduce((sum, item) => sum + item.quantity, 0)
        const totalViews = product.productViews.length

        return {
          id: product.id,
          name: product.name,
          revenue: totalRevenue,
          orders: totalOrders,
          views: totalViews
        }
      })
      .filter(product => product.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    // Get product categories for sales breakdown
    const categoryData = await prisma.product.findMany({
      where: {
        orderItems: {
          some: {
            order: {
              status: 'DELIVERED',
              createdAt: { gte: startDate }
            }
          }
        }
      },
      select: {
        category: true,
        orderItems: {
          where: {
            order: {
              status: 'DELIVERED',
              createdAt: { gte: startDate }
            }
          },
          select: {
            totalPrice: true,
            quantity: true
          }
        }
      }
    })

    // Process sales by category
    const categoryTotals: Record<string, { revenue: number, orders: number }> = {}
    categoryData.forEach(product => {
      const category = product.category
      if (!categoryTotals[category]) {
        categoryTotals[category] = { revenue: 0, orders: 0 }
      }
      product.orderItems.forEach(item => {
        categoryTotals[category].revenue += Number(item.totalPrice)
        categoryTotals[category].orders += item.quantity
      })
    })

    const processedSalesByCategory = Object.entries(categoryTotals).map(([category, data]) => ({
      category,
      revenue: data.revenue,
      orders: data.orders
    }))

    // Generate monthly revenue data (more realistic based on actual data)
    const monthlyData = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date()
      monthDate.setMonth(monthDate.getMonth() - i)
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)
      
      // Get actual monthly data
      const monthlyOrders = await prisma.order.findMany({
        where: {
          status: 'DELIVERED',
          createdAt: {
            gte: monthStart,
            lte: monthEnd
          }
        },
        select: {
          totalAmount: true
        }
      })
      
      const monthlyOrderCount = await prisma.order.count({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      })
      
      const monthRevenue = monthlyOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0)
      
      monthlyData.push({
        month: monthNames[monthDate.getMonth()],
        revenue: monthRevenue,
        orders: monthlyOrderCount
      })
    }

    // Get daily revenue for the last 30 days for trend analysis
    const dailyRevenueData = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
      
      const dailyOrders = await prisma.order.findMany({
        where: {
          status: 'DELIVERED',
          createdAt: {
            gte: dayStart,
            lt: dayEnd
          }
        },
        select: {
          totalAmount: true
        }
      })
      
      const dailyRevenue = dailyOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0)
      
      dailyRevenueData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: dailyRevenue,
        orders: dailyOrders.length
      })
    }

    const analyticsData = {
      totalRevenue: currentRevenue,
      totalOrders,
      totalCustomers,
      averageOrderValue,
      conversionRate: 2.5, // This would be calculated from actual visitor data
      topProducts: processedTopProducts,
      salesByCategory: processedSalesByCategory,
      revenueByMonth: monthlyData,
      dailyRevenue: dailyRevenueData,
      recentMetrics: {
        revenueGrowth: Number(revenueGrowth.toFixed(1)),
        orderGrowth: Number(orderGrowth.toFixed(1)),
        customerGrowth: Number(customerGrowth.toFixed(1))
      }
    }

    return NextResponse.json(analyticsData)

  } catch (error) {
    console.error('Analytics API error:', error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('connect')) {
        return NextResponse.json(
          { error: 'Database connection failed. Please check your database configuration.' },
          { status: 503 }
        )
      }
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Request timeout. The analytics query is taking too long.' },
          { status: 504 }
        )
      }
      if (error.name === 'PrismaClientKnownRequestError') {
        return NextResponse.json(
          { error: 'Database query error. Please try again later.' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error while generating analytics' },
      { status: 500 }
    )
  }
} 