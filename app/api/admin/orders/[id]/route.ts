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

    // Fetch specific order with complete details
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: {
                  select: {
                    url: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Transform order for frontend
    const transformedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.user?.name || 'Guest Customer',
      customerEmail: order.user?.email || order.guestEmail || 'N/A',
      customerPhone: order.user?.phone || '',
      status: order.status,
      paymentStatus: order.paymentStatus,
      fulfillmentStatus: order.fulfillmentStatus,
      totalAmount: Number(order.totalAmount),
      subtotal: Number(order.subtotal),
      taxAmount: Number(order.taxAmount),
      shippingAmount: Number(order.shippingAmount),
      discountAmount: Number(order.discountAmount),
      paymentMethod: order.paymentMethod,
      paypalOrderId: order.paypalOrderId,
      paypalCaptureId: order.paypalCaptureId,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      shippingMethod: order.shippingMethod,
      trackingNumber: order.trackingNumber,
      customerNotes: order.customerNotes,
      notes: order.notes,
      tags: order.tags,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt,
      orderItems: order.orderItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
        variantSelection: item.variantSelection,
        productSnapshot: item.productSnapshot,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: Number(item.product.price),
          images: item.product.images.map(img => img.url)
        }
      }))
    }

    return NextResponse.json({ order: transformedOrder })

  } catch (error) {
    console.error('Order fetch error:', error)
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

    const updateData = await request.json()

    // Prepare update object
    const orderUpdate: any = {}
    
    if (updateData.status !== undefined) {
      orderUpdate.status = updateData.status
      
      // Set timestamps based on status
      if (updateData.status === 'SHIPPED' && !orderUpdate.shippedAt) {
        orderUpdate.shippedAt = new Date()
      }
      if (updateData.status === 'DELIVERED') {
        orderUpdate.deliveredAt = new Date()
        orderUpdate.fulfillmentStatus = 'DELIVERED'
      }
    }
    
    if (updateData.paymentStatus !== undefined) orderUpdate.paymentStatus = updateData.paymentStatus
    if (updateData.fulfillmentStatus !== undefined) orderUpdate.fulfillmentStatus = updateData.fulfillmentStatus
    if (updateData.trackingNumber !== undefined) orderUpdate.trackingNumber = updateData.trackingNumber
    if (updateData.notes !== undefined) orderUpdate.notes = updateData.notes
    if (updateData.tags !== undefined) orderUpdate.tags = updateData.tags

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: orderUpdate,
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentStatus: true,
        fulfillmentStatus: true,
        trackingNumber: true,
        notes: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      message: 'Order updated successfully',
      order: updatedOrder
    })

  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 