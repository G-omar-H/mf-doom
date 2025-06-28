'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Save,
  X,
  Upload,
  Trash2,
  Plus,
  Package,
  DollarSign,
  Tag,
  Image as ImageIcon,
  Star,
  RotateCcw,
  FileImage,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface ProductForm {
  name: string
  description: string
  price: number
  compareAtPrice: number | null
  category: string
  status: string
  featured: boolean
  tags: string[]
  images: string[]
}

const categories = [
  'T_SHIRTS',
  'HOODIES', 
  'BEANIES',
  'SNEAKERS',
  'VINYL',
  'ACCESSORIES',
  'ART'
]

export default function AdminNewProductPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [uploadingImages, setUploadingImages] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    compareAtPrice: null,
    category: 'T_SHIRTS',
    status: 'DRAFT',
    featured: false,
    tags: [],
    images: []
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/auth/login')
      return
    }
  }, [session, status, router])

  const uploadImages = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return

    setUploadingImages(true)
    const formData = new FormData()
    
    // Convert FileList to Array if needed
    const fileArray = Array.from(files)
    fileArray.forEach(file => {
      if (file.type.startsWith('image/')) {
        formData.append('images', file)
      }
    })

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...data.urls]
        }))
        toast.success(`${data.urls.length} image(s) uploaded successfully!`)
      } else {
        toast.error('Failed to upload images')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Error uploading images')
    } finally {
      setUploadingImages(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      uploadImages(files)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = e.dataTransfer.files
    if (files) {
      uploadImages(files)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description || formData.price <= 0) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.images.length === 0) {
      toast.error('Please add at least one product image')
      return
    }

    setSaving(true)

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Product created successfully!')
        router.push(`/admin/products/${data.product.id}`)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to create product')
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const removeImage = (imageToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageToRemove)
    }))
    
    // Also delete the image file from filesystem
    fetch('/api/admin/delete-image', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagePath: imageToRemove }),
    }).catch(error => {
      console.error('Error deleting image file:', error)
    })
    
    toast.success('Image removed from product')
  }

  const replaceImage = async (indexToReplace: number) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setUploadingImages(true)
        const formData = new FormData()
        formData.append('images', file)

        try {
          const response = await fetch('/api/admin/upload', {
            method: 'POST',
            body: formData,
          })

          if (response.ok) {
            const data = await response.json()
            setFormData(prev => {
              const newImages = [...prev.images]
              newImages[indexToReplace] = data.urls[0]
              return { ...prev, images: newImages }
            })
            toast.success('Image replaced successfully!')
          } else {
            toast.error('Failed to upload replacement image')
          }
        } catch (error) {
          console.error('Replace error:', error)
          toast.error('Error replacing image')
        } finally {
          setUploadingImages(false)
        }
      }
    }
    input.click()
  }

  if (status === 'loading') {
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
          <div className="flex items-center space-x-3 md:space-x-4">
            <Link 
              href="/admin/products"
              className="p-2 hover:bg-mf-light-gray rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl md:text-3xl font-black">Add New Product</h1>
              <p className="text-mf-gray mt-1 text-sm md:text-base">Create a new product for your villain merchandise store</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <Link 
              href="/admin/products"
              className="btn-secondary flex items-center space-x-2 text-sm md:text-base"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Cancel</span>
              <span className="sm:hidden">Cancel</span>
            </Link>
            <button
              onClick={handleSubmit}
              disabled={saving || uploadingImages}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 text-sm md:text-base"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Creating...</span>
                  <span className="sm:hidden">Creating</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Product</span>
                  <span className="sm:hidden">Create</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Basic Information</h3>
              
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors text-sm md:text-base"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors text-sm md:text-base"
                    rows={4}
                    placeholder="Enter product description"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mf-gray w-4 h-4 md:w-5 md:h-5" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors text-sm md:text-base"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      Compare At Price
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mf-gray w-4 h-4 md:w-5 md:h-5" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.compareAtPrice || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          compareAtPrice: e.target.value ? parseFloat(e.target.value) : null 
                        }))}
                        className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors text-sm md:text-base"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors text-sm md:text-base"
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Product Tags</h3>
              
              <div className="space-y-3 md:space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-3 md:px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors text-sm md:text-base"
                    placeholder="Add a tag"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 md:px-4 py-2 bg-mf-blue text-white rounded-lg hover:bg-mf-dark-blue transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center space-x-1 md:space-x-2 bg-mf-light-gray px-2 md:px-3 py-1 rounded-full text-xs md:text-sm"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-mf-gray hover:text-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Images */}
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Product Images *</h3>
              
              {/* Current Images Grid */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
                  {formData.images.map((image, index) => (
                    <motion.div 
                      key={index} 
                      className="relative group"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-mf-light-gray border-2 border-gray-200">
                        <Image
                          src={image}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        
                        {/* Image Controls Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 flex space-x-1 md:space-x-2 transition-opacity">
                            <button
                              type="button"
                              onClick={() => replaceImage(index)}
                              className="p-1 md:p-2 bg-mf-blue text-white rounded-full hover:bg-mf-dark-blue transition-colors"
                              title="Replace Image"
                            >
                              <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(image)}
                              className="p-1 md:p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                              title="Delete Image"
                            >
                              <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                          </div>
                        </div>

                        {/* First Image Badge */}
                        {index === 0 && (
                          <div className="absolute top-1 md:top-2 left-1 md:left-2 bg-mf-blue text-white px-1 md:px-2 py-0.5 md:py-1 rounded text-xs font-medium">
                            Main
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-4 md:p-8 text-center transition-colors ${
                  dragOver 
                    ? 'border-mf-blue bg-mf-blue/10'
                    : uploadingImages
                    ? 'border-gray-300 bg-gray-50'
                    : 'border-gray-300 hover:border-mf-blue hover:bg-mf-blue/5'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {uploadingImages ? (
                  <div className="flex flex-col items-center space-y-2">
                    <Loader2 className="w-8 h-8 md:w-12 md:h-12 text-mf-blue animate-spin" />
                    <p className="text-mf-gray text-sm md:text-base">Uploading images...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2 md:space-y-4">
                    <ImageIcon className="w-8 h-8 md:w-12 md:h-12 text-mf-gray" />
                    <div>
                      <p className="text-mf-gray text-sm md:text-base mb-1 md:mb-2">
                        Drag and drop images here, or 
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-mf-blue hover:underline ml-1"
                        >
                          browse
                        </button>
                      </p>
                      <p className="text-xs text-mf-gray">PNG, JPG, GIF up to 10MB each</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Status & Visibility */}
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold mb-4">Status & Visibility</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors text-sm md:text-base"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="ACTIVE">Active</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 text-mf-blue bg-gray-100 border-gray-300 rounded focus:ring-mf-blue focus:ring-2"
                  />
                  <label htmlFor="featured" className="text-xs md:text-sm font-medium text-gray-700">
                    Featured Product
                  </label>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold mb-4">Product Details</h3>
              
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center space-x-3">
                  <Package className="w-4 h-4 md:w-5 md:h-5 text-mf-gray" />
                  <div>
                    <p className="text-xs md:text-sm text-mf-gray">Category</p>
                    <p className="font-medium text-sm md:text-base">{formData.category.replace('_', ' ')}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-mf-gray" />
                  <div>
                    <p className="text-xs md:text-sm text-mf-gray">Price</p>
                    <p className="font-medium text-sm md:text-base">${formData.price.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <ImageIcon className="w-4 h-4 md:w-5 md:h-5 text-mf-gray" />
                  <div>
                    <p className="text-xs md:text-sm text-mf-gray">Images</p>
                    <p className="font-medium text-sm md:text-base">{formData.images.length} uploaded</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Tag className="w-4 h-4 md:w-5 md:h-5 text-mf-gray" />
                  <div>
                    <p className="text-xs md:text-sm text-mf-gray">Tags</p>
                    <p className="font-medium text-sm md:text-base">{formData.tags.length} added</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Actions - Mobile */}
            <div className="lg:hidden bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={saving || uploadingImages}
                  className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 text-sm w-full"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Product...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Create Product</span>
                    </>
                  )}
                </button>
                <Link
                  href="/admin/products"
                  className="btn-secondary flex items-center justify-center space-x-2 text-sm w-full"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
} 