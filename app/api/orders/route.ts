import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  // Check if Prisma is available
  if (!prisma) {
    return NextResponse.json(
      { error: 'Database not available' },
      { status: 503 }
    )
  }

  try {
    const orderData = await request.json()
    
    const {
      items,
      customer,
      shippingAddress,
      paymentMethod,
      paypalOrderId,
      paypalCaptureId,
      paypalPayerId,
      total,
      subtotal,
      tax,
      shipping,
    } = orderData

    // Generate order number
    const orderNumber = `DOOM-${Date.now()}`

    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        guestEmail: customer.email,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        fulfillmentStatus: 'UNFULFILLED',
        
        // Pricing
        subtotal: Number(subtotal),
        taxAmount: Number(tax),
        shippingAmount: Number(shipping),
        discountAmount: 0,
        totalAmount: Number(total),
        
        // Payment - Store PayPal details in notes for now
        paymentMethod: 'paypal',
        notes: `PayPal Order: ${paypalOrderId}, Capture: ${paypalCaptureId}, Payer: ${paypalPayerId}`,
        
        // Addresses
        shippingAddress: {
          name: shippingAddress.name,
          line1: shippingAddress.line1,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
        },
        billingAddress: {
          name: shippingAddress.name,
          line1: shippingAddress.line1,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
        },
        
        // Order items
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.product.id,
            variantSelection: item.selectedVariants || {},
            quantity: item.quantity,
            unitPrice: Number(item.product.price),
            totalPrice: Number(item.product.price * item.quantity),
            productSnapshot: {
              name: item.product.name,
              description: item.product.description,
              images: item.product.images,
              category: item.product.category,
            },
          })),
        },
      },
      include: {
        orderItems: true,
      },
    })

    return NextResponse.json({ 
      success: true, 
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.totalAmount,
      }
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
} 