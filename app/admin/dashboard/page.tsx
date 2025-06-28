'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  recentOrders: any[]
  topProducts: any[]
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user.role !== 'ADMIN') {
      router.push('/auth/login')
      return
    }

    fetchDashboardData()
  }, [session, status, router])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-mf-light-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-mf-blue border-t-transparent mx-auto mb-4"></div>
          <p className="text-mf-gray">Loading villain dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  const statCards = [
    {
      title: 'Total Villains',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'bg-green-500',
      change: '+5%'
    },
    {
      title: 'Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'bg-purple-500',
      change: '+18%'
    },
    {
      title: 'Revenue',
      value: `$${stats?.totalRevenue?.toLocaleString() || '0'}`,
      icon: DollarSign,
      color: 'bg-mf-blue',
      change: '+24%'
    }
  ]

  return (
    <div className="min-h-screen bg-mf-light-gray">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black">VILLAIN COMMAND CENTER</h1>
              <p className="text-mf-gray mt-1">
                Welcome back, {session.user.name} - Managing the MF DOOM empire
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/products/new"
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-600 text-sm font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-mf-gray text-sm">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Management Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
            <div className="space-y-4">
              {[
                { title: 'Add Product', href: '/admin/products/new', icon: Plus, desc: 'Create new villain merchandise', color: 'bg-green-500' },
                { title: 'Manage Products', href: '/admin/products', icon: Package, desc: 'Edit and organize merchandise', color: 'bg-blue-500' },
                { title: 'View Orders', href: '/admin/orders', icon: ShoppingCart, desc: 'Process customer orders', color: 'bg-purple-500' },
                { title: 'Analytics Dashboard', href: '/admin/analytics', icon: TrendingUp, desc: 'Detailed sales analytics', color: 'bg-mf-blue' },
                { title: 'User Management', href: '/admin/users', icon: Users, desc: 'Manage villain collective', color: 'bg-yellow-500' }
              ].map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="flex items-center p-4 rounded-lg border-2 border-transparent hover:border-mf-blue hover:bg-mf-blue/5 transition-all duration-200 group"
                >
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-110`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold">{action.title}</p>
                    <p className="text-sm text-mf-gray">{action.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Analytics Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-mf-blue/10 to-mf-blue/20 rounded-xl shadow-sm p-6 border border-mf-blue/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Analytics Overview</h2>
              <Link 
                href="/admin/analytics"
                className="text-mf-blue hover:text-mf-dark-blue font-medium flex items-center text-sm"
              >
                View Full Analytics <TrendingUp className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Revenue</span>
                </div>
                <p className="text-2xl font-bold text-green-600">${stats?.totalRevenue?.toLocaleString() || '0'}</p>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +24% from last month
                </p>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Orders</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{stats?.totalOrders || 0}</p>
                <p className="text-xs text-blue-500 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +18% from last month
                </p>
              </div>
            </div>

            {/* Mini Revenue Chart */}
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Revenue Trend</h3>
              <div className="flex items-end space-x-1 h-16">
                {[12, 19, 15, 25, 22, 30, 28, 35, 42, 38, 45, 52].map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-mf-blue rounded-t transition-all duration-300 hover:bg-mf-dark-blue"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Last 12 months</span>
                <span>Trending ↗</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Top Products Preview */}
        {stats?.topProducts && stats.topProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mt-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Top Performing Products</h2>
              <Link 
                href="/admin/products"
                className="text-mf-blue hover:text-mf-dark-blue font-medium flex items-center text-sm"
              >
                Manage Products <Package className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.topProducts.slice(0, 6).map((product, index) => (
                <div key={product.id} className="bg-mf-light-gray rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-8 h-8 bg-mf-blue rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-xs text-green-600 font-semibold">
                      ${product.revenue.toLocaleString()}
                    </span>
                  </div>
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-mf-gray">{product.totalSales} sold</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
} 