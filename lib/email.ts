import crypto from 'crypto'
import nodemailer from 'nodemailer'

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
}

// Create reusable transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG)

// Generate secure verification token
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Store verification tokens in memory (for production, use Redis or database)
const verificationTokens = new Map<string, {
  email: string
  userId: string
  expires: Date
  type: 'verification' | 'email_change'
  pendingEmail?: string
}>()

// Store verification token
export function storeVerificationToken(token: string, data: {
  email: string
  userId: string
  type: 'verification' | 'email_change'
  pendingEmail?: string
}) {
  verificationTokens.set(token, {
    ...data,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  })
}

// Validate verification token
export function validateVerificationToken(token: string) {
  const data = verificationTokens.get(token)
  if (!data) return null
  
  if (data.expires < new Date()) {
    verificationTokens.delete(token)
    return null
  }
  
  return data
}

// Remove verification token
export function removeVerificationToken(token: string) {
  verificationTokens.delete(token)
}

// THISMFDOOM branded email template
function createEmailTemplate(type: 'verification' | 'email_change', verificationUrl: string, userName: string) {
  const isEmailChange = type === 'email_change'
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${isEmailChange ? 'Verify Your New Email' : 'Verify Your Email'} | THISMFDOOM</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: #ffffff;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .logo {
            font-size: 32px;
            font-weight: 900;
            color: #8CD4E6;
            margin-bottom: 10px;
            letter-spacing: 2px;
        }
        .subtitle {
            color: #cccccc;
            font-size: 14px;
            margin: 0;
        }
        .card {
            background: #ffffff;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            color: #333333;
        }
        .icon {
            text-align: center;
            margin-bottom: 30px;
        }
        .icon-circle {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #8CD4E6 0%, #6B46C1 100%);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
        }
        .title {
            font-size: 24px;
            font-weight: 700;
            color: #1a1a1a;
            margin: 0 0 20px 0;
            text-align: center;
        }
        .message {
            font-size: 16px;
            line-height: 1.6;
            color: #666666;
            margin-bottom: 30px;
        }
        .cta-button {
            display: block;
            width: 100%;
            max-width: 300px;
            margin: 0 auto 30px auto;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            transition: transform 0.2s ease;
        }
        .cta-button:hover {
            transform: translateY(-2px);
        }
        .security-note {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
        }
        .security-title {
            font-weight: 600;
            color: #495057;
            margin: 0 0 10px 0;
            font-size: 14px;
        }
        .security-text {
            font-size: 14px;
            color: #6c757d;
            margin: 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            color: #999999;
            font-size: 14px;
        }
        .footer-link {
            color: #8CD4E6;
            text-decoration: none;
        }
        .quote {
            font-style: italic;
            color: #8CD4E6;
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">THISMFDOOM</div>
            <p class="subtitle">VILLAIN COLLECTIVE</p>
        </div>
        
        <div class="card">
            <div class="icon">
                <div class="icon-circle">
                    🎭
                </div>
            </div>
            
            <h1 class="title">
                ${isEmailChange ? 'Verify Your New Email Address' : 'Welcome to the Villain Collective!'}
            </h1>
            
            <div class="message">
                <p>Hey ${userName},</p>
                <p>${isEmailChange 
                    ? 'You\'ve requested to change your email address. To complete this change and keep your villain status secure, please verify your new email address.'
                    : 'Welcome to THISMFDOOM! To complete your villainous transformation and access all features, please verify your email address.'
                }</p>
                <p>Click the button below to verify your email:</p>
            </div>
            
            <a href="${verificationUrl}" class="cta-button">
                ${isEmailChange ? 'Verify New Email' : 'Verify Email Address'}
            </a>
            
            <div class="security-note">
                <div class="security-title">🔒 Security Notice</div>
                <p class="security-text">
                    This verification link will expire in 24 hours. If you didn't request this ${isEmailChange ? 'email change' : 'account creation'}, 
                    please ignore this email or contact our support team.
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p>
                Need help? Contact us at 
                <a href="mailto:support@thismfdoom.shop" class="footer-link">support@thismfdoom.shop</a>
            </p>
            <p>
                Visit us at 
                <a href="https://thismfdoom.shop" class="footer-link">thismfdoom.shop</a>
            </p>
            <p class="quote">"Remember ALL CAPS when you spell the man name"</p>
        </div>
    </div>
</body>
</html>
  `
}

// Send verification email
export async function sendVerificationEmail(
  email: string, 
  token: string, 
  userName: string,
  type: 'verification' | 'email_change' = 'verification'
) {
  try {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`
    const isEmailChange = type === 'email_change'
    
    const mailOptions = {
      from: {
        name: 'THISMFDOOM',
        address: process.env.SMTP_FROM || 'noreply@thismfdoom.shop'
      },
      to: email,
      subject: isEmailChange ? 'Verify Your New Email Address - THISMFDOOM' : 'Verify Your Email - Welcome to THISMFDOOM!',
      html: createEmailTemplate(type, verificationUrl, userName)
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log('Verification email sent:', info.messageId)
    
    return {
      success: true,
      messageId: info.messageId
    }
  } catch (error) {
    console.error('Failed to send verification email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Send test email (for debugging)
export async function sendTestEmail() {
  try {
    await transporter.verify()
    console.log('Email service is ready')
    return true
  } catch (error) {
    console.error('Email service error:', error)
    return false
  }
} 