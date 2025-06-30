'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Mail, Lock, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setEmailSent(true)
        toast.success('Password reset email sent!')
      } else {
        toast.error(data.error || data.message || 'Something went wrong')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-mf-light-gray to-mf-blue/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            {/* Success State */}
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
                CHECK YOUR EMAIL
              </h1>
              <p className="text-mf-gray">
                Password reset instructions sent to your villain vault
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-mf-light-gray"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-mf-blue/10 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-mf-blue" />
                </div>
                
                <h2 className="text-xl font-bold">Email Sent Successfully!</h2>
                
                <p className="text-mf-gray text-sm">
                  We've sent password reset instructions to:
                </p>
                <p className="font-semibold text-mf-blue">{email}</p>
                
                <div className="bg-mf-light-gray rounded-lg p-4 text-left">
                  <h3 className="font-semibold text-sm mb-2">What's next?</h3>
                  <ol className="text-sm text-mf-gray space-y-1">
                    <li>1. Check your email inbox</li>
                    <li>2. Click the reset link in the email</li>
                    <li>3. Create a new secure password</li>
                    <li>4. Return to your villain activities</li>
                  </ol>
                </div>

                <div className="pt-4">
                  <p className="text-xs text-mf-gray mb-4">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  
                  <button
                    onClick={() => setEmailSent(false)}
                    className="text-mf-blue hover:text-mf-dark-blue font-medium text-sm"
                  >
                    Try a different email address
                  </button>
                </div>
              </div>

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
            <div className="w-20 h-20 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black mb-2">
              FORGOT PASSWORD?
            </h1>
            <p className="text-mf-gray">
              No worries, we'll help you regain access to your villain vault
            </p>
          </motion.div>

          {/* Forgot Password Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-mf-light-gray"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mf-gray w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-mf-blue focus:outline-none transition-colors bg-white"
                    placeholder="villain@doom.com"
                    required
                  />
                </div>
                <p className="text-xs text-mf-gray mt-2">
                  Enter the email address associated with your account
                </p>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size={20} />
                    <span>Sending Reset Email...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span>Send Reset Email</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Security Note */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 text-yellow-600 mt-0.5">
                  🔒
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-yellow-800">Security Notice</h3>
                  <p className="text-xs text-yellow-700 mt-1">
                    For your security, password reset links expire after 1 hour. 
                    If you don't see the email, check your spam folder.
                  </p>
                </div>
              </div>
            </div>

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