'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
}

const buttonVariants = {
  primary: `
    bg-gradient-to-r from-gray-900 to-black text-white 
    hover:from-black hover:to-gray-800 
    focus:ring-4 focus:ring-gray-300 
    shadow-lg hover:shadow-xl
    border border-gray-800
  `,
  secondary: `
    bg-white text-gray-900 border-2 border-gray-900 
    hover:bg-gray-900 hover:text-white 
    focus:ring-4 focus:ring-gray-300
    shadow-md hover:shadow-lg
  `,
  outline: `
    bg-transparent text-gray-900 border-2 border-gray-300 
    hover:border-gray-900 hover:bg-gray-50 
    focus:ring-4 focus:ring-gray-200
  `,
  ghost: `
    bg-transparent text-gray-900 
    hover:bg-gray-100 
    focus:ring-4 focus:ring-gray-200
  `,
  destructive: `
    bg-gradient-to-r from-red-500 to-red-600 text-white 
    hover:from-red-600 hover:to-red-700 
    focus:ring-4 focus:ring-red-300
    shadow-lg hover:shadow-xl
    border border-red-500
  `,
  gradient: `
    bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white 
    hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 
    focus:ring-4 focus:ring-blue-300
    shadow-lg hover:shadow-xl
    border border-blue-500
  `
}

const sizeVariants = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl'
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled = false,
  onClick,
  type = 'button'
}) => {
  const baseClasses = `
    relative inline-flex items-center justify-center
    font-semibold tracking-wide
    rounded-xl
    transition-all duration-300 ease-out
    focus:outline-none
    disabled:opacity-50 disabled:cursor-not-allowed
    overflow-hidden
    group
  `

  const variantClasses = buttonVariants[variant]
  const sizeClasses = sizeVariants[size]

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!loading && !disabled && onClick) {
      onClick(e)
    }
  }

  return (
    <motion.button
      whileHover={{ 
        scale: disabled || loading ? 1 : 1.02,
        y: disabled || loading ? 0 : -1
      }}
      whileTap={{ 
        scale: disabled || loading ? 1 : 0.98 
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
      className={cn(baseClasses, variantClasses, sizeClasses, className)}
      disabled={disabled || loading}
      onClick={handleClick}
      type={type}
    >
      {/* Background Animation Layer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Ripple Effect */}
      <motion.div
        className="absolute inset-0 bg-white/10 rounded-xl"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      />

      {/* Content Container */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {/* Left Icon or Loading Spinner */}
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 size={size === 'sm' ? 16 : size === 'md' ? 18 : size === 'lg' ? 20 : 24} />
          </motion.div>
        ) : leftIcon ? (
          <motion.span
            initial={{ x: -5, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {leftIcon}
          </motion.span>
        ) : null}

        {/* Text Content */}
        <motion.span
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>

        {/* Right Icon */}
        {rightIcon && !loading && (
          <motion.span
            initial={{ x: 5, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="group-hover:translate-x-1 transition-transform duration-300"
          >
            {rightIcon}
          </motion.span>
        )}
      </span>
    </motion.button>
  )
}

// Specialized Button Variants
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="primary" {...props} />
)

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="secondary" {...props} />
)

export const GradientButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="gradient" {...props} />
)

// Icon Button Component
interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon: React.ReactNode
  'aria-label': string
}

export const IconButton: React.FC<IconButtonProps> = ({ 
  icon, 
  size = 'md', 
  className,
  ...props 
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10', 
    lg: 'w-12 h-12',
    xl: 'w-14 h-14'
  }

  return (
    <Button
      size={size}
      className={cn('!p-0 aspect-square', iconSizes[size], className)}
      {...props}
    >
      {icon}
    </Button>
  )
} 