'use client'

import React, { useState } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { CartItem } from '@/types'
import Image from 'next/image'

interface PayPalProviderProps {
  items: CartItem[]
  customerEmail?: string
  shippingAddress?: any
  customerData?: any
  onSuccess: (details: any) => void
  onError: (error: unknown) => void
  disabled?: boolean
}

export const PayPalProvider: React.FC<PayPalProviderProps> = ({
  items,
  customerEmail,
  shippingAddress,
  customerData,
  onSuccess,
  onError,
  disabled = false
}) => {
  const [isProcessing, setIsProcessing] = useState(false)

  // Calculate totals
  const itemTotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const shippingTotal = itemTotal > 100 ? 0 : 10 // Free shipping over $100
  const taxTotal = itemTotal * 0.08 // 8% tax
  const total = itemTotal + shippingTotal + taxTotal

  const createOrder = async () => {
    try {
      console.log('Creating PayPal order...')
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items, 
          customerEmail, 
          shippingAddress,
          customerData
        }),
      })
      
      const data = await response.json()
      
      if (response.ok && data.orderId) {
        console.log('PayPal order created:', data.orderId)
        return data.orderId
      } else {
        throw new Error(data.error || 'Failed to create PayPal order')
      }
      
    } catch (err) {
      console.error('PayPal order creation error:', err)
      onError(err)
      throw err
    }
  }

  const onApprove = async (data: { orderID: string; payerID?: string }) => {
    try {
      setIsProcessing(true)
      console.log('Capturing PayPal payment...', data.orderID)
      
      const response = await fetch('/api/checkout', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: data.orderID }),
      })
      
      const captureData = await response.json()
      
      if (response.ok) {
        console.log('Payment captured successfully:', captureData)
        onSuccess(captureData)
      } else {
        throw new Error(captureData.error || 'Failed to capture payment')
      }
      
    } catch (err) {
      console.error('PayPal capture error:', err)
      onError(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const onCancel = () => {
    console.log('PayPal payment cancelled')
    setIsProcessing(false)
  }

  const onErrorHandler = (err: unknown) => {
    console.error('PayPal payment error:', err)
    setIsProcessing(false)
    onError(err)
    }

  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    currency: 'USD',
    intent: 'capture',
    // Enable multiple funding sources including cards for guest checkout
    'enable-funding': 'venmo,paylater,card',
    // Add components to enable Pay Later messaging
    components: 'buttons,messages,funding-eligibility',
    'data-sdk-integration-source': 'developer-studio'
  }

  if (isProcessing) {
    return (
      <div className="flex items-center justify-center p-4">
        <div style={{ width: 16, height: 16 }} className="mr-2">
          <Image
            src="/icons/mfdoomcask.gif"
            alt="Loading PayPal..."
            width={16}
            height={16}
            className="w-full h-full"
            unoptimized
          />
        </div>
        <span className="text-gray-600">Loading PayPal...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* PayPal Integration */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.704.704 0 0 0-.692.59l-1.475 9.35a.641.641 0 0 0 .633.74h5.42a.704.704 0 0 0 .692-.59l.29-1.855.018-.111a.704.704 0 0 1 .692-.59h.43c3.506 0 6.266-1.424 7.064-5.54.334-1.72.16-3.154-.676-4.074-.27-.297-.6-.543-.98-.734z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">PayPal</h3>
              <p className="text-sm text-gray-500">Pay with card (no PayPal account needed) or PayPal</p>
            </div>
          </div>
          <div className="text-sm text-gray-400">Recommended</div>
        </div>
        
        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
          <div className="flex justify-between items-center mb-1">
            <span>Subtotal:</span>
            <span>${itemTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span>Shipping:</span>
            <span>{shippingTotal === 0 ? 'FREE' : `$${shippingTotal.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span>Tax:</span>
            <span>${taxTotal.toFixed(2)}</span>
          </div>
          <div className="border-t pt-1 mt-2">
            <div className="flex justify-between items-center font-semibold">
              <span>Total:</span>
              <span>${total.toFixed(2)} USD</span>
            </div>
          </div>
        </div>
        
        {/* PayPal Buttons */}
        <PayPalScriptProvider options={initialOptions}>
          <PayPalButtons
            style={{
              layout: 'vertical',
              color: 'blue',
              shape: 'rect',
              label: 'paypal',
              height: 45,
              tagline: false
            }}
            disabled={disabled || isProcessing}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onErrorHandler}
            onCancel={onCancel}
          />
        </PayPalScriptProvider>
      </div>

      {/* Payment Security Info */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-700 mb-1">Secure Payment</p>
            <ul className="space-y-1">
              <li>✓ Protected by PayPal's buyer protection</li>
              <li>✓ Pay with any credit/debit card - no PayPal account required</li>
              <li>✓ PayPal balance and bank account options available</li>
              <li>✓ Pay Later options available</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 