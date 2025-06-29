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
  X,
  Check,
  AlertCircle,
  Send,
  ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface UserProfile {
  name: string
  email: string
  phone?: string
  emailVerified?: boolean
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sendingVerification, setSendingVerification] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    emailVerified: false
  })

  // Phone number validation
  const [phoneCountry, setPhoneCountry] = useState('+1')
  const [phoneNumber, setPhoneNumber] = useState('')

  const countryCodes = [
    { code: '+1', country: 'US/CA', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+33', country: 'FR', flag: '🇫🇷' },
    { code: '+49', country: 'DE', flag: '🇩🇪' },
    { code: '+34', country: 'ES', flag: '🇪🇸' },
    { code: '+39', country: 'IT', flag: '🇮🇹' },
    { code: '+81', country: 'JP', flag: '🇯🇵' },
    { code: '+86', country: 'CN', flag: '🇨🇳' },
    { code: '+91', country: 'IN', flag: '🇮🇳' },
    { code: '+61', country: 'AU', flag: '🇦🇺' },
  ]

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/login')
      return
    }

    setProfile({
      name: session.user.name || '',
      email: session.user.email || '',
      phone: session.user.phone || '',
      emailVerified: false // Will be fetched from API
    })

    // Parse existing phone number
    if (session.user.phone) {
      const phone = session.user.phone
      const countryCode = countryCodes.find(cc => phone.startsWith(cc.code))
      if (countryCode) {
        setPhoneCountry(countryCode.code)
        setPhoneNumber(phone.substring(countryCode.code.length).trim())
      } else {
        setPhoneNumber(phone)
      }
    }

    // Fetch complete profile data including emailVerified status
    fetchProfile()
  }, [session, status, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(prev => ({
          ...prev,
          emailVerified: data.user.emailVerified || false
        }))
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\d\s\-\(\)]+$/
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7
  }

  const handleSaveProfile = async () => {
    setLoading(true)

    try {
      // Validate email
      if (!validateEmail(profile.email)) {
        toast.error('Please enter a valid email address')
        setLoading(false)
        return
      }

      // Validate phone if provided
      const fullPhone = phoneNumber ? `${phoneCountry}${phoneNumber}` : ''
      if (phoneNumber && !validatePhone(phoneNumber)) {
        toast.error('Please enter a valid phone number')
        setLoading(false)
        return
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...profile,
          phone: fullPhone
        }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.emailChanged) {
          toast.success('Profile updated! Please check your email to verify your new email address.')
        } else {
          toast.success('Profile updated successfully!')
        }
        await update() // Refresh session
        await fetchProfile() // Refresh profile data including emailVerified
        setIsEditing(false)
      } else {
        toast.error(data.error || 'Failed to update profile')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleSendVerification = async () => {
    setSendingVerification(true)

    try {
      const response = await fetch('/api/user/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        toast.success('Verification email sent! Check your inbox.')
      } else {
        toast.error('Failed to send verification email')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setSendingVerification(false)
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
      <div className="min-h-screen bg-mf-light-gray flex items-center justify-center px-4">
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
    <div className="min-h-screen bg-mf-light-gray py-4 sm:py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 sm:mb-8 lg:mb-12"
          >
            {/* DOOM Mask GIF */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 relative">
              <Image
                src="/icons/mfdoomcask.gif"
                alt="THISMFDOOM Mask"
                width={96}
                height={96}
                className="w-full h-full"
                unoptimized
              />
              {/* Glowing effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-mf-blue to-purple-500 animate-pulse opacity-20 blur-lg"></div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-2 bg-gradient-to-r from-gray-900 via-black to-gray-900 bg-clip-text text-transparent">
              VILLAIN PROFILE
            </h1>
            <p className="text-mf-gray text-sm sm:text-base lg:text-lg">
              Manage your villain collective membership
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Profile Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                <h2 className="text-xl sm:text-2xl font-bold">Personal Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center sm:justify-start space-x-2 text-mf-blue hover:text-mf-dark-blue transition-colors py-2 px-4 sm:py-0 sm:px-0 rounded-lg sm:rounded-none bg-mf-blue/5 sm:bg-transparent"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="flex items-center justify-center space-x-2 bg-mf-blue text-white px-4 py-2.5 sm:py-2 rounded-lg hover:bg-mf-dark-blue transition-colors disabled:opacity-70 text-sm sm:text-base"
                    >
                      {loading ? (
                        <div style={{ width: 16, height: 16 }}>
                          <Image
                            src="/icons/mfdoomcask.gif"
                            alt="Saving..."
                            width={16}
                            height={16}
                            className="w-full h-full"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        setProfile({
                          name: session.user.name || '',
                          email: session.user.email || '',
                          phone: session.user.phone || '',
                          emailVerified: false
                        })
                      }}
                      className="flex items-center justify-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2.5 sm:py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4 sm:space-y-6">
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
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors text-sm sm:text-base"
                        placeholder="Enter your villain name"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 py-3 px-4 bg-mf-light-gray rounded-lg">
                      <User className="w-5 h-5 text-mf-gray flex-shrink-0" />
                      <span className="font-medium text-sm sm:text-base">{profile.name}</span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mf-gray w-5 h-5" />
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors text-sm sm:text-base"
                          placeholder="Enter your email address"
                        />
                      </div>
                      {profile.email !== session?.user?.email && (
                        <p className="text-xs text-amber-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          Changing email will require verification
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 py-3 px-4 bg-mf-light-gray rounded-lg">
                        <Mail className="w-5 h-5 text-mf-gray flex-shrink-0" />
                        <span className="font-medium flex-1 text-sm sm:text-base min-w-0 break-words">{profile.email}</span>
                        {profile.emailVerified ? (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1 flex-shrink-0">
                            <Check className="w-3 h-3" />
                            <span className="hidden sm:inline">Verified</span>
                            <span className="sm:hidden">✓</span>
                          </span>
                        ) : (
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 flex-shrink-0">
                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              <span className="hidden sm:inline">Unverified</span>
                              <span className="sm:hidden">!</span>
                            </span>
                            <button
                              onClick={handleSendVerification}
                              disabled={sendingVerification}
                              className="text-xs bg-mf-blue text-white px-2 py-1 rounded hover:bg-mf-dark-blue transition-colors disabled:opacity-70 flex items-center justify-center gap-1 min-w-0"
                            >
                              {sendingVerification ? (
                                <div style={{ width: 12, height: 12 }}>
                                  <Image
                                    src="/icons/mfdoomcask.gif"
                                    alt="Sending..."
                                    width={12}
                                    height={12}
                                    className="w-full h-full"
                                    unoptimized
                                  />
                                </div>
                              ) : (
                                <Send className="w-3 h-3" />
                              )}
                              <span className="hidden sm:inline">Verify</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <select
                        value={phoneCountry}
                        onChange={(e) => setPhoneCountry(e.target.value)}
                        className="w-full sm:w-auto px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors text-sm sm:text-base"
                      >
                        {countryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.flag} {country.code} ({country.country})
                          </option>
                        ))}
                      </select>
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mf-gray w-5 h-5" />
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors text-sm sm:text-base"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 py-3 px-4 bg-mf-light-gray rounded-lg">
                      <Phone className="w-5 h-5 text-mf-gray flex-shrink-0" />
                      <span className="font-medium text-sm sm:text-base">{profile.phone || 'Not provided'}</span>
                    </div>
                  )}
                  <p className="text-xs text-mf-gray mt-1">
                    Used for order updates and security notifications
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Account Actions */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="space-y-2 sm:space-y-3">
                  {[
                    { title: 'Order History', icon: ShoppingBag, href: '/account/orders', desc: 'View your villain purchases' },
                    { title: 'Wishlist', icon: Heart, href: '/account/wishlist', desc: 'Saved items for later' },
                    { title: 'Addresses', icon: MapPin, href: '/account/addresses', desc: 'Manage shipping addresses' },
                    { title: 'Account Settings', icon: Settings, href: '/account/settings', desc: 'Security and preferences' }
                  ].map((action) => (
                    <button
                      key={action.title}
                      onClick={() => router.push(action.href)}
                      className="w-full flex items-center p-3 rounded-lg border-2 border-transparent hover:border-mf-blue hover:bg-mf-blue/5 transition-all duration-200 group text-left touch-manipulation"
                    >
                      <div className="w-8 h-8 bg-mf-light-gray rounded-lg flex items-center justify-center group-hover:bg-mf-blue group-hover:text-white transition-colors mr-3 flex-shrink-0">
                        <action.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{action.title}</p>
                        <p className="text-xs text-mf-gray hidden sm:block">{action.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-mf-gray group-hover:text-mf-blue transition-colors flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Sign Out */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors touch-manipulation"
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
            className="text-center mt-8 sm:mt-12"
          >
            <p className="text-xs sm:text-sm text-mf-gray">
              "Remember ALL CAPS when you spell the man name"
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 