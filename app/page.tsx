'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ProductCard } from '@/components/products/ProductCard'
import { InstagramGrid } from '@/components/instagram/InstagramGrid'
import { Button, GradientButton } from '@/components/ui/Button'
import { ChevronDown, Sparkles, Disc, Shirt, Heart, ArrowRight, Play } from 'lucide-react'

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { scrollY } = useScroll()
  
  // Enhanced parallax effects
  const heroY = useTransform(scrollY, [0, 800], [0, 200])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const textY = useTransform(scrollY, [0, 600], [0, 150])
  const backgroundY = useTransform(scrollY, [0, 1000], [0, -100])

  useEffect(() => {
    setIsVisible(true)
    
    // Fetch featured products from API
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products?featured=true')
        if (response.ok) {
          const products = await response.json()
          if (products.length > 0) {
            setFeaturedProducts(products.slice(0, 4))
          } else {
            // Fallback products when database is empty
            setFeaturedProducts([
              {
                id: 'demo-1',
                name: 'Villain Mask Tee',
                price: 45,
                compareAtPrice: 55,
                images: ['https://picsum.photos/400/400?random=1'],
                category: 't_shirts',
                featured: true,
                stock: 10,
                description: 'Premium black tee featuring the iconic DOOM mask design'
              },
              {
                id: 'demo-2',
                name: 'Madvillainy Vinyl',
                price: 85,
                compareAtPrice: 95,
                images: ['https://picsum.photos/400/400?random=2'],
                category: 'vinyl',
                featured: true,
                stock: 5,
                description: 'Classic Madvillainy album on heavyweight vinyl'
              },
              {
                id: 'demo-3',
                name: 'DOOM Hoodie',
                price: 95,
                compareAtPrice: 110,
                images: ['https://picsum.photos/400/400?random=3'],
                category: 'hoodies',
                featured: true,
                stock: 8,
                description: 'Comfortable hoodie with embroidered DOOM branding'
              },
              {
                id: 'demo-4',
                name: 'Metal Face Pin',
                price: 25,
                images: ['https://picsum.photos/400/400?random=4'],
                category: 'accessories',
                featured: true,
                stock: 20,
                description: 'Enamel pin featuring the legendary Metal Face mask'
              }
            ])
          }
        } else {
          console.error('Failed to fetch products')
          // Set fallback products on API error too
          setFeaturedProducts([
            {
              id: 'demo-1',
              name: 'Villain Mask Tee',
              price: 45,
              compareAtPrice: 55,
              images: ['https://picsum.photos/400/400?random=1'],
              category: 't_shirts',
              featured: true,
              stock: 10,
              description: 'Premium black tee featuring the iconic DOOM mask design'
            },
            {
              id: 'demo-2',
              name: 'Madvillainy Vinyl',
              price: 85,
              compareAtPrice: 95,
              images: ['https://picsum.photos/400/400?random=2'],
              category: 'vinyl',
              featured: true,
              stock: 5,
              description: 'Classic Madvillainy album on heavyweight vinyl'
            },
            {
              id: 'demo-3',
              name: 'DOOM Hoodie',
              price: 95,
              compareAtPrice: 110,
              images: ['https://picsum.photos/400/400?random=3'],
              category: 'hoodies',
              featured: true,
              stock: 8,
              description: 'Comfortable hoodie with embroidered DOOM branding'
            },
            {
              id: 'demo-4',
              name: 'Metal Face Pin',
              price: 25,
              images: ['https://picsum.photos/400/400?random=4'],
              category: 'accessories',
              featured: true,
              stock: 20,
              description: 'Enamel pin featuring the legendary Metal Face mask'
            }
          ])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        // Set fallback products on error
        setFeaturedProducts([
          {
            id: 'demo-1',
            name: 'Villain Mask Tee',
            price: 45,
            compareAtPrice: 55,
            images: ['https://picsum.photos/400/400?random=1'],
            category: 't_shirts',
            featured: true,
            stock: 10,
            description: 'Premium black tee featuring the iconic DOOM mask design'
          },
          {
            id: 'demo-2',
            name: 'Madvillainy Vinyl',
            price: 85,
            compareAtPrice: 95,
            images: ['https://picsum.photos/400/400?random=2'],
            category: 'vinyl',
            featured: true,
            stock: 5,
            description: 'Classic Madvillainy album on heavyweight vinyl'
          },
          {
            id: 'demo-3',
            name: 'DOOM Hoodie',
            price: 95,
            compareAtPrice: 110,
            images: ['https://picsum.photos/400/400?random=3'],
            category: 'hoodies',
            featured: true,
            stock: 8,
            description: 'Comfortable hoodie with embroidered DOOM branding'
          },
          {
            id: 'demo-4',
            name: 'Metal Face Pin',
            price: 25,
            images: ['https://picsum.photos/400/400?random=4'],
            category: 'accessories',
            featured: true,
            stock: 20,
            description: 'Enamel pin featuring the legendary Metal Face mask'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  }

  return (
    <>
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Sophisticated Background */}
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0"
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50" />
          
          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}
              animate={{
                backgroundPosition: ['0px 0px', '40px 40px'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
          
          {/* Floating Elements */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-blue-600/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tl from-purple-300/10 to-pink-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </motion.div>

        <motion.div 
          style={{ y: textY, opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <motion.div 
            variants={itemVariants}
            className="relative mb-12"
          >
            {/* Enhanced Hero Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotateX: 15 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative bg-white/90 backdrop-blur-xl inline-block px-12 md:px-16 py-8 md:py-12 rounded-3xl shadow-2xl border border-gray-100/50"
            >
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-60" />
              
              <div className="relative z-10">
                <motion.h1 
                  className="doom-hero-title relative mb-4"
                  initial={{ backgroundPosition: "0% 50%" }}
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <motion.span 
                    className="block"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                  >
                    THIS IS
                  </motion.span>
                  <motion.span 
                    className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 1 }}
                  >
                    MF DOOM
                  </motion.span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl md:text-2xl font-medium text-gray-600 leading-relaxed"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Paying tribute to the villain
                </motion.p>
              </div>
              
              {/* Floating Decorative Elements */}
              <motion.div
                className="absolute -top-6 -right-6 text-blue-400"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <Sparkles size={40} />
              </motion.div>
              <motion.div
                className="absolute -bottom-6 -left-6 text-purple-500"
                animate={{ 
                  rotate: -360,
                  scale: [1.2, 1, 1.2]
                }}
                transition={{ 
                  rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                  scale: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }
                }}
              >
                <Disc size={36} />
              </motion.div>
            </motion.div>
          </motion.div>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-16 leading-relaxed"
          >
            A curated collection celebrating the masked legend's eternal influence on 
            <span className="font-semibold text-gray-800"> hip-hop culture</span> and 
            <span className="font-semibold text-gray-800"> artistic expression</span>.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <Button 
              size="lg" 
              rightIcon={<ArrowRight size={20} />}
              className="shadow-2xl hover:shadow-blue-500/25"
            >
              <Link href="/products">Explore Collection</Link>
            </Button>
            
            <Button 
              variant="secondary" 
              size="lg"
              leftIcon={<Play size={20} />}
            >
              <Link href="#story">Our Story</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Properly Centered Scroll Indicator */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8">
          <motion.div 
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 1 }}
          >
            <span className="text-sm font-medium tracking-wider uppercase text-gray-600 opacity-80">
              Scroll to explore
            </span>
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-gray-500"
            >
              <ChevronDown size={28} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Story Section */}
      <section id="story" className="relative bg-white py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
          </div>

        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Content */}
            <motion.div 
              className="space-y-10"
              initial={{ x: -80, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <motion.div
                  className="flex items-center gap-3 text-blue-600 font-semibold text-sm tracking-wider uppercase"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <Heart size={16} />
                  <span>Our Mission</span>
                </motion.div>
                
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Paying Tribute to 
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
                    the Villain
                  </span>
            </h2>
              </div>
              
              <div className="space-y-8 text-xl leading-relaxed text-gray-600">
                <p>
                  Born from our vibrant Instagram community{' '}
                  <a 
                    href="https://instagram.com/thismfdoom_" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-bold text-blue-600 hover:text-blue-700 transition-colors underline decoration-blue-300 hover:decoration-blue-500"
                  >
                    @thismfdoom_
                  </a>
                  , our shop represents more than merchandise — it's a sanctuary for preserving 
                  and celebrating the profound legacy of Daniel Dumile.
              </p>
              <p>
                  Every piece in our collection is meticulously curated to honor DOOM's 
                  artistic genius, from the iconic mask that became legend to the intricate 
                  wordplay that redefined hip-hop's creative boundaries.
                </p>
                <p className="font-semibold text-gray-800">
                  We believe in quality over quantity, authenticity over imitation, and 
                  community over commerce.
              </p>
            </div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-6 pt-6"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                viewport={{ once: true }}
              >
                <Button 
                  variant="gradient" 
                  size="lg"
                  rightIcon={<ArrowRight size={20} />}
                >
                  <Link href="/products">Browse Collection</Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  rightIcon={<Sparkles size={20} />}
                >
                  <a 
                    href="https://instagram.com/thismfdoom_" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Join Community
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            {/* Enhanced Instagram Panel */}
            <motion.div 
              className="relative"
              initial={{ x: 80, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="relative max-w-lg mx-auto">
                {/* Glowing Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl blur-2xl opacity-25 scale-105" />
                
                {/* Main Panel */}
                <div className="relative bg-white rounded-3xl p-10 shadow-2xl border border-gray-100">
                  <div className="text-center mb-8">
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 6, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className="inline-block mb-6"
                    >
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-3xl flex items-center justify-center text-white shadow-xl">
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                        </svg>
                      </div>
                    </motion.div>
                    
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">@thismfdoom_</h3>
                    <p className="text-lg text-gray-600 mb-8">Follow our journey on Instagram</p>
                  </div>
                  
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <InstagramGrid limit={4} className="w-full" />
                  </div>
                </div>
            </div>
          </motion.div>
        </motion.div>
        </div>
      </section>

      {/* Enhanced Featured Products */}
      <section className="py-32 px-6 bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden">
        {/* Sophisticated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-30 doom-bg-pattern" />
          <motion.div
            className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-l from-blue-200/20 to-transparent rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-24"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="flex items-center justify-center gap-3 text-blue-600 font-semibold text-sm tracking-wider uppercase mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Shirt size={18} />
              <span>Featured Collection</span>
            </motion.div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Curated with 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
                Intention
              </span>
            </h2>
            
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Each piece tells a story, each design captures a moment in hip-hop history. 
              Discover items that honor the artistry and mystique of the masked villain.
            </p>
          </motion.div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {[...Array(4)].map((_, index) => (
                <motion.div 
                  key={index}
                  className="doom-skeleton aspect-square rounded-2xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                />
              ))}
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -12 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div 
            className="text-center mt-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button 
              variant="secondary" 
              size="lg"
              rightIcon={<ArrowRight size={20} />}
            >
              <Link href="/products">View All Products</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Quote Section */}
      <section className="py-32 px-6 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
        {/* Artistic Background */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            animate={{ scale: [1.3, 1, 1.3], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>
        
        <motion.div 
          className="max-w-6xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
        >
          <motion.blockquote 
            className="doom-quote text-white mb-12 relative"
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            viewport={{ once: true }}
          >
            Just remember ALL CAPS when you spell the man name
          </motion.blockquote>
          
          <motion.cite 
            className="text-blue-300 text-2xl font-semibold"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            viewport={{ once: true }}
          >
            — MF DOOM
          </motion.cite>
          
          <motion.div 
            className="mt-16 flex flex-col sm:flex-row gap-8 justify-center"
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            viewport={{ once: true }}
          >
            <GradientButton
              size="lg"
              leftIcon={<Sparkles size={20} />}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
            <a 
              href="https://instagram.com/thismfdoom_" 
              target="_blank" 
              rel="noopener noreferrer"
              >
                Follow @thismfdoom_
              </a>
            </GradientButton>
            
            <Button 
              variant="secondary"
              size="lg"
              rightIcon={<ArrowRight size={20} />}
              className="bg-white text-black hover:bg-gray-100"
            >
              <Link href="/products">Shop Collection</Link>
            </Button>
        </motion.div>
        </motion.div>
      </section>
    </>
  );
} 