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
  MapPin
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Image from 'next/image'

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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-mf-blue border-t-transparent"></div>
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
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black">ORDER MANAGEMENT</h1>
            <p className="text-mf-gray mt-1">Track and manage villain collective orders</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Orders</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-mf-blue/10 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-mf-blue" />
            </div>
            <div>
              <p className="text-sm text-mf-gray">Total Orders</p>
              <p className="text-2xl font-bold">{totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-mf-gray">Pending</p>
              <p className="text-2xl font-bold">{pendingOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-mf-gray">Processing</p>
              <p className="text-2xl font-bold">{processingOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-mf-gray">Shipped</p>
              <p className="text-2xl font-bold">{shippedOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-mf-gray">Revenue</p>
              <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mf-gray w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors"
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
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors"
          >
            <option value="ALL">All Payment</option>
            <option value="PENDING">Payment Pending</option>
            <option value="PAID">Paid</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          <div className="flex items-center justify-center bg-mf-light-gray rounded-lg px-4 py-3">
            <span className="font-semibold">{filteredOrders.length} Orders</span>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <div className="flex items-center space-x-4 p-4 bg-mf-blue/10 rounded-lg">
            <span className="text-sm font-medium">{selectedOrders.length} selected</span>
            <button
              onClick={() => handleBulkStatusUpdate('CONFIRMED')}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Confirm
            </button>
            <button
              onClick={() => handleBulkStatusUpdate('PROCESSING')}
              className="text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
            >
              Process
            </button>
            <button
              onClick={() => handleBulkStatusUpdate('SHIPPED')}
              className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
            >
              Ship
            </button>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-mf-light-gray">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders(filteredOrders.map(o => o.id))
                      } else {
                        setSelectedOrders([])
                      }
                    }}
                    className="w-4 h-4"
                  />
                </th>
                <th className="px-6 py-4 text-left font-semibold">Order</th>
                <th className="px-6 py-4 text-left font-semibold">Customer</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Payment</th>
                <th className="px-6 py-4 text-left font-semibold">Total</th>
                <th className="px-6 py-4 text-left font-semibold">Date</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-mf-blue/5 transition-colors"
                >
                  <td className="px-6 py-4">
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
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold">{order.orderNumber}</p>
                      <p className="text-sm text-mf-gray">{order.orderItems.length} items</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold">{order.customerName}</p>
                      <p className="text-sm text-mf-gray">{order.customerEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>{order.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="p-2 hover:bg-mf-blue/10 text-mf-blue rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      
                      {order.status !== 'DELIVERED' && (
                        <div className="flex items-center space-x-1">
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
                        </div>
                      )}
                    </div>
                  </td>
                </motion.tr>
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
    </div>
  )
} 