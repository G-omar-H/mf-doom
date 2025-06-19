'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2, Package, ShoppingBag, Lock, ArrowRight, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cartStore'
import { formatPrice } from '@/lib/utils/formatters'
import { Button } from '@/components/ui/Button'

export const CartDrawer: React.FC = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, getTotalPrice } = useCartStore()
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Enhanced Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
          />

          {/* Enhanced Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Enhanced Header */}
              <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 p-6 border-b border-gray-800">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, rgba(139, 212, 230, 0.1) 0%, transparent 50%),
                                     radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)`
                  }} />
                </div>
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
                    >
                      <ShoppingBag size={20} className="text-white" />
                    </motion.div>
                    
                    <div>
                      <h2 className="text-2xl font-black tracking-tight text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Your Cart
                      </h2>
                      <p className="text-blue-300 text-sm font-medium">
                        {totalItems} {totalItems === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6"
                    >
                      <Package size={40} className="text-gray-400" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 mb-8 max-w-sm">
                      Discover our exclusive MF DOOM collection and add some items to get started.
                    </p>
                    
                    <Button 
                      onClick={() => setIsOpen(false)}
                      className="bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-800"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="p-6 space-y-6">
                    {items.map((item, index) => (
                      <motion.div
                        key={`${item.product.id}-${JSON.stringify(item.selectedVariants)}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                      >
                        <div className="p-4">
                          <div className="flex gap-4">
                            {/* Enhanced Product Image */}
                            <div className="relative w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                              {item.product.images.length > 0 ? (
                                <Image
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                                  sizes="80px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package size={24} className="text-gray-400" />
                                </div>
                              )}
                            </div>
                            
                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
                                {item.product.name}
                              </h3>
                              
                              {item.selectedVariants && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {Object.entries(item.selectedVariants).map(([key, value]) => (
                                    <span 
                                      key={key}
                                      className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                                    >
                                      {key}: {value}
                                    </span>
                                  ))}
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                  <span className="text-lg font-bold text-gray-900">
                                    {formatPrice(item.product.price)}
                                  </span>
                                  {item.quantity > 1 && (
                                    <span className="text-sm text-gray-500">
                                      {formatPrice(item.product.price * item.quantity)} total
                                    </span>
                                  )}
                                </div>
                                
                                {/* Quantity Controls */}
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center bg-gray-50 rounded-lg">
                                    <motion.button
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => {
                                        if (item.quantity > 1) {
                                          updateQuantity(item.product.id, item.quantity - 1, item.selectedVariants)
                                        }
                                      }}
                                      disabled={item.quantity <= 1}
                                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <Minus size={14} />
                                    </motion.button>
                                    
                                    <span className="w-8 text-center text-sm font-medium text-gray-900">
                                      {item.quantity}
                                    </span>
                                    
                                    <motion.button
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariants)}
                                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900"
                                    >
                                      <Plus size={14} />
                                    </motion.button>
                                  </div>
                                  
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => removeItem(item.product.id, item.selectedVariants)}
                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Enhanced Footer */}
              {items.length > 0 && (
                <div className="border-t border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6">
                  {/* Subtotal */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 font-medium">Subtotal</span>
                      <span className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {formatPrice(getTotalPrice())}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Shipping and taxes calculated at checkout
                    </p>
                  </div>
                  
                  {/* Trust Signals */}
                  <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                    <div className="text-xs text-gray-500">
                      <Lock size={14} className="mx-auto mb-1" />
                      Secure Checkout
                    </div>
                    <div className="text-xs text-gray-500">
                      <Package size={14} className="mx-auto mb-1" />
                      Free Shipping $100+
                    </div>
                    <div className="text-xs text-gray-500">
                      <Sparkles size={14} className="mx-auto mb-1" />
                      Authentic Merch
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Link href="/cart" onClick={() => setIsOpen(false)} className="block">
                      <Button 
                        variant="secondary" 
                        className="w-full border-gray-300 text-gray-900 hover:bg-gray-50"
                      >
                        View Cart Details
                      </Button>
                    </Link>
                    
                    <Link href="/checkout" onClick={() => setIsOpen(false)} className="block">
                      <Button 
                        className="w-full bg-gradient-to-r from-gray-900 via-black to-gray-900 hover:from-black hover:via-gray-900 hover:to-black shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                        rightIcon={<ArrowRight size={18} />}
                      >
                        Secure Checkout
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 