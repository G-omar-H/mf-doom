import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { 
  generatePasswordResetToken, 
  storePasswordResetToken, 
  sendPasswordResetEmail 
} from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      )
    }

    if (!prisma) {
      return NextResponse.json(
        { message: 'Database not available' },
        { status: 503 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    // Always return success to prevent email enumeration
    // Even if user doesn't exist, we pretend to send email
    if (!user) {
      // Simulate delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return NextResponse.json({
        message: 'If an account with that email exists, you will receive a password reset email.',
        success: true
      })
    }

    // Generate password reset token
    const resetToken = generatePasswordResetToken()
    
    // Store token in memory and database
    storePasswordResetToken(resetToken, {
      email: user.email,
      userId: user.id
    })

    // Update user record with reset token and expiry
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour
      }
    })

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(
      user.email,
      resetToken,
      user.name
    )

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error)
      
      // Clean up token if email failed
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: null,
          passwordResetExpires: null
        }
      })

      return NextResponse.json(
        { message: 'Failed to send password reset email. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'If an account with that email exists, you will receive a password reset email.',
      success: true
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { message: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
} 