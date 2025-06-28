import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!
const PAYPAL_BASE_URL = process.env.PAYPAL_ENVIRONMENT === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com'

// Store checkout sessions in memory (use Redis in production)
const checkoutSessions = new Map()

// Enhanced error logging for production
const logError = (context: string, error: any, details?: any) => {
  console.error(`[PayPal ${context}]`, {
    error: error.message || error,
    details,
    timestamp: new Date().toISOString(),
    environment: process.env.PAYPAL_ENVIRONMENT
  })
}

// Get PayPal access token with better error handling
async function getPayPalAccessToken() {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')
    
    const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: 'grant_type=client_credentials',
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`PayPal token request failed: ${data.error_description || data.error}`)
    }
    
    return data.access_token
  } catch (error) {
    logError('Token Request', error)
    throw error
  }
}

// Create PayPal order
export async function POST(request: NextRequest) {
  try {
    const { items, customerEmail, shippingAddress, customerData } = await request.json()

    // Validate required data
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      )
    }

    // Calculate totals with validation
    const itemTotal = items.reduce((sum: number, item: any) => {
      if (!item.product?.price || !item.quantity) {
        throw new Error('Invalid item data')
      }
      return sum + (item.product.price * item.quantity)
    }, 0)
    
    const shippingTotal = itemTotal > 100 ? 0 : 10 // Free shipping over $100
    const taxTotal = itemTotal * 0.08 // 8% tax
    const total = itemTotal + shippingTotal + taxTotal

    // Validate minimum order amount
    if (total < 0.01) {
      return NextResponse.json(
        { error: 'Order total must be at least $0.01' },
        { status: 400 }
      )
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken()

    // Create enhanced PayPal order
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
            name: item.product.name.substring(0, 127), // PayPal limit
            quantity: item.quantity.toString(),
            description: item.selectedVariants 
              ? Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ').substring(0, 127)
              : item.product.description?.substring(0, 127) || '',
            unit_amount: {
              currency_code: 'USD',
              value: item.product.price.toFixed(2),
            },
            category: 'PHYSICAL_GOODS',
            sku: item.product.id?.toString() || `${item.product.slug}-${Date.now()}`,
          })),
          shipping: shippingAddress ? {
            name: {
              full_name: (shippingAddress.name || customerData?.name || 'Customer').substring(0, 300),
            },
            address: {
              address_line_1: (shippingAddress.line1 || shippingAddress.address).substring(0, 300),
              address_line_2: (shippingAddress.line2 || '').substring(0, 300),
              admin_area_2: shippingAddress.city.substring(0, 120),
              admin_area_1: shippingAddress.state.substring(0, 120),
              postal_code: (shippingAddress.postalCode || shippingAddress.zip).substring(0, 60),
              country_code: shippingAddress.country || 'US',
            },
          } : undefined,
        },
      ],
      application_context: {
        brand_name: 'MF DOOM Shop',
        landing_page: 'BILLING', // Direct users to billing page for guest checkout
        user_action: 'PAY_NOW', // Optimizes for immediate payment completion
        return_url: `${request.headers.get('origin')}/checkout/success`,
        cancel_url: `${request.headers.get('origin')}/checkout`,
        shipping_preference: 'SET_PROVIDED_ADDRESS',
      },
    }

    const paypalResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `DOOM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Idempotency
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
      console.log('✅ PayPal order created successfully:', paypalOrder.id)

      return NextResponse.json({ 
        orderId: paypalOrder.id,
        approvalUrl: paypalOrder.links?.find((link: any) => link.rel === 'approve')?.href,
        status: paypalOrder.status
      })
    } else {
      logError('Order Creation', paypalOrder)
      return NextResponse.json(
        { 
          error: 'Failed to create PayPal order',
          details: process.env.NODE_ENV === 'development' ? paypalOrder : undefined
        },
        { status: 500 }
      )
    }
  } catch (error) {
    logError('Order Creation Request', error)
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

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken()

    // Capture the payment
    const captureResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `CAPTURE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      },
    })

    const captureData = await captureResponse.json()

    if (captureResponse.ok && captureData.status === 'COMPLETED') {
      // Get stored checkout session data
      const sessionData = checkoutSessions.get(orderId)
      
      if (!sessionData) {
        logError('Session Not Found', `No session data for order ${orderId}`)
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
                  productName: item.product.name,
                  productPrice: Number(item.product.price),
                  quantity: Number(item.quantity),
                  variants: item.selectedVariants || {},
                })),
              },
            },
          })

          console.log('✅ Order created in database:', dbOrder.orderNumber)
          
          // Clean up session data
          checkoutSessions.delete(orderId)
          
        } catch (dbError) {
          logError('Database Order Creation', dbError, { orderId, sessionData })
          // Don't fail the payment - just log the error
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
      logError('Payment Capture Failed', captureData)
      return NextResponse.json(
        { 
          error: 'Failed to capture payment',
          details: process.env.NODE_ENV === 'development' ? captureData : undefined
        },
        { status: 400 }
      )
    }
  } catch (error) {
    logError('Payment Capture Request', error)
    return NextResponse.json(
      { error: 'Failed to capture payment' },
      { status: 500 }
    )
  }
} 