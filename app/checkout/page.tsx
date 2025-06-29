'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cartStore'
import { formatPrice } from '@/lib/utils/formatters'
import { Button } from '@/components/ui/Button'
import { PayPalProvider } from '@/components/payment/PayPalProvider'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Shield, Package, CreditCard, Truck, ArrowLeft, CheckCircle, AlertCircle, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'

// Disable static generation for this page
export const dynamic = 'force-dynamic'

interface FormErrors {
  [key: string]: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'card'>('paypal')
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isFormValid, setIsFormValid] = useState(false)

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

  // Form validation
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return !emailRegex.test(value) ? 'Please enter a valid email address' : ''
      case 'name':
        return value.trim().length < 2 ? 'Name must be at least 2 characters' : ''
      case 'address':
        return value.trim().length < 5 ? 'Please enter a complete address' : ''
      case 'city':
        return value.trim().length < 2 ? 'Please enter a valid city' : ''
      case 'state':
        return value.trim().length < 2 ? 'Please enter a valid state' : ''
      case 'zip':
        const zipRegex = /^\d{5}(-\d{4})?$/
        return !zipRegex.test(value) ? 'Please enter a valid ZIP code' : ''
      default:
        return ''
    }
  }

  const validateForm = (data = formData): boolean => {
    const requiredFields = ['email', 'name', 'address', 'city', 'state', 'zip']
    const errors: FormErrors = {}
    
    requiredFields.forEach(field => {
      if (!data[field as keyof typeof data].trim()) {
        errors[field] = 'This field is required'
      } else {
        const fieldError = validateField(field, data[field as keyof typeof data])
        if (fieldError) errors[field] = fieldError
      }
    })

    setFormErrors(errors)
    const isValid = Object.keys(errors).length === 0
    setIsFormValid(isValid)
    return isValid
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const newFormData = { ...formData, [name]: value }
    setFormData(newFormData)
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
    
    // Validate on change for immediate feedback
    setTimeout(() => validateForm(newFormData), 300)
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

  // Validate form on mount and changes
  useEffect(() => {
    validateForm()
  }, [])

  // Redirect if cart is empty
  useEffect(() => {
    if (isHydrated && items.length === 0) {
      router.push('/')
    }
  }, [items, router, isHydrated])

  if (!isHydrated || items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md"
        >
          <Package size={64} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to continue with checkout</p>
          <Link href="/">
            <Button className="btn-primary">Continue Shopping</Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 text-sm text-gray-600 hover:text-black transition-all duration-200 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Back to Shop</span>
            </Link>
            <div className="flex items-center gap-2 text-sm">
              <Shield size={16} className="text-mf-blue" />
              <span className="font-medium text-gray-700">Secure Checkout</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Enhanced Order Summary */}
          <div className="lg:col-span-5 lg:order-2">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-8"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-mf-blue to-blue-600 p-6 text-white">
                <h2 className="text-xl font-bold">Order Summary</h2>
                <p className="text-blue-100 mt-1">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
              </div>

              {/* Items */}
              <div className="p-6 space-y-6 max-h-80 overflow-y-auto">
                {items.map((item, index) => (
                  <motion.div 
                    key={`${item.product.id}-${JSON.stringify(item.selectedVariants)}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                      {item.product.images[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={28} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 line-clamp-2 mb-2">{item.product.name}</h4>
                      {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {Object.entries(item.selectedVariants).map(([key, value]) => (
                            <span key={key} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Qty: {item.quantity}</span>
                        <span className="font-bold text-gray-900">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 p-6 space-y-4 bg-gray-50">
                <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-900">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span className="font-medium text-gray-900">{formatPrice(tax)}</span>
                  </div>
                </div>
                
                {subtotal < 100 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-mf-blue/10 to-blue-100 border border-mf-blue/20 p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Info size={16} className="text-mf-blue" />
                      <span className="text-sm text-mf-blue font-medium">
                        Add {formatPrice(100 - subtotal)} more for free shipping!
                      </span>
                  </div>
                  </motion.div>
                )}
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-mf-blue">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Checkout Form */}
          <div className="lg:col-span-7 lg:order-1 mt-8 lg:mt-0">
          <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
          >
              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-mf-blue text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    Contact Information
                  </h3>
                  <p className="text-gray-600 mt-1">We'll use this to send order updates</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                <input
                  type="email"
                      id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                        className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none ${
                          formErrors.email 
                            ? 'border-red-300 focus:border-red-500 bg-red-50' 
                            : formData.email && !formErrors.email
                            ? 'border-green-300 focus:border-green-500 bg-green-50'
                            : 'border-gray-200 focus:border-mf-blue focus:bg-blue-50'
                        }`}
                      placeholder="your@email.com"
                />
                      <AnimatePresence>
                        {formErrors.email && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-1 mt-2 text-red-600 text-sm"
                          >
                            <AlertCircle size={14} />
                            {formErrors.email}
                          </motion.div>
                        )}
                        {formData.email && !formErrors.email && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-1 mt-2 text-green-600 text-sm"
                          >
                            <CheckCircle size={14} />
                            Looks good!
                          </motion.div>
                        )}
                      </AnimatePresence>
              </div>
              <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                <input
                  type="text"
                      id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                        className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none ${
                          formErrors.name 
                            ? 'border-red-300 focus:border-red-500 bg-red-50' 
                            : formData.name && !formErrors.name
                            ? 'border-green-300 focus:border-green-500 bg-green-50'
                            : 'border-gray-200 focus:border-mf-blue focus:bg-blue-50'
                        }`}
                      placeholder="John Doe"
                    />
                      <AnimatePresence>
                        {formErrors.name && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-1 mt-2 text-red-600 text-sm"
                          >
                            <AlertCircle size={14} />
                            {formErrors.name}
                          </motion.div>
                        )}
                      </AnimatePresence>
                  </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:border-mf-blue focus:bg-blue-50"
                      placeholder="+1 (555) 123-4567"
                />
                    </div>
              </div>
            </div>
              </div>

          {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-mf-blue text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <Truck size={20} className="text-mf-blue" />
                    Shipping Address
                  </h3>
                  <p className="text-gray-600 mt-1">Where should we send your order?</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                      Street Address *
                    </label>
                <input
                  type="text"
                      id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                        className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none ${
                          formErrors.address 
                            ? 'border-red-300 focus:border-red-500 bg-red-50' 
                            : formData.address && !formErrors.address
                            ? 'border-green-300 focus:border-green-500 bg-green-50'
                            : 'border-gray-200 focus:border-mf-blue focus:bg-blue-50'
                        }`}
                      placeholder="123 Main Street"
                />
                      <AnimatePresence>
                        {formErrors.address && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-1 mt-2 text-red-600 text-sm"
                          >
                            <AlertCircle size={14} />
                            {formErrors.address}
                          </motion.div>
                        )}
                      </AnimatePresence>
              </div>
                <div>
                      <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                      City *
                    </label>
                  <input
                    type="text"
                      id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                        className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none ${
                          formErrors.city 
                            ? 'border-red-300 focus:border-red-500 bg-red-50' 
                            : formData.city && !formErrors.city
                            ? 'border-green-300 focus:border-green-500 bg-green-50'
                            : 'border-gray-200 focus:border-mf-blue focus:bg-blue-50'
                        }`}
                      placeholder="New York"
                  />
                      <AnimatePresence>
                        {formErrors.city && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-1 mt-2 text-red-600 text-sm"
                          >
                            <AlertCircle size={14} />
                            {formErrors.city}
                          </motion.div>
                        )}
                      </AnimatePresence>
                </div>
                <div>
                      <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2">
                      State *
                    </label>
                  <input
                    type="text"
                      id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                        className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none ${
                          formErrors.state 
                            ? 'border-red-300 focus:border-red-500 bg-red-50' 
                            : formData.state && !formErrors.state
                            ? 'border-green-300 focus:border-green-500 bg-green-50'
                            : 'border-gray-200 focus:border-mf-blue focus:bg-blue-50'
                        }`}
                      placeholder="NY"
                  />
                      <AnimatePresence>
                        {formErrors.state && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-1 mt-2 text-red-600 text-sm"
                          >
                            <AlertCircle size={14} />
                            {formErrors.state}
                          </motion.div>
                        )}
                      </AnimatePresence>
                </div>
                <div>
                      <label htmlFor="zip" className="block text-sm font-semibold text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                  <input
                    type="text"
                      id="zip"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    required
                        className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none ${
                          formErrors.zip 
                            ? 'border-red-300 focus:border-red-500 bg-red-50' 
                            : formData.zip && !formErrors.zip
                            ? 'border-green-300 focus:border-green-500 bg-green-50'
                            : 'border-gray-200 focus:border-mf-blue focus:bg-blue-50'
                        }`}
                      placeholder="10001"
                    />
                      <AnimatePresence>
                        {formErrors.zip && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-1 mt-2 text-red-600 text-sm"
                          >
                            <AlertCircle size={14} />
                            {formErrors.zip}
                          </motion.div>
                        )}
                      </AnimatePresence>
                  </div>
                  <div>
                      <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:border-mf-blue focus:bg-blue-50"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                    </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-mf-blue text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <CreditCard size={20} className="text-mf-blue" />
                    Payment Method
                  </h3>
                  <p className="text-gray-600 mt-1">Choose your preferred payment method</p>
            </div>

                <div className="p-6">
          {/* Payment Method Selection */}
                  <div className="space-y-4 mb-8">
                    <motion.label 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        paymentMethod === 'paypal' 
                          ? 'border-mf-blue bg-blue-50 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'paypal')}
                        className="text-mf-blue focus:ring-mf-blue w-4 h-4"
                    />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">PayPal</span>
                          <div className="flex items-center gap-2">
                            <span className="bg-gradient-to-r from-mf-blue to-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                              Recommended
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Pay with any card (no account needed) or PayPal balance</p>
                    </div>
                    </motion.label>
            </div>

            {/* PayPal Payment */}
            {paymentMethod === 'paypal' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 p-4 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Lock size={20} className="text-green-600" />
                          <div>
                            <h4 className="font-semibold text-green-800">Secure Payment</h4>
                            <p className="text-sm text-green-700 mt-1">
                              Your payment information is encrypted and secure. Pay with confidence.
                            </p>
                          </div>
                        </div>
                    </div>
                      
                      <div className={`transition-all duration-300 ${!isFormValid ? 'opacity-50 pointer-events-none' : ''}`}>
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
                          disabled={!isFormValid || isProcessing}
                    />
        </div>

                      {!isFormValid && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-amber-50 border border-amber-200 p-4 rounded-xl"
                        >
                <div className="flex items-center gap-3">
                            <AlertCircle size={20} className="text-amber-600" />
                <div>
                              <h4 className="font-semibold text-amber-800">Complete Required Fields</h4>
                              <p className="text-sm text-amber-700 mt-1">
                                Please fill out all required fields above to continue with payment.
                    </p>
                  </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Enhanced Security Notice */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-mf-blue/5 via-blue-50 to-mf-blue/5 border-2 border-mf-blue/20 rounded-2xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-mf-blue to-blue-600 rounded-full flex items-center justify-center">
                      <Shield size={24} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">100% Secure Checkout</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-600" />
                        <span>256-bit SSL encryption protects your data</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-600" />
                        <span>PayPal Buyer Protection covers eligible purchases</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-600" />
                        <span>We never store your payment information</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
          </div>
      </div>
    </div>
  )
} 