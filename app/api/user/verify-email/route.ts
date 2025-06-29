import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { 
  generateVerificationToken, 
  storeVerificationToken, 
  sendVerificationEmail 
} from '@/lib/email'

export async function POST(request: NextRequest) {
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
      select: { email: true, emailVerified: true, name: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email already verified' }, { status: 400 })
    }

    // Generate verification token
    const token = generateVerificationToken()
    
    // Store token with user data
    storeVerificationToken(token, {
      email: user.email,
      userId: session.user.id,
      type: 'verification'
    })

    // Send THISMFDOOM branded verification email
    const emailResult = await sendVerificationEmail(
      user.email,
      token,
      user.name,
      'verification'
    )

    if (!emailResult.success) {
      return NextResponse.json({ 
        error: 'Failed to send verification email',
        details: emailResult.error 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Verification email sent successfully! Check your inbox and remember ALL CAPS.',
      email: user.email
    })

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 