'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cartStore'
import { formatPrice } from '@/lib/utils/formatters'
import { Button } from '@/components/ui/Button'
import { PayPalProvider } from '@/components/payment/PayPalProvider'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Shield, CheckCircle, Package, Truck, RotateCcw, Star, CreditCard, Award, Eye, Clock, Skull, Zap } from 'lucide-react'
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
    
    if (!formData.email) errors.email = 'EMAIL IS REQUIRED'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'ENTER A VALID EMAIL'
    
    if (!formData.name) errors.name = 'FULL NAME IS REQUIRED'
    if (!formData.address) errors.address = 'ADDRESS IS REQUIRED'
    if (!formData.city) errors.city = 'CITY IS REQUIRED'
    if (!formData.state) errors.state = 'STATE IS REQUIRED'
    if (!formData.zip) errors.zip = 'ZIP CODE IS REQUIRED'
    
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
      toast.success(`PAYMENT SUCCESSFUL! ORDER ${result.order.orderNumber} HAS BEEN PLACED.`, {
        style: {
          background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
          color: '#ffd700',
          fontSize: '14px',
          fontWeight: '700',
          border: '1px solid #ffd700',
          fontFamily: 'monospace',
        },
      })
      router.push(`/checkout/success?order=${result.order.orderNumber}`)
    } catch (error) {
      console.error('Order creation failed:', error)
      toast.error('PAYMENT SUCCESSFUL BUT ORDER CREATION FAILED. CONTACT SUPPORT.', {
        style: {
          background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
          color: '#dc143c',
          fontSize: '14px',
          fontWeight: '700',
          border: '1px solid #dc143c',
          fontFamily: 'monospace',
        },
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePayPalError = (error: any) => {
    console.error('PayPal payment error:', error)
    toast.error('PAYMENT FAILED. TRY AGAIN.', {
      style: {
        background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
        color: '#dc143c',
        fontSize: '14px',
        fontWeight: '700',
        border: '1px solid #dc143c',
        fontFamily: 'monospace',
      },
    })
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
      <div className="min-h-screen bg-villain-dark py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-16 bg-doom-gray/50 w-80 mx-auto mb-8" style={{
                clipPath: 'polygon(8% 0%, 92% 0%, 100% 20%, 100% 80%, 92% 100%, 8% 100%, 0% 80%, 0% 20%)'
              }} />
              <div className="h-96 bg-doom-gray/30" style={{
                clipPath: 'polygon(5% 0%, 95% 0%, 100% 10%, 100% 90%, 95% 100%, 5% 100%, 0% 90%, 0% 10%)'
              }} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-villain-dark py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Villain Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-4 mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 bg-villain-gold border-4 border-doom-bronze flex items-center justify-center shadow-gold-glow"
              style={{
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 30%, 100% 70%, 80% 100%, 20% 100%, 0% 70%, 0% 30%)'
              }}
            >
              <Lock size={32} className="text-doom-black" />
            </motion.div>
            <h1 className="font-villain text-doom-3xl md:text-doom-hero text-doom-gold tracking-wide leading-none"
                style={{
                  textShadow: '4px 4px 0px #000000, -2px -2px 0px #000000'
                }}>
              SECURE CHECKOUT
            </h1>
          </div>
          <p className="text-doom-lg text-doom-silver max-w-2xl mx-auto font-mono leading-relaxed">
            COMPLETE YOUR ORDER WITH CONFIDENCE. YOUR INFORMATION IS PROTECTED WITH VILLAIN-GRADE SECURITY.
          </p>
          
          {/* Villain Trust Indicators */}
          <div className="flex items-center justify-center gap-8 mt-8 text-doom-sm text-doom-metal font-mono">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-doom-gold" />
              <span>SSL ENCRYPTED</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={18} className="text-doom-gold" />
              <span>VERIFIED MERCHANT</span>
            </div>
            <div className="flex items-center gap-2">
              <Skull size={18} className="text-doom-gold" />
              <span>VILLAIN APPROVED</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Villain Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Contact Information - Villain Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-doom-charcoal border-2 border-doom-gold/30 p-8 shadow-villain-lg"
              style={{
                clipPath: 'polygon(5% 0%, 95% 0%, 100% 8%, 100% 92%, 95% 100%, 5% 100%, 0% 92%, 0% 8%)'
              }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-villain-gold border-2 border-doom-bronze flex items-center justify-center text-doom-black font-villain text-doom-sm"
                     style={{
                       clipPath: 'polygon(20% 0%, 80% 0%, 100% 40%, 100% 60%, 80% 100%, 20% 100%, 0% 60%, 0% 40%)'
                     }}>1</div>
                <h2 className="font-villain text-doom-xl text-doom-gold tracking-wide">CONTACT INFORMATION</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-doom-silver font-villain mb-4 text-doom-sm tracking-wider uppercase">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-6 py-4 border-2 text-doom-lg bg-doom-dark text-doom-silver font-mono transition-colors focus:outline-none ${
                      formErrors.email 
                        ? 'border-doom-red focus:border-doom-red' 
                        : 'border-doom-gray focus:border-doom-gold'
                    }`}
                    style={{
                      clipPath: 'polygon(5% 0%, 95% 0%, 100% 15%, 100% 85%, 95% 100%, 5% 100%, 0% 85%, 0% 15%)'
                    }}
                    placeholder="YOUR@EMAIL.COM"
                  />
                  {formErrors.email && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-doom-red font-villain text-doom-sm mt-3 tracking-wide"
                    >
                      {formErrors.email}
                    </motion.p>
                  )}
                </div>
                
                <div>
                  <label className="block text-doom-silver font-villain mb-4 text-doom-sm tracking-wider uppercase">FULL NAME *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-6 py-4 border-2 text-doom-lg bg-doom-dark text-doom-silver font-mono transition-colors focus:outline-none ${
                      formErrors.name 
                        ? 'border-doom-red focus:border-doom-red' 
                        : 'border-doom-gray focus:border-doom-gold'
                    }`}
                    style={{
                      clipPath: 'polygon(5% 0%, 95% 0%, 100% 15%, 100% 85%, 95% 100%, 5% 100%, 0% 85%, 0% 15%)'
                    }}
                    placeholder="JOHN DOE"
                  />
                  {formErrors.name && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-doom-red font-villain text-doom-sm mt-3 tracking-wide"
                    >
                      {formErrors.name}
                    </motion.p>
                  )}
                </div>
                
                <div>
                  <label className="block text-doom-silver font-villain mb-4 text-doom-sm tracking-wider uppercase">PHONE NUMBER</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 border-2 border-doom-gray text-doom-lg bg-doom-dark text-doom-silver font-mono focus:border-doom-gold focus:outline-none transition-colors"
                    style={{
                      clipPath: 'polygon(5% 0%, 95% 0%, 100% 15%, 100% 85%, 95% 100%, 5% 100%, 0% 85%, 0% 15%)'
                    }}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </motion.div>

            {/* Shipping Address - Villain Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-doom-charcoal border-2 border-doom-gold/30 p-8 shadow-villain-lg"
              style={{
                clipPath: 'polygon(5% 0%, 95% 0%, 100% 8%, 100% 92%, 95% 100%, 5% 100%, 0% 92%, 0% 8%)'
              }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-villain-gold border-2 border-doom-bronze flex items-center justify-center text-doom-black font-villain text-doom-sm"
                     style={{
                       clipPath: 'polygon(20% 0%, 80% 0%, 100% 40%, 100% 60%, 80% 100%, 20% 100%, 0% 60%, 0% 40%)'
                     }}>2</div>
                <h2 className="font-villain text-doom-xl text-doom-gold tracking-wide">SHIPPING ADDRESS</h2>
              </div>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-doom-silver font-villain mb-4 text-doom-sm tracking-wider uppercase">STREET ADDRESS *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-6 py-4 border-2 text-doom-lg bg-doom-dark text-doom-silver font-mono transition-colors focus:outline-none ${
                      formErrors.address 
                        ? 'border-doom-red focus:border-doom-red' 
                        : 'border-doom-gray focus:border-doom-gold'
                    }`}
                    style={{
                      clipPath: 'polygon(5% 0%, 95% 0%, 100% 15%, 100% 85%, 95% 100%, 5% 100%, 0% 85%, 0% 15%)'
                    }}
                    placeholder="123 MAIN STREET"
                  />
                  {formErrors.address && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-doom-red font-villain text-doom-sm mt-3 tracking-wide"
                    >
                      {formErrors.address}
                    </motion.p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <label className="block text-doom-silver font-villain mb-4 text-doom-sm tracking-wider uppercase">CITY *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-6 py-4 border-2 text-doom-lg bg-doom-dark text-doom-silver font-mono transition-colors focus:outline-none ${
                        formErrors.city 
                          ? 'border-doom-red focus:border-doom-red' 
                          : 'border-doom-gray focus:border-doom-gold'
                      }`}
                      style={{
                        clipPath: 'polygon(5% 0%, 95% 0%, 100% 15%, 100% 85%, 95% 100%, 5% 100%, 0% 85%, 0% 15%)'
                      }}
                      placeholder="NEW YORK"
                    />
                    {formErrors.city && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-doom-red font-villain text-doom-sm mt-3 tracking-wide"
                      >
                        {formErrors.city}
                      </motion.p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-doom-silver font-villain mb-4 text-doom-sm tracking-wider uppercase">STATE *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-6 py-4 border-2 text-doom-lg bg-doom-dark text-doom-silver font-mono transition-colors focus:outline-none ${
                        formErrors.state 
                          ? 'border-doom-red focus:border-doom-red' 
                          : 'border-doom-gray focus:border-doom-gold'
                      }`}
                      style={{
                        clipPath: 'polygon(5% 0%, 95% 0%, 100% 15%, 100% 85%, 95% 100%, 5% 100%, 0% 85%, 0% 15%)'
                      }}
                      placeholder="NY"
                    />
                    {formErrors.state && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-doom-red font-villain text-doom-sm mt-3 tracking-wide"
                      >
                        {formErrors.state}
                      </motion.p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-doom-silver font-villain mb-4 text-doom-sm tracking-wider uppercase">ZIP CODE *</label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-6 py-4 border-2 text-doom-lg bg-doom-dark text-doom-silver font-mono transition-colors focus:outline-none ${
                        formErrors.zip 
                          ? 'border-doom-red focus:border-doom-red' 
                          : 'border-doom-gray focus:border-doom-gold'
                      }`}
                      style={{
                        clipPath: 'polygon(5% 0%, 95% 0%, 100% 15%, 100% 85%, 95% 100%, 5% 100%, 0% 85%, 0% 15%)'
                      }}
                      placeholder="10001"
                    />
                    {formErrors.zip && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-doom-red font-villain text-doom-sm mt-3 tracking-wide"
                      >
                        {formErrors.zip}
                      </motion.p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Method - Villain Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-doom-charcoal border-2 border-doom-gold/30 p-8 shadow-villain-lg"
              style={{
                clipPath: 'polygon(5% 0%, 95% 0%, 100% 8%, 100% 92%, 95% 100%, 5% 100%, 0% 92%, 0% 8%)'
              }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-villain-gold border-2 border-doom-bronze flex items-center justify-center text-doom-black font-villain text-doom-sm"
                     style={{
                       clipPath: 'polygon(20% 0%, 80% 0%, 100% 40%, 100% 60%, 80% 100%, 20% 100%, 0% 60%, 0% 40%)'
                     }}>3</div>
                <h2 className="font-villain text-doom-xl text-doom-gold tracking-wide">PAYMENT METHOD</h2>
              </div>
              
              <div className="space-y-8">
                <div className="bg-doom-dark border-2 border-doom-gold/50 p-6"
                     style={{
                       clipPath: 'polygon(5% 0%, 95% 0%, 100% 10%, 100% 90%, 95% 100%, 5% 100%, 0% 90%, 0% 10%)'
                     }}>
                  <div className="flex items-center gap-4 mb-6">
                    <input
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'paypal')}
                      className="w-6 h-6 text-doom-gold"
                    />
                    <label htmlFor="paypal" className="font-villain text-doom-base text-doom-gold flex items-center gap-4 tracking-wide">
                      <CreditCard size={28} className="text-doom-gold" />
                      PAYPAL CHECKOUT (RECOMMENDED)
                    </label>
                  </div>
                  <p className="text-doom-silver font-mono ml-10 mb-6 leading-relaxed">
                    PAY SECURELY WITH PAYPAL OR USE ANY MAJOR CREDIT/DEBIT CARD THROUGH PAYPAL'S TRUSTED CHECKOUT SYSTEM.
                  </p>
                  
                  <div className="flex items-center gap-6 ml-10 text-doom-sm text-doom-metal font-mono">
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-doom-gold" />
                      <span>BUYER PROTECTION</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock size={16} className="text-doom-gold" />
                      <span>256-BIT SSL</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap size={16} className="text-doom-gold" />
                      <span>INSTANT PROCESSING</span>
                    </div>
                  </div>
                </div>

                {/* PayPal Payment - Villain Style */}
                {paymentMethod === 'paypal' && (
                  <div className="mt-8">
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
                            className="mt-6 p-6 bg-doom-charcoal border-2 border-doom-gold/50"
                            style={{
                              clipPath: 'polygon(5% 0%, 95% 0%, 100% 12%, 100% 88%, 95% 100%, 5% 100%, 0% 88%, 0% 12%)'
                            }}
                          >
                            <div className="flex items-center gap-4 text-doom-gold">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-6 h-6 border-2 border-doom-gold border-t-transparent"
                                style={{
                                  clipPath: 'polygon(20% 0%, 80% 0%, 100% 40%, 100% 60%, 80% 100%, 20% 100%, 0% 60%, 0% 40%)'
                                }}
                              />
                              <span className="font-villain tracking-wide">PROCESSING YOUR PAYMENT...</span>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-doom-gray/50 border-2 border-doom-metal p-8 text-center"
                           style={{
                             clipPath: 'polygon(5% 0%, 95% 0%, 100% 12%, 100% 88%, 95% 100%, 5% 100%, 0% 88%, 0% 12%)'
                           }}>
                        <Eye size={32} className="mx-auto text-doom-gold mb-4" />
                        <p className="text-doom-silver font-villain mb-3 text-doom-base tracking-wide">COMPLETE REQUIRED INFORMATION</p>
                        <p className="text-doom-metal font-mono text-doom-sm">
                          PLEASE FILL OUT THE CONTACT AND SHIPPING INFORMATION ABOVE TO PROCEED WITH PAYMENT.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Villain Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-doom-charcoal border-2 border-doom-gold/30 p-8 shadow-villain-lg h-fit sticky top-8"
            style={{
              clipPath: 'polygon(5% 0%, 95% 0%, 100% 8%, 100% 92%, 95% 100%, 5% 100%, 0% 92%, 0% 8%)'
            }}
          >
            <div className="flex items-center gap-4 mb-8">
              <Package size={28} className="text-doom-gold" />
              <h2 className="font-villain text-doom-xl text-doom-gold tracking-wide">ORDER SUMMARY</h2>
            </div>

            {/* Villain Order Items */}
            <div className="space-y-6 mb-8">
              {items.map((item, index) => (
                <motion.div
                  key={`${item.product.id}-${JSON.stringify(item.selectedVariants)}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex gap-4 p-4 bg-doom-dark border border-doom-gold/20"
                  style={{
                    clipPath: 'polygon(5% 0%, 95% 0%, 100% 12%, 100% 88%, 95% 100%, 5% 100%, 0% 88%, 0% 12%)'
                  }}
                >
                  <div className="relative w-16 h-16 bg-doom-gray border border-doom-gold/30 overflow-hidden flex-shrink-0"
                       style={{
                         clipPath: 'polygon(15% 0%, 85% 0%, 100% 30%, 100% 70%, 85% 100%, 15% 100%, 0% 70%, 0% 30%)'
                       }}>
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
                        <Package size={24} className="text-doom-gold/60" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-villain text-doom-sm text-doom-gold line-clamp-2 mb-2 tracking-wide">
                      {item.product.name.toUpperCase()}
                    </h3>
                    {item.selectedVariants && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {Object.entries(item.selectedVariants).map(([key, value]) => (
                          <span key={key} className="text-xs bg-doom-gold/20 text-doom-gold px-2 py-1 font-mono border border-doom-gold/30"
                                style={{
                                  clipPath: 'polygon(10% 0%, 90% 0%, 100% 30%, 100% 70%, 90% 100%, 10% 100%, 0% 70%, 0% 30%)'
                                }}>
                            {key.toUpperCase()}: {value.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-doom-sm text-doom-silver font-mono">QTY: {item.quantity}</span>
                      <span className="font-villain text-doom-base text-doom-gold tracking-wide">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Villain Pricing Breakdown */}
            <div className="border-t-2 border-doom-gold/30 pt-8 space-y-6">
              <div className="flex justify-between text-doom-silver font-mono">
                <span>SUBTOTAL</span>
                <span className="font-villain text-doom-gold tracking-wide">{formatPrice(subtotal)}</span>
              </div>
              
              <div className="flex justify-between text-doom-silver font-mono">
                <span>SHIPPING</span>
                <span className="font-villain tracking-wide">
                  {shipping === 0 ? (
                    <span className="text-doom-gold">FREE</span>
                  ) : (
                    <span className="text-doom-gold">{formatPrice(shipping)}</span>
                  )}
                </span>
              </div>
              
              <div className="flex justify-between text-doom-silver font-mono">
                <span>TAX</span>
                <span className="font-villain text-doom-gold tracking-wide">{formatPrice(tax)}</span>
              </div>
              
              <div className="border-t-2 border-doom-gold/30 pt-6">
                <div className="flex justify-between items-center">
                  <span className="font-villain text-doom-lg text-doom-silver tracking-wide">TOTAL</span>
                  <span className="font-villain text-doom-2xl text-doom-gold tracking-wide"
                        style={{
                          textShadow: '2px 2px 0px #000000'
                        }}>
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Villain Trust Signals */}
            <div className="mt-8 pt-8 border-t-2 border-doom-gold/30">
              <h3 className="font-villain text-doom-base text-doom-gold mb-6 flex items-center gap-3 tracking-wide">
                <Shield size={20} className="text-doom-gold" />
                YOUR ORDER IS PROTECTED
              </h3>
              
              <div className="space-y-4 text-doom-sm text-doom-silver font-mono">
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-doom-gold flex-shrink-0" />
                  <span>SSL ENCRYPTED SECURE CHECKOUT</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck size={16} className="text-doom-gold flex-shrink-0" />
                  <span>FREE SHIPPING ON ORDERS OVER $100</span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw size={16} className="text-doom-gold flex-shrink-0" />
                  <span>30-DAY HASSLE-FREE RETURNS</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-doom-gold flex-shrink-0" />
                  <span>SHIPS WITHIN 1-2 BUSINESS DAYS</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 