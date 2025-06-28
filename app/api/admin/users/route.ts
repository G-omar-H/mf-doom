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

    // Fetch all users with order statistics
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        orders: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true
          }
        },
        reviews: {
          select: {
            id: true
          }
        }
      }
    })

    // Transform users for admin interface
    const transformedUsers = users.map(user => {
      const completedOrders = user.orders.filter(order => order.status === 'DELIVERED')
      const orderCount = completedOrders.length
      const totalSpent = completedOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0)
      const lastOrderDate = completedOrders.length > 0 
        ? completedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt
        : null

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: true, // Since we don't have isActive field, we'll assume all users are active
        orderCount,
        totalSpent,
        lastOrderDate,
        reviewCount: user.reviews.length,
        createdAt: user.createdAt
      }
    })

    return NextResponse.json({
      users: transformedUsers,
      total: transformedUsers.length
    })

  } catch (error) {
    console.error('Admin users API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
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

    const {
      name,
      email,
      phone,
      role = 'CUSTOMER'
    } = await request.json()

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Create user (without password field since it's not in the schema)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      message: 'User created successfully',
      user
    })

  } catch (error) {
    console.error('User creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 