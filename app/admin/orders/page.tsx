'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  DollarSign,
  Calendar,
  Download,
  Mail,
  Phone,
  User,
  MapPin,
  Plus,
  Shield
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Image from 'next/image'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  status: string
  paymentStatus: string
  fulfillmentStatus: string
  totalAmount: number
  subtotal: number
  taxAmount: number
  shippingAmount: number
  paymentMethod: string
  shippingAddress: any
  billingAddress: any
  trackingNumber: string | null
  createdAt: string
  updatedAt: string
  orderItems: Array<{
    id: string
    quantity: number
    unitPrice: number
    totalPrice: number
    product: {
      id: string
      name: string
      images: string[]
    }
  }>
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
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success(`Order status updated to ${newStatus}`)
        fetchOrders()
      } else {
        toast.error('Failed to update order status')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selectedOrders.length === 0) {
      toast.error('Please select orders first')
      return
    }

    if (!confirm(`Are you sure you want to update ${selectedOrders.length} orders to ${newStatus}?`)) return

    try {
      const promises = selectedOrders.map(orderId =>
        fetch(`/api/admin/orders/${orderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        })
      )

      await Promise.all(promises)
      toast.success(`${selectedOrders.length} orders updated to ${newStatus}`)
      setSelectedOrders([])
      fetchOrders()
    } catch (error) {
      toast.error('Failed to update orders')
    }
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
      case 'CANCELLED': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-mf-light-gray flex items-center justify-center">
        <LoadingSpinner size={64} text="Loading orders..." />
      </div>
    )
  }

  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length
  const processingOrders = orders.filter(o => o.status === 'PROCESSING').length
  const shippedOrders = orders.filter(o => o.status === 'SHIPPED').length
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-black">ORDER MANAGEMENT</h1>
            <p className="text-mf-gray mt-1">Track and manage villain collective orders</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="btn-secondary flex items-center space-x-2 text-sm md:text-base">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export Orders</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-3 md:p-6">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-mf-blue/10 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 md:w-6 md:h-6 text-mf-blue" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-mf-gray">Total Orders</p>
              <p className="text-lg md:text-2xl font-bold">{totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-3 md:p-6">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 md:w-6 md:h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-mf-gray">Pending</p>
              <p className="text-lg md:text-2xl font-bold">{pendingOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-3 md:p-6">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 md:w-6 md:h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-mf-gray">Processing</p>
              <p className="text-lg md:text-2xl font-bold">{processingOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-3 md:p-6">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Truck className="w-4 h-4 md:w-6 md:h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-mf-gray">Shipped</p>
              <p className="text-lg md:text-2xl font-bold">{shippedOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-3 md:p-6 col-span-2 sm:col-span-1">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-mf-gray">Revenue</p>
              <p className="text-lg md:text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
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
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PayPal Protection
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="relative px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.orderItems?.length || 0} items
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.user?.name || 'Guest'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user?.email || order.guestEmail}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  
                  <td className="px-4 py-4">
                    {order.paymentMethod === 'paypal' ? (
                      <div className="flex items-center gap-2">
                        {order.trackingNumber ? (
                          <>
                            <CheckCircle className="text-green-500" size={16} />
                            <span className="text-xs text-green-700 font-medium">Protected</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="text-amber-500" size={16} />
                            <span className="text-xs text-amber-700 font-medium">Needs Tracking</span>
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">N/A</span>
                    )}
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      ${Number(order.totalAmount).toFixed(2)}
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 text-right">
                    <Link 
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <Eye size={14} />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-mf-gray mx-auto mb-4" />
            <p className="text-mf-gray text-lg mb-2">No orders found</p>
            <p className="text-sm text-mf-gray">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Orders - Mobile Card View */}
      <div className="lg:hidden">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 text-center py-12">
            <Package className="w-12 h-12 text-mf-gray mx-auto mb-4" />
            <p className="text-mf-gray text-lg mb-2">No orders found</p>
            <p className="text-sm text-mf-gray">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
              >
                {/* Order Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOrders([...selectedOrders, order.id])
                        } else {
                          setSelectedOrders(selectedOrders.filter(id => id !== order.id))
                        }
                      }}
                      className="w-4 h-4 mt-1"
                    />
                    <div>
                      <p className="font-semibold text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-mf-gray">{order.orderItems.length} items</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold">${order.totalAmount.toFixed(2)}</span>
                </div>

                {/* Customer Info */}
                <div className="mb-3">
                  <p className="font-medium text-sm">{order.customerName}</p>
                  <p className="text-xs text-mf-gray">{order.customerEmail}</p>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span>{order.status}</span>
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>

                {/* Date and Actions */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-mf-gray">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="p-2 hover:bg-mf-blue/10 text-mf-blue rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    
                    {order.status !== 'DELIVERED' && (
                      <>
                        {order.status === 'PENDING' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'CONFIRMED')}
                            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                            title="Confirm Order"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {(order.status === 'CONFIRMED' || order.status === 'PENDING') && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'PROCESSING')}
                            className="p-2 hover:bg-purple-100 text-purple-600 rounded-lg transition-colors"
                            title="Start Processing"
                          >
                            <Package className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === 'PROCESSING' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
                            className="p-2 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"
                            title="Mark as Shipped"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 