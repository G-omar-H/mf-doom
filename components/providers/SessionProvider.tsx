'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { ReactNode, useEffect } from 'react'

interface SessionProviderProps {
  children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  useEffect(() => {
    // Enhanced session debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🎫 SessionProvider initialized with enhanced sync settings')
      
      // Listen for custom session events
      const handleSessionUpdate = (event: CustomEvent) => {
        console.log('🔄 Custom session update event:', event.detail)
      }
      
      const handleSessionError = (event: CustomEvent) => {
        console.error('❌ Session error event:', event.detail)
      }
      
      window.addEventListener('session:update', handleSessionUpdate as EventListener)
      window.addEventListener('session:error', handleSessionError as EventListener)
      
      return () => {
        window.removeEventListener('session:update', handleSessionUpdate as EventListener)
        window.removeEventListener('session:error', handleSessionError as EventListener)
      }
    }
  }, [])

  return (
    <NextAuthSessionProvider
      refetchInterval={60} // 1 minute for immediate sync
      refetchOnWindowFocus={true} // Refetch when window gains focus
      refetchWhenOffline={false} // Don't refetch when offline
      basePath="/api/auth"
    >
      {children}
    </NextAuthSessionProvider>
  )
} 