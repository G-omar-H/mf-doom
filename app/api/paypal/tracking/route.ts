import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!
const PAYPAL_BASE_URL = process.env.PAYPAL_ENVIRONMENT === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com'

// Get PayPal access token
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
    console.error('PayPal Token Error:', error)
    throw error
  }
}

// Add tracking information to PayPal order
export async function POST(request: NextRequest) {
  try {
    const { orderId, trackingNumber, carrier, status = 'SHIPPED' } = await request.json()

    if (!orderId || !trackingNumber || !carrier) {
      return NextResponse.json(
        { error: 'Order ID, tracking number, and carrier are required' },
        { status: 400 }
      )
    }

    // Get order from database
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        paypalCaptureId: true,
        paypalOrderId: true,
        orderNumber: true,
        trackingNumber: true,
        notes: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    if (!order.paypalCaptureId) {
      return NextResponse.json(
        { error: 'No PayPal capture ID found for this order' },
        { status: 400 }
      )
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken()

    // Prepare tracking data for PayPal
    const trackingData = {
      transaction_id: order.paypalCaptureId,
      tracking_number: trackingNumber,
      status: status,
      carrier: carrier.toUpperCase(),
      // Optional: add more specific carrier info
      carrier_name_other: carrier
    }

    // Send tracking info to PayPal
    const paypalResponse = await fetch(`${PAYPAL_BASE_URL}/v1/shipping/trackers-batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Auth-Assertion': generateAuthAssertion(),
      },
      body: JSON.stringify({
        trackers: [trackingData]
      }),
    })

    const paypalResult = await paypalResponse.json()

    if (paypalResponse.ok) {
      // Update order in database with tracking info
      await prisma.order.update({
        where: { id: orderId },
        data: {
          trackingNumber: trackingNumber,
          shippedAt: new Date(),
          status: 'SHIPPED',
          fulfillmentStatus: 'SHIPPED',
          notes: order.notes 
            ? `${order.notes}\n\nTracking added: ${trackingNumber} (${carrier})`
            : `Tracking added: ${trackingNumber} (${carrier})`
        }
      })

      console.log('✅ Tracking info sent to PayPal:', {
        orderNumber: order.orderNumber,
        trackingNumber,
        carrier,
        paypalResult
      })

      return NextResponse.json({
        success: true,
        message: 'Tracking information sent to PayPal successfully',
        trackingNumber,
        carrier,
        paypalResponse: paypalResult
      })
    } else {
      console.error('PayPal tracking API error:', paypalResult)
      return NextResponse.json(
        { 
          error: 'Failed to send tracking info to PayPal',
          details: paypalResult
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Tracking API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Generate PayPal Auth Assertion (required for some tracking APIs)
function generateAuthAssertion() {
  // This is a simplified version - in production, you might need a proper JWT
  const clientId = PAYPAL_CLIENT_ID
  return Buffer.from(JSON.stringify({
    iss: clientId,
    payer_id: clientId
  })).toString('base64')
}

// Update tracking status (when package is delivered)
export async function PUT(request: NextRequest) {
  try {
    const { orderId, status = 'DELIVERED' } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    // Get order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        paypalCaptureId: true,
        trackingNumber: true,
        orderNumber: true
      }
    })

    if (!order || !order.trackingNumber) {
      return NextResponse.json(
        { error: 'Order not found or no tracking number' },
        { status: 404 }
      )
    }

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'DELIVERED',
        fulfillmentStatus: 'DELIVERED',
        deliveredAt: new Date()
      }
    })

    // Note: PayPal tracking status updates are typically automatic via carrier APIs
    // But you can also manually update if needed

    return NextResponse.json({
      success: true,
      message: 'Order marked as delivered',
      orderNumber: order.orderNumber
    })

  } catch (error) {
    console.error('Delivery update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 