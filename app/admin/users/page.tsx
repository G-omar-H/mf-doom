'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search,
  Filter,
  Users,
  Shield,
  Ban,
  Mail,
  Calendar,
  ShoppingBag,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Crown,
  User
} from 'lucide-react'
import toast from 'react-hot-toast'

interface AdminUser {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'CUSTOMER'
  isActive: boolean
  orderCount: number
  totalSpent: number
  lastOrderDate: string | null
  createdAt: string
  phone?: string
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/auth/login')
      return
    }
    fetchUsers()
  }, [session, status, router])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    if (userId === session?.user?.id) {
      toast.error("You cannot deactivate your own account")
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}`)
        fetchUsers()
      } else {
        toast.error('Failed to update user status')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const changeUserRole = async (userId: string, newRole: 'ADMIN' | 'CUSTOMER') => {
    if (userId === session?.user?.id) {
      toast.error("You cannot change your own role")
      return
    }

    if (!confirm(`Are you sure you want to make this user ${newRole === 'ADMIN' ? 'an Admin' : 'a Customer'}?`)) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        toast.success(`User role updated to ${newRole}`)
        fetchUsers()
      } else {
        toast.error('Failed to update user role')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const deleteUser = async (userId: string) => {
    if (userId === session?.user?.id) {
      toast.error("You cannot delete your own account")
      return
    }

    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('User deleted successfully')
        fetchUsers()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to delete user')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter
    const matchesStatus = statusFilter === 'ALL' || 
      (statusFilter === 'ACTIVE' && user.isActive) ||
      (statusFilter === 'INACTIVE' && !user.isActive)
    
    return matchesSearch && matchesRole && matchesStatus
  })

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

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-mf-blue border-t-transparent"></div>
      </div>
    )
  }

  const totalUsers = users.length
  const adminUsers = users.filter(u => u.role === 'ADMIN').length
  const activeUsers = users.filter(u => u.isActive).length
  const totalRevenue = users.reduce((sum, user) => sum + user.totalSpent, 0)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black">USER MANAGEMENT</h1>
            <p className="text-mf-gray mt-1">Manage villain collective members and access</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-mf-blue/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-mf-blue" />
            </div>
            <div>
              <p className="text-sm text-mf-gray">Total Users</p>
              <p className="text-2xl font-bold">{totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-mf-gray">Administrators</p>
              <p className="text-2xl font-bold">{adminUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-mf-gray">Active Users</p>
              <p className="text-2xl font-bold">{activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-mf-gray">Total Revenue</p>
              <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mf-gray w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Administrators</option>
            <option value="CUSTOMER">Customers</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <div className="flex items-center justify-center bg-mf-light-gray rounded-lg px-4 py-3">
            <span className="font-semibold">{filteredUsers.length} Users</span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-mf-light-gray">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">User</th>
                <th className="px-6 py-4 text-left font-semibold">Role</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Orders</th>
                <th className="px-6 py-4 text-left font-semibold">Total Spent</th>
                <th className="px-6 py-4 text-left font-semibold">Last Order</th>
                <th className="px-6 py-4 text-left font-semibold">Joined</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-mf-blue/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        user.role === 'ADMIN' ? 'bg-purple-100' : 'bg-mf-blue/10'
                      }`}>
                        {user.role === 'ADMIN' ? (
                          <Crown className="w-4 h-4 text-purple-600" />
                        ) : (
                          <User className="w-4 h-4 text-mf-blue" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-mf-gray">{user.email}</p>
                        {user.phone && (
                          <p className="text-xs text-mf-gray">{user.phone}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.isActive)}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold">{user.orderCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold">${user.totalSpent.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">
                      {user.lastOrderDate 
                        ? new Date(user.lastOrderDate).toLocaleDateString()
                        : 'Never'
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {user.id !== session?.user?.id && (
                        <>
                          <button
                            onClick={() => changeUserRole(user.id, user.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN')}
                            className={`p-2 rounded-lg transition-colors ${
                              user.role === 'ADMIN' 
                                ? 'hover:bg-blue-100 text-blue-600' 
                                : 'hover:bg-purple-100 text-purple-600'
                            }`}
                            title={user.role === 'ADMIN' ? 'Make Customer' : 'Make Admin'}
                          >
                            {user.role === 'ADMIN' ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Crown className="w-4 h-4" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => toggleUserStatus(user.id, user.isActive)}
                            className={`p-2 rounded-lg transition-colors ${
                              user.isActive 
                                ? 'hover:bg-red-100 text-red-600' 
                                : 'hover:bg-green-100 text-green-600'
                            }`}
                            title={user.isActive ? 'Deactivate User' : 'Activate User'}
                          >
                            {user.isActive ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {user.id === session?.user?.id && (
                        <span className="text-xs text-mf-gray px-2 py-1 bg-mf-light-gray rounded">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-mf-gray mx-auto mb-4" />
            <p className="text-mf-gray text-lg mb-2">No users found</p>
            <p className="text-sm text-mf-gray">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
} 