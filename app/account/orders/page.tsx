'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  DollarSign, 
  Eye, 
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronRight
} from 'lucide-react'
import { formatPrice } from '@/lib/utils/formatters'
import Image from 'next/image'
import Link from 'next/link'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface Order {
  id: string
  orderNumber: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  createdAt: string
  items: OrderItem[]
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    zip: string
  }
}

const statusConfig = {
  pending: { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock },
  confirmed: { color: 'text-blue-600', bg: 'bg-blue-100', icon: CheckCircle },
  processing: { color: 'text-purple-600', bg: 'bg-purple-100', icon: RefreshCw },
  shipped: { color: 'text-indigo-600', bg: 'bg-indigo-100', icon: Truck },
  delivered: { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle },
  cancelled: { color: 'text-red-600', bg: 'bg-red-100', icon: XCircle }
}

export default function OrderHistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/login')
      return
    }
    fetchOrders()
  }, [session, status, router])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          {/* Spinning DOOM Mask GIF */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4">
            <Image
              src="/icons/mfdoomcask.gif"
              alt="Loading..."
              width={64}
              height={64}
              className="w-full h-full"
              unoptimized
            />
          </div>
          <p className="text-gray-600 font-medium text-sm sm:text-base">Loading villain orders...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <Link 
            href="/account/profile"
            className="inline-flex items-center gap-2 text-mf-blue hover:text-mf-dark-blue transition-colors mb-4 sm:mb-6 touch-manipulation"
          >
            <ArrowLeft size={20} />
            <span className="text-sm sm:text-base">Back to Profile</span>
          </Link>
          
          <div className="flex items-center gap-3 sm:gap-4 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">VILLAIN ORDERS</h1>
              <p className="text-gray-600 text-sm sm:text-base">Track your collective purchases</p>
            </div>
          </div>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center"
          >
            <Package size={48} className="text-gray-300 mx-auto mb-4 sm:mb-6 sm:w-16 sm:h-16" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Start building your villain collection</p>
            <Link href="/">
              <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors touch-manipulation">
                Continue Shopping
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {orders.map((order, index) => {
              const StatusIcon = statusConfig[order.status].icon
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-4 sm:p-6 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3 sm:gap-0">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                          Order #{order.orderNumber}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} className="sm:w-4 sm:h-4" />
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign size={14} className="sm:w-4 sm:h-4" />
                            <span className="font-semibold">{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                        <div className={`flex items-center justify-center sm:justify-start gap-2 px-3 py-2 sm:py-1 rounded-full ${statusConfig[order.status].bg}`}>
                          <StatusIcon size={14} className={`${statusConfig[order.status].color} sm:w-4 sm:h-4`} />
                          <span className={`text-xs sm:text-sm font-medium ${statusConfig[order.status].color}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        
                        <Link href={`/account/orders/${order.id}`} className="flex-shrink-0">
                          <button className="w-full sm:w-auto flex items-center justify-center gap-2 text-mf-blue hover:text-mf-dark-blue transition-colors py-2 px-3 sm:py-1 sm:px-0 rounded-lg sm:rounded-none bg-mf-blue/5 sm:bg-transparent touch-manipulation">
                            <Eye size={14} className="sm:w-4 sm:h-4" />
                            <span className="text-xs sm:text-sm font-medium">View Details</span>
                            <ChevronRight size={14} className="sm:w-4 sm:h-4 sm:hidden" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 sm:p-6">
                    <div className="space-y-3 sm:space-y-4">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={16} className="text-gray-400 sm:w-6 sm:h-6" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 sm:line-clamp-1">{item.name}</h4>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-xs sm:text-sm text-gray-600">Qty: {item.quantity}</p>
                              <p className="font-bold text-gray-900 text-sm sm:text-base">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {order.items.length > 3 && (
                        <div className="text-center py-2">
                          <Link href={`/account/orders/${order.id}`}>
                            <button className="text-mf-blue hover:text-mf-dark-blue text-sm font-medium">
                              +{order.items.length - 3} more items
                            </button>
                          </Link>
                        </div>
                      )}
                    </div>
                    
                    {/* Shipping Address */}
                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
                      <h5 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Shipping To:</h5>
                      <div className="text-xs sm:text-sm text-gray-700 space-y-1">
                        <p className="font-medium">{order.shippingAddress.name}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Bottom Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 sm:mt-12"
        >
          <p className="text-xs sm:text-sm text-gray-600 italic">
            "Just remember ALL CAPS when you spell the man name"
          </p>
        </motion.div>
      </div>
    </div>
  )
} 