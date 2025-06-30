import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import { VisitorTracking } from '@/components/analytics/VisitorTracking'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'THISMFDOOM | Premium Streetwear & Vinyl Collection',
  description: 'Official MF DOOM merchandise store featuring exclusive streetwear, vinyl records, and collectibles. Just remember ALL CAPS when you spell the man name.',
  keywords: ['MF DOOM', 'streetwear', 'vinyl', 'hip hop', 'merchandise', 'collectibles', 'THISMFDOOM'],
  metadataBase: new URL('https://thismfdoom.shop'),
  openGraph: {
    title: 'THISMFDOOM - Premium Streetwear Collection',
    description: 'Official MF DOOM merchandise featuring exclusive streetwear, vinyl records, and collectibles.',
    url: 'https://thismfdoom.shop',
    siteName: 'THISMFDOOM',
    images: [
      {
        url: 'https://thismfdoom.shop/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'THISMFDOOM - Premium Streetwear Collection',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zoom issues on mobile
  viewportFit: 'cover',
  themeColor: '#8CD4E6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Header />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                style: {
                  background: '#8CD4E6',
                  color: '#000',
                },
              },
            }}
          />
          
          {/* Analytics Components */}
          <Analytics />
          <GoogleAnalytics />
          <VisitorTracking />
        </SessionProvider>
      </body>
    </html>
  )
} 