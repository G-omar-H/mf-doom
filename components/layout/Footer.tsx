'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Instagram, Mail, ShoppingBag, Heart, Sparkles, Disc, Music } from 'lucide-react'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Artistic Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-blue-500/3 to-transparent rounded-full" />
      </div>

      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 doom-bg-pattern" />
      </div>

      <div className="relative z-10">
        <motion.div 
          className="container mx-auto px-6 py-16 lg:py-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
            {/* Brand Section */}
            <motion.div 
              className="lg:col-span-2 space-y-6"
              variants={itemVariants}
            >
              <div className="space-y-4">
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="text-blue-400"
                  >
                    <Disc size={32} />
                  </motion.div>
                  <h3 
                    className="text-3xl font-black tracking-tight"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    MF DOOM SHOP
                  </h3>
                </motion.div>
                
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p className="text-lg">
                    Paying tribute to the villain — celebrating the masked legend's legacy 
                    through authentic, carefully curated merchandise.
                  </p>
                  <p>
                    Born from our vibrant Instagram community{' '}
                    <a 
                      href="https://instagram.com/thismfdoom_" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
                    >
                      @thismfdoom_
                    </a>
                    {' '}for true hip-hop heads who understand the cultural impact of DOOM's artistry.
                  </p>
                </div>
                
                <motion.div 
                  className="flex items-center gap-2 text-blue-300 text-sm font-medium"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Heart size={16} fill="currentColor" />
                  <span>Remember ALL CAPS when you spell the man name</span>
                </motion.div>
              </div>

              {/* Social Links */}
              <motion.div 
                className="flex gap-4"
                variants={itemVariants}
              >
                <motion.a
                  href="https://instagram.com/thismfdoom_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Instagram size={24} />
                  <motion.div
                    className="absolute inset-0 bg-white rounded-xl opacity-0 group-hover:opacity-20 transition-opacity"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  />
                </motion.a>
                
                <motion.a
                  href="mailto:contact@mfdoomshop.com"
                  className="group relative p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                  whileHover={{ scale: 1.05, rotate: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail size={24} />
                  <motion.div
                    className="absolute inset-0 bg-white rounded-xl opacity-0 group-hover:opacity-20 transition-opacity"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  />
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Shop Links */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingBag size={20} className="text-blue-400" />
                <h4 className="font-bold text-lg">Shop</h4>
              </div>
              <nav className="space-y-3">
                {[
                  { href: '/products', label: 'All Products' },
                  { href: '/products?category=apparel', label: 'Apparel' },
                  { href: '/products?category=vinyl', label: 'Vinyl Records' },
                  { href: '/products?category=accessories', label: 'Accessories' },
                ].map((link, index) => (
                  <motion.div
                    key={link.href}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Link
                      href={link.href}
                      className="block text-gray-300 hover:text-white transition-colors duration-300 relative group"
                    >
                      <span className="relative z-10">{link.label}</span>
                      <motion.div
                        className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 w-0 group-hover:w-full transition-all duration-300"
                        initial={{ width: 0 }}
                        whileHover={{ width: '100%' }}
                      />
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>

            {/* Connect Links */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <Music size={20} className="text-blue-400" />
                <h4 className="font-bold text-lg">Connect</h4>
              </div>
              <nav className="space-y-3">
                {[
                  {
                    href: 'https://instagram.com/thismfdoom_',
                    label: '@thismfdoom_',
                    icon: Instagram,
                    external: true
                  },
                  {
                    href: 'mailto:contact@mfdoomshop.com',
                    label: 'Contact Us',
                    icon: Mail,
                    external: false
                  },
                  {
                    href: '/cart',
                    label: 'Shopping Cart',
                    icon: ShoppingBag,
                    external: false
                  },
                ].map((link, index) => {
                  const IconComponent = link.icon
                  const LinkComponent = link.external ? 'a' : Link
                  const linkProps = link.external ? {
                    href: link.href,
                    target: '_blank',
                    rel: 'noopener noreferrer'
                  } : { href: link.href }

                  return (
                    <motion.div
                      key={link.href}
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <LinkComponent
                        {...linkProps}
                        className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-300 group"
                      >
                        <IconComponent size={16} className="group-hover:text-blue-400 transition-colors" />
                        <span className="relative">
                          {link.label}
                          <motion.div
                            className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 w-0 group-hover:w-full transition-all duration-300"
                            initial={{ width: 0 }}
                            whileHover={{ width: '100%' }}
                          />
                        </span>
                      </LinkComponent>
                    </motion.div>
                  )
                })}
              </nav>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <motion.div 
            className="border-t border-gray-800 mt-16 pt-8"
            variants={itemVariants}
          >
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <motion.div 
                className="flex items-center gap-2 text-sm text-gray-400"
                whileHover={{ scale: 1.02 }}
              >
                <Sparkles size={16} className="text-blue-400" />
                <span>© {currentYear} MF DOOM Shop. All rights reserved.</span>
              </motion.div>
              
              <div className="flex gap-6 text-sm">
                {[
                  { href: '/privacy', label: 'Privacy Policy' },
                  { href: '/terms', label: 'Terms of Service' },
                  { href: '/shipping', label: 'Shipping Info' },
                ].map((link, index) => (
                  <motion.div
                    key={link.href}
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 relative group"
                    >
                      <span className="relative z-10">{link.label}</span>
                      <motion.div
                        className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 w-0 group-hover:w-full transition-all duration-300"
                        initial={{ width: 0 }}
                        whileHover={{ width: '100%' }}
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Artistic Quote */}
          <motion.div 
            className="text-center mt-12 pt-8 border-t border-gray-800/50"
            variants={itemVariants}
          >
            <motion.blockquote 
              className="text-gray-400 italic text-lg font-medium relative"
              style={{ fontFamily: 'Playfair Display, serif' }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.span
                className="absolute -top-2 -left-4 text-blue-400/50 text-4xl"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                "
              </motion.span>
              Just remember ALL CAPS when you spell the man name
              <motion.span
                className="absolute -bottom-2 -right-4 text-blue-400/50 text-4xl"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >
                "
              </motion.span>
            </motion.blockquote>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
} 