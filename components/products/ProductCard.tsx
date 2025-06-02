'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils/formatters'
import { useCartStore } from '@/lib/store/cartStore'
import toast from 'react-hot-toast'
import { ShoppingBag, Package } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem)
  const [imageError, setImageError] = useState(false)
  const hasImage = product.images.length > 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    toast.success(`${product.name} added to cart`, {
      style: {
        background: '#000',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '500',
      },
      duration: 2000,
    })
  }

  return (
    <Link href={`/products/${product.id}`}>
      <motion.article
        whileHover={{ y: -4 }}
        className="group cursor-pointer product-card bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all"
      >
        <div className="relative aspect-square overflow-hidden bg-mf-light-gray">
          {!imageError && hasImage ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <Package size={48} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500 text-center px-4">{product.name}</span>
            </div>
          )}
          
          {product.featured && (
            <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs font-semibold">
              FEATURED
            </div>
          )}
          
          {/* Quick Add Button on Hover */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <button
              onClick={handleAddToCart}
              className="bg-white text-black px-6 py-3 font-semibold flex items-center gap-2 hover:bg-mf-light-gray transition-colors"
              disabled={product.stock === 0}
            >
              <ShoppingBag size={18} />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </motion.div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 group-hover:text-mf-dark-blue transition-colors">
            {product.name}
          </h3>
          
          <p className="text-sm text-mf-gray line-clamp-2 mb-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <p className="font-bold text-lg">
              {formatPrice(product.price)}
            </p>
            {product.stock < 10 && product.stock > 0 && (
              <span className="text-xs text-red-600 font-medium">
                Only {product.stock} left
              </span>
            )}
          </div>
        </div>
      </motion.article>
    </Link>
  )
} 