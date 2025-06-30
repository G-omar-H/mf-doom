'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Package,
  DollarSign,
  Star,
  MoreHorizontal,
  Upload,
  Download,
  Tag,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Image from 'next/image'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useOptimisticUpdate } from '@/lib/hooks/useOptimisticUpdate'

interface Product {
  id: string
  name: string
  price: number
  category: string
  status: string
  featured: boolean
  stock: number
  images: string[]
  createdAt: string
}

export default function AdminProductsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  // Optimistic updates hook
  const { updateItem, deleteItem, bulkUpdate, loading: optimisticLoading } = useOptimisticUpdate(products, setProducts)

  const categories = [
    'ALL', 'T_SHIRTS', 'HOODIES', 'BEANIES', 'SNEAKERS', 'VINYL', 'ACCESSORIES', 'ART'
  ]

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/auth/login')
      return
    }
    fetchProducts()
  }, [session, status, router])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const toggleProductStatus = async (productId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'DRAFT' : 'ACTIVE'
    
    await updateItem(
      productId,
      (product) => ({ ...product, status: newStatus }),
      () => fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      }),
      {
        successMessage: `Product ${newStatus.toLowerCase()}`,
        errorMessage: 'Failed to update product status'
      }
    )
  }

  const toggleProductFeatured = async (productId: string, currentFeatured: boolean) => {
    await updateItem(
      productId,
      (product) => ({ ...product, featured: !currentFeatured }),
      () => fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured }),
      }),
      {
        successMessage: `Product ${!currentFeatured ? 'featured' : 'unfeatured'}`,
        errorMessage: 'Failed to update product'
      }
    )
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    await deleteItem(
      productId,
      () => fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      }),
      {
        successMessage: 'Product deleted successfully',
        errorMessage: 'Failed to delete product'
      }
    )
  }

  const handleBulkAction = async (action: string) => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products first')
      return
    }

    if (!confirm(`Are you sure you want to ${action} ${selectedProducts.length} products?`)) return

    let updateFn: (product: Product) => Product
    let successMessage: string

    switch (action) {
      case 'activate':
        updateFn = (product) => ({ ...product, status: 'ACTIVE' })
        successMessage = `${selectedProducts.length} products activated`
        break
      case 'deactivate':
        updateFn = (product) => ({ ...product, status: 'DRAFT' })
        successMessage = `${selectedProducts.length} products set to draft`
        break
      case 'delete':
        // For bulk delete, we need to remove items from array
        setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id)))
        toast.success(`${selectedProducts.length} products deleted`)
        
        try {
          const response = await fetch('/api/admin/products/bulk', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productIds: selectedProducts, action }),
          })

          if (!response.ok) {
            // Revert on error
            fetchProducts()
            toast.error('Failed to delete some products')
          }
        } catch (error) {
          fetchProducts()
          toast.error('Bulk delete failed')
        }
        
        setSelectedProducts([])
        return
      default:
        return
    }

    await bulkUpdate(
      selectedProducts,
      updateFn,
      () => fetch('/api/admin/products/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: selectedProducts, action }),
      }),
      {
        successMessage,
        errorMessage: `Failed to ${action} products`
      }
    )

    setSelectedProducts([])
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'ALL' || product.category === categoryFilter
    const matchesStatus = statusFilter === 'ALL' || product.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800'
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-mf-light-gray flex items-center justify-center">
        <LoadingSpinner size={64} text="Loading products..." />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-black">PRODUCT MANAGEMENT</h1>
            <p className="text-mf-gray mt-1 text-sm md:text-base">Manage your villain merchandise inventory</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <button className="btn-secondary flex items-center space-x-2 text-sm md:text-base">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Import</span>
              <span className="sm:hidden">Import</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2 text-sm md:text-base">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">Export</span>
            </button>
            <Link href="/admin/products/new" className="btn-primary flex items-center space-x-2 text-sm md:text-base">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 mb-4">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mf-gray w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors text-sm md:text-base"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors text-sm md:text-base"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors text-sm md:text-base"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <div className="flex items-center justify-center bg-mf-light-gray rounded-lg px-3 md:px-4 py-2 md:py-3">
            <span className="font-semibold text-sm md:text-base">{filteredProducts.length} Products</span>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 md:p-4 bg-mf-blue/10 rounded-lg">
            <span className="text-sm font-medium">{selectedProducts.length} selected</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="text-xs md:text-sm bg-green-600 text-white px-2 md:px-3 py-1 rounded hover:bg-green-700"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="text-xs md:text-sm bg-yellow-600 text-white px-2 md:px-3 py-1 rounded hover:bg-yellow-700"
              >
                Draft
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="text-xs md:text-sm bg-red-600 text-white px-2 md:px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow ${
              optimisticLoading[product.id] ? 'opacity-75' : ''
            }`}
          >
            <div className="relative">
              {/* Product Selection Checkbox */}
              <div className="absolute top-2 left-2 z-20">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedProducts(prev => [...prev, product.id])
                    } else {
                      setSelectedProducts(prev => prev.filter(id => id !== product.id))
                    }
                  }}
                  className="w-4 h-4 text-mf-blue bg-white border-2 border-gray-300 rounded focus:ring-mf-blue focus:ring-2"
                />
              </div>

              {/* Product Image */}
              <div className="aspect-square bg-mf-light-gray relative">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-mf-gray" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                </div>

                {/* Featured Badge */}
                {product.featured && (
                  <div className="absolute bottom-2 left-2">
                    <div className="bg-yellow-500 text-white px-2 py-1 rounded-full flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs font-medium">Featured</span>
                    </div>
                  </div>
                )}

                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      disabled={optimisticLoading[product.id]}
                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-3 md:p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sm md:text-base line-clamp-2 flex-1">{product.name}</h3>
                <button
                  onClick={() => toggleProductFeatured(product.id, product.featured)}
                  disabled={optimisticLoading[product.id]}
                  className="ml-2 text-gray-400 hover:text-yellow-500 transition-colors disabled:opacity-50"
                >
                  <Star className={`w-4 h-4 ${product.featured ? 'text-yellow-500 fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-base md:text-lg">${product.price}</span>
                <span className="text-xs text-mf-gray">{product.category.replace('_', ' ')}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-mf-gray">Stock: {product.stock}</span>
                <button
                  onClick={() => toggleProductStatus(product.id, product.status)}
                  disabled={optimisticLoading[product.id]}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-50 ${
                    product.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {product.status === 'ACTIVE' ? (
                    <ToggleRight className="w-3 h-3" />
                  ) : (
                    <ToggleLeft className="w-3 h-3" />
                  )}
                  <span>{product.status === 'ACTIVE' ? 'Active' : 'Draft'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-mf-gray mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-mf-gray mb-2">No products found</h3>
          <p className="text-mf-gray">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
} 