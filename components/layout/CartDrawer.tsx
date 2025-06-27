'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2, Package, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cartStore'
import { formatPrice } from '@/lib/utils/formatters'
import { Button } from '@/components/ui/Button'

export const CartDrawer: React.FC = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, getTotalPrice } = useCartStore()

  const subtotal = getTotalPrice()
  const shipping = subtotal > 100 ? 0 : 10
  const total = subtotal + shipping

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
                <div className="flex items-center gap-3">
                  <ShoppingBag size={24} className="text-black" />
                  <h2 className="font-bold text-xl text-black">Your Cart</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                    <Package size={64} className="text-gray-300 mb-4" />
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-600 mb-6">Add some MF DOOM merchandise to get started</p>
                    <Button
                      onClick={() => setIsOpen(false)}
                      className="btn-primary"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="p-6 space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={`${item.product.id}-${JSON.stringify(item.selectedVariants)}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {/* Product Image */}
                        <div className="relative w-16 h-16 bg-white rounded-md overflow-hidden shadow-sm">
                          {item.product.images?.[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <Package size={24} className="text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-black line-clamp-2 mb-1">
                            {item.product.name}
                          </h4>
                          {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                            <p className="text-xs text-gray-600 mb-2">
                              {Object.entries(item.selectedVariants)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(', ')}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-sm text-black">
                              {formatPrice(item.product.price)}
                            </p>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    updateQuantity(item.product.id, item.quantity - 1, item.selectedVariants)
                                  }
                                }}
                                className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={14} className="text-gray-600" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium text-black">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariants)}
                                className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                              >
                                <Plus size={14} className="text-gray-600" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.product.id, item.selectedVariants)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer with Totals and Checkout */}
              {items.length > 0 && (
                <div className="border-t border-gray-100 bg-white p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                      <span className="font-medium text-black">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-black">
                        {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                      </span>
                    </div>
                    {subtotal < 100 && (
                      <p className="text-xs text-mf-blue bg-mf-blue/10 p-2 rounded text-center">
                        Add {formatPrice(100 - subtotal)} more for free shipping
                      </p>
                    )}
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-black">Total</span>
                        <span className="text-black">{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>

                  <Link href="/checkout" onClick={() => setIsOpen(false)}>
                    <Button className="w-full btn-primary text-center">
                      Secure Checkout
                    </Button>
                  </Link>
                  
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full mt-3 py-2 text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 