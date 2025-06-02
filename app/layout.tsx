import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MF DOOM Shop - Official Merchandise',
  description: 'Official MF DOOM merchandise store. Shop exclusive apparel, vinyl, accessories, and more inspired by the legendary masked villain.',
  keywords: 'MF DOOM, merchandise, hip hop, vinyl, apparel, madvillain, operation doomsday',
  metadataBase: new URL('https://mfdoomshop.com'),
  openGraph: {
    title: 'MF DOOM Shop - Official Merchandise',
    description: 'Shop exclusive MF DOOM merchandise curated by @thismfdoom_',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MF DOOM Shop',
    description: 'Official MF DOOM merchandise store',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
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
        <Header />
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#000',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '500',
            },
          }}
        />
      </body>
    </html>
  )
} 