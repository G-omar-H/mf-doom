'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe2,
  Smartphone,
  Monitor,
  Tablet,
  Users,
  TrendingUp,
  MapPin,
  Clock,
  Eye,
  Activity,
  Wifi,
  User
} from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts'
import WorldMap from './WorldMap'

interface VisitorData {
  totalPageViews: number
  uniqueVisitors: number
  topCountries: Array<{
    country: string
    visits: number
    flag?: string
  }>
  topPages: Array<{
    page: string
    visits: number
  }>
  deviceTypes: Array<{
    device: string
    visits: number
  }>
  realTimeVisitors: number
  avgSessionDuration: number
  bounceRate: number
  hourlyTraffic: Array<{
    hour: number
    visitors: number
    pageViews: number
  }>
  visitorLocations?: Array<{
    sessionId: string
    latitude: number
    longitude: number
    country?: string
    city?: string
    timestamp: string
  }>
}

// MF DOOM Brand Colors
const DOOM_COLORS = {
  primary: '#8CD4E6',
  secondary: '#4A9BA6', 
  accent: '#6BB6C6',
  dark: '#2A7F86',
  darker: '#1A6266',
  gold: '#FFD700',
  silver: '#C0C0C0'
}

const CHART_COLORS = [DOOM_COLORS.primary, DOOM_COLORS.secondary, DOOM_COLORS.accent, DOOM_COLORS.dark, DOOM_COLORS.gold, DOOM_COLORS.silver]

// Device icons mapping
const DeviceIcon = ({ device }: { device: string }) => {
  switch (device.toLowerCase()) {
    case 'mobile':
      return <Smartphone className="w-5 h-5" />
    case 'tablet':
      return <Tablet className="w-5 h-5" />
    case 'desktop':
      return <Monitor className="w-5 h-5" />
    default:
      return <Monitor className="w-5 h-5" />
  }
}

// Country flag emojis (basic implementation)
const getCountryFlag = (country: string): string => {
  const flags: { [key: string]: string } = {
    'United States': '🇺🇸',
    'Canada': '🇨🇦',
    'United Kingdom': '🇬🇧',
    'Germany': '🇩🇪',
    'France': '🇫🇷',
    'Japan': '🇯🇵',
    'Australia': '🇦🇺',
    'Brazil': '🇧🇷',
    'Mexico': '🇲🇽',
    'Spain': '🇪🇸',
    'Italy': '🇮🇹',
    'Netherlands': '🇳🇱',
    'Sweden': '🇸🇪',
    'Norway': '🇳🇴',
    'Denmark': '🇩🇰',
    'Finland': '🇫🇮',
    'South Korea': '🇰🇷',
    'China': '🇨🇳',
    'India': '🇮🇳',
    'Russia': '🇷🇺'
  }
  return flags[country] || '🌍'
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 text-white p-3 rounded-lg shadow-xl border border-gray-600">
        <p className="font-semibold text-sm">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }
  return null
}

interface VisitorInsightsWidgetProps {
  period?: string
  refreshInterval?: number
}

