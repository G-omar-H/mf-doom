'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  Star,
  Crown,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  DollarSign,
  Package,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface UserDetail {
  id: string
  name: string
  email: string
  phone: string | null
  role: 'ADMIN' | 'CUSTOMER'
  isActive: boolean
  orderCount: number
  completedOrderCount: number
  totalSpent: number
  reviewCount: number
  addressCount: number
  createdAt: string
  orders: Array<{
    id: string
    orderNumber: string
    totalAmount: number
    status: string
    createdAt: string
  }>
  reviews: Array<{
    id: string
    rating: number
    title: string | null
    content: string
    createdAt: string
    product: {
      name: string
    }
  }>
  addresses: Array<{
    id: string
    type: string
    firstName: string
    lastName: string
    line1: string
    city: string
    state: string
    country: string
  }>
}

export default function AdminUserDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/auth/login')
      return
    }
    if (params.id) {
      fetchUser()
    }
  }, [session, status, router, params.id])

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/admin/users/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        toast.error('User not found')
        router.push('/admin/users')
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      toast.error('Failed to load user')
      router.push('/admin/users')
    } finally {
      setLoading(false)
    }
  }

  const changeUserRole = async (newRole: 'ADMIN' | 'CUSTOMER') => {
    if (!user) return
    if (user.id === session?.user?.id) {
      toast.error("You cannot change your own role")
      return
    }

    if (!confirm(`Are you sure you want to make this user ${newRole === 'ADMIN' ? 'an Admin' : 'a Customer'}?`)) return

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        toast.success(`User role updated to ${newRole}`)
        fetchUser()
      } else {
        toast.error('Failed to update user role')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const toggleUserStatus = async () => {
    if (!user) return
    if (user.id === session?.user?.id) {
      toast.error("You cannot deactivate your own account")
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !user.isActive }),
      })

      if (response.ok) {
        toast.success(`User ${!user.isActive ? 'activated' : 'deactivated'}`)
        fetchUser()
      } else {
        toast.error('Failed to update user status')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const deleteUser = async () => {
    if (!user) return
    if (user.id === session?.user?.id) {
      toast.error("You cannot delete your own account")
      return
    }

    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('User deleted successfully')
        router.push('/admin/users')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to delete user')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800'
      case 'CUSTOMER': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
  }

  const getOrderStatusColor = (status: string) => {
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

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-mf-blue border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <User className="w-16 h-16 text-mf-gray mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-mf-gray mb-2">User Not Found</h3>
          <p className="text-mf-gray mb-6">The user you're looking for doesn't exist.</p>
          <Link href="/admin/users" className="btn-primary">
            Back to Users
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
              href="/admin/users"
              className="p-2 hover:bg-mf-light-gray rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl md:text-3xl font-black">{user.name}</h1>
              <p className="text-mf-gray mt-1 text-sm md:text-base">User Profile & Activity</p>
            </div>
          </div>
          {user.id !== session?.user?.id && (
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <button
                onClick={() => changeUserRole(user.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN')}
                className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                  user.role === 'ADMIN' 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {user.role === 'ADMIN' ? (
                  <>
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Make Customer</span>
                    <span className="sm:hidden">Customer</span>
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4" />
                    <span className="hidden sm:inline">Make Admin</span>
                    <span className="sm:hidden">Admin</span>
                  </>
                )}
              </button>
              <button
                onClick={deleteUser}
                className="bg-red-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 text-sm md:text-base"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete User</span>
                <span className="sm:hidden">Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* User Information */}
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0 mb-4 md:mb-6">
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center ${
                  user.role === 'ADMIN' ? 'bg-purple-100' : 'bg-mf-blue/10'
                }`}>
                  {user.role === 'ADMIN' ? (
                    <Crown className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                  ) : (
                    <User className="w-6 h-6 md:w-8 md:h-8 text-mf-blue" />
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                    <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                    <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor(user.isActive)}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold">{user.name}</h2>
                </div>
              </div>
              {user.id !== session?.user?.id && (
                <button
                  onClick={toggleUserStatus}
                  className={`flex items-center justify-center space-x-2 px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                    user.isActive 
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {user.isActive ? (
                    <>
                      <UserX className="w-4 h-4" />
                      <span>Deactivate</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Activate</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 md:w-5 md:h-5 text-mf-gray flex-shrink-0" />
                  <div>
                    <p className="text-xs md:text-sm text-mf-gray">Email</p>
                    <p className="font-medium text-sm md:text-base break-all">{user.email}</p>
                  </div>
                </div>
                {user.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 md:w-5 md:h-5 text-mf-gray flex-shrink-0" />
                    <div>
                      <p className="text-xs md:text-sm text-mf-gray">Phone</p>
                      <p className="font-medium text-sm md:text-base">{user.phone}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 text-mf-gray flex-shrink-0" />
                  <div>
                    <p className="text-xs md:text-sm text-mf-gray">Member Since</p>
                    <p className="font-medium text-sm md:text-base">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-mf-gray flex-shrink-0" />
                  <div>
                    <p className="text-xs md:text-sm text-mf-gray">Addresses</p>
                    <p className="font-medium text-sm md:text-base">{user.addressCount} saved</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Recent Orders</h3>
            {user.orders.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {user.orders.slice(0, 10).map((order) => (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 p-3 md:p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div>
                        <p className="font-semibold text-sm md:text-base">{order.orderNumber}</p>
                        <p className="text-xs md:text-sm text-mf-gray">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-semibold text-sm md:text-base">${order.totalAmount.toFixed(2)}</p>
                      <Link 
                        href={`/admin/orders/${order.id}`}
                        className="text-xs md:text-sm text-mf-blue hover:text-mf-dark-blue"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 md:py-8">
                <ShoppingBag className="w-10 h-10 md:w-12 md:h-12 text-mf-gray mx-auto mb-3 md:mb-4" />
                <p className="text-mf-gray text-sm md:text-base">No orders yet</p>
              </div>
            )}
          </div>

          {/* Reviews */}
          {user.reviews.length > 0 && (
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Recent Reviews</h3>
              <div className="space-y-3 md:space-y-4">
                {user.reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-3 md:pb-4 last:border-b-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-2 sm:space-y-0">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 md:w-4 md:h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="font-medium text-sm md:text-base">{review.product.name}</span>
                      </div>
                      <span className="text-xs md:text-sm text-mf-gray">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.title && (
                      <h5 className="font-medium mb-1 text-sm md:text-base">{review.title}</h5>
                    )}
                    <p className="text-mf-gray text-xs md:text-sm">{review.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Addresses */}
          {user.addresses.length > 0 && (
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Saved Addresses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {user.addresses.map((address) => (
                  <div key={address.id} className="border border-gray-200 rounded-lg p-3 md:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm md:text-base">{address.firstName} {address.lastName}</span>
                      <span className="text-xs bg-mf-light-gray px-2 py-1 rounded">
                        {address.type}
                      </span>
                    </div>
                    <div className="text-xs md:text-sm text-mf-gray space-y-1">
                      <p>{address.line1}</p>
                      <p>{address.city}, {address.state}</p>
                      <p>{address.country}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 md:space-y-6">
          {/* User Statistics */}
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">User Statistics</h3>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-mf-gray">Total Spent</p>
                  <p className="text-lg md:text-2xl font-bold">${user.totalSpent.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-mf-gray">Total Orders</p>
                  <p className="text-lg md:text-2xl font-bold">{user.orderCount}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-mf-gray">Completed Orders</p>
                  <p className="text-lg md:text-2xl font-bold">{user.completedOrderCount}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-mf-gray">Reviews</p>
                  <p className="text-lg md:text-2xl font-bold">{user.reviewCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Actions - Mobile */}
          {user.id !== session?.user?.id && (
            <div className="lg:hidden bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <h3 className="text-base font-semibold mb-3">User Actions</h3>
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={toggleUserStatus}
                  className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm w-full ${
                    user.isActive 
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {user.isActive ? (
                    <>
                      <UserX className="w-4 h-4" />
                      <span>Deactivate User</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Activate User</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => changeUserRole(user.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN')}
                  className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm w-full ${
                    user.role === 'ADMIN' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {user.role === 'ADMIN' ? (
                    <>
                      <User className="w-4 h-4" />
                      <span>Make Customer</span>
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4" />
                      <span>Make Admin</span>
                    </>
                  )}
                </button>
                <button
                  onClick={deleteUser}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 text-sm w-full"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete User</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 