'use client'

import React from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { CartItem } from '@/types'

interface PayPalProviderProps {
  items: CartItem[]
  customerEmail?: string
  shippingAddress?: any
  onSuccess: (details: any) => void
  onError: (error: unknown) => void
  disabled?: boolean
}

export const PayPalProvider: React.FC<PayPalProviderProps> = ({
  items,
  customerEmail,
  shippingAddress,
  onSuccess,
  onError,
  disabled = false
}) => {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!

  const initialOptions = {
    clientId: clientId,
    currency: 'USD' as const,
    intent: 'capture' as const,
    'enable-funding': 'venmo,paylater',
    'disable-funding': '',
    'data-sdk-integration-source': 'integrationbuilder_sc',
  }

  const createOrder = async (): Promise<string> => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customerEmail,
          shippingAddress,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      return data.orderId
    } catch (error) {
      console.error('Error creating PayPal order:', error)
      onError(error)
      throw error
    }
  }

  const onApprove = async (data: { orderID: string; payerID?: string }): Promise<void> => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: data.orderID,
        }),
      })

      const captureData = await response.json()

      if (!response.ok) {
        throw new Error(captureData.error || 'Failed to capture payment')
      }

      onSuccess({
        orderID: data.orderID,
        captureID: captureData.id,
        payerID: data.payerID || captureData.payer?.payer_id,
        details: captureData,
      })
    } catch (error) {
      console.error('Error capturing PayPal payment:', error)
      onError(error)
    }
  }

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="paypal-container">
        <PayPalButtons
          disabled={disabled}
          style={{
            layout: 'vertical',
            color: 'black',
            shape: 'rect',
            label: 'pay',
            height: 48,
          }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={(error: unknown) => {
            console.error('PayPal Button Error:', error)
            onError(error)
          }}
          onCancel={() => {
            console.log('PayPal payment cancelled')
          }}
        />
      </div>

      <style jsx>{`
        .paypal-container {
          margin-top: 1rem;
        }
        
        .paypal-container :global(.paypal-buttons) {
          margin: 0;
        }
      `}</style>
    </PayPalScriptProvider>
  )
} 