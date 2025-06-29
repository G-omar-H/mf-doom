'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowRight, Home, Mail, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function VerificationErrorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  
  const errorType = searchParams?.get('error') || 'unknown'

  useEffect(() => {
    setMounted(true)
  }, [])

  const getErrorInfo = (error: string) => {
    switch (error) {
      case 'missing_token':
        return {
          title: 'Missing Verification Token',
          message: 'The verification link appears to be incomplete. Please check your email and click the complete link.',
          action: 'Check Email Again'
        }
      case 'invalid_or_expired':
        return {
          title: 'Link Expired or Invalid',
          message: 'This verification link has expired or is invalid. Verification links expire after 24 hours for security.',
          action: 'Request New Link'
        }
      case 'database_unavailable':
        return {
          title: 'Service Temporarily Unavailable',
          message: 'Our verification service is temporarily unavailable. Please try again in a few moments.',
          action: 'Try Again Later'
        }
      case 'server_error':
        return {
          title: 'Server Error',
          message: 'An unexpected error occurred while processing your verification. Our team has been notified.',
          action: 'Contact Support'
        }
      default:
        return {
          title: 'Verification Failed',
          message: 'Unable to verify your email address. Please try again or contact support if the problem persists.',
          action: 'Go Home'
        }
    }
  }

  const errorInfo = getErrorInfo(errorType)

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="w-16 h-16">
          <Image
            src="/icons/mfdoomcask.gif"
            alt="Loading..."
            width={64}
            height={64}
            className="w-full h-full"
            unoptimized
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Error Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-black text-gray-900 mb-2">
              THISMFDOOM
            </h1>
            <p className="text-sm text-gray-600">VILLAIN COLLECTIVE</p>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              {errorInfo.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {errorInfo.message}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            {errorType === 'invalid_or_expired' ? (
              <Link
                href="/account/profile"
                className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group"
              >
                <RefreshCw className="w-5 h-5" />
                Request New Verification
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : errorType === 'server_error' ? (
              <a
                href="mailto:support@thismfdoom.shop"
                className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group"
              >
                <Mail className="w-5 h-5" />
                Contact Support
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            ) : (
              <Link
                href="/"
                className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group"
              >
                <Home className="w-5 h-5" />
                Go Home
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            
            <Link
              href="/account/profile"
              className="w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              Visit Profile
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 pt-6 border-t border-gray-100"
          >
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-800">Need Help?</p>
                  <p className="text-sm text-amber-700 mt-1">
                    If you continue having issues, contact our support team at{' '}
                    <a href="mailto:support@thismfdoom.shop" className="underline">
                      support@thismfdoom.shop
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-gray-500 italic">
            "Remember ALL CAPS when you spell the man name"
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
} 