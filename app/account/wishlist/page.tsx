'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Heart, 
  ShoppingCart, 
  X,
  Star,
  Package,
  Plus,
  Eye
} from 'lucide-react'
import { formatPrice } from '@/lib/utils/formatters'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cartStore'
import toast from 'react-hot-toast'

interface WishlistItem {
  id: string
  productId: string
  product: {
    id: string
    name: string
    price: number
    compareAtPrice?: number
    images: string[]
    slug: string
    category: string
    inStock: boolean
  }
  addedAt: string
}

export default function WishlistPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { addItem } = useCartStore()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/login')
      return
    }
    fetchWishlist()
  }, [session, status, router])

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/user/wishlist')
      if (response.ok) {
        const data = await response.json()
        setWishlistItems(data.items || [])
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (itemId: string) => {
    setRemovingItems(prev => new Set(prev).add(itemId))
    
    try {
      const response = await fetch(`/api/user/wishlist/${itemId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setWishlistItems(prev => prev.filter(item => item.id !== itemId))
        toast.success('Removed from wishlist')
      } else {
        toast.error('Failed to remove item')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const addToCartFromWishlist = (item: WishlistItem) => {
    addItem(
      {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        images: item.product.images,
        category: item.product.category as any
      } as any,
      1,
      {}
    )
    toast.success('Added to cart')
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          {/* Spinning DOOM Mask GIF */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4">
            <Image
              src="/icons/mfdoomcask.gif"
              alt="Loading..."
              width={64}
              height={64}
              className="w-full h-full"
              unoptimized
            />
          </div>
          <p className="text-gray-600 font-medium text-sm sm:text-base">Loading villain wishlist...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <Link 
            href="/account/profile"
            className="inline-flex items-center gap-2 text-mf-blue hover:text-mf-dark-blue transition-colors mb-4 sm:mb-6 touch-manipulation"
          >
            <ArrowLeft size={20} />
            <span className="text-sm sm:text-base">Back to Profile</span>
          </Link>
          
          <div className="flex items-center gap-3 sm:gap-4 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">VILLAIN WISHLIST</h1>
              <p className="text-gray-600 text-sm sm:text-base">Your coveted collection awaits</p>
            </div>
          </div>
        </motion.div>

        {wishlistItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center"
          >
            <Heart size={48} className="text-gray-300 mx-auto mb-4 sm:mb-6 sm:w-16 sm:h-16" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Save items you love for later</p>
            <Link href="/">
              <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors touch-manipulation">
                Start Exploring
              </button>
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
            >
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{wishlistItems.length}</p>
                    <p className="text-xs sm:text-sm text-gray-600">Saved Items</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {wishlistItems.filter(item => item.product.inStock).length}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">In Stock</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 sm:col-span-1 col-span-1">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {formatPrice(wishlistItems.reduce((sum, item) => sum + item.product.price, 0))}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">Total Value</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Wishlist Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <AnimatePresence>
                {wishlistItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <Link href={`/products/${item.product.slug}`}>
                        <Image
                          src={item.product.images[0] || '/placeholder.png'}
                          alt={item.product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </Link>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        disabled={removingItems.has(item.id)}
                        className="absolute top-3 right-3 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors touch-manipulation"
                      >
                        {removingItems.has(item.id) ? (
                          <div style={{ width: 16, height: 16 }}>
                            <Image
                              src="/icons/mfdoomcask.gif"
                              alt="Removing..."
                              width={16}
                              height={16}
                              className="w-full h-full"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <X size={16} />
                        )}
                      </button>

                      {/* Stock Badge */}
                      {!item.product.inStock && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          Out of Stock
                        </div>
                      )}

                      {/* Discount Badge */}
                      {item.product.compareAtPrice && item.product.compareAtPrice > item.product.price && (
                        <div className="absolute bottom-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {Math.round(((item.product.compareAtPrice - item.product.price) / item.product.compareAtPrice) * 100)}% OFF
                        </div>
                      )}

                      {/* Quick View Button - Desktop Only */}
                      <Link href={`/products/${item.product.slug}`} className="hidden sm:block">
                        <button className="absolute inset-0 w-full h-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                            <Eye size={20} className="text-gray-900" />
                          </div>
                        </button>
                      </Link>
                    </div>

                    {/* Product Info */}
                    <div className="p-4 sm:p-6">
                      <Link href={`/products/${item.product.slug}`}>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 hover:text-mf-blue transition-colors line-clamp-2">
                          {item.product.name}
                        </h3>
                      </Link>
                      
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 capitalize">{item.product.category}</p>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg sm:text-xl font-bold text-gray-900">
                          {formatPrice(item.product.price)}
                        </span>
                        {item.product.compareAtPrice && item.product.compareAtPrice > item.product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(item.product.compareAtPrice)}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="space-y-2 sm:space-y-3">
                        <button
                          onClick={() => addToCartFromWishlist(item)}
                          disabled={!item.product.inStock}
                          className="w-full flex items-center justify-center gap-2 bg-black text-white py-2.5 sm:py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                        >
                          <ShoppingCart size={16} />
                          <span className="text-sm font-medium">
                            {item.product.inStock ? 'Add to Cart' : 'Out of Stock'}
                          </span>
                        </button>

                        {/* Mobile View Product Button */}
                        <Link href={`/products/${item.product.slug}`} className="block sm:hidden">
                          <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors touch-manipulation">
                            <Eye size={16} />
                            <span className="text-sm font-medium">View Product</span>
                          </button>
                        </Link>
                      </div>

                      <p className="text-xs text-gray-500 mt-3">
                        Added {new Date(item.addedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* Bottom Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 sm:mt-12"
        >
          <p className="text-xs sm:text-sm text-gray-600 italic">
            "Just remember ALL CAPS when you spell the man name"
          </p>
        </motion.div>
      </div>
    </div>
  )
} 