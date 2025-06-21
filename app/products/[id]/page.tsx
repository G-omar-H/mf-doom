'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingCart, Package, Skull, Shield, Zap, Star } from 'lucide-react'
import { formatPrice } from '@/lib/utils/formatters'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/lib/store/cartStore'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const params = useParams()
  const addItem = useCartStore((state) => state.addItem)
  
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [imageError, setImageError] = useState(false)

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
        } else {
          console.error('Failed to fetch product')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-villain-dark py-16">
        <div className="container mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-6 bg-doom-gray/50 w-32 mb-8" style={{
              clipPath: 'polygon(5% 0%, 95% 0%, 100% 20%, 100% 80%, 95% 100%, 5% 100%, 0% 80%, 0% 20%)'
            }}></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-doom-gray/30 aspect-square" style={{
                clipPath: 'polygon(5% 0%, 95% 0%, 100% 10%, 100% 90%, 95% 100%, 5% 100%, 0% 90%, 0% 10%)'
              }}></div>
              <div className="space-y-6">
                <div className="h-12 bg-doom-gray/50 w-full" style={{
                  clipPath: 'polygon(3% 0%, 97% 0%, 100% 15%, 100% 85%, 97% 100%, 3% 100%, 0% 85%, 0% 15%)'
                }}></div>
                <div className="h-6 bg-doom-gray/30 w-3/4"></div>
                <div className="h-8 bg-doom-gray/40 w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-villain-dark py-16">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-2xl mx-auto"
          >
            <Skull size={80} className="text-doom-gold mx-auto mb-6" />
            <h1 className="font-villain text-doom-2xl text-doom-gold mb-4 tracking-wide">
              PRODUCT NOT FOUND
            </h1>
            <p className="text-doom-silver font-mono mb-8">
              This item has vanished into the shadows...
            </p>
            <Link href="/products">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <div className="bg-villain-gold border-2 border-doom-bronze text-doom-black font-villain px-8 py-4 shadow-villain-lg hover:shadow-gold-glow transition-all duration-300 tracking-wide"
                     style={{
                       clipPath: 'polygon(10% 0%, 90% 0%, 100% 25%, 100% 75%, 90% 100%, 10% 100%, 0% 75%, 0% 25%)'
                     }}>
                  BACK TO PRODUCTS
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  const hasImages = product.images && product.images.length > 0

  const handleAddToCart = () => {
    // Check if all required variants are selected
    if (product.variants) {
      const missingVariants = product.variants.filter(
        (v: any) => !selectedVariants[v.type]
      )
      if (missingVariants.length > 0) {
        toast.error(`PLEASE SELECT ${missingVariants.map((v: any) => v.type.toUpperCase()).join(', ')}`, {
          style: {
            background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
            color: '#ffd700',
            fontSize: '14px',
            fontWeight: '700',
            border: '1px solid #ffd700',
            fontFamily: 'monospace',
          },
        })
        return
      }
    }

    addItem(product, quantity, selectedVariants)
    toast.success(`${quantity} × ${product.name.toUpperCase()} ADDED TO CART!`, {
      style: {
        background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
        color: '#ffd700',
        fontSize: '14px',
        fontWeight: '700',
        border: '1px solid #ffd700',
        fontFamily: 'monospace',
      },
      duration: 2000,
    })
  }

  return (
    <div className="min-h-screen bg-villain-dark py-8">
      <div className="container mx-auto px-6">
        {/* Villain Back Button */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-8"
        >
          <Link href="/products" className="inline-flex items-center text-doom-silver hover:text-doom-gold transition-colors duration-300 font-villain tracking-wide">
            <motion.div
              whileHover={{ x: -5 }}
              className="flex items-center gap-3 px-4 py-2 bg-doom-charcoal/50 border border-doom-gray hover:border-doom-gold/50 transition-all duration-300"
              style={{
                clipPath: 'polygon(8% 0%, 92% 0%, 100% 20%, 100% 80%, 92% 100%, 8% 100%, 0% 80%, 0% 20%)'
              }}
            >
              <ArrowLeft size={20} />
              <span>BACK TO PRODUCTS</span>
            </motion.div>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Villain Images Section */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-doom-charcoal/80 border-2 border-doom-gold/30 overflow-hidden shadow-villain-lg"
                 style={{
                   clipPath: 'polygon(5% 0%, 95% 0%, 100% 8%, 100% 92%, 95% 100%, 5% 100%, 0% 92%, 0% 8%)'
                 }}>
              <div className="relative h-96 md:h-[600px] bg-doom-gray/20">
                {hasImages && !imageError ? (
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-doom-charcoal/60">
                    <Package size={120} className="text-doom-gold/60 mb-6" />
                    <span className="text-doom-lg font-villain text-doom-silver text-center px-4 tracking-wide">
                      {product.name.toUpperCase()}
                    </span>
                  </div>
                )}
                
                {/* Overlay effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-doom-black/20 to-transparent" />
                <div className="absolute top-4 right-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-doom-gold/30"
                    style={{
                      clipPath: 'polygon(20% 0%, 80% 0%, 100% 40%, 100% 60%, 80% 100%, 20% 100%, 0% 60%, 0% 40%)'
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Villain Image Thumbnails */}
            {hasImages && product.images.length > 1 && (
              <div className="flex gap-4 mt-6">
                {product.images.map((image: string, index: number) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 bg-doom-charcoal border-2 overflow-hidden transition-all duration-300 ${
                      selectedImage === index 
                        ? 'border-doom-gold shadow-gold-glow' 
                        : 'border-doom-gray hover:border-doom-gold/50'
                    }`}
                    style={{
                      clipPath: 'polygon(15% 0%, 85% 0%, 100% 30%, 100% 70%, 85% 100%, 15% 100%, 0% 70%, 0% 30%)'
                    }}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Villain Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Product Title */}
            <div>
              <motion.h1 
                className="font-villain text-doom-2xl md:text-doom-3xl text-doom-gold mb-4 leading-tight tracking-wide"
                style={{
                  textShadow: '3px 3px 0px #000000, -1px -1px 0px #000000'
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {product.name.toUpperCase()}
              </motion.h1>
              <p className="text-doom-base text-doom-metal font-mono leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Villain Price */}
            <motion.div 
              className="bg-doom-charcoal/60 border-2 border-doom-gold/40 p-6 shadow-villain-md"
              style={{
                clipPath: 'polygon(8% 0%, 92% 0%, 100% 20%, 100% 80%, 92% 100%, 8% 100%, 0% 80%, 0% 20%)'
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="font-villain text-doom-xl text-doom-gold tracking-wide">
                {formatPrice(product.price)}
              </div>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <div className="text-doom-silver line-through font-mono">
                  {formatPrice(product.compareAtPrice)}
                </div>
              )}
            </motion.div>

            {/* Villain Variants */}
            {product.variants && product.variants.length > 0 && (
              <motion.div 
                className="space-y-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {product.variants.map((variant: any) => (
                  <div key={variant.type}>
                    <label className="block text-doom-silver mb-3 font-villain tracking-wider uppercase text-doom-sm">
                      {variant.type}
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {variant.options.map((option: string) => (
                        <motion.button
                          key={option}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedVariants({
                            ...selectedVariants,
                            [variant.type]: option
                          })}
                          className={`px-4 py-3 border-2 font-villain text-doom-sm tracking-wide transition-all duration-300 ${
                            selectedVariants[variant.type] === option
                              ? 'border-doom-gold bg-doom-gold text-doom-black shadow-gold-glow'
                              : 'border-doom-gray text-doom-silver bg-doom-charcoal hover:border-doom-gold/50 hover:text-doom-gold'
                          }`}
                          style={{
                            clipPath: 'polygon(10% 0%, 90% 0%, 100% 25%, 100% 75%, 90% 100%, 10% 100%, 0% 75%, 0% 25%)'
                          }}
                        >
                          {option.toUpperCase()}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Villain Quantity */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-doom-silver mb-3 font-villain tracking-wider uppercase text-doom-sm">
                QUANTITY
              </label>
              <div className="flex items-center gap-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 bg-doom-charcoal border-2 border-doom-gray text-doom-silver hover:border-doom-gold hover:text-doom-gold font-villain text-doom-lg transition-all duration-300"
                  style={{
                    clipPath: 'polygon(20% 0%, 80% 0%, 100% 40%, 100% 60%, 80% 100%, 20% 100%, 0% 60%, 0% 40%)'
                  }}
                >
                  -
                </motion.button>
                <span className="w-16 text-center font-villain text-doom-lg text-doom-gold tracking-wide">
                  {quantity}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 bg-doom-charcoal border-2 border-doom-gray text-doom-silver hover:border-doom-gold hover:text-doom-gold font-villain text-doom-lg transition-all duration-300"
                  style={{
                    clipPath: 'polygon(20% 0%, 80% 0%, 100% 40%, 100% 60%, 80% 100%, 20% 100%, 0% 60%, 0% 40%)'
                  }}
                >
                  +
                </motion.button>
              </div>
            </motion.div>

            {/* Villain Stock Status */}
            <motion.div 
              className="text-doom-sm font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 text-doom-gold">
                  <Star size={16} />
                  <span>IN STOCK ({product.stock} AVAILABLE)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-doom-red">
                  <Skull size={16} />
                  <span>OUT OF STOCK</span>
                </div>
              )}
            </motion.div>

            {/* Villain Add to Cart */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full flex items-center justify-center gap-4 px-8 py-6 font-villain text-doom-base tracking-wide shadow-villain-lg transition-all duration-300 ${
                  product.stock === 0
                    ? 'bg-doom-gray text-doom-metal border-2 border-doom-gray cursor-not-allowed'
                    : 'bg-villain-gold text-doom-black border-2 border-doom-bronze hover:shadow-gold-glow'
                }`}
                style={{
                  clipPath: 'polygon(8% 0%, 92% 0%, 100% 20%, 100% 80%, 92% 100%, 8% 100%, 0% 80%, 0% 20%)'
                }}
              >
                <ShoppingCart size={24} />
                {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
              </motion.button>
            </motion.div>

            {/* Villain Additional Info */}
            <motion.div 
              className="bg-doom-charcoal/40 border border-doom-gold/20 p-6 space-y-3 text-doom-sm font-mono"
              style={{
                clipPath: 'polygon(5% 0%, 95% 0%, 100% 15%, 100% 85%, 95% 100%, 5% 100%, 0% 85%, 0% 15%)'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-3">
                <Shield size={16} className="text-doom-gold" />
                <span className="text-doom-silver">
                  <span className="font-villain text-doom-gold">CATEGORY:</span> {product.category?.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Zap size={16} className="text-doom-gold" />
                <span className="text-doom-silver">
                  <span className="font-villain text-doom-gold">SKU:</span> {product.sku || `DOOM-${product.id.toUpperCase()}`}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 