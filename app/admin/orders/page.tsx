'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search,
  Filter,
  Eye,
  ShoppingCart,
  User,
  Calendar,
  DollarSign,
  Package,
  MoreHorizontal,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useOptimisticUpdate } from '@/lib/hooks/useOptimisticUpdate'

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  totalAmount: number
  customerName: string
  customerEmail: string
  createdAt: string
  itemCount: number
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [paymentFilter, setPaymentFilter] = useState('ALL')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  // Optimistic updates hook
  const { updateItem, bulkUpdate, loading: optimisticLoading } = useOptimisticUpdate(orders, setOrders)

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/auth/login')
      return
    }
    fetchOrders()
  }, [session, status, router])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    await updateItem(
      orderId,
      (order) => ({ ...order, status: newStatus }),
      () => fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      }),
      {
        successMessage: `Order status updated to ${newStatus}`,
        errorMessage: 'Failed to update order status'
      }
    )
  }

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selectedOrders.length === 0) {
      toast.error('Please select orders first')
      return
    }

    if (!confirm(`Are you sure you want to update ${selectedOrders.length} orders to ${newStatus}?`)) return

    await bulkUpdate(
      selectedOrders,
      (order) => ({ ...order, status: newStatus }),
      async () => {
        const promises = selectedOrders.map(orderId =>
          fetch(`/api/admin/orders/${orderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
          })
        )
        return Promise.all(promises)
      },
      {
        successMessage: `${selectedOrders.length} orders updated to ${newStatus}`,
        errorMessage: 'Failed to update orders'
      }
    )

    setSelectedOrders([])
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter
    const matchesPayment = paymentFilter === 'ALL' || order.paymentStatus === paymentFilter
    
    return matchesSearch && matchesStatus && matchesPayment
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
      case 'PROCESSING': return 'bg-purple-100 text-purple-800'
      case 'SHIPPED': return 'bg-indigo-100 text-indigo-800'
      case 'DELIVERED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4" />
      case 'CONFIRMED': return <CheckCircle className="w-4 h-4" />
      case 'PROCESSING': return <Package className="w-4 h-4" />
      case 'SHIPPED': return <Truck className="w-4 h-4" />
      case 'DELIVERED': return <CheckCircle className="w-4 h-4" />
      case 'CANCELLED': return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      case 'REFUNDED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-mf-light-gray flex items-center justify-center">
        <LoadingSpinner size={64} text="Loading orders..." />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-black">ORDER MANAGEMENT</h1>
            <p className="text-mf-gray mt-1 text-sm md:text-base">Manage customer orders and fulfillment</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-mf-light-gray rounded-lg px-4 py-2">
              <span className="font-semibold text-sm md:text-base">{filteredOrders.length} Orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 mb-4">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mf-gray w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors text-sm md:text-base"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors text-sm md:text-base"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors text-sm md:text-base"
          >
            <option value="ALL">All Payment</option>
            <option value="PENDING">Payment Pending</option>
            <option value="PAID">Paid</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          <div className="flex items-center justify-center bg-mf-light-gray rounded-lg px-3 md:px-4 py-2 md:py-3">
            <span className="font-semibold text-sm md:text-base">{filteredOrders.length} Orders</span>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 md:p-4 bg-mf-blue/10 rounded-lg">
            <span className="text-sm font-medium">{selectedOrders.length} selected</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleBulkStatusUpdate('CONFIRMED')}
                className="text-xs md:text-sm bg-blue-600 text-white px-2 md:px-3 py-1 rounded hover:bg-blue-700"
              >
                Confirm
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('PROCESSING')}
                className="text-xs md:text-sm bg-purple-600 text-white px-2 md:px-3 py-1 rounded hover:bg-purple-700"
              >
                Process
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('SHIPPED')}
                className="text-xs md:text-sm bg-indigo-600 text-white px-2 md:px-3 py-1 rounded hover:bg-indigo-700"
              >
                Ship
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Orders - Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-mf-light-gray">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders(filteredOrders.map(order => order.id))
                      } else {
                        setSelectedOrders([])
                      }
                    }}
                    className="w-4 h-4 text-mf-blue bg-gray-100 border-gray-300 rounded focus:ring-mf-blue focus:ring-2"
                  />
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Order Number</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Payment</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Total</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className={`border-b border-gray-100 hover:bg-mf-light-gray/50 transition-colors ${
                    optimisticLoading[order.id] ? 'opacity-75' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOrders(prev => [...prev, order.id])
                        } else {
                          setSelectedOrders(prev => prev.filter(id => id !== order.id))
                        }
                      }}
                      className="w-4 h-4 text-mf-blue bg-gray-100 border-gray-300 rounded focus:ring-mf-blue focus:ring-2"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-mf-blue hover:text-mf-dark-blue"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-sm">{order.customerName}</div>
                      <div className="text-xs text-mf-gray">{order.customerEmail}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span>{order.status}</span>
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium">${order.totalAmount}</td>
                  <td className="py-3 px-4 text-sm text-mf-gray">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-mf-blue hover:text-mf-dark-blue"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        disabled={optimisticLoading[order.id]}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:border-mf-blue focus:outline-none disabled:opacity-50"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Orders - Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredOrders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 ${
              optimisticLoading[order.id] ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedOrders(prev => [...prev, order.id])
                    } else {
                      setSelectedOrders(prev => prev.filter(id => id !== order.id))
                    }
                  }}
                  className="mt-1 w-4 h-4 text-mf-blue bg-gray-100 border-gray-300 rounded focus:ring-mf-blue focus:ring-2"
                />
                <div>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-semibold text-mf-blue hover:text-mf-dark-blue"
                  >
                    {order.orderNumber}
                  </Link>
                  <div className="text-sm text-mf-gray mt-1">{order.customerName}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">${order.totalAmount}</div>
                <div className="text-xs text-mf-gray">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span>{order.status}</span>
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <Link
                href={`/admin/orders/${order.id}`}
                className="text-mf-blue hover:text-mf-dark-blue"
              >
                <Eye className="w-5 h-5" />
              </Link>
            </div>

            <select
              value={order.status}
              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
              disabled={optimisticLoading[order.id]}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:border-mf-blue focus:outline-none disabled:opacity-50"
            >
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && !loading && (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-mf-gray mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-mf-gray mb-2">No orders found</h3>
          <p className="text-mf-gray">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
} 