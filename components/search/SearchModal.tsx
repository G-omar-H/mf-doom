'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight, Package, Clock, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils/formatters'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Popular searches - could be dynamic from analytics
  const popularSearches = [
    'MF DOOM mask',
    'Madvillainy vinyl',
    'Villain hoodie',
    'DOOM merchandise',
    'Hip hop apparel'
  ]

  // Debounced search function
  const debounceSearch = useCallback(
    (searchQuery: string) => {
      const timeoutId = setTimeout(() => {
        if (searchQuery.length > 0) {
          performSearch(searchQuery)
        } else {
          setResults([])
          setIsLoading(false)
        }
      }, 300)

      return () => clearTimeout(timeoutId)
    },
    []
  )

  // Perform search API call
  const performSearch = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const products = await response.json()
        setResults(products.slice(0, 8)) // Limit to 8 results
      } else {
        setResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setSelectedIndex(-1)
    
    if (value.length > 0) {
      setIsLoading(true)
      debounceSearch(value)
    } else {
      setResults([])
      setIsLoading(false)
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < results.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      const selectedProduct = results[selectedIndex]
      if (selectedProduct) {
        addToRecentSearches(query)
        onClose()
        // Navigate to product page
        window.location.href = `/products/${selectedProduct.id}`
      }
    }
  }

  // Add to recent searches
  const addToRecentSearches = (searchTerm: string) => {
    if (searchTerm.trim()) {
      setRecentSearches(prev => {
        const filtered = prev.filter(item => item !== searchTerm)
        return [searchTerm, ...filtered].slice(0, 5)
      })
    }
  }

  // Handle search submission
  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      addToRecentSearches(searchTerm)
      onClose()
      // Navigate to search results page
      window.location.href = `/products?search=${encodeURIComponent(searchTerm)}`
    }
  }

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Save recent searches to localStorage
  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches))
  }, [recentSearches])

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        })
      }
    }
  }, [selectedIndex])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="relative flex items-center">
              <Search size={20} className="absolute left-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="Search for products..."
                className="w-full pl-12 pr-12 py-4 text-lg bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                onClick={onClose}
                className="absolute right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            
            {/* Keyboard shortcut hint */}
            <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
              <span>Search our entire collection</span>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">ESC</kbd>
                <span>to close</span>
              </div>
            </div>
          </div>

          {/* Search Content */}
          <div className="max-h-96 overflow-y-auto">
            {/* Loading State */}
            {isLoading && (
              <div className="p-6 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  <Search size={24} className="text-gray-400" />
                </motion.div>
                <p className="text-gray-500 mt-2">Searching...</p>
              </div>
            )}

            {/* Search Results */}
            {!isLoading && results.length > 0 && (
              <div ref={resultsRef} className="p-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                  Products ({results.length})
                </h3>
                <div className="space-y-2">
                  {results.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer ${
                        selectedIndex === index ? 'bg-blue-50 ring-2 ring-blue-200' : ''
                      }`}
                      onClick={() => handleSearch(product.name)}
                    >
                      <Link href={`/products/${product.id}`} className="flex items-center gap-4">
                        <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {product.images.length > 0 ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={20} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-500 truncate">
                            {product.description}
                          </p>
                        </div>
                        
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-gray-900">
                            {formatPrice(product.price)}
                          </p>
                          {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <p className="text-xs text-gray-400 line-through">
                              {formatPrice(product.compareAtPrice)}
                            </p>
                          )}
                        </div>
                        
                        <ArrowRight size={16} className="text-gray-400 flex-shrink-0" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {!isLoading && query.length > 0 && results.length === 0 && (
              <div className="p-6 text-center">
                <Package size={48} className="text-gray-300 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">No products found</h3>
                <p className="text-gray-500 mb-4">
                  Try searching for something else or browse our categories
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  onClick={onClose}
                >
                  Browse all products
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}

            {/* Popular Searches & Recent Searches */}
            {!isLoading && query.length === 0 && (
              <div className="p-4 space-y-6">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
                      <Clock size={14} />
                      Recent
                    </h3>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(search)
                            handleSearch(search)
                          }}
                          className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-between group"
                        >
                          <span className="text-gray-700">{search}</span>
                          <ArrowRight size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
                    <TrendingUp size={14} />
                    Popular
                  </h3>
                  <div className="space-y-1">
                    {popularSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(search)
                          handleSearch(search)
                        }}
                        className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-between group"
                      >
                        <span className="text-gray-700">{search}</span>
                        <ArrowRight size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 