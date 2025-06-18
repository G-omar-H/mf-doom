'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function CheckoutCancelPage() {
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
          <XCircle size={100} className="text-red-500" />
        </motion.div>

        <h1 className="font-metal text-5xl text-doom-gold mb-4">
          PAYMENT CANCELLED
        </h1>

        <p className="text-xl text-doom-silver mb-8">
          No worries! Your cart is still saved and ready when you are.
        </p>

        <div className="comic-panel p-8 mb-8">
          <h2 className="font-metal text-2xl text-doom-gold mb-4">
            What Happened?
          </h2>
          <div className="text-left space-y-3 text-doom-silver">
            <p>• You cancelled the PayPal payment process</p>
            <p>• Your cart items are still saved</p>
            <p>• No charges were made to your account</p>
            <p>• You can try again whenever you're ready</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/checkout">
            <Button size="lg" className="flex items-center gap-2">
              <ArrowLeft size={18} />
              Back to Checkout
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="secondary" size="lg" className="flex items-center gap-2">
              <ShoppingCart size={18} />
              View Cart
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="secondary" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>

        <blockquote className="mt-12 text-doom-silver italic">
          "Take your time, the villain's lair will wait for you"
        </blockquote>
      </motion.div>
    </div>
  )
} 