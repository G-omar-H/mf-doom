import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { validatePasswordResetToken } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required' },
        { status: 400 }
      )
    }

    if (!prisma) {
      return NextResponse.json(
        { message: 'Database not available' },
        { status: 503 }
      )
    }

    // First validate token from memory (quick check)
    const memoryTokenData = validatePasswordResetToken(token)
    
    // Also validate from database (authoritative check)
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date() // Token hasn't expired
        }
      }
    })

    // Token must exist in both memory and database
    if (!memoryTokenData || !user) {
      return NextResponse.json(
        { message: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Verify the token data matches
    if (memoryTokenData.userId !== user.id || memoryTokenData.email !== user.email) {
      return NextResponse.json(
        { message: 'Token validation failed' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Token is valid',
      success: true,
      userId: user.id,
      email: user.email
    })

  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json(
      { message: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
} 