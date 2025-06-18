'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cartStore'
import { formatPrice } from '@/lib/utils/formatters'
import { Button } from '@/components/ui/Button'
import { PayPalProvider } from '@/components/payment/PayPalProvider'
import { motion } from 'framer-motion'
import { Lock, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

// Disable static generation for this page
export const dynamic = 'force-dynamic'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'card'>('paypal')

  // Prevent hydration mismatch
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const subtotal = getTotalPrice()
  const shipping = subtotal > 100 ? 0 : 10 // Free shipping over $100
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePayPalSuccess = async (details: any) => {
    setIsProcessing(true)
    
    try {
      // Create order in database
      const orderData = {
        items,
        customer: {
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
        },
        shippingAddress: {
          name: formData.name,
          line1: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.zip,
          country: formData.country,
        },
        paymentMethod: 'paypal',
        paypalOrderId: details.orderID,
        paypalCaptureId: details.captureID,
        paypalPayerId: details.payerID,
        total,
        subtotal,
        tax,
        shipping,
      }

      // Save order to database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save order')
      }

      console.log('Order created:', result.order)
      
      // Clear cart and redirect
      clearCart()
      toast.success(`Payment successful! Order ${result.order.orderNumber} has been placed.`)
      router.push(`/checkout/success?order=${result.order.orderNumber}`)
    } catch (error) {
      console.error('Order creation failed:', error)
      toast.error('Payment successful but order creation failed. Please contact support with your PayPal transaction details.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePayPalError = (error: any) => {
    console.error('PayPal payment error:', error)
    toast.error('Payment failed. Please try again.')
    setIsProcessing(false)
  }

  const isFormValid = formData.email && formData.name && formData.address && 
                      formData.city && formData.state && formData.zip

  if (items.length === 0) {
    if (isHydrated) {
      router.push('/cart')
    }
    return null
  }

  // Don't render until hydrated to prevent hydration mismatch
  if (!isHydrated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-12">
          CHECKOUT
        </h1>
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-12">
        CHECKOUT
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-mf-blue focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-mf-blue focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-mf-blue focus:outline-none"
                />
              </div>
            </div>
          </motion.div>

          {/* Shipping Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-mf-blue focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-mf-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-mf-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">ZIP Code *</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-mf-blue focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Method Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="paypal"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'paypal')}
                  className="w-4 h-4 text-mf-blue"
                />
                <label htmlFor="paypal" className="text-gray-700 font-medium">
                  PayPal (Recommended)
                </label>
              </div>
              <p className="text-sm text-gray-600 ml-7">
                Pay with PayPal or credit/debit card through PayPal's secure checkout
              </p>
            </div>

            {/* PayPal Payment */}
            {paymentMethod === 'paypal' && (
              <div>
                {isFormValid ? (
                  <div>
                    <PayPalProvider
                      items={items}
                      customerEmail={formData.email}
                      customerData={{
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                      }}
                      shippingAddress={{
                        name: formData.name,
                        address: formData.address,
                        line1: formData.address,
                        city: formData.city,
                        state: formData.state,
                        zip: formData.zip,
                        postalCode: formData.zip,
                        country: formData.country,
                      }}
                      onSuccess={handlePayPalSuccess}
                      onError={handlePayPalError}
                      disabled={isProcessing}
                    />
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
                      <Shield size={16} />
                      <span>Your payment is secured by PayPal's buyer protection</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-center">
                      Please complete the contact and shipping information above to continue with payment.
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border h-fit"
        >
          <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={`${item.product.id}-${JSON.stringify(item.selectedVariants)}`} className="flex justify-between text-sm">
                <div>
                  <p className="text-gray-800">{item.product.name}</p>
                  {item.selectedVariants && (
                    <p className="text-gray-500 text-xs">
                      {Object.entries(item.selectedVariants).map(([key, value]) => `${key}: ${value}`).join(', ')}
                    </p>
                  )}
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-gray-800 font-medium">{formatPrice(item.product.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">{formatPrice(tax)}</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between">
                <span className="text-xl font-semibold">Total</span>
                <span className="text-xl font-semibold text-mf-dark-blue">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>✓ Secure checkout with PayPal</p>
            <p>✓ Free shipping on orders over $100</p>
            <p>✓ 30-day return policy</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 