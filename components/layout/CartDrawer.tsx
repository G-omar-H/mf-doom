'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2, Package, ShoppingBag, Lock, ArrowRight, Skull, Shield, Zap } from 'lucide-react'
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
          {/* Villain Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-doom-black/80 backdrop-blur-md z-40"
          />

          {/* Villain Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-villain-dark shadow-villain-2xl z-50 overflow-hidden border-l-4 border-doom-gold"
          >
            <div className="flex flex-col h-full">
              {/* Villain Header */}
              <div className="relative bg-doom-charcoal p-6 border-b-2 border-doom-gold/30">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-grunge-texture opacity-20" />
                <div className="absolute inset-0 bg-doom-bg-pattern opacity-10" />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="w-12 h-12 bg-villain-gold border-2 border-doom-bronze flex items-center justify-center shadow-gold-glow"
                      style={{
                        clipPath: 'polygon(20% 0%, 80% 0%, 100% 40%, 100% 60%, 80% 100%, 20% 100%, 0% 60%, 0% 40%)'
                      }}
                    >
                      <ShoppingBag size={24} className="text-doom-black" />
                    </motion.div>
                    
                    <div>
                      <h2 className="font-villain text-doom-xl text-doom-gold tracking-wide leading-none"
                          style={{
                            textShadow: '2px 2px 0px #000000'
                          }}>
                        YOUR CART
                      </h2>
                      <p className="text-doom-silver font-mono text-doom-sm mt-1">
                        {totalItems} {totalItems === 1 ? 'ITEM' : 'ITEMS'}
                      </p>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="w-12 h-12 bg-doom-charcoal border-2 border-doom-silver text-doom-silver hover:border-doom-red hover:text-doom-red transition-all duration-300"
                    style={{
                      clipPath: 'polygon(20% 0%, 80% 0%, 100% 40%, 100% 60%, 80% 100%, 20% 100%, 0% 60%, 0% 40%)'
                    }}
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto bg-villain-dark">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full px-6 text-center bg-paper-texture">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="w-28 h-28 bg-doom-charcoal border-2 border-doom-gold/30 flex items-center justify-center mb-8 shadow-villain-md"
                      style={{
                        clipPath: 'polygon(20% 0%, 80% 0%, 100% 30%, 100% 70%, 80% 100%, 20% 100%, 0% 70%, 0% 30%)'
                      }}
                    >
                      <Package size={48} className="text-doom-gold/60" />
                    </motion.div>
                    
                    <h3 className="font-villain text-doom-lg text-doom-gold mb-3 tracking-wide">
                      YOUR CART IS EMPTY
                    </h3>
                    <p className="text-doom-metal font-mono mb-8 max-w-sm leading-relaxed">
                      Discover our exclusive MF DOOM collection and add some villain gear to get started.
                    </p>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsOpen(false)}
                      className="bg-villain-gold text-doom-black font-villain px-8 py-4 shadow-villain-lg hover:shadow-gold-glow transition-all duration-300 tracking-wide"
                      style={{
                        clipPath: 'polygon(10% 0%, 90% 0%, 100% 25%, 100% 75%, 90% 100%, 10% 100%, 0% 75%, 0% 25%)'
                      }}
                    >
                      CONTINUE SHOPPING
                    </motion.button>
                  </div>
                ) : (
                  <div className="p-6 space-y-6 bg-paper-texture">
                    {items.map((item, index) => (
                      <motion.div
                        key={`${item.product.id}-${JSON.stringify(item.selectedVariants)}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative bg-doom-charcoal border-2 border-doom-gray hover:border-doom-gold/50 hover:shadow-villain-md transition-all duration-300 overflow-hidden"
                        style={{
                          clipPath: 'polygon(5% 0%, 95% 0%, 100% 12%, 100% 88%, 95% 100%, 5% 100%, 0% 88%, 0% 12%)'
                        }}
                      >
                        <div className="p-4">
                          <div className="flex gap-4">
                            {/* Villain Product Image */}
                            <div className="relative w-20 h-20 bg-doom-gray border border-doom-gold/30 overflow-hidden flex-shrink-0"
                                 style={{
                                   clipPath: 'polygon(15% 0%, 85% 0%, 100% 30%, 100% 70%, 85% 100%, 15% 100%, 0% 70%, 0% 30%)'
                                 }}>
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
                                  <Package size={28} className="text-doom-gold/60" />
                                </div>
                              )}
                            </div>
                            
                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-villain text-doom-sm text-doom-gold leading-tight mb-2 line-clamp-2 tracking-wide">
                                {item.product.name.toUpperCase()}
                              </h3>
                              
                              {item.selectedVariants && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {Object.entries(item.selectedVariants).map(([key, value]) => (
                                    <span 
                                      key={key}
                                      className="inline-block text-xs bg-doom-gold/20 text-doom-gold px-2 py-1 font-mono border border-doom-gold/30"
                                      style={{
                                        clipPath: 'polygon(10% 0%, 90% 0%, 100% 30%, 100% 70%, 90% 100%, 10% 100%, 0% 70%, 0% 30%)'
                                      }}
                                    >
                                      {key.toUpperCase()}: {value.toUpperCase()}
                                    </span>
                                  ))}
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                  <span className="font-villain text-doom-base text-doom-gold tracking-wide">
                                    {formatPrice(item.product.price)}
                                  </span>
                                  {item.quantity > 1 && (
                                    <span className="text-doom-sm text-doom-silver font-mono">
                                      {formatPrice(item.product.price * item.quantity)} TOTAL
                                    </span>
                                  )}
                                </div>
                                
                                {/* Villain Quantity Controls */}
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center bg-doom-charcoal border border-doom-gray">
                                    <motion.button
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => {
                                        if (item.quantity > 1) {
                                          updateQuantity(item.product.id, item.quantity - 1, item.selectedVariants)
                                        }
                                      }}
                                      disabled={item.quantity <= 1}
                                      className="w-8 h-8 flex items-center justify-center text-doom-silver hover:text-doom-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                                    >
                                      <Minus size={14} />
                                    </motion.button>
                                    
                                    <span className="w-8 text-center text-doom-sm font-villain text-doom-gold">
                                      {item.quantity}
                                    </span>
                                    
                                    <motion.button
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariants)}
                                      className="w-8 h-8 flex items-center justify-center text-doom-silver hover:text-doom-gold transition-colors duration-300"
                                    >
                                      <Plus size={14} />
                                    </motion.button>
                                  </div>
                                  
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => removeItem(item.product.id, item.selectedVariants)}
                                    className="w-8 h-8 flex items-center justify-center text-doom-metal hover:text-doom-red hover:bg-doom-red/10 border border-doom-gray hover:border-doom-red transition-all duration-300"
                                    style={{
                                      clipPath: 'polygon(20% 0%, 80% 0%, 100% 40%, 100% 60%, 80% 100%, 20% 100%, 0% 60%, 0% 40%)'
                                    }}
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

              {/* Villain Footer */}
              {items.length > 0 && (
                <div className="border-t-2 border-doom-gold/30 bg-doom-charcoal p-6">
                  {/* Villain Subtotal */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-doom-silver font-villain text-doom-base tracking-wide">SUBTOTAL</span>
                      <span className="font-villain text-doom-xl text-doom-gold tracking-wide"
                            style={{
                              textShadow: '2px 2px 0px #000000'
                            }}>
                        {formatPrice(getTotalPrice())}
                      </span>
                    </div>
                    <p className="text-doom-sm text-doom-metal font-mono">
                      SHIPPING AND TAXES CALCULATED AT CHECKOUT
                    </p>
                  </div>
                  
                  {/* Villain Trust Signals */}
                  <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                    <div className="text-xs text-doom-silver font-mono">
                      <Lock size={14} className="mx-auto mb-1 text-doom-gold" />
                      SECURE
                    </div>
                    <div className="text-xs text-doom-silver font-mono">
                      <Package size={14} className="mx-auto mb-1 text-doom-gold" />
                      FREE $100+
                    </div>
                    <div className="text-xs text-doom-silver font-mono">
                      <Skull size={14} className="mx-auto mb-1 text-doom-gold" />
                      AUTHENTIC
                    </div>
                  </div>
                  
                  {/* Villain Action Buttons */}
                  <div className="space-y-4">
                    <Link href="/cart" onClick={() => setIsOpen(false)} className="block">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full text-center px-6 py-3 bg-doom-charcoal border-2 border-doom-silver text-doom-silver hover:border-doom-gold hover:text-doom-gold font-villain text-doom-sm tracking-wide transition-all duration-300"
                        style={{
                          clipPath: 'polygon(8% 0%, 92% 0%, 100% 20%, 100% 80%, 92% 100%, 8% 100%, 0% 80%, 0% 20%)'
                        }}
                      >
                        VIEW CART DETAILS
                      </motion.div>
                    </Link>
                    
                    <Link href="/checkout" onClick={() => setIsOpen(false)} className="block">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-villain-gold border-2 border-doom-bronze text-doom-black font-villain text-doom-base tracking-wide shadow-villain-lg hover:shadow-gold-glow transition-all duration-300"
                        style={{
                          clipPath: 'polygon(8% 0%, 92% 0%, 100% 20%, 100% 80%, 92% 100%, 8% 100%, 0% 80%, 0% 20%)'
                        }}
                      >
                        SECURE CHECKOUT
                        <ArrowRight size={20} />
                      </motion.div>
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