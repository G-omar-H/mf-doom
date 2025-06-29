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
  LineChart
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

// Chart color palette
const COLORS = ['#8CD4E6', '#6BB6C6', '#4A9BA6', '#2A7F86', '#1A6266', '#0D4A4E']

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
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
      <div className="min-h-screen bg-mf-light-gray flex items-center justify-center">
        <LoadingSpinner size={64} text="Loading analytics..." />
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-mf-gray mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-mf-gray mb-2">
            {error ? 'Analytics Error' : 'Analytics Unavailable'}
          </h3>
          <p className="text-mf-gray mb-4">
            {error || 'Unable to load analytics data at this time.'}
          </p>
          {error && (
            <button 
              onClick={fetchAnalytics}
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Retrying...' : 'Retry'}
            </button>
          )}
        </div>
      </div>
    )
  }

  // Prepare data for charts
  const categoryPieData = analytics.salesByCategory.map((item, index) => ({
    name: item.category.replace('_', ' '),
    value: item.revenue,
    orders: item.orders,
    fill: COLORS[index % COLORS.length]
  }))

  const topProductsBarData = analytics.topProducts.slice(0, 8).map(product => ({
    name: product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name,
    revenue: product.revenue,
    orders: product.orders,
    views: product.views,
    conversion: product.views > 0 ? ((product.orders / product.views) * 100).toFixed(1) : 0
  }))

  const revenueAreaData = analytics.revenueByMonth.map(month => ({
    month: month.month,
    revenue: month.revenue,
    orders: month.orders,
    aov: month.orders > 0 ? month.revenue / month.orders : 0
  }))

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-black">ANALYTICS DASHBOARD</h1>
            <p className="text-mf-gray mt-1 text-sm md:text-base">Track villain collective performance and insights</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 md:px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors text-sm md:text-base"
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
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 mb-6 md:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-3 md:p-6"
        >
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-mf-gray">Total Revenue</p>
              <p className="text-lg md:text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</p>
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
          className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-3 md:p-6"
        >
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-mf-gray">Total Orders</p>
              <p className="text-lg md:text-2xl font-bold">{analytics.totalOrders.toLocaleString()}</p>
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
          className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-3 md:p-6"
        >
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 md:w-6 md:h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-mf-gray">Customers</p>
              <p className="text-lg md:text-2xl font-bold">{analytics.totalCustomers.toLocaleString()}</p>
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
          className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-3 md:p-6"
        >
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-mf-gray">Avg Order Value</p>
              <p className="text-lg md:text-2xl font-bold">${analytics.averageOrderValue.toFixed(2)}</p>
              <p className="text-xs text-mf-gray mt-1">Per transaction</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-3 md:p-6"
        >
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-mf-blue/10 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 md:w-6 md:h-6 text-mf-blue" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-mf-gray">Conversion Rate</p>
              <p className="text-lg md:text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</p>
              <p className="text-xs text-mf-gray mt-1">Visitor to customer</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Revenue Over Time Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6"
        >
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold">Revenue Over Time</h3>
            <LineChart className="w-4 h-4 md:w-5 md:h-5 text-mf-blue" />
          </div>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueAreaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#8CD4E6"
                  fill="#8CD4E6"
                  fillOpacity={0.6}
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#4A9BA6"
                  strokeWidth={2}
                  dot={{ fill: '#4A9BA6', strokeWidth: 2, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Sales by Category Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6"
        >
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold">Sales by Category</h3>
            <PieChart className="w-4 h-4 md:w-5 md:h-5 text-mf-blue" />
          </div>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
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
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Top Products Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6 md:mb-8"
      >
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-semibold">Top Products Performance</h3>
          <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-mf-blue" />
        </div>
        <div className="h-80 md:h-96">
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
        transition={{ delay: 0.8 }}
        className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6 md:mb-8"
      >
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-semibold">Top Performing Products</h3>
          <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-mf-gray" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-mf-light-gray">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Rank</th>
                <th className="px-4 py-3 text-left font-semibold">Product</th>
                <th className="px-4 py-3 text-left font-semibold">Revenue</th>
                <th className="px-4 py-3 text-left font-semibold">Orders</th>
                <th className="px-4 py-3 text-left font-semibold">Views</th>
                <th className="px-4 py-3 text-left font-semibold">Conversion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analytics.topProducts.map((product, index) => (
                <tr key={product.id} className="hover:bg-mf-blue/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-8 h-8 bg-mf-blue rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium">{product.name}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-green-600">
                    ${product.revenue.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{product.orders}</td>
                  <td className="px-4 py-3">{product.views.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 font-medium">
                        {product.views > 0 ? ((product.orders / product.views) * 100).toFixed(1) : 0}%
                      </span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
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
        transition={{ delay: 0.9 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Monthly Performance Breakdown</h3>
          <Calendar className="w-5 h-5 text-mf-gray" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {analytics.revenueByMonth.map((month, index) => (
            <motion.div 
              key={month.month} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + (index * 0.1) }}
              className="text-center p-4 bg-gradient-to-br from-mf-blue/10 to-mf-blue/20 rounded-lg border border-mf-blue/20 hover:shadow-md transition-all duration-200"
            >
              <p className="text-sm font-medium text-mf-blue mb-1">{month.month}</p>
              <p className="text-xl font-bold text-gray-900">${month.revenue.toLocaleString()}</p>
              <p className="text-sm text-mf-gray">{month.orders} orders</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-mf-blue h-1.5 rounded-full transition-all duration-500"
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
  )
} 