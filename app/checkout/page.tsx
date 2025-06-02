'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cartStore'
import { formatPrice } from '@/lib/utils/formatters'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { CreditCard, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [isProcessing, setIsProcessing] = useState(false)

  const subtotal = getTotalPrice()
  const shipping = subtotal > 0 ? 10 : 0
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
    cardNumber: '',
    expiry: '',
    cvc: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create order
      const orderData = {
        items,
        customer: {
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
        },
        shippingAddress: {
          line1: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.zip,
          country: formData.country,
        },
        total,
        subtotal,
        tax,
        shipping,
      }

      console.log('Order created:', orderData)
      
      // Clear cart and redirect
      clearCart()
      toast.success('Order placed successfully!')
      router.push('/checkout/success')
    } catch (error) {
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-metal text-5xl text-doom-gold text-center mb-12">
        CHECKOUT
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="comic-panel p-6"
          >
            <h2 className="font-metal text-2xl text-doom-gold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-doom-silver mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-doom-black border-2 border-doom-silver text-doom-silver focus:border-doom-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-doom-silver mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-doom-black border-2 border-doom-silver text-doom-silver focus:border-doom-gold focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-doom-silver mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-doom-black border-2 border-doom-silver text-doom-silver focus:border-doom-gold focus:outline-none"
                />
              </div>
            </div>
          </motion.div>

          {/* Shipping Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="comic-panel p-6"
          >
            <h2 className="font-metal text-2xl text-doom-gold mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-doom-silver mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-doom-black border-2 border-doom-silver text-doom-silver focus:border-doom-gold focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-doom-silver mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-doom-black border-2 border-doom-silver text-doom-silver focus:border-doom-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-doom-silver mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-doom-black border-2 border-doom-silver text-doom-silver focus:border-doom-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-doom-silver mb-2">ZIP Code</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-doom-black border-2 border-doom-silver text-doom-silver focus:border-doom-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="comic-panel p-6"
          >
            <h2 className="font-metal text-2xl text-doom-gold mb-4">Payment Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-doom-silver mb-2">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  required
                  className="w-full px-4 py-3 bg-doom-black border-2 border-doom-silver text-doom-silver focus:border-doom-gold focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-doom-silver mb-2">Expiry Date</label>
                  <input
                    type="text"
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    required
                    className="w-full px-4 py-3 bg-doom-black border-2 border-doom-silver text-doom-silver focus:border-doom-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-doom-silver mb-2">CVC</label>
                  <input
                    type="text"
                    name="cvc"
                    value={formData.cvc}
                    onChange={handleInputChange}
                    placeholder="123"
                    required
                    className="w-full px-4 py-3 bg-doom-black border-2 border-doom-silver text-doom-silver focus:border-doom-gold focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-doom-silver/70">
                <Lock size={16} />
                <span>Your payment information is encrypted and secure</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="comic-panel p-6 h-fit"
        >
          <h2 className="font-metal text-2xl text-doom-gold mb-6">Order Summary</h2>

          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={`${item.product.id}-${JSON.stringify(item.selectedVariants)}`} className="flex justify-between text-sm">
                <div>
                  <p className="text-doom-silver">{item.product.name}</p>
                  {item.selectedVariants && (
                    <p className="text-doom-silver/70 text-xs">
                      {Object.entries(item.selectedVariants).map(([key, value]) => `${key}: ${value}`).join(', ')}
                    </p>
                  )}
                  <p className="text-doom-silver/70">Qty: {item.quantity}</p>
                </div>
                <p className="text-doom-silver">{formatPrice(item.product.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3 mb-6 border-t-2 border-doom-silver pt-4">
            <div className="flex justify-between">
              <span className="text-doom-silver">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-doom-silver">Shipping</span>
              <span>{formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-doom-silver">Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="border-t-2 border-doom-silver pt-3">
              <div className="flex justify-between">
                <span className="font-metal text-xl">Total</span>
                <span className="font-metal text-xl text-doom-gold">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full flex items-center justify-center gap-2"
            isLoading={isProcessing}
            disabled={isProcessing}
          >
            <CreditCard size={20} />
            {isProcessing ? 'Processing...' : 'Complete Order'}
          </Button>
        </motion.div>
      </form>
    </div>
  )
} 