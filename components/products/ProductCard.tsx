'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils/formatters'
import { useCartStore } from '@/lib/store/cartStore'
import toast from 'react-hot-toast'
import { ShoppingBag, Package, Heart, Star, Sparkles } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem)
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const hasImage = product.images.length > 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsAdding(true)
    
    // Add a slight delay for better UX
    setTimeout(() => {
    addItem(product)
      setIsAdding(false)
      
      toast.success(
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-blue-400" />
          <span>{product.name} added to cart</span>
        </div>,
        {
      style: {
            background: 'linear-gradient(135deg, #000 0%, #1f2937 100%)',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '500',
            border: '1px solid #374151',
            borderRadius: '8px',
      },
          duration: 3000,
          icon: '🎭',
        }
      )
    }, 300)
  }

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <motion.article
        className="doom-product-card h-full flex flex-col"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ 
          y: -8,
          transition: { type: "spring", stiffness: 400, damping: 25 }
        }}
        whileTap={{ scale: 0.98 }}
        layout
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-lg">
          {!imageError && hasImage ? (
            <motion.div className="relative w-full h-full">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
              
              {/* Overlay gradient on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 relative">
              <motion.div
                animate={{ 
                  rotate: isHovered ? 360 : 0,
                  scale: isHovered ? 1.1 : 1
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <Package size={48} className="text-gray-400 mb-3" />
              </motion.div>
              <span className="text-sm text-gray-500 text-center px-4 font-medium">
                {product.name}
              </span>
            </div>
          )}
          
          {/* Product Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <AnimatePresence>
          {product.featured && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg flex items-center gap-1"
                >
                  <Star size={12} fill="currentColor" />
              FEATURED
                </motion.div>
              )}
              
              {product.stock < 10 && product.stock > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg"
                >
                  {product.stock} LEFT
                </motion.div>
              )}
              
              {product.stock === 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg"
                >
                  SOLD OUT
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          
          {/* Wishlist Button */}
          <motion.button
            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0
            }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              // Add wishlist functionality here
            }}
          >
            <Heart size={16} className="text-gray-600 hover:text-red-500 transition-colors" />
          </motion.button>
          
          {/* Quick Add Overlay */}
          <AnimatePresence>
            {isHovered && product.stock > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute inset-x-4 bottom-4"
          >
                <motion.button
              onClick={handleAddToCart}
                  disabled={isAdding}
                  className="w-full bg-black/90 backdrop-blur-sm text-white py-3 px-4 font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-black transition-all duration-300 disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AnimatePresence mode="wait">
                    {isAdding ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, rotate: -180 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 180 }}
                        className="flex items-center gap-2"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles size={18} />
                        </motion.div>
                        Adding...
                      </motion.div>
                    ) : (
                      <motion.div
                        key="default"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-2"
            >
              <ShoppingBag size={18} />
                        Quick Add
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
          </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Product Info */}
        <div className="flex-1 p-6 bg-white rounded-b-lg">
          <div className="space-y-3">
            {/* Product Name */}
            <motion.h3 
              className="font-bold text-lg leading-tight text-gray-900 group-hover:text-blue-600 transition-colors duration-300"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
            {product.name}
            </motion.h3>
          
            {/* Product Description */}
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
          
            {/* Price and Stock Info */}
            <div className="flex items-center justify-between pt-2">
              <motion.div
                className="space-y-1"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <p className="font-bold text-xl text-gray-900">
              {formatPrice(product.price)}
            </p>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <p className="text-sm text-gray-500 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </p>
                )}
              </motion.div>
              
              {/* Stock Indicator */}
              <div className="text-right">
                {product.stock === 0 ? (
                  <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                    Out of Stock
                  </span>
                ) : product.stock < 10 ? (
                  <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                Only {product.stock} left
              </span>
                ) : (
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    In Stock
                  </span>
            )}
              </div>
            </div>
          </div>
        </div>

        {/* Hover Effects Border */}
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-transparent pointer-events-none"
          animate={{
            borderColor: isHovered ? 'rgb(59, 130, 246)' : 'transparent',
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Subtle Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          animate={{
            boxShadow: isHovered 
              ? '0 20px 60px rgba(59, 130, 246, 0.15)' 
              : '0 4px 20px rgba(0, 0, 0, 0.05)',
          }}
          transition={{ duration: 0.4 }}
        />
      </motion.article>
    </Link>
  )
} 