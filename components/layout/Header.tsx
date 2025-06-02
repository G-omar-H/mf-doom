'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Menu, X, Instagram } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { useState, useEffect } from 'react'

export const Header: React.FC = () => {
  const { toggleCart, getTotalItems } = useCartStore()
  const totalItems = getTotalItems()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/products', label: 'Shop' },
    { href: '/products?category=apparel', label: 'Apparel' },
    { href: '/products?category=vinyl', label: 'Vinyl' },
    { href: '/products?category=accessories', label: 'Accessories' },
  ]

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="px-4 md:px-8">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <motion.div
              animate={{ 
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              className="font-bold text-xl"
            >
              MF DOOM
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium hover:text-mf-dark-blue transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://instagram.com/thismfdoom_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:text-mf-dark-blue transition-colors flex items-center gap-1"
            >
              <Instagram size={16} />
              <span>@thismfdoom_</span>
            </a>
          </div>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleCart}
              className="relative p-2"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </motion.button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={false}
        animate={{ height: isMobileMenuOpen ? 'auto' : 0 }}
        className="md:hidden overflow-hidden bg-white border-t border-gray-100"
      >
        <div className="px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium hover:text-mf-dark-blue transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://instagram.com/thismfdoom_"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm font-medium hover:text-mf-dark-blue transition-colors"
          >
            @thismfdoom_ on Instagram
          </a>
        </div>
      </motion.div>
    </header>
  )
} 