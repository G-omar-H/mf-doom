'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Lock, Check, AlertCircle, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [tokenValidating, setTokenValidating] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [resetComplete, setResetComplete] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset link')
      router.push('/auth/forgot-password')
      return
    }

    // Validate token on page load
    validateToken()
  }, [token, router])

  const validateToken = async () => {
    try {
      const response = await fetch('/api/auth/validate-reset-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      if (response.ok) {
        setTokenValid(true)
      } else {
        const data = await response.json()
        toast.error(data.error || data.message || 'Invalid or expired reset link')
        setTimeout(() => router.push('/auth/forgot-password'), 2000)
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
      setTimeout(() => router.push('/auth/forgot-password'), 2000)
    } finally {
      setTokenValidating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!password) {
      toast.error('Please enter a new password')
      return
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setResetComplete(true)
        toast.success('Password reset successfully!')
      } else {
        toast.error(data.message || 'Failed to reset password')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state while validating token
  if (tokenValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-mf-light-gray to-mf-blue/10 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size={48} />
          <p className="mt-4 text-mf-gray">Validating reset link...</p>
        </div>
      </div>
    )
  }

  // Invalid token state
  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-mf-light-gray to-mf-blue/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-black mb-2">
                INVALID LINK
              </h1>
              <p className="text-mf-gray">
                This password reset link is invalid or has expired
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-mf-light-gray text-center"
            >
              <p className="text-mf-gray mb-6">
                Password reset links expire after 1 hour for security. 
                Please request a new one.
              </p>
              
              <Link
                href="/auth/forgot-password"
                className="w-full bg-mf-blue text-white py-3 px-4 rounded-lg font-semibold hover:bg-mf-dark-blue transition-colors inline-block"
              >
                Request New Reset Link
              </Link>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link 
                  href="/auth/login"
                  className="text-mf-gray hover:text-black transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to login</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  // Success state after password reset
  if (resetComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-mf-light-gray to-mf-blue/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-black mb-2">
                PASSWORD RESET!
              </h1>
              <p className="text-mf-gray">
                Your password has been successfully updated
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-mf-light-gray text-center"
            >
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-xl font-bold mb-4">All Set!</h2>
              
              <p className="text-mf-gray mb-6">
                Your new password is now active. You can use it to log in to your account.
              </p>
              
              <Link
                href="/auth/login"
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-block"
              >
                Continue to Login
              </Link>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mt-8"
            >
              <p className="text-sm text-mf-gray">
                "Just remember ALL CAPS when you spell the man name"
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  // Main reset password form
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-mf-light-gray to-mf-blue/10">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-blue-500 rounded-full flex items-center justify-center">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black mb-2">
              RESET PASSWORD
            </h1>
            <p className="text-mf-gray">
              Enter your new password to regain access to your villain vault
            </p>
          </motion.div>

          {/* Reset Password Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-mf-light-gray"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mf-gray w-5 h-5" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors bg-white"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-mf-gray hover:text-black transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-mf-gray mt-2">
                  Password must be at least 8 characters
                </p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mf-gray w-5 h-5" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors bg-white"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-mf-gray hover:text-black transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className={`text-sm ${password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                  {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size={20} />
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Reset Password</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Back to Login */}
            <div className="mt-8 text-center pt-6 border-t border-gray-200">
              <Link 
                href="/auth/login"
                className="text-mf-gray hover:text-black transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to login</span>
              </Link>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-mf-gray">
              "Just remember ALL CAPS when you spell the man name"
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 