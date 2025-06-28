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
    
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success(`Product ${newStatus.toLowerCase()}`)
        fetchProducts()
      } else {
        toast.error('Failed to update product')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const toggleProductFeatured = async (productId: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured }),
      })

      if (response.ok) {
        toast.success(`Product ${!currentFeatured ? 'featured' : 'unfeatured'}`)
        fetchProducts()
      } else {
        toast.error('Failed to update product')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Product deleted successfully')
        fetchProducts()
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products first')
      return
    }

    if (!confirm(`Are you sure you want to ${action} ${selectedProducts.length} products?`)) return

    try {
      const response = await fetch('/api/admin/products/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: selectedProducts, action }),
      })

      if (response.ok) {
        toast.success(`Bulk ${action} completed`)
        setSelectedProducts([])
        fetchProducts()
      } else {
        toast.error(`Failed to ${action} products`)
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-mf-blue border-t-transparent"></div>
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
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Product Image */}
            <div className="relative h-40 md:h-48">
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedProducts([...selectedProducts, product.id])
                  } else {
                    setSelectedProducts(selectedProducts.filter(id => id !== product.id))
                  }
                }}
                className="absolute top-2 md:top-3 left-2 md:left-3 z-10 w-4 h-4"
              />
              
              {product.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-mf-light-gray flex items-center justify-center">
                  <Package className="w-8 h-8 md:w-12 md:h-12 text-mf-gray" />
                </div>
              )}

              {/* Featured Badge */}
              {product.featured && (
                <div className="absolute top-2 md:top-3 right-2 md:right-3 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Featured</span>
                  <span className="sm:hidden">★</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-3 md:p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-xs md:text-sm line-clamp-2 flex-1">{product.name}</h3>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                  {product.status}
                </span>
              </div>

              <div className="flex items-center justify-between mb-2 md:mb-3">
                <span className="font-bold text-base md:text-lg">${product.price}</span>
                <span className="text-xs md:text-sm text-mf-gray">{product.category.replace('_', ' ')}</span>
              </div>

              <div className="flex items-center justify-between mb-3 md:mb-4">
                <span className="text-xs md:text-sm text-mf-gray">Stock: {product.stock}</span>
                <span className="text-xs text-mf-gray">
                  {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Action Buttons - Mobile Optimized */}
              <div className="flex items-center space-x-1 md:space-x-2">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="flex-1 bg-mf-blue text-white text-center py-2 rounded-lg hover:bg-mf-dark-blue transition-colors"
                  title="View Product"
                >
                  <Eye className="w-3 h-3 md:w-4 md:h-4 mx-auto" />
                </Link>
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="flex-1 bg-gray-600 text-white text-center py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  title="Edit Product"
                >
                  <Edit className="w-3 h-3 md:w-4 md:h-4 mx-auto" />
                </Link>
                <button
                  onClick={() => toggleProductFeatured(product.id, product.featured)}
                  className="flex-1 bg-yellow-600 text-white text-center py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                  title="Toggle Featured"
                >
                  <Star className="w-3 h-3 md:w-4 md:h-4 mx-auto" />
                </button>
                <button
                  onClick={() => toggleProductStatus(product.id, product.status)}
                  className="flex-1 bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition-colors"
                  title="Toggle Status"
                >
                  {product.status === 'ACTIVE' ? 
                    <ToggleRight className="w-3 h-3 md:w-4 md:h-4 mx-auto" /> : 
                    <ToggleLeft className="w-3 h-3 md:w-4 md:h-4 mx-auto" />
                  }
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="flex-1 bg-red-600 text-white text-center py-2 rounded-lg hover:bg-red-700 transition-colors"
                  title="Delete Product"
                >
                  <Trash2 className="w-3 h-3 md:w-4 md:h-4 mx-auto" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 md:w-16 md:h-16 text-mf-gray mx-auto mb-4" />
          <h3 className="text-lg md:text-xl font-semibold text-mf-gray mb-2">No products found</h3>
          <p className="text-sm md:text-base text-mf-gray mb-6">Try adjusting your search or filter criteria</p>
          <Link href="/admin/products/new" className="btn-primary text-sm md:text-base">
            Add Your First Product
          </Link>
        </div>
      )}
    </div>
  )
} 