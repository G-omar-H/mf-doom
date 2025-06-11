'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ProductCard } from '@/components/products/ProductCard'

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsVisible(true)
    
    // Fetch featured products from API
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products?featured=true')
        if (response.ok) {
          const products = await response.json()
          setFeaturedProducts(products.slice(0, 4)) // Get first 4 featured products
        } else {
          console.error('Failed to fetch products')
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  return (
    <>
      {/* Spotify-style "This is" Hero */}
      <section className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
        <motion.div 
          className="text-center px-4 z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="bg-white inline-block px-6 md:px-8 py-4 md:py-6 mb-6 md:mb-8 mobile-rounded mobile-shadow-xl">
            <h1 className="spotify-header">
              <span className="block">THIS IS</span>
              <span className="block text-mf-blue">MF DOOM</span>
            </h1>
          </div>
          
          <p className="text-base md:text-lg text-mf-gray max-w-md mx-auto mb-6 md:mb-8">
            Paying tribute to the villain - collection curated by @thismfdoom_
          </p>

          <Link href="/products" className="btn-primary inline-block">
            Shop Collection
          </Link>

          {/* Scroll Indicator */}
          <motion.div 
            className="scroll-indicator"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-48 -right-48 w-96 h-96 bg-mf-blue/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-mf-blue/5 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Instagram Introduction Section */}
      <section className="min-h-screen bg-gradient-to-br from-mf-blue/20 to-mf-blue/10 py-20 px-4">
        <motion.div 
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Instagram Image */}
          <div className="order-2 md:order-1 max-w-sm mx-auto w-full">
            <div className="instagram-border rounded-2xl transform hover:scale-105 transition-transform duration-300">
              <div className="bg-white rounded-2xl p-6 md:p-8 text-center">
                <svg className="w-12 h-12 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                </svg>
                <h3 className="text-xl md:text-2xl font-bold mb-2">@thismfdoom_</h3>
                <p className="text-mf-gray text-sm md:text-base">Follow us on Instagram</p>
                {/* Instagram feed placeholder with gradient */}
                <div className="mt-4 md:mt-6 bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400 rounded-xl aspect-square flex items-center justify-center p-1">
                  <div className="bg-white rounded-xl w-full h-full flex items-center justify-center">
                    <span className="text-mf-gray font-medium text-sm md:text-base">Latest Posts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Introduction Text */}
          <motion.div 
            className="order-1 md:order-2 text-center md:text-left"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-black to-mf-dark-blue bg-clip-text text-transparent">
              Paying Tribute to the Villain
            </h2>
            <div className="space-y-4 text-base md:text-lg leading-relaxed">
              <p>
                Born from our Instagram community <strong className="text-mf-dark-blue">@thismfdoom_</strong>, this shop represents 
                our dedication to preserving and celebrating the legacy of Daniel Dumile, 
                known to the world as MF DOOM.
              </p>
              <p>
                Our mission is simple: to provide authentic, high-quality merchandise that 
                honors the masked villain&apos;s artistic genius while building a community of 
                fans who understand the cultural impact of his work.
              </p>
              <p>
                Every piece in our collection is carefully curated to reflect DOOM&apos;s 
                aesthetic - from the iconic mask to the intricate wordplay that defined 
                his legendary career.
              </p>
            </div>
            <div className="mt-8">
              <Link href="/products" className="btn-primary inline-block">
                Explore the Collection
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-mf-gray max-w-2xl mx-auto">
              Each item tells a story, each design captures a moment in hip-hop history.
            </p>
          </motion.div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products" className="btn-secondary inline-block">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-black to-gray-900 text-white">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Join the DOOM Community
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Follow <strong className="text-mf-blue">@thismfdoom_</strong> on Instagram for exclusive drops, 
            behind-the-scenes content, and to connect with fellow DOOM fans worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://instagram.com/thismfdoom_" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 font-semibold tracking-tight inline-flex items-center justify-center gap-2 hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
              </svg>
              Follow on Instagram
            </a>
            <Link href="/products" className="bg-white text-black px-6 py-3 font-semibold tracking-tight hover:bg-gray-100 transition-colors">
              Shop Now
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Quote Section */}
      <section className="py-20 px-4 bg-white">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <blockquote className="text-2xl md:text-3xl font-semibold mb-4">
            &quot;Just remember ALL CAPS when you spell the man name&quot;
          </blockquote>
          <cite className="text-mf-gray">— MF DOOM</cite>
        </motion.div>
      </section>
    </>
  );
} 