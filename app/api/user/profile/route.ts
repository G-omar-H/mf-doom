import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { 
  generateVerificationToken, 
  storeVerificationToken, 
  sendVerificationEmail 
} from '@/lib/email'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const { name, email, phone } = await request.json()

    // Validate input
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Validate phone if provided
    if (phone) {
      const phoneRegex = /^\+\d{1,4}\d{7,}$/
      if (!phoneRegex.test(phone)) {
        return NextResponse.json({ error: 'Invalid phone format' }, { status: 400 })
      }
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, emailVerified: true, name: true }
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if email is being changed
    let emailChanged = false
    if (email !== currentUser.email) {
      emailChanged = true
      
      // Check if email is already taken by another user
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })
      
      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
      }

      // Generate verification token for email change
      const token = generateVerificationToken()
      
      // Store token for email change verification
      storeVerificationToken(token, {
        email: currentUser.email, // Current email
        userId: session.user.id,
        type: 'email_change',
        pendingEmail: email // New email to verify
      })

      // Send verification email to the NEW email address
      const emailResult = await sendVerificationEmail(
        email, // Send to new email
        token,
        name,
        'email_change'
      )

      if (!emailResult.success) {
        return NextResponse.json({ 
          error: 'Failed to send verification email to new address',
          details: emailResult.error 
        }, { status: 500 })
      }
    }

    // Update user profile (but don't change email until verified if it changed)
    const updateData: any = {
      name,
      phone: phone || null,
    }

    // Only update email if it hasn't changed (to maintain current verified status)
    if (!emailChanged) {
      updateData.email = email
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        emailVerified: true
      }
    })

    return NextResponse.json({ 
      user: updatedUser,
      emailChanged,
      message: emailChanged 
        ? 'Profile updated! A verification email has been sent to your new email address. Please verify it to complete the change.' 
        : 'Profile updated successfully!'
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        emailVerified: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 