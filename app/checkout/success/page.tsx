'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import confetti from 'canvas-confetti'

export default function CheckoutSuccessPage() {
  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#C0C0C0', '#8B0000']
    })
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
          <CheckCircle size={100} className="text-doom-green" />
        </motion.div>

        <h1 className="font-metal text-5xl text-doom-gold mb-4">
          ORDER CONFIRMED!
        </h1>

        <p className="text-xl text-doom-silver mb-8">
          Thank you for your order! Your villainous gear is on its way.
        </p>

        <div className="comic-panel p-8 mb-8">
          <h2 className="font-metal text-2xl text-doom-gold mb-4">
            What's Next?
          </h2>
          <ul className="text-left space-y-3 text-doom-silver">
            <li>✓ You'll receive an order confirmation email shortly</li>
            <li>✓ We'll notify you when your order ships</li>
            <li>✓ Track your order with the link in your email</li>
            <li>✓ Expected delivery: 5-7 business days</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button size="lg">Continue Shopping</Button>
          </Link>
          <Link href="/">
            <Button variant="secondary" size="lg">Back to Home</Button>
          </Link>
        </div>

        <blockquote className="mt-12 text-doom-silver italic">
          "Remember ALL CAPS when you spell the man name"
        </blockquote>
      </motion.div>
    </div>
  )
} 