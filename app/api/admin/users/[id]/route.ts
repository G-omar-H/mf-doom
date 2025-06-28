import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Fetch specific user with detailed information
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        orders: {
          select: {
            id: true,
            orderNumber: true,
            totalAmount: true,
            status: true,
            createdAt: true
          }
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            title: true,
            content: true,
            createdAt: true,
            product: {
              select: {
                name: true
              }
            }
          }
        },
        addresses: {
          select: {
            id: true,
            type: true,
            firstName: true,
            lastName: true,
            line1: true,
            city: true,
            state: true,
            country: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate user statistics
    const completedOrders = user.orders.filter(order => order.status === 'DELIVERED')
    const totalSpent = completedOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0)

    const transformedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: true,
      orderCount: user.orders.length,
      completedOrderCount: completedOrders.length,
      totalSpent,
      reviewCount: user.reviews.length,
      addressCount: user.addresses.length,
      createdAt: user.createdAt,
      orders: user.orders.map(order => ({
        ...order,
        totalAmount: Number(order.totalAmount)
      })),
      reviews: user.reviews,
      addresses: user.addresses
    }

    return NextResponse.json({ user: transformedUser })

  } catch (error) {
    console.error('User fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { name, email, phone, role, isActive } = await request.json()

    // Prevent self-modification of critical fields
    if (params.id === session.user.id) {
      if (role && role !== session.user.role) {
        return NextResponse.json(
          { error: 'Cannot change your own role' },
          { status: 400 }
        )
      }
      if (isActive === false) {
        return NextResponse.json(
          { error: 'Cannot deactivate your own account' },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (phone !== undefined) updateData.phone = phone
    if (role !== undefined) updateData.role = role
    // Note: isActive is not in the schema, so we skip it

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser
    })

  } catch (error: any) {
    console.error('User update error:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Prevent self-deletion
    if (params.id === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        orders: { select: { id: true } },
        reviews: { select: { id: true } }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user has orders (might want to prevent deletion)
    if (user.orders.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete user with existing orders. Consider deactivating instead.' },
        { status: 400 }
      )
    }

    // Delete user (this will cascade delete related records due to schema constraints)
    await prisma.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: 'User deleted successfully'
    })

  } catch (error) {
    console.error('User deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 