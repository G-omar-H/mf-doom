import { NextRequest, NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { 
  validateVerificationToken, 
  removeVerificationToken 
} from '@/lib/email'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      // Redirect to error page
      return redirect('/auth/verification-error?error=missing_token')
    }

    if (!prisma) {
      return redirect('/auth/verification-error?error=database_unavailable')
    }

    // Validate the verification token
    const tokenData = validateVerificationToken(token)
    
    if (!tokenData) {
      return redirect('/auth/verification-error?error=invalid_or_expired')
    }

    // Handle different verification types
    if (tokenData.type === 'verification') {
      // Regular email verification
      await prisma.user.update({
        where: { id: tokenData.userId },
        data: {
          emailVerified: new Date(),
        }
      })
      
      // Remove the used token
      removeVerificationToken(token)
      
      // Redirect to success page
      return redirect('/auth/verification-success')
      
    } else if (tokenData.type === 'email_change' && tokenData.pendingEmail) {
      // Email change verification
      await prisma.user.update({
        where: { id: tokenData.userId },
        data: {
          email: tokenData.pendingEmail,
          emailVerified: new Date(),
        }
      })
      
      // Remove the used token
      removeVerificationToken(token)
      
      // Redirect to success page with email change confirmation
      return redirect('/auth/verification-success?type=email_change')
    }

    return redirect('/auth/verification-error?error=unknown_type')

  } catch (error) {
    console.error('Email verification error:', error)
    return redirect('/auth/verification-error?error=server_error')
  }
} 