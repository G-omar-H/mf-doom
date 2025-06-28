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

    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    // Fetch real statistics from database
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      recentOrders,
      totalRevenue,
      topProducts
    ] = await Promise.all([
      // Total customer users
      prisma.user.count({
        where: { role: 'CUSTOMER' }
      }),
      
      // Total active products
      prisma.product.count({
        where: { status: 'ACTIVE' }
      }),
      
      // Total orders count
      prisma.order.count(),
      
      // Recent orders with customer details
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          totalAmount: true,
          guestEmail: true,
          createdAt: true,
          user: {
            select: {
              email: true,
              name: true
            }
          }
        }
      }),
      
      // Calculate total revenue from completed orders
      prisma.order.aggregate({
        _sum: {
          totalAmount: true
        },
        where: {
          status: 'DELIVERED'
        }
      }),
      
      // Top selling products by order frequency
      prisma.product.findMany({
        take: 5,
        where: { status: 'ACTIVE' },
        select: {
          id: true,
          name: true,
          price: true,
          images: {
            take: 1,
            select: { url: true }
          },
          orderItems: {
            select: {
              quantity: true,
              unitPrice: true,
              order: {
                select: {
                  status: true
                }
              }
            }
          }
        },
        orderBy: {
          orderItems: {
            _count: 'desc'
          }
        }
      })
    ])

    // Process recent orders for display
    const processedRecentOrders = recentOrders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: Number(order.totalAmount),
      customerEmail: order.user?.email || order.guestEmail || 'Guest Customer',
      customerName: order.user?.name || 'Guest',
      createdAt: order.createdAt
    }))

    // Calculate real revenue
    const calculatedRevenue = Number(totalRevenue._sum.totalAmount || 0)

    // Process top products with real sales data
    const processedTopProducts = topProducts.map(product => {
      const completedOrderItems = product.orderItems.filter(
        item => item.order.status === 'DELIVERED'
      )
      
      const totalSales = completedOrderItems.reduce(
        (sum, item) => sum + item.quantity, 0
      )
      
      const productRevenue = completedOrderItems.reduce(
        (sum, item) => sum + (Number(item.unitPrice) * item.quantity), 0
      )

      return {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        totalSales,
        revenue: productRevenue,
        images: product.images.map(img => img.url)
      }
    }).filter(product => product.totalSales > 0) // Only show products with sales

    const dashboardData = {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: calculatedRevenue,
      recentOrders: processedRecentOrders,
      topProducts: processedTopProducts
    }

    return NextResponse.json(dashboardData)

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 