export default function VisitorInsightsWidget({ 
  period = '7',
  refreshInterval = 30000 // 30 seconds
}: VisitorInsightsWidgetProps) {
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchVisitorAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/visitor?days=${period}&limit=100`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const data = await response.json()
      setVisitorData(data)
      setLastUpdated(new Date())
      setError(null)
    } catch (error) {
      console.error('Error fetching visitor analytics:', error)
      setError('Failed to load visitor data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVisitorAnalytics()
    
    // Set up auto-refresh
    const interval = setInterval(fetchVisitorAnalytics, refreshInterval)
    return () => clearInterval(interval)
  }, [period, refreshInterval])

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl p-6 text-white">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-900/20 via-red-800/20 to-black rounded-xl p-6 text-white border border-red-500/30">
        <div className="text-center">
          <Wifi className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold mb-2">Visitor Data Unavailable</h3>
          <p className="text-red-300 text-sm mb-4">{error}</p>
          <button 
            onClick={fetchVisitorAnalytics}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-medium"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  if (!visitorData) return null

  // Prepare chart data
  const deviceChartData = visitorData.deviceTypes.map((device, index) => ({
    ...device,
    fill: CHART_COLORS[index % CHART_COLORS.length]
  }))

  const countryChartData = visitorData.topCountries.slice(0, 5).map((country, index) => ({
    name: country.country,
    visits: country.visits,
    flag: getCountryFlag(country.country),
    fill: CHART_COLORS[index % CHART_COLORS.length]
  }))

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 md:p-6 border-b border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Globe2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-white tracking-wide">VILLAIN COLLECTIVE INSIGHTS</h2>
              <p className="text-gray-300 text-xs md:text-sm">Real-time visitor analytics & geographic intelligence</p>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-2">
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <Activity className="w-3 h-3 animate-pulse text-green-400" />
              <span>Live</span>
            </div>
            <div className="text-xs text-gray-400">
              Updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl p-4 border border-blue-500/30"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-blue-300 text-xs font-medium uppercase tracking-wide">Page Views</p>
                <p className="text-white text-xl font-bold">{visitorData.totalPageViews.toLocaleString()}</p>
                <p className="text-blue-400 text-xs">Last {period} days</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-4 border border-purple-500/30"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-purple-300 text-xs font-medium uppercase tracking-wide">Unique Visitors</p>
                <p className="text-white text-xl font-bold">{visitorData.uniqueVisitors.toLocaleString()}</p>
                <p className="text-purple-400 text-xs">Individual sessions</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl p-4 border border-green-500/30"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-green-300 text-xs font-medium uppercase tracking-wide">Real-time</p>
                <p className="text-white text-xl font-bold">{visitorData.realTimeVisitors || 0}</p>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-green-400 text-xs">Active now</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 rounded-xl p-4 border border-yellow-500/30"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-yellow-300 text-xs font-medium uppercase tracking-wide">Avg Session</p>
                <p className="text-white text-xl font-bold">{Math.round(visitorData.avgSessionDuration || 0)}s</p>
                <p className="text-yellow-400 text-xs">Time on site</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Device Types Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-600/30"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Device Distribution</h3>
              <Monitor className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="visits"
                    label={({ device, percent }: any) => `${device} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {deviceChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Interactive World Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-600/30"
          >
            <WorldMap countryData={visitorData.topCountries} visitorLocations={visitorData.visitorLocations} />
          </motion.div>
        </div>

        {/* Hourly Traffic Chart */}
        {visitorData.hourlyTraffic && visitorData.hourlyTraffic.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-600/30 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">24-Hour Traffic Pattern</h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={visitorData.hourlyTraffic}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="hour" 
                    stroke="#9CA3AF" 
                    fontSize={12}
                    tickFormatter={(hour) => `${hour}:00`}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="pageViews"
                    name="Page Views"
                    fill={DOOM_COLORS.primary}
                    fillOpacity={0.3}
                    stroke={DOOM_COLORS.primary}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    name="Visitors"
                    stroke={DOOM_COLORS.gold}
                    strokeWidth={3}
                    dot={{ fill: DOOM_COLORS.gold, strokeWidth: 2, r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Top Pages & Countries Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-600/30"
          >
            <h3 className="text-lg font-bold text-white mb-4">Popular Pages</h3>
            <div className="space-y-3">
              {visitorData.topPages.slice(0, 5).map((page, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-white text-sm font-medium">
                      {page.page === '/' ? 'Homepage' : page.page}
                    </span>
                  </div>
                  <span className="text-gray-300 text-sm font-medium">
                    {page.visits.toLocaleString()} views
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Countries with Flags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-600/30"
          >
            <h3 className="text-lg font-bold text-white mb-4">Global Visitors</h3>
            <div className="space-y-3">
              {visitorData.topCountries.slice(0, 5).map((country, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getCountryFlag(country.country)}</div>
                    <span className="text-white text-sm font-medium">{country.country}</span>
                  </div>
                  <span className="text-gray-300 text-sm font-medium">
                    {country.visits.toLocaleString()} visits
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 