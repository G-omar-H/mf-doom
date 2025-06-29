import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'thismfdoom | Premium Streetwear & Vinyl Collection',
  description: 'Official MF DOOM merchandise store featuring exclusive streetwear, vinyl records, and collectibles. Just remember ALL CAPS when you spell the man name.',
  keywords: ['MF DOOM', 'streetwear', 'vinyl', 'hip hop', 'merchandise', 'collectibles', 'thismfdoom'],
  metadataBase: new URL('https://thismfdoom.shop'),
  openGraph: {
    title: 'thismfdoom - Premium Streetwear Collection',
    description: 'Official MF DOOM merchandise featuring exclusive streetwear, vinyl records, and collectibles.',
    url: 'https://thismfdoom.shop',
    siteName: 'thismfdoom',
    images: [
      {
        url: 'https://thismfdoom.shop/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'thismfdoom - Premium Streetwear Collection',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
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
        </SessionProvider>
      </body>
    </html>
  )
} 