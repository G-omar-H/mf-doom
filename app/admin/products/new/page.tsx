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
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin/products"
              className="p-2 hover:bg-mf-light-gray rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-black">Add New Product</h1>
              <p className="text-mf-gray mt-1">Create a new product for your villain merchandise store</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin/products"
              className="btn-secondary flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </Link>
            <button
              onClick={handleSubmit}
              disabled={saving || uploadingImages}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Create Product</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-6">Basic Information</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors"
                    rows={4}
                    placeholder="Enter product description"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mf-gray w-5 h-5" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Compare At Price
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mf-gray w-5 h-5" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.compareAtPrice || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          compareAtPrice: e.target.value ? parseFloat(e.target.value) : null 
                        }))}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors"
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-6">Product Tags</h3>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors"
                    placeholder="Add a tag"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-mf-blue text-white rounded-lg hover:bg-mf-dark-blue transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center space-x-2 bg-mf-light-gray px-3 py-1 rounded-full text-sm"
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-6">Product Images *</h3>
              
              {/* Current Images Grid */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
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
                          <div className="opacity-0 group-hover:opacity-100 flex space-x-2 transition-opacity">
                            <button
                              type="button"
                              onClick={() => replaceImage(index)}
                              className="p-2 bg-mf-blue text-white rounded-full hover:bg-mf-dark-blue transition-colors"
                              title="Replace Image"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(image)}
                              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                              title="Delete Image"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Primary Image Badge */}
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-mf-blue text-white px-2 py-1 rounded text-xs font-semibold">
                            Primary
                          </div>
                        )}

                        {/* Image Number */}
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                          {index + 1}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                  dragOver 
                    ? 'border-mf-blue bg-mf-blue/5' 
                    : 'border-gray-300 hover:border-mf-blue hover:bg-mf-blue/5'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                {uploadingImages ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-12 h-12 text-mf-blue animate-spin mb-4" />
                    <p className="text-mf-blue font-medium">Uploading images...</p>
                    <p className="text-sm text-mf-gray">Please wait</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-mf-blue/10 rounded-full flex items-center justify-center mb-4">
                      <Upload className="w-8 h-8 text-mf-blue" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {formData.images.length === 0 ? 'Add Product Images' : 'Add More Images'}
                    </h4>
                    <p className="text-mf-gray mb-4">
                      Drag and drop images here, or click to browse
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-mf-gray">
                      <span className="flex items-center">
                        <FileImage className="w-4 h-4 mr-1" />
                        PNG, JPG, JPEG
                      </span>
                      <span>•</span>
                      <span>Max 10MB each</span>
                    </div>
                  </div>
                )}
              </div>

              {formData.images.length > 0 && (
                <div className="mt-4 text-sm text-mf-gray">
                  <p>💡 <strong>Tips:</strong></p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>First image will be used as the primary product image</li>
                    <li>Hover over images to replace or delete them</li>
                    <li>Add at least one image to create the product</li>
                    <li>Use high-quality images for better customer experience</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Visibility */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-6">Status & Visibility</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Product Status
                  </label>
                  <div className="space-y-2">
                    {['DRAFT', 'ACTIVE', 'ARCHIVED'].map(status => (
                      <label key={status} className="flex items-center">
                        <input
                          type="radio"
                          value={status}
                          checked={formData.status === status}
                          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                          className="mr-3"
                        />
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {status}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Featured Product</span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, featured: !prev.featured }))}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        formData.featured 
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {formData.featured ? (
                        <>
                          <Star className="w-4 h-4 fill-current" />
                          <span>Featured</span>
                        </>
                      ) : (
                        <>
                          <Star className="w-4 h-4" />
                          <span>Not Featured</span>
                        </>
                      )}
                    </button>
                  </label>
                  <p className="text-xs text-mf-gray mt-1">
                    Featured products appear prominently on the homepage
                  </p>
                </div>
              </div>
            </div>

            {/* Product Preview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-4">Product Preview</h3>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-mf-gray">Name</span>
                  <span className="font-semibold text-right">
                    {formData.name || 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mf-gray">Price</span>
                  <span className="font-semibold">
                    {formData.price > 0 ? `$${formData.price}` : 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mf-gray">Images</span>
                  <span className="font-semibold">{formData.images.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mf-gray">Category</span>
                  <span>{formData.category.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mf-gray">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    formData.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    formData.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {formData.status}
                  </span>
                </div>
                {formData.featured && (
                  <div className="flex justify-between">
                    <span className="text-mf-gray">Featured</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Yes
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-4">Completion Checklist</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    formData.name ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {formData.name && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <span className={formData.name ? 'text-green-600' : 'text-mf-gray'}>
                    Product name
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    formData.description ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {formData.description && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <span className={formData.description ? 'text-green-600' : 'text-mf-gray'}>
                    Product description
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    formData.price > 0 ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {formData.price > 0 && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <span className={formData.price > 0 ? 'text-green-600' : 'text-mf-gray'}>
                    Product price
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    formData.images.length > 0 ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {formData.images.length > 0 && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <span className={formData.images.length > 0 ? 'text-green-600' : 'text-mf-gray'}>
                    At least one image
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, featured: !prev.featured }))}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    formData.featured 
                      ? 'bg-gray-600 text-white hover:bg-gray-700' 
                      : 'bg-yellow-600 text-white hover:bg-yellow-700'
                  }`}
                >
                  <Star className="w-4 h-4" />
                  <span>{formData.featured ? 'Unfeature' : 'Feature'}</span>
                </button>

                <Link
                  href="/admin/products"
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <Package className="w-4 h-4" />
                  <span>Back to Products</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
} 