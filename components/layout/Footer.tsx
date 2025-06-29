import React from 'react'
import Link from 'next/link'
import { Instagram, Mail, ShoppingBag } from 'lucide-react'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">THISMFDOOM</h3>
            <p className="text-gray-400 mb-4 max-w-md">
              Paying tribute to the villain - celebrating the masked legend's legacy. 
              Curated by @thismfdoom_ for true hip-hop heads.
            </p>
            <p className="text-sm text-gray-500">
              Remember ALL CAPS when you spell the man name.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=apparel" className="text-gray-400 hover:text-white transition-colors">
                  Apparel
                </Link>
              </li>
              <li>
                <Link href="/products?category=vinyl" className="text-gray-400 hover:text-white transition-colors">
                  Vinyl Records
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="text-gray-400 hover:text-white transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://instagram.com/thismfdoom_" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Instagram size={16} />
                  @thismfdoom_
                </a>
              </li>
              <li>
                <a 
                  href="mailto:contact@thismfdoom.shop" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Mail size={16} />
                  Contact Us
                </a>
              </li>
              <li>
                <Link href="/cart" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <ShoppingBag size={16} />
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            © {currentYear} THISMFDOOM. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 