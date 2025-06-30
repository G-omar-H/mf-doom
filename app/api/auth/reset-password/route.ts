import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { 
  validatePasswordResetToken, 
  removePasswordResetToken 
} from '@/lib/email'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    // Enhanced validation with consistent error messaging
    if (!token?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      )
    }

    // Consistent password validation (matches registration)
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Enhanced password strength validation (consistent with registration)
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' },
        { status: 400 }
      )
    }

    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    console.log('🔐 Password reset attempt with token:', token.substring(0, 8) + '...')

    // Dual validation: memory and database for security
    const memoryTokenData = validatePasswordResetToken(token)
    
    if (!memoryTokenData) {
      console.warn('❌ Invalid or expired reset token (memory):', token.substring(0, 8) + '...')
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Find user with comprehensive validation
    const user = await prisma.user.findFirst({
      where: {
        id: memoryTokenData.userId,
        email: memoryTokenData.email,
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date() // Token hasn't expired
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        passwordResetToken: true,
        passwordResetExpires: true
      }
    })

    if (!user) {
      console.warn('❌ Invalid or expired reset token (database):', {
        userId: memoryTokenData.userId,
        email: memoryTokenData.email,
        tokenPrefix: token.substring(0, 8) + '...'
      })
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    console.log('✅ Valid reset token for user:', user.email)

    // Hash new password with consistent salt rounds (matches registration)
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user password and clear reset token atomically
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        // Optional: update emailVerified if resetting password verifies email
        // emailVerified: user.emailVerified || new Date(),
      }
    })

    // Remove token from memory for security
    removePasswordResetToken(token)

    console.log('✅ Password reset successful for:', user.email)

    return NextResponse.json({
      message: 'Password reset successfully',
      success: true
    })

  } catch (error) {
    console.error('❌ Password reset error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
} 