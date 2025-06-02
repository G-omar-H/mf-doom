'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2, Package } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cartStore'
import { formatPrice } from '@/lib/utils/formatters'
import { Button } from '@/components/ui/Button'

export const CartDrawer: React.FC = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, getTotalPrice } = useCartStore()

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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-doom-navy border-l-4 border-doom-chrome z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b-2 border-doom-chrome/30 bg-gradient-to-r from-doom-darkTeal to-doom-navy">
                <h2 className="font-metal text-2xl text-doom-teal">Your Cart</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-doom-chrome hover:text-doom-teal transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-doom-silver mb-4">Your cart is empty</p>
                    <Button onClick={() => setIsOpen(false)}>Continue Shopping</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={`${item.product.id}-${JSON.stringify(item.selectedVariants)}`} className="flex gap-4 py-4 border-b border-gray-100">
                        <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                            <Package size={32} className="text-gray-400" />
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-bold text-doom-silver mb-1">{item.product.name}</h3>
                          {item.selectedVariants && (
                            <p className="text-sm text-doom-chrome/70 mb-2">
                              {Object.entries(item.selectedVariants).map(([key, value]) => (
                                <span key={key}>{key}: {value} </span>
                              ))}
                            </p>
                          )}
                          <p className="font-metal text-doom-teal">{formatPrice(item.product.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t-2 border-doom-chrome/30 p-6 bg-gradient-to-r from-doom-navy to-doom-darkTeal">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-metal text-xl text-doom-silver">Total</span>
                    <span className="font-metal text-2xl text-doom-teal">
                      {formatPrice(getTotalPrice())}
                    </span>
                  </div>
                  
                  <Link href="/cart" onClick={() => setIsOpen(false)}>
                    <Button variant="primary" className="w-full mb-2">
                      View Cart
                    </Button>
                  </Link>
                  
                  <Link href="/checkout" onClick={() => setIsOpen(false)}>
                    <Button variant="primary" className="w-full">
                      Checkout
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 