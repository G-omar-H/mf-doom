import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!
const PAYPAL_BASE_URL = process.env.PAYPAL_ENVIRONMENT === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com'

// Store checkout sessions in memory (use Redis in production)
const checkoutSessions = new Map()

// Get PayPal access token
async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')
  
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  const data = await response.json()
  return data.access_token
}

// Create PayPal order
export async function POST(request: NextRequest) {
  try {
    const { items, customerEmail, shippingAddress, customerData } = await request.json()

    // Calculate totals
    const itemTotal = items.reduce((sum: number, item: any) => 
      sum + (item.product.price * item.quantity), 0
    )
    const shippingTotal = itemTotal > 100 ? 0 : 10 // Free shipping over $100
    const taxTotal = itemTotal * 0.08 // 8% tax
    const total = itemTotal + shippingTotal + taxTotal

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken()

    // Create PayPal order
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: `DOOM-${Date.now()}`,
          amount: {
            currency_code: 'USD',
            value: total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: itemTotal.toFixed(2),
              },
              shipping: {
                currency_code: 'USD',
                value: shippingTotal.toFixed(2),
              },
              tax_total: {
                currency_code: 'USD',
                value: taxTotal.toFixed(2),
              },
            },
          },
          items: items.map((item: any) => ({
            name: item.product.name,
            quantity: item.quantity.toString(),
            description: item.selectedVariants 
              ? Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ')
              : item.product.description.substring(0, 127),
            unit_amount: {
              currency_code: 'USD',
              value: item.product.price.toFixed(2),
            },
            category: 'PHYSICAL_GOODS',
          })),
          shipping: shippingAddress ? {
            name: {
              full_name: shippingAddress.name || customerData?.name || 'Customer',
            },
            address: {
              address_line_1: shippingAddress.line1 || shippingAddress.address,
              address_line_2: shippingAddress.line2 || '',
              admin_area_2: shippingAddress.city,
              admin_area_1: shippingAddress.state,
              postal_code: shippingAddress.postalCode || shippingAddress.zip,
              country_code: shippingAddress.country || 'US',
            },
          } : undefined,
        },
      ],
      application_context: {
        brand_name: 'MF DOOM Shop',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: `${request.headers.get('origin')}/checkout/success`,
        cancel_url: `${request.headers.get('origin')}/checkout/cancel`,
      },
    }

    const paypalResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    const paypalOrder = await paypalResponse.json()

    if (paypalResponse.ok) {
      // Store checkout session data for later use
      const sessionData = {
        items,
        customerEmail: customerEmail || customerData?.email,
        customerData,
        shippingAddress,
        totals: {
          subtotal: itemTotal,
          tax: taxTotal,
          shipping: shippingTotal,
          total,
        },
        createdAt: new Date().toISOString(),
      }
      
      checkoutSessions.set(paypalOrder.id, sessionData)
      console.log('Stored checkout session for order:', paypalOrder.id)

      return NextResponse.json({ 
        orderId: paypalOrder.id,
        approvalUrl: paypalOrder.links.find((link: any) => link.rel === 'approve')?.href
      })
    } else {
      console.error('PayPal order creation failed:', paypalOrder)
      return NextResponse.json(
        { error: 'Failed to create PayPal order' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('PayPal error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

// Capture PayPal payment and create order in database
export async function PUT(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken()

    // Capture the payment
    const captureResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    const captureData = await captureResponse.json()

    if (captureResponse.ok) {
      // Get stored checkout session data
      const sessionData = checkoutSessions.get(orderId)
      
      if (!sessionData) {
        console.error('No checkout session found for order:', orderId)
        return NextResponse.json({ 
          ...captureData,
          warning: 'Payment captured but order creation failed - session not found' 
        })
      }

      // Create order in database if Prisma is available
      let dbOrder = null
      if (prisma) {
        try {
          const orderNumber = `DOOM-${Date.now()}`
          
          dbOrder = await prisma.order.create({
            data: {
              orderNumber,
              guestEmail: sessionData.customerEmail,
              status: 'CONFIRMED',
              paymentStatus: 'PAID',
              fulfillmentStatus: 'UNFULFILLED',
              
              // Pricing
              subtotal: Number(sessionData.totals.subtotal),
              taxAmount: Number(sessionData.totals.tax),
              shippingAmount: Number(sessionData.totals.shipping),
              discountAmount: 0,
              totalAmount: Number(sessionData.totals.total),
              
              // Payment details
              paymentMethod: 'paypal',
              paypalOrderId: orderId,
              paypalCaptureId: captureData.id,
              paypalPayerId: captureData.payer?.payer_id,
              
              // Addresses
              shippingAddress: {
                name: sessionData.customerData?.name || sessionData.customerEmail,
                line1: sessionData.shippingAddress?.line1 || sessionData.shippingAddress?.address,
                line2: sessionData.shippingAddress?.line2 || '',
                city: sessionData.shippingAddress?.city,
                state: sessionData.shippingAddress?.state,
                postalCode: sessionData.shippingAddress?.postalCode || sessionData.shippingAddress?.zip,
                country: sessionData.shippingAddress?.country || 'US',
                phone: sessionData.customerData?.phone,
              },
              billingAddress: {
                name: sessionData.customerData?.name || sessionData.customerEmail,
                line1: sessionData.shippingAddress?.line1 || sessionData.shippingAddress?.address,
                line2: sessionData.shippingAddress?.line2 || '',
                city: sessionData.shippingAddress?.city,
                state: sessionData.shippingAddress?.state,
                postalCode: sessionData.shippingAddress?.postalCode || sessionData.shippingAddress?.zip,
                country: sessionData.shippingAddress?.country || 'US',
                phone: sessionData.customerData?.phone,
              },
              
              // Order items
              orderItems: {
                create: sessionData.items.map((item: any) => ({
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
                    price: item.product.price,
                  },
                })),
              },
            },
            include: {
              orderItems: true,
            },
          })

          console.log('Order created in database:', dbOrder.orderNumber)
          
          // Clean up checkout session
          checkoutSessions.delete(orderId)
          
        } catch (dbError) {
          console.error('Database order creation failed:', dbError)
          // Don't fail the payment capture if DB fails
        }
      }

      return NextResponse.json({
        ...captureData,
        order: dbOrder ? {
          id: dbOrder.id,
          orderNumber: dbOrder.orderNumber,
          status: dbOrder.status,
          total: dbOrder.totalAmount,
        } : null,
      })
      
    } else {
      console.error('PayPal capture failed:', captureData)
      return NextResponse.json(
        { error: 'Failed to capture payment' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('PayPal capture error:', error)
    return NextResponse.json(
      { error: 'Failed to capture payment' },
      { status: 500 }
    )
  }
} 