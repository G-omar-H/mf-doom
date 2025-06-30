'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { ReactNode, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface SessionProviderProps {
  children: ReactNode
}

// Debug component to monitor session changes
function SessionDebugger() {
  const { data: session, status } = useSession()
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🎫 Session State Change:', {
        status,
        hasSession: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        userRole: session?.user?.role,
        timestamp: new Date().toISOString(),
        sessionExpires: session?.expires
      })
    }
  }, [session, status])

  return null // This component doesn't render anything
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
      refetchInterval={30} // Reduced to 30 seconds for faster debugging
      refetchOnWindowFocus={true} // Refetch when window gains focus
      refetchWhenOffline={false} // Don't refetch when offline
      basePath="/api/auth"
    >
      {process.env.NODE_ENV === 'development' && <SessionDebugger />}
      {children}
    </NextAuthSessionProvider>
  )
} 