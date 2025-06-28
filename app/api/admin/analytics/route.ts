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

    // Efficient parallel data fetching using real data only
    const [
      totalRevenue,
      totalOrders, 
      totalCustomers,
      completedOrders,
      previousRevenue,
      previousOrders,
      previousCustomers,
      topProductsWithItems,
      categoryData,
      monthlyOrdersRaw,
      productCategories
    ] = await Promise.all([
      // Current period revenue (delivered orders only)
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: 'DELIVERED',
          createdAt: { gte: startDate }
        }
      }),

      // Current period orders count
      prisma.order.count({
        where: { createdAt: { gte: startDate } }
      }),

      // Current period customers
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

      // Previous period revenue for growth calculation
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: 'DELIVERED',
          createdAt: { gte: previousStartDate, lt: startDate }
        }
      }),

      // Previous period orders for growth calculation
      prisma.order.count({
        where: { createdAt: { gte: previousStartDate, lt: startDate } }
      }),

      // Previous period customers for growth calculation
      prisma.user.count({
        where: {
          role: 'CUSTOMER',
          createdAt: { gte: previousStartDate, lt: startDate }
        }
      }),

      // Top products with their order items (real data)
      prisma.product.findMany({
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
            }
          }
        }
      }),

      // Real category sales data
      prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
          order: {
            status: 'DELIVERED',
            createdAt: { gte: startDate }
          }
        },
        _sum: {
          totalPrice: true,
          quantity: true
        }
      }),

      // Real monthly data (last 6 months)
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          COUNT(*)::int as order_count,
          SUM("totalAmount")::float as total_revenue
        FROM orders 
        WHERE "status" = 'DELIVERED' 
        AND "createdAt" >= ${new Date(now.getFullYear(), now.getMonth() - 5, 1)}
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month DESC
        LIMIT 6
      `,

      // Get all products with categories for category grouping
      prisma.product.findMany({
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
          id: true,
          category: true
        }
      })
    ])

    // Calculate real metrics
    const currentRevenue = Number(totalRevenue._sum.totalAmount || 0)
    const prevRevenue = Number(previousRevenue._sum.totalAmount || 0)
    const averageOrderValue = completedOrders.length > 0 
      ? completedOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0) / completedOrders.length 
      : 0

    // Calculate real growth percentages
    const revenueGrowth = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0
    const orderGrowth = previousOrders > 0 ? ((totalOrders - previousOrders) / previousOrders) * 100 : 0
    const customerGrowth = previousCustomers > 0 ? ((totalCustomers - previousCustomers) / previousCustomers) * 100 : 0

    // Process top products with real data
    const processedTopProducts = topProductsWithItems
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

    // Process real sales by category
    const categoryTotals: Record<string, { revenue: number, orders: number }> = {}
    categoryData.forEach(item => {
      const product = productCategories.find(p => p.id === item.productId)
      if (product) {
        const category = product.category
        if (!categoryTotals[category]) {
          categoryTotals[category] = { revenue: 0, orders: 0 }
        }
        categoryTotals[category].revenue += Number(item._sum.totalPrice || 0)
        categoryTotals[category].orders += Number(item._sum.quantity || 0)
      }
    })

    const salesByCategory = Object.entries(categoryTotals).map(([category, data]) => ({
      category,
      revenue: data.revenue,
      orders: data.orders
    }))

    // Process real monthly data
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthlyData = (monthlyOrdersRaw as any[])
      .map(row => ({
        month: monthNames[new Date(row.month).getMonth()],
        revenue: Number(row.total_revenue || 0),
        orders: Number(row.order_count || 0)
      }))
      .reverse()

    // Calculate real conversion rate (basic approximation)
    const totalViews = processedTopProducts.reduce((sum, product) => sum + product.views, 0)
    const conversionRate = totalViews > 0 ? (totalOrders / totalViews) * 100 : 0

    const analyticsData = {
      totalRevenue: currentRevenue,
      totalOrders,
      totalCustomers,
      averageOrderValue,
      conversionRate: Math.max(0, Math.min(100, conversionRate)), // Ensure reasonable range
      topProducts: processedTopProducts,
      salesByCategory,
      revenueByMonth: monthlyData,
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