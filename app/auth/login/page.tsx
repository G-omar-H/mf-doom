'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Invalid credentials')
      } else {
        toast.success('Welcome back, villain!')
        
        // Enhanced session establishment with proper timing for production
        let session = null
        let attempts = 0
        const maxAttempts = 8 // Increased for production reliability
        
        // First, force a session refresh to ensure server-side session is propagated
        await new Promise(resolve => setTimeout(resolve, 500)) // Initial wait for production
        
        while (!session && attempts < maxAttempts) {
          // Progressive backoff: 500ms, 750ms, 1000ms, 1250ms...
          await new Promise(resolve => setTimeout(resolve, 500 + (attempts * 250)))
          
          try {
            session = await getSession()
            
            // Verify session is properly established (not just returned)
            if (session?.user?.id && session?.user?.role) {
              console.log('✅ Session established for:', session.user.email)
              break
            } else if (session) {
              console.warn('⚠️ Incomplete session data, retrying...', session)
              session = null // Force retry if incomplete
            }
          } catch (sessionError) {
            console.warn('Session check failed, retrying...', sessionError)
          }
          
          attempts++
        }
        
        // Additional verification: ensure browser has session cookie
        if (session) {
          // Small delay to ensure browser processes session cookies
          await new Promise(resolve => setTimeout(resolve, 200))
          
          // Final verification - re-check session one more time
          const finalSession = await getSession()
          if (!finalSession?.user?.id) {
            console.warn('Session verification failed, forcing page reload')
            // In extreme cases, reload the page to ensure proper session
            window.location.href = session.user.role === 'ADMIN' ? '/admin/dashboard' : '/account/profile'
            return
          }
        }
        
        if (session?.user?.role === 'ADMIN') {
          router.push('/admin/dashboard')
        } else if (session?.user) {
          router.push('/account/profile')
        } else {
          console.error('❌ Session establishment failed after all retries')
          toast.error('Login succeeded but session failed. Please try again.')
          // Don't redirect - let user try again
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
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
            <div className="w-20 h-20 mx-auto mb-6 bg-black rounded-full flex items-center justify-center">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black mb-2">
              VILLAIN ACCESS
            </h1>
            <p className="text-mf-gray">
              Enter your credentials to access the vault
            </p>
          </motion.div>

          {/* Login Form */}
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
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
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
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link 
                  href="/auth/forgot-password"
                  className="text-sm text-mf-blue hover:text-mf-dark-blue transition-colors font-medium"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div style={{ width: 20, height: 20 }}>
                      <Image
                        src="/icons/mfdoomcask.gif"
                        alt="Loading..."
                        width={20}
                        height={20}
                        className="w-full h-full"
                        unoptimized
                      />
                    </div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </motion.button>
            </form>

            {/* Register Link */}
            <div className="mt-8 text-center pt-6 border-t border-gray-200">
              <p className="text-mf-gray">
                New to the villain collective?{' '}
                <Link 
                  href="/auth/register"
                  className="text-black font-semibold hover:text-mf-blue transition-colors"
                >
                  Join the legion
                </Link>
              </p>
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