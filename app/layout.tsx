import type { Metadata, Viewport } from 'next'
import { Inter, Bebas_Neue } from 'next/font/google'
import '@/styles/globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })
const bebasNeue = Bebas_Neue({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas'
})

export const metadata: Metadata = {
  title: 'MF DOOM Shop - Paying Tribute to the Villain',
  description: 'Paying tribute to the villain - MF DOOM merchandise store. Shop exclusive apparel, vinyl, accessories, and more inspired by the legendary masked villain.',
  keywords: 'MF DOOM, merchandise, hip hop, vinyl, apparel, madvillain, operation doomsday, villain, metal face',
  metadataBase: new URL('https://mfdoomshop.com'),
  openGraph: {
    title: 'MF DOOM Shop - Paying Tribute to the Villain',
    description: 'Shop exclusive MF DOOM merchandise curated by @thismfdoom_',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MF DOOM Shop - Villain Merchandise',
    description: 'Paying tribute to the villain - authentic MF DOOM merchandise store',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#FFD700', // DOOM gold instead of blue
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${bebasNeue.variable}`}>
      <head>
        {/* Additional villain fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} bg-doom-dark text-doom-silver`}>
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
              background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
              color: '#ffd700',
              fontSize: '14px',
              fontWeight: '700',
              border: '1px solid #ffd700',
              fontFamily: 'monospace',
            },
          }}
        />
      </body>
    </html>
  )
} 