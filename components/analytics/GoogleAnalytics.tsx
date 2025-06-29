'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'

// Google Analytics 4 Configuration
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

// Initialize gtag function
export function gtag(...args: any[]) {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push(arguments)
  }
}

// Track page views
export function trackPageView(url: string) {
  if (GA_MEASUREMENT_ID) {
    gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      // Enable enhanced measurement for better geo data
      enhanced_measurement: true,
      // Track user engagement
      engagement_time_msec: 100,
    })
  }
}

// Track custom events
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (GA_MEASUREMENT_ID) {
    gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Track e-commerce events
export function trackPurchase(transactionId: string, value: number, currency: string = 'USD', items: any[] = []) {
  if (GA_MEASUREMENT_ID) {
    gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items,
    })
  }
}

// Track product views
export function trackProductView(productId: string, productName: string, category: string, price: number) {
  if (GA_MEASUREMENT_ID) {
    gtag('event', 'view_item', {
      currency: 'USD',
      value: price,
      items: [{
        item_id: productId,
        item_name: productName,
        item_category: category,
        price: price,
        quantity: 1
      }]
    })
  }
}

// Track add to cart
export function trackAddToCart(productId: string, productName: string, category: string, price: number, quantity: number = 1) {
  if (GA_MEASUREMENT_ID) {
    gtag('event', 'add_to_cart', {
      currency: 'USD',
      value: price * quantity,
      items: [{
        item_id: productId,
        item_name: productName,
        item_category: category,
        price: price,
        quantity: quantity
      }]
    })
  }
}

// Main Google Analytics Component
export function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track page views on route changes
  useEffect(() => {
    if (GA_MEASUREMENT_ID) {
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
      trackPageView(url)
    }
  }, [pathname, searchParams])

  // Don't render in development unless explicitly enabled
  if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_GA_DEBUG) {
    return null
  }

  // Don't render if no measurement ID
  if (!GA_MEASUREMENT_ID) {
    return null
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        async
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // Configure Google Analytics with enhanced settings
            gtag('config', '${GA_MEASUREMENT_ID}', {
              // Enhanced measurement for automatic event tracking
              enhanced_measurement: true,
              
              // Enable advertising features for demographics
              allow_google_signals: true,
              
              // Enable enhanced e-commerce
              enable_enhanced_ecommerce: true,
              
              // Custom parameters for better tracking
              custom_map: {
                'villain_theme': 'doom_theme',
                'product_category': 'mf_doom_category'
              },
              
              // Page performance tracking
              page_title: document.title,
              page_location: window.location.href,
              
              // User engagement tracking
              engagement_time_msec: 100,
              
              // Debug mode for development
              debug_mode: ${process.env.NODE_ENV === 'development' ? 'true' : 'false'}
            });
            
            // Track initial page load
            gtag('event', 'page_view', {
              page_title: document.title,
              page_location: window.location.href,
              content_group1: 'MF DOOM Shop',
              content_group2: window.location.pathname,
            });
            
            // Track user engagement
            gtag('event', 'user_engagement', {
              engagement_time_msec: 100
            });
          `,
        }}
      />
    </>
  )
} 