'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Menu, X, Instagram, User, LogOut, Settings } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'

export const Header: React.FC = () => {
  const { toggleCart, getTotalItems } = useCartStore()
  const { data: session, status } = useSession()
  const totalItems = getTotalItems()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.user-menu')) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navLinks = [
    { href: '/products', label: 'Shop' },
    { href: '/products?category=t_shirts', label: 'T-Shirts' },
    { href: '/products?category=hoodies', label: 'Hoodies' },
    { href: '/products?category=vinyl', label: 'Vinyl' },
    { href: '/products?category=accessories', label: 'Accessories' },
  ]

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

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

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Authentication */}
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-mf-light-gray animate-pulse"></div>
            ) : session ? (
              <div className="relative user-menu">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-mf-light-gray transition-colors"
                >
                  <div className="w-8 h-8 bg-mf-blue rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden md:block text-sm font-medium">{session.user.name}</span>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold">{session.user.name}</p>
                      <p className="text-xs text-mf-gray">{session.user.email}</p>
                      {session.user.role === 'ADMIN' && (
                        <span className="inline-block mt-1 bg-mf-blue text-white text-xs px-2 py-1 rounded">
                          Admin
                        </span>
                      )}
                    </div>
                    
                    <div className="py-1">
                      <Link
                        href="/account/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-mf-light-gray transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      
                      <Link
                        href="/account/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-mf-light-gray transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Orders</span>
                      </Link>

                      {session.user.role === 'ADMIN' && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-mf-light-gray transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          handleSignOut()
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium hover:text-mf-dark-blue transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-mf-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-mf-dark-blue transition-colors"
                >
                  Join Legion
                </Link>
              </div>
            )}

            {/* Cart */}
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
        className="md:hidden overflow-hidden bg-white border-t border-gray-100 shadow-lg"
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-base font-medium hover:text-mf-dark-blue hover:bg-mf-blue/10 transition-all duration-200 px-4 py-3 rounded-lg"
            >
              {link.label}
            </Link>
          ))}
          
          {/* Mobile Auth */}
          {session ? (
            <div className="space-y-1 pt-4 border-t border-gray-200">
              <Link
                href="/account/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-base font-medium hover:text-mf-dark-blue hover:bg-mf-blue/10 transition-all duration-200 px-4 py-3 rounded-lg"
              >
                Profile
              </Link>
              {session.user.role === 'ADMIN' && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-medium hover:text-mf-dark-blue hover:bg-mf-blue/10 transition-all duration-200 px-4 py-3 rounded-lg"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  handleSignOut()
                }}
                className="block w-full text-left text-base font-medium text-red-600 hover:bg-red-50 transition-all duration-200 px-4 py-3 rounded-lg"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-1 pt-4 border-t border-gray-200">
              <Link
                href="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-base font-medium hover:text-mf-dark-blue hover:bg-mf-blue/10 transition-all duration-200 px-4 py-3 rounded-lg"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-base font-medium bg-mf-blue text-white hover:bg-mf-dark-blue transition-all duration-200 px-4 py-3 rounded-lg"
              >
                Join the Legion
              </Link>
            </div>
          )}

          <a
            href="https://instagram.com/thismfdoom_"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-base font-medium hover:text-mf-dark-blue hover:bg-mf-blue/10 transition-all duration-200 px-4 py-3 rounded-lg flex items-center gap-2"
          >
            <Instagram size={18} />
            @thismfdoom_ on Instagram
          </a>
        </div>
      </motion.div>
    </header>
  )
} 