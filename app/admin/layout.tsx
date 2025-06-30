'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
  Tag,
  BarChart3,
  Database,
  Shield
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const adminNavItems = [
  {
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    description: 'Overview & Analytics'
  },
  {
    href: '/admin/products',
    icon: Package,
    label: 'Products',
    description: 'Manage Inventory'
  },
  {
    href: '/admin/categories',
    icon: Tag,
    label: 'Categories',
    description: 'Product Categories'
  },
  {
    href: '/admin/orders',
    icon: ShoppingCart,
    label: 'Orders',
    description: 'Order Management'
  },
  {
    href: '/admin/users',
    icon: Users,
    label: 'Users',
    description: 'Customer Management'
  },
  {
    href: '/admin/analytics',
    icon: BarChart3,
    label: 'Analytics',
    description: 'Sales & Reports'
  },
  {
    href: '/admin/inventory',
    icon: Database,
    label: 'Inventory',
    description: 'Stock Management'
  },
  {
    href: '/admin/settings',
    icon: Settings,
    label: 'Settings',
    description: 'System Configuration'
  }
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sessionChecked, setSessionChecked] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    console.log('🔍 Admin Layout - Session Check:', {
      status,
      hasSession: !!session,
      userRole: session?.user?.role,
      pathname,
      retryCount,
      isRetrying,
      timestamp: new Date().toISOString()
    })

    // Wait for session to be determined (not loading)
    if (status === 'loading') {
      console.log('⏳ Session still loading, waiting...')
      return
    }

    // Mark that we've checked the session
    setSessionChecked(true)

    // Handle unauthenticated status with retry logic
    if (status === 'unauthenticated') {
      // Check if we just came from a login (callback URL suggests recent login attempt)
      const hasCallbackUrl = pathname === '/admin/dashboard'
      
      // Retry up to 3 times with delays for session establishment
      if (hasCallbackUrl && retryCount < 3) {
        console.log(`🔄 Session unauthenticated after login, retrying... (${retryCount + 1}/3)`)
        setIsRetrying(true)
        setRetryCount(prev => prev + 1)
        
        // Wait and retry session check with forced update
        setTimeout(async () => {
          console.log('🔄 Retrying session check with forced update...')
          try {
            await update() // Force session refresh
            console.log('✅ Session update completed')
          } catch (error) {
            console.error('❌ Session update failed:', error)
          }
          setIsRetrying(false)
        }, 1000 * (retryCount + 1)) // Increasing delay: 1s, 2s, 3s
        
        return
      }
      
      // If retries exhausted or no callback URL, redirect to login
      console.warn('❌ Session unauthenticated after retries, redirecting to login')
      router.push('/auth/login?callbackUrl=' + encodeURIComponent(pathname))
      return
    }

    // Reset retry count on successful session
    if (status === 'authenticated') {
      if (retryCount > 0) {
        console.log(`✅ Session established after ${retryCount} retries`)
      }
      setRetryCount(0)
      setIsRetrying(false)
    }

    // Enhanced session validation with more detailed logging
    if (!session) {
      console.warn('❌ No session found, redirecting to login')
      router.push('/auth/login?callbackUrl=' + encodeURIComponent(pathname))
      return
    }

    if (!session.user) {
      console.warn('❌ Session has no user data, redirecting to login')
      router.push('/auth/login?callbackUrl=' + encodeURIComponent(pathname))
      return
    }

    if (session.user.role !== 'ADMIN') {
      console.warn('❌ User is not admin:', session.user.role)
      router.push('/auth/login?callbackUrl=' + encodeURIComponent(pathname))
      return
    }

    console.log('✅ Admin session validated successfully:', {
      userId: session.user.id,
      userEmail: session.user.email,
      userRole: session.user.role
    })
  }, [session, status, router, pathname, retryCount, update])

  const handleSignOut = async () => {
    console.log('🚪 Admin logout initiated')
    await signOut({ callbackUrl: '/' })
  }

  // Show loading state while session is being determined or retrying
  if (status === 'loading' || !sessionChecked || isRetrying) {
    return (
      <div className="min-h-screen bg-mf-light-gray flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size={64} />
          <p className="mt-4 text-mf-gray font-medium">
            {status === 'loading' 
              ? 'Loading admin panel...' 
              : isRetrying 
                ? `Establishing session... (${retryCount}/3)` 
                : 'Validating session...'}
          </p>
          <p className="mt-2 text-sm text-mf-gray">
            Session status: {status}
            {isRetrying && ` • Retry ${retryCount}/3`}
          </p>
        </div>
      </div>
    )
  }

  // Show nothing while redirecting (prevents flash of admin content)
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    console.log('🔄 Invalid session, redirecting...')
    return (
      <div className="min-h-screen bg-mf-light-gray flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size={48} />
          <p className="mt-4 text-mf-gray">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mf-light-gray">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link href="/admin/dashboard" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-black text-lg">ADMIN</h1>
              <p className="text-xs text-mf-gray">MF DOOM</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-mf-light-gray"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 px-4 py-6">
          <nav className="space-y-2">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-mf-blue text-white shadow-md'
                      : 'text-gray-700 hover:bg-mf-blue/10 hover:text-mf-blue'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-mf-gray group-hover:text-mf-blue'}`} />
                  <div>
                    <p className={`font-semibold ${isActive ? 'text-white' : ''}`}>{item.label}</p>
                    <p className={`text-xs ${isActive ? 'text-white/80' : 'text-mf-gray'}`}>{item.description}</p>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User info & sign out */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-mf-blue rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">{session.user.name}</p>
              <p className="text-xs text-mf-gray">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-mf-light-gray"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/"
              className="text-sm text-mf-blue hover:text-mf-dark-blue transition-colors"
            >
              ← Back to Store
            </Link>
          </div>
        </div>

        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  )
} 