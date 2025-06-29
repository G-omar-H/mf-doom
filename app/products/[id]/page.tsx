'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { formatPrice } from '@/lib/utils/formatters'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/lib/store/cartStore'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ImageGallery from '@/components/ui/ImageGallery'
import SizeChart from '@/components/ui/SizeChart'

export default function ProductDetailPage() {
  const params = useParams()
  const addItem = useCartStore((state) => state.addItem)
  
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})

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
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <LoadingSpinner size={64} text="Loading product details..." />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-metal text-2xl sm:text-4xl text-doom-red mb-4 break-words">Product Not Found</h1>
        <Link href="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    )
  }

  // Determine size chart category based on product category or name
  const getSizeChartCategory = (product: any): 'clothing' | 'shoes' | 'accessories' | 'headwear' => {
    const category = product.category?.toLowerCase() || ''
    const name = product.name?.toLowerCase() || ''
    
    if (category.includes('shoe') || category.includes('sneaker') || name.includes('shoe') || name.includes('sneaker')) {
      return 'shoes'
    }
    if (category.includes('hat') || category.includes('cap') || category.includes('beanie') || name.includes('hat') || name.includes('cap') || name.includes('beanie')) {
      return 'headwear'
    }
    if (category.includes('clothing') || category.includes('shirt') || category.includes('hoodie') || category.includes('jacket') || category.includes('tee')) {
      return 'clothing'
    }
    return 'accessories'
  }

  const handleAddToCart = () => {
    // Check if all required variants are selected
    if (product.variants) {
      const missingVariants = product.variants.filter(
        (v: any) => !selectedVariants[v.type]
      )
      if (missingVariants.length > 0) {
        toast.error(`Please select ${missingVariants.map((v: any) => v.type).join(', ')}`)
        return
      }
    }

    addItem(product, quantity, selectedVariants)
    toast.success(`${quantity} × ${product.name} added to cart!`, {
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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <Link href="/products" className="inline-flex items-center text-mf-gray hover:text-mf-dark-blue mb-4 sm:mb-8 touch-manipulation">
          <ArrowLeft size={20} className="mr-2" />
          <span className="text-sm sm:text-base">Back to Products</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <ImageGallery
              images={product.images || []}
              productName={product.name}
              currentImage={selectedImage}
              onImageChange={setSelectedImage}
            />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 sm:space-y-6 w-full min-w-0"
          >
            <div className="w-full min-w-0">
              <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black mb-3 sm:mb-4 break-words hyphens-auto leading-tight">
                {product.name}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-mf-gray break-words">{product.description}</p>
            </div>

            <div className="font-bold text-xl sm:text-2xl lg:text-3xl text-black">
              {formatPrice(product.price)}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3 sm:space-y-4">
                {product.variants.map((variant: any) => (
                  <div key={variant.type} className="w-full min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-mf-gray font-semibold capitalize text-sm sm:text-base">
                        {variant.type}
                      </label>
                      {variant.type.toLowerCase().includes('size') && (
                        <SizeChart 
                          category={getSizeChartCategory(product)}
                          productName={product.name}
                        />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {variant.options.map((option: string) => (
                        <button
                          key={option}
                          onClick={() => setSelectedVariants({
                            ...selectedVariants,
                            [variant.type]: option
                          })}
                          className={`px-3 sm:px-4 py-2 border rounded-lg transition-all text-sm sm:text-base break-words max-w-full ${
                            selectedVariants[variant.type] === option
                              ? 'border-mf-dark-blue bg-mf-dark-blue text-white'
                              : 'border-gray-300 text-mf-gray hover:border-mf-dark-blue'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Size Guide for products without size variants but could benefit from sizing info */}
            {(!product.variants || !product.variants.some((v: any) => v.type.toLowerCase().includes('size'))) && 
             (getSizeChartCategory(product) === 'clothing' || getSizeChartCategory(product) === 'shoes' || getSizeChartCategory(product) === 'headwear') && (
              <div className="py-2">
                <SizeChart 
                  category={getSizeChartCategory(product)}
                  productName={product.name}
                />
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-mf-gray mb-2 font-semibold text-sm sm:text-base">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border rounded-lg text-mf-gray hover:border-mf-dark-blue hover:text-mf-dark-blue touch-manipulation"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold text-sm sm:text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border rounded-lg text-mf-gray hover:border-mf-dark-blue hover:text-mf-dark-blue touch-manipulation"
                >
                  +
                </button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="text-xs sm:text-sm">
              {product.stock > 0 ? (
                <span className="text-green-600">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>

            {/* Add to Cart */}
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full flex items-center justify-center gap-3 touch-manipulation"
            >
              <ShoppingCart size={20} />
              <span className="break-words">{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
            </Button>

            {/* Additional Info */}
            <div className="border-t pt-4 sm:pt-6 space-y-2 text-xs sm:text-sm">
              <p className="text-mf-gray break-words">
                <span className="font-semibold">Category:</span> {product.category}
              </p>
              <p className="text-mf-gray break-words">
                <span className="font-semibold">SKU:</span> {product.sku || `DOOM-${product.id.toUpperCase()}`}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 