'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/store/cartStore'
import { formatPrice } from '@/lib/utils/formatters'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, Package } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

// Disable static generation for this page
export const dynamic = 'force-dynamic'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()
  const [isHydrated, setIsHydrated] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const subtotal = getTotalPrice()
  const shipping = subtotal > 0 ? 10 : 0
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  // Don't render until hydrated to prevent hydration mismatch
  if (!isHydrated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-metal text-5xl text-doom-gold text-center mb-12">
          YOUR CART
        </h1>
        <div className="text-center text-doom-silver">Loading...</div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag size={80} className="mx-auto mb-6 text-doom-silver/50" />
          <h1 className="font-metal text-4xl text-doom-gold mb-4">Your Cart is Empty</h1>
          <p className="text-doom-silver mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link href="/products">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-metal text-5xl text-doom-gold text-center mb-12">
        YOUR CART
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={`${item.product.id}-${JSON.stringify(item.selectedVariants)}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="comic-panel p-6"
            >
              <div className="flex gap-6">
                <div className="relative w-32 h-32 bg-mf-light-gray rounded-lg overflow-hidden flex-shrink-0">
                  {item.product.images.length > 0 ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`${item.product.images.length > 0 ? 'hidden' : ''} w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200`}>
                    <Package size={48} className="text-gray-400" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-metal text-xl text-doom-silver">
                      {item.product.name}
                    </h3>
                    <button
                      onClick={() => removeItem(item.product.id, item.selectedVariants)}
                      className="text-doom-red hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {item.selectedVariants && (
                    <p className="text-sm text-doom-silver/70 mb-3">
                      {Object.entries(item.selectedVariants).map(([key, value]) => (
                        <span key={key} className="mr-3">
                          {key}: <span className="font-bold">{value}</span>
                        </span>
                      ))}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariants)}
                        className="w-8 h-8 border-2 border-doom-silver text-doom-silver hover:border-doom-gold hover:text-doom-gold flex items-center justify-center"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariants)}
                        className="w-8 h-8 border-2 border-doom-silver text-doom-silver hover:border-doom-gold hover:text-doom-gold flex items-center justify-center"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <p className="font-metal text-xl text-doom-gold">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          <div className="flex justify-end mt-6">
            <Button variant="danger" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="comic-panel p-6 h-fit"
        >
          <h2 className="font-metal text-2xl text-doom-gold mb-6">Order Summary</h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-doom-silver">Subtotal</span>
              <span className="font-bold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-doom-silver">Shipping</span>
              <span className="font-bold">{formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-doom-silver">Tax</span>
              <span className="font-bold">{formatPrice(tax)}</span>
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

          <Link href="/checkout">
            <Button size="lg" className="w-full mb-3">
              Proceed to Checkout
            </Button>
          </Link>

          <Link href="/products">
            <Button variant="secondary" className="w-full">
              Continue Shopping
            </Button>
          </Link>

          <div className="mt-6 text-sm text-doom-silver/70">
            <p>✓ Secure checkout</p>
            <p>✓ Free shipping on orders over $100</p>
            <p>✓ 30-day return policy</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 