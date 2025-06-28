'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Star,
  Eye,
  Package
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts'

interface MetricData {
  label: string
  value: string | number
  change: number
  trend: 'up' | 'down'
  color: string
  icon: any
}

interface AnalyticsWidgetProps {
  title?: string
  timeRange?: string
  showChart?: boolean
  compact?: boolean
}

const AnalyticsWidget = ({ 
  title = "Quick Analytics", 
  timeRange = "7d",
  showChart = true,
  compact = false 
}: AnalyticsWidgetProps) => {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<MetricData[]>([])
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        
        // Transform data into metrics
        const transformedMetrics: MetricData[] = [
          {
            label: 'Revenue',
            value: `$${data.totalRevenue?.toLocaleString() || '0'}`,
            change: data.recentMetrics?.revenueGrowth || 0,
            trend: (data.recentMetrics?.revenueGrowth || 0) >= 0 ? 'up' : 'down',
            color: 'text-green-600',
            icon: DollarSign
          },
          {
            label: 'Orders',
            value: data.totalOrders?.toLocaleString() || '0',
            change: data.recentMetrics?.orderGrowth || 0,
            trend: (data.recentMetrics?.orderGrowth || 0) >= 0 ? 'up' : 'down',
            color: 'text-blue-600',
            icon: ShoppingBag
          },
          {
            label: 'Customers',
            value: data.totalCustomers?.toLocaleString() || '0',
            change: data.recentMetrics?.customerGrowth || 0,
            trend: (data.recentMetrics?.customerGrowth || 0) >= 0 ? 'up' : 'down',
            color: 'text-purple-600',
            icon: Users
          },
          {
            label: 'Avg Order',
            value: `$${data.averageOrderValue?.toFixed(2) || '0.00'}`,
            change: 5.2, // Would calculate from actual data
            trend: 'up',
            color: 'text-orange-600',
            icon: Star
          }
        ]

        setMetrics(transformedMetrics)

        // Transform monthly data for mini chart
        if (data.revenueByMonth) {
          const chartData = data.revenueByMonth.map((item: any) => ({
            name: item.month,
            value: item.revenue,
            orders: item.orders
          }))
          setChartData(chartData)
        }
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-gray-300 rounded"></div>
            <div className="h-16 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <h3 className="text-sm font-semibold mb-3 text-gray-700">{title}</h3>
        <div className="grid grid-cols-2 gap-3">
          {metrics.slice(0, 2).map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-1">
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
              </div>
              <p className="text-lg font-bold">{metric.value}</p>
              <p className="text-xs text-gray-500">{metric.label}</p>
              <div className={`flex items-center justify-center text-xs mt-1 ${
                metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {metric.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {Math.abs(metric.change)}%
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span>Last {timeRange}</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <div className="flex items-center space-x-2 mb-2">
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
              <span className="text-sm font-medium text-gray-700">{metric.label}</span>
            </div>
            <p className="text-xl font-bold mb-1">{metric.value}</p>
            <div className={`flex items-center text-xs ${
              metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
            }`}>
              {metric.trend === 'up' ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {Math.abs(metric.change)}% from last period
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mini Chart */}
      {showChart && chartData.length > 0 && (
        <div className="bg-gradient-to-r from-mf-blue/5 to-mf-blue/10 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-3 text-gray-700">Revenue Trend</h4>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip 
                  formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8CD4E6"
                  fill="#8CD4E6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnalyticsWidget 