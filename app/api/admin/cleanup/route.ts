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
      inventoryCount,
      addressCount,
      discountCodeCount,
      orderDiscountCodeCount
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
      prisma.inventoryItem.count(),
      prisma.address.count(),
      prisma.discountCode.count(),
      prisma.orderDiscountCode.count()
    ])

    // Get sample data to inspect
    const [
      sampleOrders,
      sampleUsers,
      sampleReviews,
      sampleDiscountCodes
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
          createdAt: true,
          _count: {
            select: {
              orders: true,
              reviews: true,
              wishlist: true,
              addresses: true
            }
          }
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
      }),
      prisma.discountCode.findMany({
        take: 3,
        select: {
          id: true,
          code: true,
          name: true,
          type: true,
          status: true,
          usedCount: true
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
        inventory: inventoryCount,
        addresses: addressCount,
        discountCodes: discountCodeCount,
        orderDiscountCodes: orderDiscountCodeCount
      },
      samples: {
        orders: sampleOrders,
        users: sampleUsers,
        reviews: sampleReviews,
        discountCodes: sampleDiscountCodes
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
        // OrderItems and OrderDiscountCodes will cascade when orders are deleted
        const deletedOrders = await prisma.order.deleteMany({})
        
        summary.deleted = {
          orders: deletedOrders.count
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
        const [deletedAnalytics, deletedVisitorAnalytics, deletedProductViews] = await Promise.all([
          prisma.salesAnalytics.deleteMany({}),
          prisma.visitorAnalytics.deleteMany({}),
          prisma.productView.deleteMany({})
        ])
        
        summary.deleted = {
          salesAnalytics: deletedAnalytics.count,
          visitorAnalytics: deletedVisitorAnalytics.count,
          productViews: deletedProductViews.count
        }
        break

      case 'VISITOR_ANALYTICS_ONLY':
        console.log('🗑️  Deleting only visitor analytics (real-time tracking data)...')
        const deletedVisitorData = await prisma.visitorAnalytics.deleteMany({})
        
        summary.deleted = {
          visitorAnalytics: deletedVisitorData.count,
          message: 'This will reset the "Active (5min)" counter to 0'
        }
        break

      case 'TEST_USERS_ONLY':
        console.log('🗑️  Deleting test users (handling foreign key constraints)...')
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
        
        // First, find test users
        const testUsers = await prisma.user.findMany({
          where: {
            OR: testUserPatterns.map(pattern => ({
              email: {
                contains: pattern
              }
            }))
          },
          select: {
            id: true,
            email: true
          }
        })

        if (testUsers.length > 0) {
          const testUserIds = testUsers.map(u => u.id)
          
          // Delete in proper order to respect foreign key constraints
          // 1. Delete orders (and their items/discount codes will cascade)
          const deletedTestOrders = await prisma.order.deleteMany({
            where: {
              userId: {
                in: testUserIds
              }
            }
          })
          
          // 2. Now delete the users (reviews, wishlist, addresses will cascade)
          const deletedTestUsers = await prisma.user.deleteMany({
            where: {
              id: {
                in: testUserIds
              }
            }
          })
          
          summary.deleted = {
            testUsers: deletedTestUsers.count,
            testOrders: deletedTestOrders.count,
            deletedEmails: testUsers.map(u => u.email)
          }
        } else {
          summary.deleted = {
            testUsers: 0,
            message: 'No test users found'
          }
        }
        break

      case 'ALL_TRANSACTIONAL_DATA':
        console.log('🗑️  Deleting all transactional data (orders, reviews, analytics, discount codes)...')
        
        // Delete all transactional data but keep products, inventory, and users
        const [
          delOrders,
          delReviews,
          delAnalytics,
          delVisitorAnalytics,
          delProductViews,
          delWishlist,
          delDiscountCodes
        ] = await Promise.all([
          prisma.order.deleteMany({}), // OrderItems and OrderDiscountCodes cascade
          prisma.productReview.deleteMany({}),
          prisma.salesAnalytics.deleteMany({}),
          prisma.visitorAnalytics.deleteMany({}),
          prisma.productView.deleteMany({}),
          prisma.wishlistItem.deleteMany({}),
          prisma.discountCode.deleteMany({}) // OrderDiscountCodes will be deleted first by order deletion
        ])
        
        summary.deleted = {
          orders: delOrders.count,
          reviews: delReviews.count,
          salesAnalytics: delAnalytics.count,
          visitorAnalytics: delVisitorAnalytics.count,
          productViews: delProductViews.count,
          wishlistItems: delWishlist.count,
          discountCodes: delDiscountCodes.count
        }
        break

      case 'NUCLEAR_OPTION':
        console.log('☢️  NUCLEAR OPTION: Deleting ALL data except products and admin users...')
        
        // Keep only products, inventory, product images/variants, and admin users
        // Delete in proper order to handle foreign key constraints
        
        // 1. Delete all orders first (cascades to order items and order discount codes)
        const nuclearOrders = await prisma.order.deleteMany({})
        
        // 2. Delete all other transactional data
        const [
          nuclearReviews,
          nuclearAnalytics,
          nuclearVisitorAnalytics,
          nuclearProductViews,
          nuclearWishlist,
          nuclearDiscountCodes
        ] = await Promise.all([
          prisma.productReview.deleteMany({}),
          prisma.salesAnalytics.deleteMany({}),
          prisma.visitorAnalytics.deleteMany({}),
          prisma.productView.deleteMany({}),
          prisma.wishlistItem.deleteMany({}),
          prisma.discountCode.deleteMany({})
        ])

        // 3. Delete all non-admin users (addresses will cascade)
        const nuclearUsers = await prisma.user.deleteMany({
          where: {
            role: 'CUSTOMER'
          }
        })
        
        summary.deleted = {
          orders: nuclearOrders.count,
          reviews: nuclearReviews.count,
          salesAnalytics: nuclearAnalytics.count,
          visitorAnalytics: nuclearVisitorAnalytics.count,
          productViews: nuclearProductViews.count,
          wishlistItems: nuclearWishlist.count,
          discountCodes: nuclearDiscountCodes.count,
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
              'VISITOR_ANALYTICS_ONLY',
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
      remainingReviews,
      remainingDiscountCodes
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.inventoryItem.count(),
      prisma.order.count(),
      prisma.productReview.count(),
      prisma.discountCode.count()
    ])

    summary.remaining = {
      users: remainingUsers,
      products: remainingProducts,
      inventory: remainingInventory,
      orders: remainingOrders,
      reviews: remainingReviews,
      discountCodes: remainingDiscountCodes
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