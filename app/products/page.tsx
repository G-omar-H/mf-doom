'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/products/ProductCard'
import { motion } from 'framer-motion'

const categories = [
  { value: 'all', label: 'All Products' },
  { value: 't_shirts', label: 'T-Shirts' },
  { value: 'hoodies', label: 'Hoodies' },
  { value: 'beanies', label: 'Beanies' },
  { value: 'sneakers', label: 'Sneakers' },
  { value: 'vinyl', label: 'Vinyl' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'art', label: 'Art' },
]

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category') || 'all'
  const [selectedCategory, setSelectedCategory] = useState(categoryParam)
  const [sortBy, setSortBy] = useState('name')
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const url = selectedCategory === 'all' 
          ? '/api/products' 
          : `/api/products?category=${selectedCategory}`
        
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        } else {
          console.error('Failed to fetch products')
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory])

  const filteredProducts = useMemo(() => {
    let filteredList = [...products]
    
    // Sort products
    filteredList.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        default:
          return 0
      }
    })
    
    return filteredList
  }, [products, sortBy])

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-black mb-4">
              ALL PRODUCTS
            </h1>
            <p className="text-lg text-mf-gray">
              Authentic MF DOOM merchandise curated by @thismfdoom_
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between bg-mf-light-gray p-4 rounded-lg">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === cat.value
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-mf-blue"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Results count */}
          <p className="text-mf-gray mb-6">
            {loading ? 'Loading...' : `Showing ${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'}`}
          </p>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-mf-gray text-xl mb-4">No products found in this category.</p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="btn-primary"
              >
                View All Products
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 