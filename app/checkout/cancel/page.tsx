'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function CheckoutCancelPage() {
  const router = useRouter()

  useEffect(() => {
    // Optional: Clear any temporary session data here
    console.log('PayPal payment cancelled')
  }, [])

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-block mb-6"
        >
          <XCircle size={100} className="text-orange-500" />
        </motion.div>

        <h1 className="font-metal text-5xl text-doom-gold mb-4">
          PAYMENT CANCELLED
        </h1>

        <p className="text-xl text-doom-silver mb-8">
          Your PayPal payment was cancelled. No charges were made to your account.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          <Link href="/checkout">
            <Button className="w-full bg-doom-gold hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
              <RefreshCw size={20} className="mr-2" />
              Try Payment Again
            </Button>
          </Link>
          
          <Link href="/cart">
            <Button variant="secondary" className="w-full border-doom-silver text-doom-silver hover:bg-doom-silver hover:text-black py-3 px-6 rounded-lg transition-colors duration-200">
              <ArrowLeft size={20} className="mr-2" />
              Return to Cart
            </Button>
          </Link>
        </div>

        {/* Information Box */}
        <div className="bg-gray-50 rounded-lg p-6 text-left">
          <h3 className="font-medium text-gray-800 mb-3">What happened?</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• You cancelled the payment process on PayPal</li>
            <li>• Your cart items are still saved and waiting for you</li>
            <li>• You can try a different payment method or retry PayPal</li>
            <li>• No charges were made to your account</li>
          </ul>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Need help? Contact our support team:</p>
          <p className="font-medium">
            Email: <a href="mailto:support@mfdoomshop.com" className="text-doom-gold hover:underline">support@mfdoomshop.com</a>
          </p>
        </div>
      </motion.div>
    </div>
  )
} 