'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Settings, 
  Shield, 
  Bell, 
  Eye,
  EyeOff,
  Key,
  Mail,
  Smartphone,
  Globe,
  Moon,
  Sun,
  Monitor,
  Save,
  AlertTriangle,
  Check,
  LogOut,
  Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface UserSettings {
  notifications: {
    email: boolean
    orderUpdates: boolean
    promotions: boolean
    newsletter: boolean
  }
  privacy: {
    showProfile: boolean
    showOrders: boolean
    allowTracking: boolean
  }
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: string
    currency: string
  }
}

export default function AccountSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      orderUpdates: true,
      promotions: false,
      newsletter: false
    },
    privacy: {
      showProfile: true,
      showOrders: false,
      allowTracking: false
    },
    preferences: {
      theme: 'system',
      language: 'en',
      currency: 'USD'
    }
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/login')
      return
    }
    fetchSettings()
  }, [session, status, router])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/user/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings || settings)
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        toast.success('Settings saved successfully')
      } else {
        toast.error('Failed to save settings')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      if (response.ok) {
        toast.success('Password updated successfully')
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update password')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const deleteAccount = async () => {
    try {
      const response = await fetch('/api/user/account', {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Account deleted successfully')
        await signOut({ callbackUrl: '/' })
      } else {
        toast.error('Failed to delete account')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          {/* Spinning DOOM Mask CSS Animation */}
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center animate-spin">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-600 font-medium">Loading villain settings...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            href="/account/profile"
            className="inline-flex items-center gap-2 text-mf-blue hover:text-mf-dark-blue transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Profile</span>
          </Link>
          
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">VILLAIN SETTINGS</h1>
              <p className="text-gray-600">Customize your experience</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-8">
          {/* Notifications */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
                { key: 'orderUpdates', label: 'Order Updates', desc: 'Get notified about order status changes' },
                { key: 'promotions', label: 'Promotions & Deals', desc: 'Special offers and discounts' },
                { key: 'newsletter', label: 'Newsletter', desc: 'MF DOOM updates and news' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.label}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          [item.key]: e.target.checked
                        }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Privacy */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-bold text-gray-900">Privacy</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { key: 'showProfile', label: 'Public Profile', desc: 'Allow others to see your profile' },
                { key: 'showOrders', label: 'Order History Visibility', desc: 'Show order history in public profile' },
                { key: 'allowTracking', label: 'Analytics Tracking', desc: 'Help improve our service with usage data' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.label}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy[item.key as keyof typeof settings.privacy]}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        privacy: {
                          ...prev.privacy,
                          [item.key]: e.target.checked
                        }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Preferences */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl font-bold text-gray-900">Preferences</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Theme */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Theme</label>
                <div className="space-y-2">
                  {[
                    { value: 'light', label: 'Light', icon: Sun },
                    { value: 'dark', label: 'Dark', icon: Moon },
                    { value: 'system', label: 'System', icon: Monitor }
                  ].map((theme) => {
                    const Icon = theme.icon
                    return (
                      <label key={theme.value} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                        <input
                          type="radio"
                          name="theme"
                          value={theme.value}
                          checked={settings.preferences.theme === theme.value}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              theme: e.target.value as 'light' | 'dark' | 'system'
                            }
                          }))}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        <Icon size={20} className="text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">{theme.label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Language</label>
                <select
                  value={settings.preferences.language}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      language: e.target.value
                    }
                  }))}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Currency</label>
                <select
                  value={settings.preferences.currency}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      currency: e.target.value
                    }
                  }))}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD ($)</option>
                </select>
              </div>
            </div>
          </motion.section>

          {/* Security */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Key className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-bold text-gray-900">Security</h2>
            </div>
            
            <form onSubmit={updatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                Update Password
              </button>
            </form>
          </motion.section>

          {/* Save Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-6"
          >
            <div>
              <h3 className="font-bold text-gray-900">Save Changes</h3>
              <p className="text-sm text-gray-600">Make sure to save your settings</p>
            </div>
            <button
              onClick={saveSettings}
              disabled={saving}
              className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-70"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save size={20} />
              )}
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </motion.div>

          {/* Danger Zone */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-red-50 border-2 border-red-200 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-bold text-red-900">Danger Zone</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-red-900">Delete Account</h3>
                  <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={18} />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              <div className="text-center">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Account</h3>
                <p className="text-gray-600 mb-6">
                  This action cannot be undone. This will permanently delete your account and all associated data.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteAccount}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Bottom Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-gray-600 italic">
            "Your mask, your rules, your villain empire"
          </p>
        </motion.div>
      </div>
    </div>
  )
} 