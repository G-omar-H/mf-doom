'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/lib/store/cartStore'
import { formatPrice } from '@/lib/utils/formatters'
import confetti from 'canvas-confetti'

export default function CheckoutSuccessPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const searchParams = useSearchParams()
  const { clearCart } = useCartStore()

  useEffect(() => {
    const token = searchParams.get('token') // PayPal order ID
    const payerId = searchParams.get('PayerID')
    const orderParam = searchParams.get('order') // Direct order access

    // If we have PayPal parameters, complete the payment
    if (token && payerId && !paymentCompleted && !isProcessing) {
      setIsProcessing(true)
      
      // Capture the payment and create order
      fetch('/api/checkout', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: token }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          throw new Error(data.error)
        }
        
        console.log('Payment captured and order created:', data)
        setOrderDetails(data.order)
        setPaymentCompleted(true)
        setIsProcessing(false)
        
        // Clear cart after successful order
        clearCart()
        
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#C0C0C0', '#8B0000']
    })
      })
      .catch(err => {
        console.error('Payment capture error:', err)
        setError('Failed to complete payment. Please contact support with your PayPal transaction details.')
        setIsProcessing(false)
      })
    } else if (!token && !payerId && orderParam) {
      // Direct access to success page with order number (from embedded checkout)
      setPaymentCompleted(true)
      setOrderDetails({ orderNumber: orderParam })
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#C0C0C0', '#8B0000']
      })
    } else if (!token && !payerId && !orderParam) {
      // Direct access to success page (fallback)
      setPaymentCompleted(true)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#C0C0C0', '#8B0000']
      })
    }
  }, [searchParams, paymentCompleted, isProcessing, clearCart])

  if (isProcessing) {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-6"
          >
            <Loader2 size={100} className="text-doom-gold animate-spin" />
          </motion.div>

          <h1 className="font-metal text-5xl text-doom-gold mb-4">
            COMPLETING PAYMENT...
          </h1>

          <p className="text-xl text-doom-silver mb-8">
            Please wait while we finalize your order with PayPal.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              • Capturing payment from PayPal<br/>
              • Creating your order in our system<br/>
              • Preparing order confirmation
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-block mb-6">
            <svg className="w-24 h-24 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>

          <h1 className="font-metal text-5xl text-red-500 mb-4">
            PAYMENT ERROR
          </h1>

          <p className="text-xl text-doom-silver mb-8">
            {error}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/checkout">
              <Button size="lg">Try Again</Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg">Contact Support</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-block mb-6"
        >
          <CheckCircle size={100} className="text-doom-green" />
        </motion.div>

        <h1 className="font-metal text-5xl text-doom-gold mb-4">
          ORDER CONFIRMED!
        </h1>

        <p className="text-xl text-doom-silver mb-8">
          Thank you for your order! Your villainous gear is on its way.
        </p>

        {/* Order Details */}
        {orderDetails && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-medium text-gray-800 mb-2">Order Details</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Order Number:</strong> {orderDetails.orderNumber}</p>
              {orderDetails.total && (
                <p><strong>Total:</strong> {formatPrice(Number(orderDetails.total))}</p>
              )}
              <p><strong>Payment:</strong> PayPal</p>
              <p><strong>Status:</strong> {orderDetails.status || 'Confirmed'}</p>
            </div>
          </div>
        )}

        <div className="comic-panel p-8 mb-8">
          <h2 className="font-metal text-2xl text-doom-gold mb-4">
            What's Next?
          </h2>
          <ul className="text-left space-y-3 text-doom-silver">
            <li>✓ You'll receive an order confirmation email shortly</li>
            <li>✓ We'll notify you when your order ships</li>
            <li>✓ Track your order with the link in your email</li>
            <li>✓ Expected delivery: 5-7 business days</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button size="lg">Continue Shopping</Button>
          </Link>
          <Link href="/">
            <Button variant="secondary" size="lg">Back to Home</Button>
          </Link>
        </div>

        <blockquote className="mt-12 text-doom-silver italic">
          "Remember ALL CAPS when you spell the man name"
        </blockquote>
      </motion.div>
    </div>
  )
} 