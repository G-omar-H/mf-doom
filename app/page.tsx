'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ProductCard } from '@/components/products/ProductCard'
import { InstagramGrid } from '@/components/instagram/InstagramGrid'
import { Button, GradientButton } from '@/components/ui/Button'
import { ChevronDown, Sparkles, Disc, Shirt, Heart, ArrowRight, Play, Skull, Zap, Shield } from 'lucide-react'

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { scrollY } = useScroll()
  
  // Dark villain parallax effects
  const heroY = useTransform(scrollY, [0, 800], [0, 100])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3])
  const textY = useTransform(scrollY, [0, 600], [0, 80])
  const backgroundY = useTransform(scrollY, [0, 1000], [0, -50])

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
            // Fallback villain products when database is empty
            setFeaturedProducts([
              {
                id: 'demo-1',
                name: 'VILLAIN MASK TEE',
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
                name: 'MADVILLAINY VINYL',
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
                name: 'DOOM HOODIE',
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
                name: 'METAL FACE PIN',
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
              name: 'VILLAIN MASK TEE',
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
              name: 'MADVILLAINY VINYL',
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
              name: 'DOOM HOODIE',
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
              name: 'METAL FACE PIN',
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
            name: 'VILLAIN MASK TEE',
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
            name: 'MADVILLAINY VINYL',
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
            name: 'DOOM HOODIE',
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
            name: 'METAL FACE PIN',
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
      {/* Dark Villain Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-villain-dark">
        {/* Gritty Dark Background */}
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0"
        >
          {/* Dark gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-doom-black via-doom-dark to-doom-charcoal" />
          
          {/* Grunge texture overlay */}
          <div className="absolute inset-0 bg-grunge-texture opacity-60" />
          
          {/* Sharp grid pattern */}
          <div className="absolute inset-0 opacity-[0.08]">
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255, 215, 0, 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 215, 0, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px'
              }}
              animate={{
                backgroundPosition: ['0px 0px', '60px 60px'],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
          
          {/* Dramatic floating elements */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-doom-gold/20 to-doom-bronze/30 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              clipPath: 'polygon(20% 0%, 80% 0%, 100% 30%, 100% 70%, 80% 100%, 20% 100%, 0% 70%, 0% 30%)'
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-doom-red/20 to-doom-blood/30 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
            style={{
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 40%, 100% 60%, 70% 100%, 30% 100%, 0% 60%, 0% 40%)'
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
            className="relative mb-16"
          >
            {/* Bold Villain Hero Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotateX: 15 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative bg-doom-charcoal/90 backdrop-blur-xl inline-block px-16 md:px-20 py-12 md:py-16 border-4 border-doom-gold shadow-villain-2xl"
              style={{
                clipPath: 'polygon(8% 0%, 92% 0%, 100% 15%, 100% 85%, 92% 100%, 8% 100%, 0% 85%, 0% 15%)',
                background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(42, 42, 42, 0.9))'
              }}
            >
              {/* Gold border glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-doom-gold/30 via-doom-bronze/20 to-doom-gold/30 blur-xl opacity-80" />
              
              <div className="relative z-10">
                <motion.h1 
                  className="relative mb-6"
                  initial={{ backgroundPosition: "0% 50%" }}
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <motion.span 
                    className="block font-villain text-doom-xl md:text-doom-3xl text-doom-silver tracking-[0.1em] leading-none"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    style={{
                      textShadow: '4px 4px 0px #000000, -2px -2px 0px #000000, 2px -2px 0px #000000, -2px 2px 0px #000000'
                    }}
                  >
                    THIS IS
                  </motion.span>
                  <motion.span 
                    className="block font-villain text-doom-hero md:text-doom-hero text-doom-gold tracking-[-0.02em] leading-none mt-2"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 1 }}
                    style={{
                      textShadow: '6px 6px 0px #000000, -3px -3px 0px #000000, 3px -3px 0px #000000, -3px 3px 0px #000000',
                      filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))'
                    }}
                  >
                    MF DOOM
                  </motion.span>
                </motion.h1>
                
                <motion.p 
                  className="text-doom-lg md:text-doom-xl font-villain text-doom-silver leading-tight tracking-wide"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  style={{
                    textShadow: '2px 2px 0px #000000'
                  }}
                >
                  PAYING TRIBUTE TO THE VILLAIN
                </motion.p>
              </div>
              
              {/* Sharp decorative elements */}
              <motion.div
                className="absolute -top-8 -right-8 text-doom-gold"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.3, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <Skull size={48} />
              </motion.div>
              <motion.div
                className="absolute -bottom-8 -left-8 text-doom-bronze"
                animate={{ 
                  rotate: -360,
                  scale: [1.2, 1, 1.2]
                }}
                transition={{ 
                  rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                  scale: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }
                }}
              >
                <Shield size={44} />
              </motion.div>
            </motion.div>
          </motion.div>
          
          <motion.p 
            variants={itemVariants}
            className="text-doom-lg md:text-doom-xl text-doom-metal max-w-4xl mx-auto mb-16 leading-relaxed font-mono tracking-wide"
            style={{
              textShadow: '1px 1px 0px #000000'
            }}
          >
            A curated collection celebrating the masked legend's eternal influence on 
            <span className="font-villain text-doom-silver"> HIP-HOP CULTURE</span> and 
            <span className="font-villain text-doom-silver"> ARTISTIC EXPRESSION</span>.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group"
            >
              <Link 
                href="/products"
                className="inline-flex items-center gap-3 px-8 py-4 bg-villain-gold border-3 border-doom-bronze text-doom-black font-villain text-doom-base tracking-wide shadow-villain-lg hover:shadow-gold-glow transition-all duration-300"
                style={{
                  clipPath: 'polygon(10% 0%, 90% 0%, 100% 25%, 100% 75%, 90% 100%, 10% 100%, 0% 75%, 0% 25%)',
                  textShadow: 'none'
                }}
              >
                EXPLORE COLLECTION
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group"
            >
              <Link 
                href="#story"
                className="inline-flex items-center gap-3 px-8 py-4 bg-doom-charcoal border-3 border-doom-silver text-doom-silver font-villain text-doom-base tracking-wide shadow-villain-lg hover:shadow-silver-glow hover:text-doom-gold transition-all duration-300"
                style={{
                  clipPath: 'polygon(10% 0%, 90% 0%, 100% 25%, 100% 75%, 90% 100%, 10% 100%, 0% 75%, 0% 25%)'
                }}
              >
                <Play size={20} className="group-hover:scale-110 transition-transform" />
                OUR STORY
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Sharp scroll indicator */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8">
          <motion.div 
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 1 }}
          >
            <span className="text-sm font-villain tracking-[0.2em] uppercase text-doom-silver opacity-80">
              SCROLL DOWN
            </span>
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-doom-gold"
            >
              <ChevronDown size={32} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Dark Story Section */}
      <section id="story" className="relative bg-doom-dark py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-paper-texture opacity-30" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-doom-gold to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-doom-gold to-transparent" />
          </div>

        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Dark Content */}
            <motion.div 
              className="space-y-12"
              initial={{ x: -80, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8">
                <motion.div
                  className="flex items-center gap-3 text-doom-gold font-villain text-doom-sm tracking-[0.2em] uppercase"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <Skull size={20} />
                  <span>OUR MISSION</span>
                </motion.div>
                
                <h2 className="font-villain text-doom-2xl md:text-doom-3xl lg:text-doom-3xl text-doom-silver leading-tight tracking-wide">
                  PAYING TRIBUTE TO 
                  <span className="block text-doom-gold mt-2" style={{
                    textShadow: '3px 3px 0px #000000, -1px -1px 0px #000000',
                    filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.6))'
                  }}>
                    THE VILLAIN
                  </span>
            </h2>
              </div>
              
              <div className="space-y-8 text-doom-base leading-relaxed text-doom-metal font-mono">
                <p>
                  Born from our vibrant Instagram community{' '}
                  <a 
                    href="https://instagram.com/thismfdoom_" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-villain text-doom-gold hover:text-doom-bronze transition-colors underline decoration-doom-gold/50 hover:decoration-doom-bronze tracking-wide"
                  >
                    @THISMFDOOM_
                  </a>
                  , our shop represents more than merchandise — it's a sanctuary for preserving 
                  and celebrating the profound legacy of Daniel Dumile.
              </p>
              <p>
                  Every piece in our collection is meticulously curated to honor DOOM's 
                  artistic genius, from the iconic mask that became legend to the intricate 
                  wordplay that redefined hip-hop's creative boundaries.
                </p>
                <p className="font-villain text-doom-silver tracking-wide">
                  WE BELIEVE IN QUALITY OVER QUANTITY, AUTHENTICITY OVER IMITATION, AND 
                  COMMUNITY OVER COMMERCE.
              </p>
            </div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-6 pt-8"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                viewport={{ once: true }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/products"
                    className="inline-flex items-center gap-3 px-6 py-3 bg-villain-gold border-2 border-doom-bronze text-doom-black font-villain text-doom-sm tracking-wide shadow-villain-md hover:shadow-gold-glow transition-all duration-300"
                    style={{
                      clipPath: 'polygon(8% 0%, 92% 0%, 100% 20%, 100% 80%, 92% 100%, 8% 100%, 0% 80%, 0% 20%)'
                    }}
                  >
                    BROWSE COLLECTION
                    <ArrowRight size={18} />
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a 
                    href="https://instagram.com/thismfdoom_" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-3 bg-doom-charcoal border-2 border-doom-silver text-doom-silver font-villain text-doom-sm tracking-wide shadow-villain-md hover:shadow-silver-glow hover:text-doom-gold transition-all duration-300"
                    style={{
                      clipPath: 'polygon(8% 0%, 92% 0%, 100% 20%, 100% 80%, 92% 100%, 8% 100%, 0% 80%, 0% 20%)'
                    }}
                  >
                    FOLLOW US
                    <Zap size={18} />
                  </a>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right side could have image or additional content */}
            <motion.div 
              className="relative"
              initial={{ x: 80, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="bg-doom-charcoal/50 border-2 border-doom-gold/30 p-8 shadow-villain-lg">
                <div className="text-center space-y-6" style={{
                  clipPath: 'polygon(5% 0%, 95% 0%, 100% 10%, 100% 90%, 95% 100%, 5% 100%, 0% 90%, 0% 10%)'
                }}>
                  <blockquote className="text-doom-lg md:text-doom-xl font-villain text-doom-gold leading-tight tracking-wide">
                    "REMEMBER ALL CAPS WHEN YOU SPELL THE MAN NAME"
                  </blockquote>
                  <cite className="text-doom-base font-mono text-doom-silver tracking-[0.1em]">
                    — MF DOOM
                  </cite>
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