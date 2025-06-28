'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cartStore'
import { formatPrice } from '@/lib/utils/formatters'
import { Button } from '@/components/ui/Button'
import { PayPalProvider } from '@/components/payment/PayPalProvider'
import PayPalDebug from '@/components/debug/PayPalDebug'
import { motion } from 'framer-motion'
import { Lock, Shield, Package, CreditCard, Truck, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'

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
      console.log('✅ PayPal payment successful:', details)
      
      // Payment was already captured by the PayPal component
      // The order should already be created in the database
      if (details.order) {
        clearCart()
        router.push(`/checkout/success?order=${details.order.orderNumber}`)
      } else {
        // Fallback for older flow
        clearCart()
        router.push('/checkout/success')
      }
    } catch (error) {
      console.error('Post-payment processing error:', error)
      toast.error('Payment successful but there was an issue. Please contact support.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePayPalError = (error: any) => {
    console.error('PayPal payment error:', error)
    setIsProcessing(false)
    toast.error('Payment failed. Please try again or contact support if the issue persists.')
  }

  // Redirect if cart is empty
  useEffect(() => {
    if (isHydrated && items.length === 0) {
      router.push('/')
    }
  }, [items, router, isHydrated])

  if (!isHydrated || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package size={64} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to continue with checkout</p>
          <Link href="/">
            <Button className="btn-primary">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Temporary PayPal Debug Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <PayPalDebug />
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors">
              <ArrowLeft size={16} />
              Back to Shop
            </Link>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-mf-blue" />
              <span className="text-sm text-gray-600">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mf-blue focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mf-blue focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mf-blue focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck size={20} className="text-mf-blue" />
                <h3 className="text-lg font-semibold text-black">Shipping Address</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mf-blue focus:border-transparent"
                    placeholder="123 Main Street"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mf-blue focus:border-transparent"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mf-blue focus:border-transparent"
                    placeholder="NY"
                  />
                </div>
                <div>
                  <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mf-blue focus:border-transparent"
                    placeholder="10001"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mf-blue focus:border-transparent"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={20} className="text-mf-blue" />
                <h3 className="text-lg font-semibold text-black">Payment Method</h3>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3 mb-6">
                <label className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'paypal')}
                    className="text-mf-blue focus:ring-mf-blue"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">PayPal</span>
                  <div className="ml-auto">
                    <span className="text-xs text-gray-500">Secure payment with PayPal</span>
                  </div>
                </label>
              </div>

              {/* PayPal Payment */}
              {paymentMethod === 'paypal' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    <Lock size={16} className="text-mf-blue" />
                    <span>Your payment information is encrypted and secure</span>
                  </div>
                  <PayPalProvider
                    items={items}
                    customerEmail={formData.email}
                    customerData={{
                      name: formData.name,
                      email: formData.email,
                      phone: formData.phone,
                    }}
                    shippingAddress={{
                      line1: formData.address,
                      city: formData.city,
                      state: formData.state,
                      postalCode: formData.zip,
                      country: formData.country,
                    }}
                    onSuccess={handlePayPalSuccess}
                    onError={handlePayPalError}
                    disabled={!formData.email || !formData.name || !formData.address || !formData.city || !formData.state || !formData.zip || isProcessing}
                  />
                </div>
              )}
            </div>

            {/* Security Notice */}
            <div className="bg-mf-blue/5 border border-mf-blue/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-mf-blue" />
                <div>
                  <h4 className="font-medium text-black">Secure Checkout</h4>
                  <p className="text-sm text-gray-600">
                    Your personal and payment information is always safe. All transactions are encrypted and secure.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 