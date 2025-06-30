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
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    console.log('🔍 Inspecting database contents...')

    // Get all data counts and sample records
    const [
      orderCount,
      orderItemCount,
      userCount,
      reviewCount,
      analyticsCount,
      visitorAnalyticsCount,
      productViewCount,
      wishlistCount,
      productCount,
      inventoryCount
    ] = await Promise.all([
      prisma.order.count(),
      prisma.orderItem.count(),
      prisma.user.count(),
      prisma.productReview.count(),
      prisma.salesAnalytics.count(),
      prisma.visitorAnalytics.count(),
      prisma.productView.count(),
      prisma.wishlistItem.count(),
      prisma.product.count(),
      prisma.inventoryItem.count()
    ])

    // Get sample data to inspect
    const [
      sampleOrders,
      sampleUsers,
      sampleReviews
    ] = await Promise.all([
      prisma.order.findMany({
        take: 5,
        select: {
          id: true,
          orderNumber: true,
          guestEmail: true,
          userId: true,
          status: true,
          totalAmount: true,
          createdAt: true,
          user: {
            select: {
              email: true,
              name: true
            }
          }
        }
      }),
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
        }
      }),
      prisma.productReview.findMany({
        take: 5,
        select: {
          id: true,
          title: true,
          rating: true,
          verified: true,
          createdAt: true,
          user: {
            select: {
              email: true,
              name: true
            }
          }
        }
      })
    ])

    const inspection = {
      counts: {
        orders: orderCount,
        orderItems: orderItemCount,
        users: userCount,
        reviews: reviewCount,
        salesAnalytics: analyticsCount,
        visitorAnalytics: visitorAnalyticsCount,
        productViews: productViewCount,
        wishlistItems: wishlistCount,
        products: productCount,
        inventory: inventoryCount
      },
      samples: {
        orders: sampleOrders,
        users: sampleUsers,
        reviews: sampleReviews
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database inspection completed',
      data: inspection
    })

  } catch (error) {
    console.error('❌ Error inspecting database:', error)
    return NextResponse.json(
      { 
        error: 'Inspection failed', 
        details: process.env.NODE_ENV === 'development' ? error : undefined 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    const { action, confirm, options = {} } = await request.json()
    
    if (confirm !== 'DELETE_CONFIRMED') {
      return NextResponse.json(
        { 
          error: 'Missing confirmation', 
          message: 'Send { "confirm": "DELETE_CONFIRMED" } to proceed'
        },
        { status: 400 }
      )
    }

    console.log('🧹 Starting database cleanup with action:', action)

    let summary = {
      deleted: {},
      remaining: {}
    }

    switch (action) {
      case 'ORDERS_ONLY':
        console.log('🗑️  Deleting only orders and order items...')
        const deletedOrderItems = await prisma.orderItem.deleteMany({})
        const deletedOrders = await prisma.order.deleteMany({})
        
        summary.deleted = {
          orders: deletedOrders.count,
          orderItems: deletedOrderItems.count
        }
        break

      case 'REVIEWS_ONLY':
        console.log('🗑️  Deleting only product reviews...')
        const deletedReviews = await prisma.productReview.deleteMany({})
        
        summary.deleted = {
          reviews: deletedReviews.count
        }
        break

      case 'ANALYTICS_ONLY':
        console.log('🗑️  Deleting only analytics data...')
        const deletedAnalytics = await prisma.salesAnalytics.deleteMany({})
        const deletedVisitorAnalytics = await prisma.visitorAnalytics.deleteMany({})
        const deletedProductViews = await prisma.productView.deleteMany({})
        
        summary.deleted = {
          salesAnalytics: deletedAnalytics.count,
          visitorAnalytics: deletedVisitorAnalytics.count,
          productViews: deletedProductViews.count
        }
        break

      case 'TEST_USERS_ONLY':
        console.log('🗑️  Deleting test users...')
        // Delete users that look like test users
        const testUserPatterns = [
          'test@',
          '@test.',
          '@example.',
          '@localhost',
          'demo@',
          'sample@',
          '.local'
        ]
        
        const testUsers = await prisma.user.findMany({
          where: {
            OR: testUserPatterns.map(pattern => ({
              email: {
                contains: pattern
              }
            }))
          }
        })

        const deletedTestUsers = await prisma.user.deleteMany({
          where: {
            OR: testUserPatterns.map(pattern => ({
              email: {
                contains: pattern
              }
            }))
          }
        })
        
        summary.deleted = {
          testUsers: deletedTestUsers.count,
          deletedEmails: testUsers.map(u => u.email)
        }
        break

      case 'ALL_TRANSACTIONAL_DATA':
        console.log('🗑️  Deleting all transactional data (orders, reviews, analytics)...')
        
        // Delete all transactional data but keep products and inventory
        const [
          delOrderItems,
          delOrders,
          delReviews,
          delAnalytics,
          delVisitorAnalytics,
          delProductViews,
          delWishlist
        ] = await Promise.all([
          prisma.orderItem.deleteMany({}),
          prisma.order.deleteMany({}),
          prisma.productReview.deleteMany({}),
          prisma.salesAnalytics.deleteMany({}),
          prisma.visitorAnalytics.deleteMany({}),
          prisma.productView.deleteMany({}),
          prisma.wishlistItem.deleteMany({})
        ])
        
        summary.deleted = {
          orderItems: delOrderItems.count,
          orders: delOrders.count,
          reviews: delReviews.count,
          salesAnalytics: delAnalytics.count,
          visitorAnalytics: delVisitorAnalytics.count,
          productViews: delProductViews.count,
          wishlistItems: delWishlist.count
        }
        break

      case 'NUCLEAR_OPTION':
        console.log('☢️  NUCLEAR OPTION: Deleting ALL data except products and admin users...')
        
        // Keep only products, inventory, and admin users
        const [
          nuclearOrderItems,
          nuclearOrders,
          nuclearReviews,
          nuclearAnalytics,
          nuclearVisitorAnalytics,
          nuclearProductViews,
          nuclearWishlist
        ] = await Promise.all([
          prisma.orderItem.deleteMany({}),
          prisma.order.deleteMany({}),
          prisma.productReview.deleteMany({}),
          prisma.salesAnalytics.deleteMany({}),
          prisma.visitorAnalytics.deleteMany({}),
          prisma.productView.deleteMany({}),
          prisma.wishlistItem.deleteMany({})
        ])

        // Delete all non-admin users
        const nuclearUsers = await prisma.user.deleteMany({
          where: {
            role: 'CUSTOMER'
          }
        })
        
        summary.deleted = {
          orderItems: nuclearOrderItems.count,
          orders: nuclearOrders.count,
          reviews: nuclearReviews.count,
          salesAnalytics: nuclearAnalytics.count,
          visitorAnalytics: nuclearVisitorAnalytics.count,
          productViews: nuclearProductViews.count,
          wishlistItems: nuclearWishlist.count,
          customerUsers: nuclearUsers.count
        }
        break

      default:
        return NextResponse.json(
          { 
            error: 'Invalid action',
            validActions: [
              'ORDERS_ONLY',
              'REVIEWS_ONLY', 
              'ANALYTICS_ONLY',
              'TEST_USERS_ONLY',
              'ALL_TRANSACTIONAL_DATA',
              'NUCLEAR_OPTION'
            ]
          },
          { status: 400 }
        )
    }

    // Get final counts
    const [
      remainingUsers,
      remainingProducts,
      remainingInventory,
      remainingOrders,
      remainingReviews
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.inventoryItem.count(),
      prisma.order.count(),
      prisma.productReview.count()
    ])

    summary.remaining = {
      users: remainingUsers,
      products: remainingProducts,
      inventory: remainingInventory,
      orders: remainingOrders,
      reviews: remainingReviews
    }

    console.log('🎉 Cleanup completed successfully!')
    console.log('📊 Summary:', summary)

    return NextResponse.json({
      success: true,
      message: `Cleanup action '${action}' completed successfully`,
      summary
    })

  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    return NextResponse.json(
      { 
        error: 'Cleanup failed', 
        details: process.env.NODE_ENV === 'development' ? error : undefined 
      },
      { status: 500 }
    )
  }
} 