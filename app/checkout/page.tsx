'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cartStore'
import { formatPrice } from '@/lib/utils/formatters'
import { Button } from '@/components/ui/Button'
import { PayPalProvider } from '@/components/payment/PayPalProvider'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Shield, CheckCircle, Package, Truck, RotateCcw, Star, CreditCard, Award, Eye, Clock } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'

// Disable static generation for this page
export const dynamic = 'force-dynamic'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'card'>('paypal')
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

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
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.email) errors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Please enter a valid email'
    
    if (!formData.name) errors.name = 'Full name is required'
    if (!formData.address) errors.address = 'Address is required'
    if (!formData.city) errors.city = 'City is required'
    if (!formData.state) errors.state = 'State is required'
    if (!formData.zip) errors.zip = 'ZIP code is required'
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handlePayPalSuccess = async (details: any) => {
    if (!validateForm()) return
    
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded-lg w-64 mx-auto mb-8" />
              <div className="h-96 bg-gray-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 bg-gradient-to-br from-gray-900 to-black rounded-xl flex items-center justify-center shadow-lg"
            >
              <Lock size={24} className="text-white" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Secure Checkout
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete your order with confidence. Your information is protected with enterprise-grade security.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-green-500" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={16} className="text-blue-500" />
              <span>Verified Merchant</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-yellow-500" />
              <span>5-Star Reviews</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Enhanced Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-3">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-4 border-2 rounded-xl text-lg transition-colors focus:outline-none ${
                      formErrors.email 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-blue-500'
                    }`}
                    placeholder="your@email.com"
                  />
                  {formErrors.email && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2"
                    >
                      {formErrors.email}
                    </motion.p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-3">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-4 border-2 rounded-xl text-lg transition-colors focus:outline-none ${
                      formErrors.name 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-blue-500'
                    }`}
                    placeholder="John Doe"
                  />
                  {formErrors.name && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2"
                    >
                      {formErrors.name}
                    </motion.p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-3">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                <h2 className="text-2xl font-bold text-gray-900">Shipping Address</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-3">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-4 border-2 rounded-xl text-lg transition-colors focus:outline-none ${
                      formErrors.address 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-blue-500'
                    }`}
                    placeholder="123 Main Street"
                  />
                  {formErrors.address && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2"
                    >
                      {formErrors.address}
                    </motion.p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-3">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-4 border-2 rounded-xl text-lg transition-colors focus:outline-none ${
                        formErrors.city 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-blue-500'
                      }`}
                      placeholder="New York"
                    />
                    {formErrors.city && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2"
                      >
                        {formErrors.city}
                      </motion.p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-3">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-4 border-2 rounded-xl text-lg transition-colors focus:outline-none ${
                        formErrors.state 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-blue-500'
                      }`}
                      placeholder="NY"
                    />
                    {formErrors.state && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2"
                      >
                        {formErrors.state}
                      </motion.p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-3">ZIP Code *</label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-4 border-2 rounded-xl text-lg transition-colors focus:outline-none ${
                        formErrors.zip 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-blue-500'
                      }`}
                      placeholder="10001"
                    />
                    {formErrors.zip && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2"
                      >
                        {formErrors.zip}
                      </motion.p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'paypal')}
                      className="w-5 h-5 text-blue-600"
                    />
                    <label htmlFor="paypal" className="text-lg font-bold text-gray-900 flex items-center gap-3">
                      <CreditCard size={24} className="text-blue-600" />
                      PayPal Checkout (Recommended)
                    </label>
                  </div>
                  <p className="text-gray-600 ml-8 mb-4">
                    Pay securely with PayPal or use any major credit/debit card through PayPal's trusted checkout system.
                  </p>
                  
                  <div className="flex items-center gap-4 ml-8 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Shield size={14} />
                      <span>Buyer Protection</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Lock size={14} />
                      <span>256-bit SSL</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle size={14} />
                      <span>Instant Processing</span>
                    </div>
                  </div>
                </div>

                {/* PayPal Payment */}
                {paymentMethod === 'paypal' && (
                  <div className="mt-6">
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
                        
                        {isProcessing && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
                          >
                            <div className="flex items-center gap-3 text-blue-700">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
                              />
                              <span className="font-medium">Processing your payment...</span>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                        <Eye size={24} className="mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-600 font-medium mb-2">Complete Required Information</p>
                        <p className="text-gray-500 text-sm">
                          Please fill out the contact and shipping information above to proceed with payment.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Enhanced Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-fit sticky top-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <Package size={24} className="text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
            </div>

            {/* Order Items */}
            <div className="space-y-4 mb-8">
              {items.map((item, index) => (
                <motion.div
                  key={`${item.product.id}-${JSON.stringify(item.selectedVariants)}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                    {item.product.images.length > 0 ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={20} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-1">
                      {item.product.name}
                    </h3>
                    {item.selectedVariants && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {Object.entries(item.selectedVariants).map(([key, value]) => (
                          <span key={key} className="text-xs bg-white text-gray-600 px-2 py-1 rounded-full">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                      <span className="font-bold text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pricing Breakdown */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600 font-bold">FREE</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span className="font-medium">{formatPrice(tax)}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Trust Signals */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield size={16} className="text-green-500" />
                Your Order is Protected
              </h3>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                  <span>SSL encrypted secure checkout</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck size={16} className="text-blue-500 flex-shrink-0" />
                  <span>Free shipping on orders over $100</span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw size={16} className="text-purple-500 flex-shrink-0" />
                  <span>30-day hassle-free returns</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-orange-500 flex-shrink-0" />
                  <span>Ships within 1-2 business days</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 