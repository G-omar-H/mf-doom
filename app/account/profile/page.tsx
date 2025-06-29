'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  ShoppingBag, 
  Heart,
  Settings,
  LogOut,
  Save,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface UserProfile {
  name: string
  email: string
  phone?: string
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/login')
      return
    }

    setProfile({
      name: session.user.name || '',
      email: session.user.email || '',
      phone: session.user.phone || ''
    })
  }, [session, status, router])

  const handleSaveProfile = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        toast.success('Profile updated successfully!')
        await update() // Refresh session
        setIsEditing(false)
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut({ 
      callbackUrl: '/',
      redirect: true 
    })
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-mf-light-gray flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4">
            <Image
              src="/icons/mfdoomcask.gif"
              alt="Loading..."
              width={48}
              height={48}
              className="w-full h-full"
              unoptimized
            />
          </div>
          <p className="text-mf-gray">Loading villain profile...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-mf-light-gray py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            {/* DOOM Mask GIF */}
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <Image
                src="/icons/mfdoomcask.gif"
                alt="MF DOOM Mask"
                width={96}
                height={96}
                className="w-full h-full"
                unoptimized
              />
              {/* Glowing effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-mf-blue to-purple-500 animate-pulse opacity-20 blur-lg"></div>
            </div>
            <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-gray-900 via-black to-gray-900 bg-clip-text text-transparent">
              VILLAIN PROFILE
            </h1>
            <p className="text-mf-gray text-lg">
              Manage your villain collective membership
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 bg-white rounded-xl shadow-sm p-8 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Personal Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 text-mf-blue hover:text-mf-dark-blue transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="flex items-center space-x-2 bg-mf-blue text-white px-4 py-2 rounded-lg hover:bg-mf-dark-blue transition-colors disabled:opacity-70"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        setProfile({
                          name: session.user.name || '',
                          email: session.user.email || '',
                          phone: session.user.phone || ''
                        })
                      }}
                      className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Villain Name
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mf-gray w-5 h-5" />
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors"
                        placeholder="Enter your villain name"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 py-3 px-4 bg-mf-light-gray rounded-lg">
                      <User className="w-5 h-5 text-mf-gray" />
                      <span className="font-medium">{profile.name}</span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center space-x-3 py-3 px-4 bg-mf-light-gray rounded-lg">
                    <Mail className="w-5 h-5 text-mf-gray" />
                    <span className="font-medium">{profile.email}</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified</span>
                  </div>
                  <p className="text-xs text-mf-gray mt-1">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mf-gray w-5 h-5" />
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 py-3 px-4 bg-mf-light-gray rounded-lg">
                      <Phone className="w-5 h-5 text-mf-gray" />
                      <span className="font-medium">{profile.phone || 'Not provided'}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Account Actions */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {[
                    { title: 'Order History', icon: ShoppingBag, href: '/account/orders', desc: 'View your villain purchases' },
                    { title: 'Wishlist', icon: Heart, href: '/account/wishlist', desc: 'Saved items for later' },
                    { title: 'Addresses', icon: MapPin, href: '/account/addresses', desc: 'Manage shipping addresses' },
                    { title: 'Account Settings', icon: Settings, href: '/account/settings', desc: 'Security and preferences' }
                  ].map((action) => (
                    <button
                      key={action.title}
                      onClick={() => router.push(action.href)}
                      className="w-full flex items-center p-3 rounded-lg border-2 border-transparent hover:border-mf-blue hover:bg-mf-blue/5 transition-all duration-200 group text-left"
                    >
                      <div className="w-8 h-8 bg-mf-light-gray rounded-lg flex items-center justify-center group-hover:bg-mf-blue group-hover:text-white transition-colors mr-3">
                        <action.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{action.title}</p>
                        <p className="text-xs text-mf-gray">{action.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sign Out */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Footer Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-sm text-mf-gray">
              "Remember ALL CAPS when you spell the man name"
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 