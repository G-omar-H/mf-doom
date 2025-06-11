'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingCart, Package } from 'lucide-react'
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
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-200 aspect-square rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-metal text-4xl text-doom-red mb-4">Product Not Found</h1>
        <Link href="/products">
          <Button>Back to Products</Button>
        </Link>
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
    <div className="container mx-auto px-4 py-8">
      <Link href="/products" className="inline-flex items-center text-mf-gray hover:text-mf-dark-blue mb-8">
        <ArrowLeft size={20} className="mr-2" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="relative h-96 md:h-[600px] bg-mf-light-gray">
              {hasImages && !imageError ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <Package size={96} className="text-gray-400 mb-4" />
                  <span className="text-lg text-gray-500 text-center px-4">{product.name}</span>
                </div>
              )}
            </div>
          </div>
          
          {hasImages && product.images.length > 1 && (
            <div className="flex gap-4 mt-4">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-mf-dark-blue' : ''
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div>
            <h1 className="font-bold text-4xl md:text-5xl text-black mb-4">
              {product.name}
            </h1>
            <p className="text-lg text-mf-gray">{product.description}</p>
          </div>

          <div className="font-bold text-3xl text-black">
            {formatPrice(product.price)}
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4">
              {product.variants.map((variant: any) => (
                <div key={variant.type}>
                  <label className="block text-mf-gray mb-2 font-semibold capitalize">
                    {variant.type}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((option: string) => (
                      <button
                        key={option}
                        onClick={() => setSelectedVariants({
                          ...selectedVariants,
                          [variant.type]: option
                        })}
                        className={`px-4 py-2 border rounded-lg transition-all ${
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

          {/* Quantity */}
          <div>
            <label className="block text-mf-gray mb-2 font-semibold">
              Quantity
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border rounded-lg text-mf-gray hover:border-mf-dark-blue hover:text-mf-dark-blue"
              >
                -
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border rounded-lg text-mf-gray hover:border-mf-dark-blue hover:text-mf-dark-blue"
              >
                +
              </button>
            </div>
          </div>

          {/* Stock Status */}
          <div className="text-sm">
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
            className="w-full flex items-center justify-center gap-3"
          >
            <ShoppingCart size={20} />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>

          {/* Additional Info */}
          <div className="border-t pt-6 space-y-2 text-sm">
            <p className="text-mf-gray">
              <span className="font-semibold">Category:</span> {product.category}
            </p>
            <p className="text-mf-gray">
              <span className="font-semibold">SKU:</span> {product.sku || `DOOM-${product.id.toUpperCase()}`}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 