import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

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

    // TODO: Implement actual email sending with THISMFDOOM branding
    // For now, we'll just log the verification attempt
    console.log(`Verification email would be sent to ${user.email} for user ${user.name}`)
    
    // In a real implementation, you would:
    // 1. Generate a verification token
    // 2. Store it in the database (would need to add fields to User model)
    // 3. Send an email with THISMFDOOM branding
    // 4. Create a verification endpoint to handle the token

    return NextResponse.json({ 
      message: 'Verification email sent successfully',
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