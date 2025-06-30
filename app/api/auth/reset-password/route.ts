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

    if (!token || !password) {
      return NextResponse.json(
        { message: 'Token and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    if (!prisma) {
      return NextResponse.json(
        { message: 'Database not available' },
        { status: 503 }
      )
    }

    // Validate token from memory
    const memoryTokenData = validatePasswordResetToken(token)
    
    if (!memoryTokenData) {
      return NextResponse.json(
        { message: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Find user by token and check expiry
    const user = await prisma.user.findFirst({
      where: {
        id: memoryTokenData.userId,
        email: memoryTokenData.email,
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date() // Token hasn't expired
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null
      }
    })

    // Remove token from memory
    removePasswordResetToken(token)

    return NextResponse.json({
      message: 'Password reset successfully',
      success: true
    })

  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { message: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
} 