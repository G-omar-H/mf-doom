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
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user.role !== 'ADMIN') {
      router.push('/auth/login')
      return
    }
  }, [session, status, router])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-mf-light-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-mf-blue border-t-transparent mx-auto mb-4"></div>
          <p className="text-mf-gray">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
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