'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { ShoppingCart, Menu, X, Instagram, Search, Hash, Command, Skull } from 'lucide-react'
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
    { href: '/products', label: 'SHOP', description: 'ALL ITEMS' },
    { href: '/products?category=apparel', label: 'GEAR', description: 'CLOTHING' },
    { href: '/products?category=vinyl', label: 'VINYL', description: 'RECORDS' },
    { href: '/products?category=accessories', label: 'EXTRAS', description: 'ACCESSORIES' },
    { href: '/products?category=art', label: 'ART', description: 'PIECES' },
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
            ? 'bg-doom-black/95 backdrop-blur-xl shadow-villain-xl border-b border-doom-gold/20' 
            : 'bg-doom-dark/90 backdrop-blur-md'
        }`}
      >
        <div className="px-6 md:px-12 lg:px-20">
          <nav className="flex items-center justify-between h-24">
            {/* MF DOOM Villain Logo */}
            <Link href="/" className="relative z-50">
              <div className="flex items-center gap-4">
                {/* DOOM Mask with Gritty Effect */}
                <motion.div 
                  className="w-14 h-14 border-2 border-doom-gold bg-villain-metal flex items-center justify-center shadow-villain-md overflow-hidden relative"
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  transition={{ duration: 0.3, ease: "comic" }}
                  style={{
                    clipPath: 'polygon(10% 0%, 90% 0%, 100% 25%, 100% 75%, 90% 100%, 10% 100%, 0% 75%, 0% 25%)'
                  }}
                >
                  <div className="relative w-12 h-10 overflow-hidden">
                    <Image
                      src="/icons/mfdoomcask.gif"
                      alt="MF DOOM Mask"
                      width={48}
                      height={40}
                      className="w-12 h-12 object-cover"
                      style={{
                        filter: 'contrast(1.5) brightness(0.8) saturate(0.7)',
                        objectPosition: 'center top',
                        transform: 'translateY(-2px)'
                      }}
                      unoptimized
                    />
                  </div>
                  {/* Metallic shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-doom-silver/30 to-transparent transform -skew-x-12 animate-gold-shine" />
                </motion.div>

                {/* Bold Villain Typography */}
                <div className="flex flex-col">
                  <h1 
                    className="text-3xl md:text-4xl font-villain text-doom-gold leading-none tracking-wider"
                    style={{
                      textShadow: '3px 3px 0px #000000, -1px -1px 0px #000000, 1px -1px 0px #000000, -1px 1px 0px #000000',
                      filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))'
                    }}
                  >
                    MF DOOM
                  </h1>
                  
                  <p className="text-xs tracking-[0.3em] font-bold uppercase text-doom-silver font-mono">
                    <Skull size={8} className="inline mr-1" />
                    VILLAIN SHOP
                  </p>
                </div>
              </div>
            </Link>

            {/* Gritty Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 relative z-40">
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
                    className="flex flex-col items-center px-3 py-3 bg-doom-charcoal/50 border border-doom-gray/30 hover:bg-doom-gray/60 hover:border-doom-gold/50 transition-all duration-300 relative overflow-hidden"
                    style={{
                      clipPath: 'polygon(5% 0%, 95% 0%, 100% 15%, 100% 85%, 95% 100%, 5% 100%, 0% 85%, 0% 15%)'
                    }}
                  >
                    {/* Background glow on hover */}
                    <motion.div
                      className="absolute inset-0 bg-doom-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <span className="relative z-10 text-sm font-villain text-doom-silver group-hover:text-doom-gold transition-colors duration-300 tracking-wide">
                      {link.label}
                    </span>
                    <span className="relative z-10 text-xs text-doom-metal group-hover:text-doom-silver transition-colors duration-300 mt-1 font-mono tracking-wider">
                      {link.description}
                    </span>
                    
                    {/* Sharp bottom accent */}
                    <motion.div
                      className="absolute bottom-0 left-1/2 w-0 h-1 bg-doom-gold group-hover:w-3/4 transition-all duration-300"
                      style={{ transform: 'translateX(-50%)' }}
                    />
                  </Link>
                </motion.div>
              ))}
              
              {/* Instagram with Villain Styling */}
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
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-doom-blood to-doom-red text-white hover:from-doom-red hover:to-doom-blood transition-all duration-300 hover:shadow-red-glow hover:scale-105 relative z-30 border border-doom-red/50"
                  style={{
                    clipPath: 'polygon(10% 0%, 90% 0%, 100% 20%, 100% 80%, 90% 100%, 10% 100%, 0% 80%, 0% 20%)'
                  }}
                >
                  <Instagram size={16} />
                  <span className="text-sm font-villain hidden xl:inline tracking-wide">@VILLAIN</span>
                </a>
              </motion.div>
            </div>

            {/* Right Side Actions - Villain Style */}
            <div className="flex items-center space-x-3 relative z-40">
              {/* Search with Dark Styling */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openSearch}
                className="hidden md:flex items-center justify-center gap-2 px-4 h-12 bg-doom-charcoal border border-doom-gray hover:bg-doom-gray hover:border-doom-gold/50 transition-colors duration-300 group relative z-30"
                style={{
                  clipPath: 'polygon(8% 0%, 92% 0%, 100% 20%, 100% 80%, 92% 100%, 8% 100%, 0% 80%, 0% 20%)'
                }}
              >
                <Search size={18} className="text-doom-silver group-hover:text-doom-gold transition-colors" />
                <span className="text-sm text-doom-silver group-hover:text-doom-gold transition-colors hidden lg:inline font-mono tracking-wide">
                  SEARCH
                </span>
                <div className="hidden xl:flex items-center gap-1 ml-2">
                  <kbd className="px-1.5 py-0.5 bg-doom-dark border border-doom-gray text-xs text-doom-metal font-mono">
                    {typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'CTRL'}
                  </kbd>
                  <kbd className="px-1.5 py-0.5 bg-doom-dark border border-doom-gray text-xs text-doom-metal font-mono">
                    K
                  </kbd>
                </div>
              </motion.button>

              {/* Mobile Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openSearch}
                className="md:hidden flex items-center justify-center w-12 h-12 bg-doom-charcoal border border-doom-gray hover:bg-doom-gray hover:border-doom-gold/50 transition-colors duration-300 group relative z-30"
                style={{
                  clipPath: 'polygon(10% 0%, 90% 0%, 100% 25%, 100% 75%, 90% 100%, 10% 100%, 0% 75%, 0% 25%)'
                }}
              >
                <Search size={20} className="text-doom-silver group-hover:text-doom-gold transition-colors" />
              </motion.button>

              {/* Villain Cart Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCart}
                className="relative flex items-center justify-center w-12 h-12 bg-villain-dark border-2 border-doom-gold hover:bg-doom-charcoal transition-all duration-300 group shadow-villain-md hover:shadow-gold-glow z-30"
                style={{
                  clipPath: 'polygon(15% 0%, 85% 0%, 100% 30%, 100% 70%, 85% 100%, 15% 100%, 0% 70%, 0% 30%)'
                }}
              >
                <ShoppingCart size={20} className="text-doom-gold" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-2 -right-2 bg-doom-red text-white text-xs w-6 h-6 flex items-center justify-center font-villain shadow-villain-sm border-2 border-doom-dark z-40"
                      style={{
                        clipPath: 'polygon(20% 0%, 80% 0%, 100% 40%, 100% 60%, 80% 100%, 20% 100%, 0% 60%, 0% 40%)'
                      }}
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {totalItems > 0 && (
                  <motion.div
                    className="absolute inset-0 bg-doom-red/20 opacity-60"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      clipPath: 'polygon(15% 0%, 85% 0%, 100% 30%, 100% 70%, 85% 100%, 15% 100%, 0% 70%, 0% 30%)'
                    }}
                  />
                )}
              </motion.button>

              {/* Mobile Menu with Sharp Styling */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-12 h-12 bg-doom-charcoal border border-doom-gray hover:bg-doom-gray hover:border-doom-gold/50 transition-colors duration-300 relative z-30"
                style={{
                  clipPath: 'polygon(10% 0%, 90% 0%, 100% 25%, 100% 75%, 90% 100%, 10% 100%, 0% 75%, 0% 25%)'
                }}
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
                      <X size={20} className="text-doom-silver" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={20} className="text-doom-silver" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </nav>
        </div>

        {/* Dark Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="lg:hidden overflow-hidden bg-doom-dark/98 backdrop-blur-xl border-t border-doom-gold/30 shadow-villain-2xl relative z-40"
            >
              <div className="px-6 py-8 space-y-6 bg-paper-texture">
                {/* Mobile Search - Villain Style */}
                <motion.div
                  custom={-1}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <button
                    onClick={openSearch}
                    className="w-full flex items-center gap-4 p-4 bg-doom-charcoal/80 border border-doom-gray hover:bg-doom-gray/60 hover:border-doom-gold/50 transition-all duration-300"
                    style={{
                      clipPath: 'polygon(5% 0%, 95% 0%, 100% 15%, 100% 85%, 95% 100%, 5% 100%, 0% 85%, 0% 15%)'
                    }}
                  >
                    <Search size={24} className="text-doom-gold" />
                    <div className="text-left">
                      <h3 className="text-lg font-villain text-doom-silver tracking-wide">SEARCH ITEMS</h3>
                      <p className="text-sm text-doom-metal font-mono">Find your villain gear</p>
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
                      className="group block p-4 bg-doom-charcoal/50 border border-doom-gray/30 hover:bg-doom-gray/60 hover:border-doom-gold/50 transition-all duration-300"
                      style={{
                        clipPath: 'polygon(3% 0%, 97% 0%, 100% 12%, 100% 88%, 97% 100%, 3% 100%, 0% 88%, 0% 12%)'
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-villain text-doom-silver group-hover:text-doom-gold transition-colors tracking-wide">
                            {link.label}
                          </h3>
                          <p className="text-sm text-doom-metal group-hover:text-doom-silver transition-colors font-mono tracking-wider">
                            {link.description}
                          </p>
                        </div>
                        <motion.div
                          className="w-8 h-8 bg-doom-gray group-hover:bg-doom-gold/20 flex items-center justify-center transition-colors border border-doom-metal"
                          whileHover={{ scale: 1.1 }}
                          style={{
                            clipPath: 'polygon(20% 0%, 80% 0%, 100% 40%, 100% 60%, 80% 100%, 20% 100%, 0% 60%, 0% 40%)'
                          }}
                        >
                          <div className="w-2 h-2 bg-doom-gold" />
                        </motion.div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
                
                {/* Instagram with Dark Villain Styling */}
                <motion.div
                  custom={navLinks.length}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="pt-6 border-t border-doom-gold/30"
                >
                  <a
                    href="https://instagram.com/thismfdoom_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-doom-blood to-doom-red text-white hover:from-doom-red hover:to-doom-blood transition-all duration-300 hover:scale-105 border border-doom-red/50"
                    style={{
                      clipPath: 'polygon(8% 0%, 92% 0%, 100% 18%, 100% 82%, 92% 100%, 8% 100%, 0% 82%, 0% 18%)'
                    }}
                  >
                    <Instagram size={24} />
                    <div>
                      <h3 className="font-villain tracking-wide">FOLLOW THE VILLAIN</h3>
                      <p className="text-sm opacity-90 font-mono">@thismfdoom_</p>
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