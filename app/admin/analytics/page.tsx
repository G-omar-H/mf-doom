'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Eye,
  Star,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Globe2,
  Activity,
  Zap
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  AreaChart,
  BarChart,
  PieChart as RechartsPieChart,
  Line,
  Area,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Pie
} from 'recharts'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import VisitorInsightsWidget from '@/components/admin/VisitorInsightsWidget'

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  averageOrderValue: number
  conversionRate: number
  topProducts: Array<{
    id: string
    name: string
    revenue: number
    orders: number
    views: number
  }>
  salesByCategory: Array<{
    category: string
    revenue: number
    orders: number
  }>
  revenueByMonth: Array<{
    month: string
    revenue: number
    orders: number
  }>
  recentMetrics: {
    revenueGrowth: number
    orderGrowth: number
    customerGrowth: number
  }
}

// MF DOOM Brand Colors
const DOOM_COLORS = ['#8CD4E6', '#6BB6C6', '#4A9BA6', '#2A7F86', '#1A6266', '#FFD700']

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 text-white p-4 border border-gray-600 rounded-lg shadow-xl">
        <p className="font-semibold text-sm">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.name.includes('Revenue') || entry.name.includes('$') 
              ? `$${entry.value.toLocaleString()}` 
              : entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function AdminAnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('30d')
  const [activeTab, setActiveTab] = useState<'overview' | 'business' | 'visitors'>('overview')

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/auth/login')
      return
    }
    fetchAnalytics()
  }, [session, status, router, timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setError(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center">
        <LoadingSpinner size={64} text="Loading villain analytics..." />
      </div>
    )
  }

  if (!analytics && error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-mf-gray mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-mf-gray mb-2">
            Analytics Error
          </h3>
          <p className="text-mf-gray mb-4">{error}</p>
          <button 
            onClick={fetchAnalytics}
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Retrying...' : 'Retry'}
          </button>
        </div>
      </div>
    )
  }

  // Prepare data for charts (only if analytics data exists)
  const categoryPieData = analytics?.salesByCategory.map((item, index) => ({
    name: item.category.replace('_', ' '),
    value: item.revenue,
    orders: item.orders,
    fill: DOOM_COLORS[index % DOOM_COLORS.length]
  })) || []

  const topProductsBarData = analytics?.topProducts.slice(0, 8).map(product => ({
    name: product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name,
    revenue: product.revenue,
    orders: product.orders,
    views: product.views,
    conversion: product.views > 0 ? ((product.orders / product.views) * 100).toFixed(1) : 0
  })) || []

  const revenueAreaData = analytics?.revenueByMonth.map(month => ({
    month: month.month,
    revenue: month.revenue,
    orders: month.orders,
    aov: month.orders > 0 ? month.revenue / month.orders : 0
  })) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">
                VILLAIN ANALYTICS HQ
              </h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                Comprehensive intelligence & performance monitoring
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 md:px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-sm md:text-base bg-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="btn-secondary flex items-center space-x-2 text-sm md:text-base">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export Report</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-1">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'business', label: 'Business Metrics', icon: DollarSign },
              { id: 'visitors', label: 'Visitor Intelligence', icon: Globe2 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg transition-all duration-200 font-medium text-xs md:text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline md:hidden lg:inline">{tab.label}</span>
                <span className="sm:hidden md:inline lg:hidden">
                  {tab.id === 'overview' ? 'Overview' : tab.id === 'business' ? 'Business' : 'Visitors'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats Row */}
          {analytics && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 font-medium">Revenue</p>
                    <p className="text-lg md:text-2xl font-bold text-gray-900">${analytics.totalRevenue.toLocaleString()}</p>
                    <div className="flex items-center text-xs mt-1">
                      {analytics.recentMetrics.revenueGrowth >= 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                      )}
                      <span className={analytics.recentMetrics.revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {Math.abs(analytics.recentMetrics.revenueGrowth)}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 font-medium">Orders</p>
                    <p className="text-lg md:text-2xl font-bold text-gray-900">{analytics.totalOrders.toLocaleString()}</p>
                    <div className="flex items-center text-xs mt-1">
                      {analytics.recentMetrics.orderGrowth >= 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                      )}
                      <span className={analytics.recentMetrics.orderGrowth >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {Math.abs(analytics.recentMetrics.orderGrowth)}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 font-medium">Customers</p>
                    <p className="text-lg md:text-2xl font-bold text-gray-900">{analytics.totalCustomers.toLocaleString()}</p>
                    <div className="flex items-center text-xs mt-1">
                      {analytics.recentMetrics.customerGrowth >= 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                      )}
                      <span className={analytics.recentMetrics.customerGrowth >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {Math.abs(analytics.recentMetrics.customerGrowth)}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 font-medium">Avg Order</p>
                    <p className="text-lg md:text-2xl font-bold text-gray-900">${analytics.averageOrderValue.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">Per transaction</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 font-medium">Conversion</p>
                    <p className="text-lg md:text-2xl font-bold text-gray-900">{analytics.conversionRate.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500 mt-1">Success rate</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Combined Overview Charts */}
          {analytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trend */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
                  <LineChart className="w-5 h-5 text-gray-400" />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueAreaData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                      <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#8CD4E6" fill="#8CD4E6" fillOpacity={0.6} strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Category Distribution */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Sales by Category</h3>
                  <PieChart className="w-5 h-5 text-gray-400" />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={categoryPieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }: { name: string; percent?: number }) => 
                          `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                        }
                        labelLine={false}
                      >
                        {categoryPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          )}

          {/* Visitor Insights Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <VisitorInsightsWidget period={timeRange.replace('d', '')} />
          </motion.div>
        </div>
      )}

      {activeTab === 'business' && analytics && (
        <div className="space-y-6">
          {/* Business metrics content - full business analytics */}
          
          {/* Top Products Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Top Products Performance</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductsBarData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9CA3AF"
                    fontSize={11}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="revenue" 
                    name="Revenue" 
                    fill="#8CD4E6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="orders" 
                    name="Orders" 
                    fill="#4A9BA6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Top Products Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Top Performing Products</h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Rank</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Product</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Revenue</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 hidden md:table-cell">Orders</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 hidden lg:table-cell">Views</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Conversion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analytics.topProducts.map((product, index) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <span className="font-medium text-gray-900 text-sm md:text-base">{product.name}</span>
                          <div className="md:hidden text-xs text-gray-500 mt-1">
                            {product.orders} orders • {product.views.toLocaleString()} views
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-green-600 text-sm md:text-base">
                        ${product.revenue.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-700 hidden md:table-cell">{product.orders}</td>
                      <td className="px-4 py-3 text-gray-700 hidden lg:table-cell">{product.views.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-600 font-medium text-sm">
                            {product.views > 0 ? ((product.orders / product.views) * 100).toFixed(1) : 0}%
                          </span>
                          <div className="w-12 md:w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${product.views > 0 ? Math.min(((product.orders / product.views) * 100), 100) : 0}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Monthly Performance Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Monthly Performance Breakdown</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {analytics.revenueByMonth.map((month, index) => (
                <motion.div 
                  key={month.month} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + (index * 0.1) }}
                  className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-md transition-all duration-200"
                >
                  <p className="text-sm font-medium text-blue-700 mb-1">{month.month}</p>
                  <p className="text-xl font-bold text-gray-900">${month.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{month.orders} orders</p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min((month.revenue / Math.max(...analytics.revenueByMonth.map(m => m.revenue))) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === 'visitors' && (
        <div className="space-y-6">
          {/* Dedicated Visitor Intelligence Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <VisitorInsightsWidget period={timeRange.replace('d', '')} refreshInterval={15000} />
          </motion.div>

          {/* Additional Visitor Analytics Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-xl p-6 text-white"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Global Intelligence</h3>
                <Globe2 className="w-6 h-6 text-purple-200" />
              </div>
              <p className="text-purple-100 text-sm mb-4">
                Real-time visitor tracking across {timeRange.replace('d', '')} days with geographic precision and device analytics.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-200">Data Sources:</span>
                  <span className="text-white font-medium">5 Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-200">Update Frequency:</span>
                  <span className="text-white font-medium">Real-time</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-200">Geographic Coverage:</span>
                  <span className="text-white font-medium">Worldwide</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 rounded-xl p-6 text-white"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Performance Metrics</h3>
                <Activity className="w-6 h-6 text-green-200" />
              </div>
              <p className="text-green-100 text-sm mb-4">
                Advanced analytics including session duration, bounce rates, and conversion tracking.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-200">Bot Filtering:</span>
                  <span className="text-white font-medium">Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-200">Privacy Compliant:</span>
                  <span className="text-white font-medium">GDPR Ready</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-200">Data Retention:</span>
                  <span className="text-white font-medium">90 Days</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 rounded-xl p-6 text-white"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Integration Status</h3>
                <Zap className="w-6 h-6 text-orange-200" />
              </div>
              <p className="text-orange-100 text-sm mb-4">
                Multiple analytics platforms working in harmony for comprehensive insights.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-orange-200">Google Analytics:</span>
                  <span className="text-white font-medium">Connected</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-orange-200">Vercel Analytics:</span>
                  <span className="text-white font-medium">Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-orange-200">Custom Tracking:</span>
                  <span className="text-white font-medium">Operational</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
} 