'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Database, 
  Trash2, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  Users,
  ShoppingCart,
  Star,
  BarChart3,
  RefreshCw,
  Tag,
  Activity
} from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface DatabaseCounts {
  orders: number
  orderItems: number
  users: number
  reviews: number
  salesAnalytics: number
  visitorAnalytics: number
  productViews: number
  wishlistItems: number
  products: number
  inventory: number
  addresses: number
  discountCodes: number
  orderDiscountCodes: number
}

interface DatabaseInspection {
  counts: DatabaseCounts
  samples: {
    orders: any[]
    users: any[]
    reviews: any[]
    discountCodes: any[]
  }
}

export default function AdminCleanupPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [inspection, setInspection] = useState<DatabaseInspection | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/auth/login')
      return
    }
    inspectDatabase()
  }, [session, status, router])

  const inspectDatabase = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/cleanup')
      
      if (response.ok) {
        const data = await response.json()
        setInspection(data.data)
      } else {
        toast.error('Failed to inspect database')
      }
    } catch (error) {
      console.error('Error inspecting database:', error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const runCleanup = async (action: string, description: string) => {
    if (!confirm(`Are you sure you want to ${description}?\n\nThis action cannot be undone!`)) {
      return
    }

    try {
      setActionLoading(action)
      const response = await fetch('/api/admin/cleanup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action,
          confirm: 'DELETE_CONFIRMED'
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        toast.success(data.message)
        console.log('Cleanup summary:', data.summary)
        // Refresh inspection
        await inspectDatabase()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Cleanup failed')
      }
    } catch (error) {
      console.error('Error during cleanup:', error)
      toast.error('Something went wrong')
    } finally {
      setActionLoading(null)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-mf-light-gray flex items-center justify-center">
        <LoadingSpinner size={64} text="Loading database inspector..." />
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  const cleanupActions = [
    {
      id: 'ORDERS_ONLY',
      title: 'Delete Orders Only',
      description: 'Remove all orders and order items',
      icon: ShoppingCart,
      color: 'bg-blue-500',
      risk: 'medium'
    },
    {
      id: 'REVIEWS_ONLY', 
      title: 'Delete Reviews Only',
      description: 'Remove all product reviews',
      icon: Star,
      color: 'bg-green-500',
      risk: 'low'
    },
    {
      id: 'ANALYTICS_ONLY',
      title: 'Delete Analytics Only', 
      description: 'Remove all analytics and tracking data (includes visitor tracking)',
      icon: BarChart3,
      color: 'bg-purple-500',
      risk: 'low'
    },
    {
      id: 'VISITOR_ANALYTICS_ONLY',
      title: 'Reset Visitor Tracking', 
      description: 'Clear visitor analytics only (fixes misleading "Active" count)',
      icon: Activity,
      color: 'bg-indigo-500',
      risk: 'low'
    },
    {
      id: 'TEST_USERS_ONLY',
      title: 'Delete Test Users',
      description: 'Remove users with test/demo email patterns',
      icon: Users,
      color: 'bg-yellow-500',
      risk: 'medium'
    },
    {
      id: 'ALL_TRANSACTIONAL_DATA',
      title: 'Delete All Transactional Data',
      description: 'Remove orders, reviews, analytics (keep products)',
      icon: Database,
      color: 'bg-orange-500',
      risk: 'high'
    },
    {
      id: 'NUCLEAR_OPTION',
      title: '☢️ Nuclear Option',
      description: 'Delete EVERYTHING except products and admin users',
      icon: AlertTriangle,
      color: 'bg-red-500',
      risk: 'extreme'
    }
  ]

  return (
    <div className="min-h-screen bg-mf-light-gray">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black">DATABASE CLEANUP</h1>
              <p className="text-mf-gray mt-1">
                Prepare for production by cleaning test data from Supabase
              </p>
            </div>
            <button
              onClick={inspectDatabase}
              disabled={loading}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Database Overview */}
        {inspection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Database className="w-6 h-6 text-mf-blue" />
              <h2 className="text-xl font-bold">Current Database State</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <ShoppingCart className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{inspection.counts.orders}</div>
                <div className="text-sm text-blue-600">Orders</div>
                <div className="text-xs text-gray-500">{inspection.counts.orderDiscountCodes} discount codes</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{inspection.counts.users}</div>
                <div className="text-sm text-green-600">Users</div>
                <div className="text-xs text-gray-500">{inspection.counts.addresses} addresses</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <Star className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">{inspection.counts.reviews}</div>
                <div className="text-sm text-purple-600">Reviews</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <BarChart3 className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">
                  {inspection.counts.salesAnalytics + inspection.counts.visitorAnalytics + inspection.counts.productViews}
                </div>
                <div className="text-sm text-orange-600">Analytics</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <Tag className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">{inspection.counts.discountCodes}</div>
                <div className="text-sm text-yellow-600">Discounts</div>
                <div className="text-xs text-gray-500">{inspection.counts.wishlistItems} wishlist</div>
              </div>
              <div className="bg-mf-blue/10 p-4 rounded-lg text-center">
                <Database className="w-6 h-6 text-mf-blue mx-auto mb-2" />
                <div className="text-2xl font-bold text-mf-blue">{inspection.counts.products}</div>
                <div className="text-sm text-mf-blue">Products</div>
                <div className="text-xs text-gray-500">{inspection.counts.inventory} inventory</div>
              </div>
            </div>

            {/* Sample Data Preview */}
            <div className="space-y-4">
              <h3 className="font-semibold">Sample Data Preview:</h3>
              
              {inspection.samples.users.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Users:</h4>
                  <div className="bg-gray-50 p-3 rounded text-xs">
                    {inspection.samples.users.map((user: any) => (
                      <div key={user.id} className="mb-1">
                        <strong>{user.email}</strong> - {user.name} ({user.role}) - {new Date(user.createdAt).toLocaleDateString()}
                        {user._count && (
                          <div className="text-gray-500 ml-2">
                            Orders: {user._count.orders}, Reviews: {user._count.reviews}, 
                            Wishlist: {user._count.wishlist}, Addresses: {user._count.addresses}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {inspection.samples.orders.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Orders:</h4>
                  <div className="bg-gray-50 p-3 rounded text-xs">
                    {inspection.samples.orders.map((order: any) => (
                      <div key={order.id} className="mb-1">
                        <strong>{order.orderNumber}</strong> - ${order.totalAmount} ({order.status}) - {new Date(order.createdAt).toLocaleDateString()}
                        {order.user && ` - ${order.user.email}`}
                        {order.guestEmail && ` - Guest: ${order.guestEmail}`}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {inspection.samples.discountCodes && inspection.samples.discountCodes.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Discount Codes:</h4>
                  <div className="bg-gray-50 p-3 rounded text-xs">
                    {inspection.samples.discountCodes.map((code: any) => (
                      <div key={code.id} className="mb-1">
                        <strong>{code.code}</strong> - {code.name} ({code.type}) - Used: {code.usedCount} times
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Cleanup Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Trash2 className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold">Cleanup Actions</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cleanupActions.map((action) => (
              <div key={action.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded ${
                    action.risk === 'low' ? 'bg-green-100 text-green-800' :
                    action.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    action.risk === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {action.risk.toUpperCase()} RISK
                  </span>
                  
                  <button
                    onClick={() => runCleanup(action.id, action.description)}
                    disabled={actionLoading === action.id}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      action.risk === 'extreme' 
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : action.risk === 'high'
                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                        : 'bg-gray-600 text-white hover:bg-gray-700'
                    } disabled:opacity-50`}
                  >
                    {actionLoading === action.id ? 'Running...' : 'Execute'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800">⚠️ Important Warning</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  These actions permanently delete data from your Supabase production database. 
                  Make sure you have backups if needed. Products and admin users are preserved in most actions.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800">📊 Visitor Analytics Note</h4>
                <p className="text-sm text-blue-700 mt-1">
                  If your "Active (5min)" visitor count shows numbers but Vercel Analytics shows 0, 
                  there's likely test visitor tracking data in your database. Use "Reset Visitor Tracking" 
                  to clear this test data and get accurate real-time visitor counts.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 