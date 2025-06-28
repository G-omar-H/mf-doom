'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  CreditCard,
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Edit,
  Printer,
  Send,
  Shield,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface OrderDetail {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  status: string
  paymentStatus: string
  fulfillmentStatus: string
  totalAmount: number
  subtotal: number
  taxAmount: number
  shippingAmount: number
  discountAmount: number
  paymentMethod: string
  paypalOrderId: string | null
  paypalCaptureId: string | null
  shippingAddress: any
  billingAddress: any
  shippingMethod: string | null
  trackingNumber: string | null
  customerNotes: string | null
  notes: string | null
  tags: string[]
  createdAt: string
  updatedAt: string
  shippedAt: string | null
  deliveredAt: string | null
  orderItems: Array<{
    id: string
    quantity: number
    unitPrice: number
    totalPrice: number
    variantSelection: any
    productSnapshot: any
    product: {
      id: string
      name: string
      price: number
      images: string[]
    }
  }>
}

export default function AdminOrderDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  
  // Tracking form state
  const [showTrackingForm, setShowTrackingForm] = useState(false)
  const [trackingData, setTrackingData] = useState({
    trackingNumber: '',
    carrier: 'USPS',
    notes: ''
  })
  const [sendingTracking, setSendingTracking] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/auth/login')
      return
    }
    if (params.id) {
      fetchOrder()
    }
  }, [session, status, router, params.id])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
        // Initialize tracking form with existing data if available
        if (data.order.trackingNumber) {
          setTrackingData(prev => ({
            ...prev,
            trackingNumber: data.order.trackingNumber
          }))
        }
        if (data.order.notes) {
          setTrackingData(prev => ({
            ...prev,
            notes: data.order.notes
          }))
        }
      } else {
        toast.error('Order not found')
        router.push('/admin/orders')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      toast.error('Failed to load order')
      router.push('/admin/orders')
    } finally {
      setLoading(false)
    }
  }

  const handleSendTracking = async () => {
    if (!trackingData.trackingNumber.trim()) {
      toast.error('Please enter a tracking number')
      return
    }

    setSendingTracking(true)
    try {
      const response = await fetch('/api/paypal/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: params.id,
          trackingNumber: trackingData.trackingNumber,
          carrier: trackingData.carrier
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('🛡️ Tracking sent to PayPal! You\'re now protected from disputes')
        setShowTrackingForm(false)
        setTrackingData({ trackingNumber: '', carrier: 'USPS', notes: '' })
        fetchOrder() // Refresh order data
      } else {
        toast.error(data.error || 'Failed to send tracking to PayPal')
      }
    } catch (error) {
      console.error('Tracking error:', error)
      toast.error('Failed to send tracking information')
    } finally {
      setSendingTracking(false)
    }
  }

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return

    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success('Order status updated!')
        fetchOrder()
      } else {
        toast.error('Failed to update order status')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const updateTrackingAndNotes = async () => {
    if (!order) return

    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          trackingNumber: trackingData.trackingNumber || null,
          notes: trackingData.notes || null
        }),
      })

      if (response.ok) {
        toast.success('Order details updated!')
        fetchOrder()
      } else {
        toast.error('Failed to update order details')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

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

  if (!order) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-mf-gray mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-mf-gray mb-2">Order Not Found</h3>
          <p className="text-mf-gray mb-6">The order you're looking for doesn't exist.</p>
          <Link href="/admin/orders" className="btn-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3 md:space-x-4">
            <Link 
              href="/admin/orders"
              className="p-2 hover:bg-mf-light-gray rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl md:text-3xl font-black">Order {order.orderNumber}</h1>
              <p className="text-mf-gray mt-1 text-sm md:text-base">Order Details & Management</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <button className="btn-secondary flex items-center space-x-2 text-sm md:text-base">
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
              <span className="sm:hidden">Print</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2 text-sm md:text-base">
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Email Customer</span>
              <span className="sm:hidden">Email</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Order Details */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Order Status */}
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Order Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className={`inline-flex items-center space-x-1 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span>{order.status}</span>
                  </span>
                </div>
                <p className="text-xs md:text-sm text-mf-gray">Order Status</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className={`inline-flex items-center space-x-1 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                    order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    <CreditCard className="w-4 h-4" />
                    <span>{order.paymentStatus}</span>
                  </span>
                </div>
                <p className="text-xs md:text-sm text-mf-gray">Payment Status</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className={`inline-flex items-center space-x-1 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                    order.fulfillmentStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    <Truck className="w-4 h-4" />
                    <span>{order.fulfillmentStatus}</span>
                  </span>
                </div>
                <p className="text-xs md:text-sm text-mf-gray">Fulfillment Status</p>
              </div>
            </div>

            {/* Status Update Actions */}
            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
              <p className="text-xs md:text-sm font-medium text-mf-gray mb-2 md:mb-3">Update Order Status:</p>
              <div className="flex flex-wrap gap-1 md:gap-2">
                {['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateOrderStatus(status)}
                    className={`px-2 md:px-3 py-1 text-xs md:text-sm rounded transition-colors ${
                      order.status === status
                        ? 'bg-mf-blue text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    disabled={order.status === status}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Order Items</h3>
            <div className="space-y-3 md:space-y-4">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 md:space-x-4 p-3 md:p-4 border border-gray-200 rounded-lg">
                  <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden bg-mf-light-gray flex-shrink-0">
                    {item.product.images.length > 0 ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-4 h-4 md:w-6 md:h-6 text-mf-gray" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm md:text-base truncate">{item.product.name}</h4>
                    {item.variantSelection && (
                      <p className="text-xs md:text-sm text-mf-gray">
                        {Object.entries(item.variantSelection).map(([key, value]) => 
                          `${key}: ${value}`
                        ).join(', ')}
                      </p>
                    )}
                    <p className="text-xs md:text-sm text-mf-gray">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-sm md:text-base">${item.totalPrice.toFixed(2)}</p>
                    <p className="text-xs md:text-sm text-mf-gray">${item.unitPrice.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Shipping Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <h4 className="font-medium mb-2 flex items-center text-sm md:text-base">
                  <MapPin className="w-4 h-4 mr-2" />
                  Shipping Address
                </h4>
                <div className="text-xs md:text-sm text-mf-gray space-y-1">
                  <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                  <p>{order.shippingAddress.line1}</p>
                  {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && <p>Phone: {order.shippingAddress.phone}</p>}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center text-sm md:text-base">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Billing Address
                </h4>
                <div className="text-xs md:text-sm text-mf-gray space-y-1">
                  <p>{order.billingAddress.firstName} {order.billingAddress.lastName}</p>
                  <p>{order.billingAddress.line1}</p>
                  {order.billingAddress.line2 && <p>{order.billingAddress.line2}</p>}
                  <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}</p>
                  <p>{order.billingAddress.country}</p>
                </div>
              </div>
            </div>

            {/* Tracking & Notes */}
            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={trackingData.trackingNumber}
                    onChange={(e) => setTrackingData({...trackingData, trackingNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-mf-blue focus:outline-none text-sm md:text-base"
                    placeholder="Enter tracking number"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                    Shipping Method
                  </label>
                  <p className="px-3 py-2 bg-mf-light-gray rounded-lg text-sm md:text-base">
                    {order.shippingMethod || 'Standard Shipping'}
                  </p>
                </div>
              </div>
              
              <div className="mt-3 md:mt-4">
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Internal Notes
                </label>
                <textarea
                  value={trackingData.notes || ''}
                  onChange={(e) => setTrackingData({...trackingData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-mf-blue focus:outline-none text-sm md:text-base"
                  rows={3}
                  placeholder="Add internal notes about this order"
                />
              </div>

              <button
                onClick={updateTrackingAndNotes}
                className="mt-3 md:mt-4 bg-mf-blue text-white px-4 py-2 rounded-lg hover:bg-mf-dark-blue transition-colors text-sm md:text-base"
              >
                Update Details
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 md:space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Customer Information</h3>
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-mf-gray flex-shrink-0" />
                <span className="font-medium text-sm md:text-base">{order.customerName}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-mf-gray flex-shrink-0" />
                <span className="text-xs md:text-sm break-all">{order.customerEmail}</span>
              </div>
              {order.customerPhone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-mf-gray flex-shrink-0" />
                  <span className="text-xs md:text-sm">{order.customerPhone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Order Summary</h3>
            <div className="space-y-2 md:space-y-3 text-sm md:text-base">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${order.shippingAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${order.taxAmount.toFixed(2)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${order.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 md:pt-3 flex justify-between font-semibold text-base md:text-lg">
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Payment Information</h3>
            <div className="space-y-2 md:space-y-3 text-sm md:text-base">
              <div className="flex justify-between">
                <span>Method</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              {order.paypalOrderId && (
                <div className="text-xs md:text-sm">
                  <p className="text-mf-gray">PayPal Order ID:</p>
                  <p className="font-mono text-xs break-all">{order.paypalOrderId}</p>
                </div>
              )}
              {order.paypalCaptureId && (
                <div className="text-xs md:text-sm">
                  <p className="text-mf-gray">PayPal Capture ID:</p>
                  <p className="font-mono text-xs break-all">{order.paypalCaptureId}</p>
                </div>
              )}
            </div>
          </div>

          {/* PayPal Seller Protection */}
          {order.paymentMethod === 'paypal' && (
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <Shield className="text-blue-600" size={20} />
                <h3 className="text-base md:text-lg font-semibold">PayPal Seller Protection</h3>
              </div>
              
              {order.trackingNumber ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="text-green-600" size={16} />
                    <span className="text-sm font-medium text-green-800">Protected from disputes</span>
                  </div>
                  <div className="text-sm">
                    <p className="text-mf-gray">Tracking Number:</p>
                    <p className="font-mono text-sm break-all">{order.trackingNumber}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertCircle className="text-amber-600" size={16} />
                    <span className="text-sm font-medium text-amber-800">Add tracking to avoid disputes</span>
                  </div>
                  
                  {!showTrackingForm ? (
                    <button
                      onClick={() => setShowTrackingForm(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      Add Tracking Number
                    </button>
                  ) : (
                    <div className="space-y-3 border border-gray-200 rounded-lg p-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tracking Number *
                        </label>
                        <input
                          type="text"
                          value={trackingData.trackingNumber}
                          onChange={(e) => setTrackingData({...trackingData, trackingNumber: e.target.value})}
                          placeholder="Enter tracking number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Shipping Carrier *
                        </label>
                        <select
                          value={trackingData.carrier}
                          onChange={(e) => setTrackingData({...trackingData, carrier: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="USPS">USPS</option>
                          <option value="UPS">UPS</option>
                          <option value="FEDEX">FedEx</option>
                          <option value="DHL">DHL</option>
                          <option value="ARAMEX">Aramex</option>
                          <option value="CHRONOPOST">Chronopost</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={handleSendTracking}
                          disabled={sendingTracking || !trackingData.trackingNumber.trim()}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                        >
                          {sendingTracking ? 'Sending...' : 'Send to PayPal'}
                        </button>
                        <button
                          onClick={() => setShowTrackingForm(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        <p>✅ Automatically updates PayPal with delivery proof</p>
                        <p>✅ Protects you from "Item Not Received" disputes</p>
                        <p>✅ Qualifies for PayPal Seller Protection</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Order Timeline */}
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Order Timeline</h3>
            <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-mf-gray flex-shrink-0" />
                <div>
                  <p className="font-medium">Order Created</p>
                  <p className="text-mf-gray">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>
              {order.shippedAt && (
                <div className="flex items-center space-x-3">
                  <Truck className="w-4 h-4 text-mf-gray flex-shrink-0" />
                  <div>
                    <p className="font-medium">Shipped</p>
                    <p className="text-mf-gray">{new Date(order.shippedAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
              {order.deliveredAt && (
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Delivered</p>
                    <p className="text-mf-gray">{new Date(order.deliveredAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 