'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Edit,
  Trash2,
  Star,
  Package,
  DollarSign,
  Eye,
  TrendingUp,
  Calendar,
  Tag,
  BarChart3,
  Users,
  ArrowLeft,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Image from 'next/image'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface ProductDetail {
  id: string
  name: string
  description: string
  price: number
  compareAtPrice: number | null
  category: string
  status: string
  featured: boolean
  stock: number
  totalSold: number
  avgRating: number
  reviewCount: number
  images: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
  variants: Array<{
    id: string
    name: string
    type: string
    options: string[]
  }>
  reviews: Array<{
    id: string
    rating: number
    title: string
    content: string
    userName: string
    createdAt: string
  }>
  salesAnalytics: {
    totalRevenue: number
    totalOrders: number
    conversionRate: number
    viewCount: number
  }
}

export default function AdminProductDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/auth/login')
      return
    }
    if (params.id) {
      fetchProduct()
    }
  }, [session, status, router, params.id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data.product)
      } else {
        toast.error('Product not found')
        router.push('/admin/products')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to load product')
      router.push('/admin/products')
    } finally {
      setLoading(false)
    }
  }

  const toggleProductStatus = async () => {
    if (!product) return
    
    const newStatus = product.status === 'ACTIVE' ? 'DRAFT' : 'ACTIVE'
    
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success(`Product ${newStatus.toLowerCase()}`)
        fetchProduct()
      } else {
        toast.error('Failed to update product')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const toggleProductFeatured = async () => {
    if (!product) return
    
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !product.featured }),
      })

      if (response.ok) {
        toast.success(`Product ${!product.featured ? 'featured' : 'unfeatured'}`)
        fetchProduct()
      } else {
        toast.error('Failed to update product')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const deleteProduct = async () => {
    if (!product) return
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Product deleted successfully')
        router.push('/admin/products')
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800'
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (status === 'loading' || loading) {
    return (
      <LoadingSpinner size={64} text="Loading product..." />
    )
  }

  if (!product) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-mf-gray mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-mf-gray mb-2">Product Not Found</h3>
          <p className="text-mf-gray mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/admin/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3 md:space-x-4">
            <Link 
              href="/admin/products"
              className="p-2 hover:bg-mf-light-gray rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl md:text-3xl font-black">{product.name}</h1>
              <p className="text-mf-gray mt-1 text-sm md:text-base">Product Details & Analytics</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <Link 
              href={`/admin/products/${product.id}/edit`}
              className="btn-secondary flex items-center space-x-2 text-sm md:text-base"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Edit Product</span>
              <span className="sm:hidden">Edit</span>
            </Link>
            <button
              onClick={deleteProduct}
              className="bg-red-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 text-sm md:text-base"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
              <span className="sm:hidden">Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
        {/* Product Images */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Product Images</h3>
            {product.images.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 md:gap-4">
                {product.images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="aspect-square bg-mf-light-gray rounded-lg flex items-center justify-center">
                <Package className="w-12 h-12 md:w-16 md:h-16 text-mf-gray" />
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="flex items-start justify-between mb-4 md:mb-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                  <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                  {product.featured && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-mf-gray mb-3 md:mb-4 text-sm md:text-base">{product.description}</p>
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
              <div>
                <p className="text-xs md:text-sm text-mf-gray mb-1">Price</p>
                <p className="text-xl md:text-2xl font-bold">${product.price}</p>
                {product.compareAtPrice && (
                  <p className="text-xs md:text-sm text-mf-gray line-through">${product.compareAtPrice}</p>
                )}
              </div>
              <div>
                <p className="text-xs md:text-sm text-mf-gray mb-1">Category</p>
                <p className="font-semibold text-sm md:text-base">{product.category.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-mf-gray mb-1">Stock</p>
                <p className="font-semibold text-sm md:text-base">{product.stock} units</p>
              </div>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="mb-4 md:mb-6">
                <p className="text-xs md:text-sm text-mf-gray mb-2">Tags</p>
                <div className="flex flex-wrap gap-1 md:gap-2">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="bg-mf-light-gray px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 pt-4 md:pt-6 border-t border-gray-200">
              <button
                onClick={toggleProductStatus}
                className={`flex items-center justify-center space-x-2 px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                  product.status === 'ACTIVE' 
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {product.status === 'ACTIVE' ? (
                  <>
                    <ToggleLeft className="w-4 h-4" />
                    <span>Set to Draft</span>
                  </>
                ) : (
                  <>
                    <ToggleRight className="w-4 h-4" />
                    <span>Activate</span>
                  </>
                )}
              </button>
              
              <button
                onClick={toggleProductFeatured}
                className={`flex items-center justify-center space-x-2 px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                  product.featured 
                    ? 'bg-gray-600 text-white hover:bg-gray-700' 
                    : 'bg-yellow-600 text-white hover:bg-yellow-700'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>{product.featured ? 'Unfeature' : 'Feature'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics & Performance */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-3 md:p-6">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-mf-gray">Total Revenue</p>
              <p className="text-lg md:text-2xl font-bold">${product.salesAnalytics?.totalRevenue || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-3 md:p-6">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-mf-gray">Units Sold</p>
              <p className="text-lg md:text-2xl font-bold">{product.totalSold}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-3 md:p-6">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 md:w-6 md:h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-mf-gray">Views</p>
              <p className="text-lg md:text-2xl font-bold">{product.salesAnalytics?.viewCount || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-3 md:p-6">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 md:w-6 md:h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-mf-gray">Rating</p>
              <p className="text-lg md:text-2xl font-bold">{product.avgRating.toFixed(1)}</p>
              <p className="text-xs text-mf-gray">{product.reviewCount} reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Variants */}
      {product.variants.length > 0 && (
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6 md:mb-8">
          <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Product Variants</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {product.variants.map((variant) => (
              <div key={variant.id} className="border border-gray-200 rounded-lg p-3 md:p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm md:text-base">{variant.name}</h4>
                  <span className="text-xs md:text-sm bg-mf-light-gray px-2 py-1 rounded">{variant.type}</span>
                </div>
                <div className="flex flex-wrap gap-1 md:gap-2">
                  {variant.options.map((option, index) => (
                    <span key={index} className="text-xs md:text-sm bg-white border border-gray-300 px-2 py-1 rounded">
                      {option}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Recent Reviews</h3>
          <div className="space-y-3 md:space-y-4">
            {product.reviews.slice(0, 5).map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-3 md:pb-4 last:border-b-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm md:text-base">{review.userName}</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 md:w-4 md:h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs md:text-sm text-mf-gray">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {review.title && (
                  <h5 className="font-medium mb-1 text-sm md:text-base">{review.title}</h5>
                )}
                <p className="text-mf-gray text-xs md:text-sm">{review.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 