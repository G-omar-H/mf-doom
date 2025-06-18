'use client'

import React, { useState } from 'react'
import { CartItem } from '@/types'

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

  const handlePayPalPayment = async () => {
    if (disabled || isProcessing) return
    
    setIsProcessing(true)
    
    try {
      console.log('Creating PayPal order for redirect...')
      
      // Create order via API
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
      console.log('PayPal order response:', data)
      
      if (response.ok && data.approvalUrl) {
        console.log('Redirecting to PayPal:', data.approvalUrl)
        // Redirect to PayPal for payment
        window.location.href = data.approvalUrl
      } else {
        throw new Error(data.error || 'Failed to create PayPal order')
      }
      
    } catch (err) {
      console.error('PayPal payment error:', err)
      setIsProcessing(false)
      onError(err)
    }
  }

  return (
    <div className="space-y-4">
      {/* Primary PayPal Payment Button */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.704.704 0 0 0-.692.59l-1.475 9.35a.641.641 0 0 0 .633.74h5.42a.704.704 0 0 0 .692-.59l.29-1.855.018-.111a.704.704 0 0 1 .692-.59h.43c3.506 0 6.266-1.424 7.064-5.54.334-1.72.16-3.154-.676-4.074-.27-.297-.6-.543-.98-.734z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">PayPal</h3>
              <p className="text-sm text-gray-500">Pay securely with PayPal or card</p>
            </div>
          </div>
          <div className="text-sm text-gray-400">Recommended</div>
        </div>
        
        <button
          onClick={handlePayPalPayment}
          disabled={disabled || isProcessing}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            disabled || isProcessing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Redirecting to PayPal...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.704.704 0 0 0-.692.59l-1.475 9.35a.641.641 0 0 0 .633.74h5.42a.704.704 0 0 0 .692-.59l.29-1.855.018-.111a.704.704 0 0 1 .692-.59h.43c3.506 0 6.266-1.424 7.064-5.54.334-1.72.16-3.154-.676-4.074-.27-.297-.6-.543-.98-.734z"/>
              </svg>
              <span>Continue with PayPal</span>
            </div>
          )}
        </button>
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
              <li>✓ Pay with PayPal balance, card, or bank account</li>
              <li>✓ No account required for card payments</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 