'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus,
  Edit,
  Trash2,
  Tag,
  Search,
  Package,
  MoreHorizontal,
  Eye,
  ToggleLeft,
  ToggleRight,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useOptimisticUpdate } from '@/lib/hooks/useOptimisticUpdate'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  isActive: boolean
  productCount?: number
  createdAt: string
}

export default function AdminCategoriesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  })

  // Optimistic updates hook
  const { updateItem, deleteItem, addItem, loading: optimisticLoading } = useOptimisticUpdate(categories, setCategories)

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/auth/login')
      return
    }
    fetchCategories()
  }, [session, status, router])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingCategory) {
      // Update existing category
      await updateItem(
        editingCategory.id,
        (category) => ({ ...category, ...formData }),
        () => fetch(`/api/admin/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }),
        {
          successMessage: 'Category updated successfully',
          errorMessage: 'Failed to update category'
        }
      )
    } else {
      // Add new category
      await addItem(
        { 
          ...formData, 
          slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          productCount: 0, 
          createdAt: new Date().toISOString() 
        },
        async () => {
          const response = await fetch('/api/admin/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          })
          return response.json()
        },
        {
          successMessage: 'Category created successfully',
          errorMessage: 'Failed to create category'
        }
      )
    }

    setShowForm(false)
    setEditingCategory(null)
    setFormData({ name: '', description: '', isActive: true })
  }

  const toggleCategoryStatus = async (categoryId: string, currentStatus: boolean) => {
    await updateItem(
      categoryId,
      (category) => ({ ...category, isActive: !currentStatus }),
      () => fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      }),
      {
        successMessage: `Category ${!currentStatus ? 'activated' : 'deactivated'}`,
        errorMessage: 'Failed to update category'
      }
    )
  }

  const deleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This will affect all products in this category.')) return

    await deleteItem(
      categoryId,
      () => fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      }),
      {
        successMessage: 'Category deleted successfully',
        errorMessage: 'Failed to delete category'
      }
    )
  }

  const startEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      isActive: category.isActive
    })
    setShowForm(true)
  }

  const cancelEdit = () => {
    setEditingCategory(null)
    setFormData({ name: '', description: '', isActive: true })
    setShowForm(false)
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-mf-light-gray flex items-center justify-center">
        <LoadingSpinner size={64} text="Loading categories..." />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-black">CATEGORY MANAGEMENT</h1>
            <p className="text-mf-gray mt-1 text-sm md:text-base">Organize your villain merchandise catalog</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2 text-sm md:text-base w-full sm:w-auto justify-center sm:justify-start"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 mb-6">
        <div className="relative max-w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mf-gray w-5 h-5" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors text-sm md:text-base"
          />
        </div>
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 md:p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>
              <button
                onClick={cancelEdit}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-mf-blue bg-gray-100 border-gray-300 rounded focus:ring-mf-blue focus:ring-2"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active Category
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-mf-blue text-white py-2 px-4 rounded-lg hover:bg-mf-dark-blue transition-colors font-medium"
                >
                  {editingCategory ? 'Update' : 'Create'} Category
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredCategories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-md transition-shadow ${
              optimisticLoading[category.id] ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center ${
                  category.isActive ? 'bg-mf-blue' : 'bg-gray-400'
                }`}>
                  <Tag className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm md:text-base line-clamp-1">{category.name}</h3>
                  <p className="text-xs md:text-sm text-mf-gray truncate">/{category.slug}</p>
                </div>
              </div>
              
              <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                  category.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>

            <p className="text-xs md:text-sm text-mf-gray mb-4 line-clamp-2">
              {category.description || 'No description available'}
            </p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Package className="w-3 h-3 md:w-4 md:h-4 text-mf-gray" />
                <span className="text-xs md:text-sm text-mf-gray">
                  {category.productCount} products
                </span>
              </div>
              <span className="text-xs text-mf-gray">
                {new Date(category.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Mobile-Optimized Action Buttons */}
            <div className="space-y-2 md:space-y-0 md:flex md:items-center md:space-x-2">
              {/* Mobile: Stacked buttons, Desktop: Row */}
              <button
                onClick={() => startEdit(category)}
                disabled={optimisticLoading[category.id]}
                className="w-full md:flex-1 bg-gray-600 text-white text-center py-2 md:py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-1 text-sm"
              >
                <Edit className="w-3 h-3 md:w-4 md:h-4" />
                <span>Edit</span>
              </button>
              
              <div className="flex space-x-2 md:contents">
              <button
                onClick={() => toggleCategoryStatus(category.id, category.isActive)}
                disabled={optimisticLoading[category.id]}
                className={`flex-1 md:flex-1 text-white text-center py-2 rounded-lg transition-colors flex items-center justify-center space-x-1 text-sm ${
                  category.isActive 
                    ? 'bg-yellow-600 hover:bg-yellow-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {category.isActive ? (
                  <>
                      <ToggleLeft className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">Hide</span>
                      <span className="sm:hidden">Hide</span>
                  </>
                ) : (
                  <>
                      <ToggleRight className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">Show</span>
                      <span className="sm:hidden">Show</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => deleteCategory(category.id)}
                disabled={optimisticLoading[category.id]}
                className="flex-1 md:flex-1 bg-red-600 text-white text-center py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-1 text-sm"
              >
                  <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                <span>Delete</span>
              </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <Tag className="w-12 h-12 md:w-16 md:h-16 text-mf-gray mx-auto mb-4" />
          <h3 className="text-lg md:text-xl font-semibold text-mf-gray mb-2">No categories found</h3>
          <p className="text-sm md:text-base text-mf-gray mb-6">
            {searchTerm ? 'Try adjusting your search criteria' : 'Start by creating your first category'}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary text-sm md:text-base"
          >
            Add Category
          </button>
        </div>
      )}
    </div>
  )
} 