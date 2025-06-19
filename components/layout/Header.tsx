'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { ShoppingCart, Menu, X, Instagram, Search, Hash, Command } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { useState, useEffect } from 'react'
import { SearchModal } from '@/components/search/SearchModal'

export const Header: React.FC = () => {
  const { toggleCart, getTotalItems } = useCartStore()
  const totalItems = getTotalItems()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Keyboard shortcuts for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Windows/Linux) to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
      // Close mobile menu when search is opened
      if (isSearchOpen && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isSearchOpen, isMobileMenuOpen])

  const openSearch = () => {
    setIsSearchOpen(true)
    setIsMobileMenuOpen(false) // Close mobile menu if open
  }

  const closeSearch = () => {
    setIsSearchOpen(false)
  }

  const navLinks = [
    { href: '/products', label: 'Shop', description: 'Browse all items' },
    { href: '/products?category=apparel', label: 'Apparel', description: 'Clothing & gear' },
    { href: '/products?category=vinyl', label: 'Vinyl', description: 'Records & music' },
    { href: '/products?category=accessories', label: 'Accessories', description: 'Premium extras' },
    { href: '/products?category=art', label: 'Art', description: 'Artistic pieces' },
  ]

  const menuVariants: Variants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  }

  const itemVariants: Variants = {
    closed: { opacity: 0, y: -20 },
    open: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  }

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/98 backdrop-blur-xl shadow-xl border-b border-gray-100/50' 
            : 'bg-white/95 backdrop-blur-md'
        }`}
      >
        <div className="px-6 md:px-12 lg:px-20">
          <nav className="flex items-center justify-between h-24">
            {/* MF DOOM Logo with Mask GIF */}
            <Link href="/" className="relative z-50">
              <div className="flex items-center gap-3">
                {/* MF DOOM Mask GIF */}
                <motion.div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center shadow-lg overflow-hidden relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(139, 212, 230, 0.1), rgba(147, 51, 234, 0.1))'
                  }}
                >
                  <div className="relative w-10 h-8 overflow-hidden rounded-md">
                    <Image
                      src="/icons/mfdoomcask.gif"
                      alt="MF DOOM Mask"
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover"
                      style={{
                        mixBlendMode: 'screen',
                        filter: 'contrast(1.2) brightness(1.1)',
                        objectPosition: 'center top',
                        transform: 'translateY(-2px)'
                      }}
                      unoptimized
                    />
                  </div>
                </motion.div>

                {/* Simple Typography */}
                <div className="flex flex-col">
                  <h1 
                    className="text-2xl md:text-3xl font-black tracking-tight leading-none"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      background: 'linear-gradient(135deg, #000, #374151)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    MF DOOM
                  </h1>
                  
                  <p className="text-xs tracking-widest font-medium uppercase text-gray-500">
                    <Hash size={8} className="inline mr-1" />
                    SHOP
                  </p>
                </div>
              </div>
            </Link>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2 relative z-40">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                  className="group relative"
                >
                  <Link
                    href={link.href}
                    className="flex flex-col items-center px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{ zIndex: 1 }}
                    />
                    
                    <span className="relative z-10 text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                      {link.label}
                    </span>
                    <span className="relative z-10 text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-300 mt-1">
                      {link.description}
                    </span>
                    
                    <motion.div
                      className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-gray-900 to-gray-600 group-hover:w-3/4 transition-all duration-300"
                      style={{ transform: 'translateX(-50%)', zIndex: 2 }}
                    />
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="group relative z-30"
              >
                <a
                  href="https://instagram.com/thismfdoom_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:shadow-lg hover:scale-105 relative z-30"
                >
                  <Instagram size={16} />
                  <span className="text-sm font-medium hidden xl:inline">@thismfdoom_</span>
                </a>
              </motion.div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4 relative z-40">
              {/* Enhanced Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openSearch}
                className="hidden md:flex items-center justify-center gap-2 px-4 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-300 group relative z-30"
              >
                <Search size={18} className="text-gray-600 group-hover:text-gray-800 transition-colors" />
                <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors hidden lg:inline">
                  Search
                </span>
                <div className="hidden xl:flex items-center gap-1 ml-2">
                  <kbd className="px-1.5 py-0.5 bg-white rounded text-xs text-gray-500 border border-gray-300">
                    {typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
                  </kbd>
                  <kbd className="px-1.5 py-0.5 bg-white rounded text-xs text-gray-500 border border-gray-300">
                    K
                  </kbd>
                </div>
              </motion.button>

              {/* Mobile Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openSearch}
                className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-300 group relative z-30"
              >
                <Search size={20} className="text-gray-600 group-hover:text-gray-800 transition-colors" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCart}
                className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gray-900 hover:bg-black transition-all duration-300 group shadow-lg hover:shadow-xl z-30"
              >
                <ShoppingCart size={20} className="text-white" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white z-40"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {totalItems > 0 && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-red-500 opacity-20"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-300 relative z-30"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={20} className="text-gray-700" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={20} className="text-gray-700" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </nav>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="lg:hidden overflow-hidden bg-white/98 backdrop-blur-xl border-t border-gray-100 shadow-2xl relative z-40"
            >
              <div className="px-6 py-8 space-y-6">
                {/* Mobile Search */}
                <motion.div
                  custom={-1}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <button
                    onClick={openSearch}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300"
                  >
                    <Search size={24} className="text-gray-600" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Search Products</h3>
                      <p className="text-sm text-gray-500">Find exactly what you're looking for</p>
                    </div>
                  </button>
                </motion.div>

                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    custom={index}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="group block p-4 rounded-2xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-300"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                            {link.label}
                          </h3>
                          <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                            {link.description}
                          </p>
                        </div>
                        <motion.div
                          className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors"
                          whileHover={{ scale: 1.1 }}
                        >
                          <div className="w-2 h-2 rounded-full bg-gray-400 group-hover:bg-gray-500 transition-colors" />
                        </motion.div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div
                  custom={navLinks.length}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="pt-6 border-t border-gray-200"
                >
                  <a
                    href="https://instagram.com/thismfdoom_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105"
                  >
                    <Instagram size={24} />
                    <div>
                      <h3 className="font-semibold">Follow @thismfdoom_</h3>
                      <p className="text-sm opacity-90">Join our community</p>
                    </div>
                  </a>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
    </>
  )
} 