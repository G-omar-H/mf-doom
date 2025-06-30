import { NextAuthOptions, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

// Debug environment variables
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 NextAuth Environment Check:', {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing',
    NODE_ENV: process.env.NODE_ENV
  })
}

// Types are defined in types/next-auth.d.ts to avoid conflicts

export const authOptions: NextAuthOptions = {
  // Remove PrismaAdapter to fix conflict with JWT strategy
  // The adapter was causing session establishment issues with the new password reset fields
  
  // Security configuration
  secret: process.env.NEXTAUTH_SECRET,
  
  // Debug environment variables
  ...(process.env.NODE_ENV === 'development' && {
    debug: true,
  }),
  
  // Session configuration - IMPROVED for better sync
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 5 * 60, // 5 minutes - much more frequent updates for immediate sync (was 1 hour)
  },

  // JWT configuration
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Cookie configuration for enhanced security and better sync
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // Explicit maxAge for session token
      }
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60, // 15 minutes for callback URL
      }
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60, // 15 minutes for CSRF token
      }
    },
  },

  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Email and Password',
      credentials: {
        email: { 
          label: 'Email', 
          type: 'email',
          placeholder: 'your@email.com'
        },
        password: { 
          label: 'Password', 
          type: 'password',
          placeholder: 'Your password'
        }
      },
      async authorize(credentials): Promise<User | null> {
        try {
          console.log('🔑 Authorization attempt for:', credentials?.email)
          
          // Validate input with detailed logging
          if (!credentials?.email?.trim() || !credentials?.password) {
            console.warn('❌ Missing credentials:', { 
              hasEmail: !!credentials?.email, 
              hasPassword: !!credentials?.password 
            })
            return null
          }

          if (!prisma) {
            console.error('❌ Database connection not available')
            return null
          }

          const normalizedEmail = credentials.email.toLowerCase().trim()

          // Validate email format for security
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(normalizedEmail)) {
            console.warn('❌ Invalid email format:', credentials.email)
            return null
          }

          // Find user with explicit field selection for performance
          const user = await prisma.user.findUnique({
            where: {
              email: normalizedEmail
            },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              role: true,
              avatar: true,
              phone: true,
              emailVerified: true,
              // Explicitly exclude password reset fields for security
            }
          })

          if (!user) {
            console.warn('❌ User not found:', normalizedEmail)
            return null
          }

          if (!user.password) {
            console.warn('❌ User has no password set:', normalizedEmail)
            return null
          }

          // Verify password with timing-safe comparison
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            console.warn('❌ Invalid password for user:', normalizedEmail)
            return null
          }

          console.log('✅ Successful login for:', normalizedEmail)

          // Return user object with explicit type casting for consistency
          const returnUser: User = {
            id: user.id,
            email: user.email,
            name: user.name || '',
            role: user.role,
            avatar: user.avatar || undefined,
            phone: user.phone || undefined,
          }

          console.log('🎯 Returning user object:', {
            id: returnUser.id,
            email: returnUser.email,
            role: returnUser.role,
            hasAvatar: !!returnUser.avatar,
            hasPhone: !!returnUser.phone
          })
          
          return returnUser
        } catch (error) {
          console.error('❌ Authentication error:', error)
          return null
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }): Promise<JWT> {
      console.log('🔐 JWT Callback triggered:', { 
        hasUser: !!user, 
        hasToken: !!token, 
        hasAccount: !!account,
        trigger,
        tokenId: token?.id,
        userId: user?.id,
        timestamp: new Date().toISOString()
      })

      // Initial sign in - establish token
      if (user && account) {
        console.log('👤 Establishing JWT token for new login:', user.email)
        token.id = user.id
        token.role = user.role
        token.avatar = user.avatar
        token.phone = user.phone
        
        console.log('✅ JWT token established:', {
          id: token.id,
          email: token.email,
          role: token.role,
          provider: account.provider,
          tokenSub: token.sub
        })
      }

      // Handle token refresh and updates
      if (trigger === 'update' && prisma) {
        try {
          console.log('🔄 Refreshing JWT token for user:', token.id)
          const refreshedUser = await prisma.user.findUnique({
            where: { id: token.id },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              avatar: true,
              phone: true,
              emailVerified: true
            }
          })

          if (refreshedUser) {
            // Update token with fresh user data
            token.name = refreshedUser.name || undefined
            token.email = refreshedUser.email || undefined
            token.role = refreshedUser.role
            token.avatar = refreshedUser.avatar || undefined
            token.phone = refreshedUser.phone || undefined
            
            console.log('✅ JWT token refreshed successfully:', {
              id: refreshedUser.id,
              email: refreshedUser.email,
              role: refreshedUser.role,
              refreshTime: new Date().toISOString()
            })
          } else {
            console.error('❌ User not found during token refresh:', token.id)
          }
        } catch (error) {
          console.error('❌ Error refreshing JWT token:', error)
        }
      }

      // Session update trigger
      if (trigger === 'update' && session) {
        console.log('🔄 Updating JWT token from session data')
        // Update token with any session changes
        if (session.user) {
          token.name = session.user.name || token.name
          token.avatar = session.user.avatar || token.avatar
          token.phone = session.user.phone || token.phone
        }
      }

      console.log('🎯 JWT token finalized:', {
        id: token.id,
        email: token.email,
        role: token.role,
        hasAvatar: !!token.avatar,
        hasPhone: !!token.phone,
        sub: token.sub,
        iat: token.iat,
        exp: token.exp
      })

      return token
    },

    async session({ session, token }): Promise<any> {
      console.log('🎫 Session Callback triggered:', {
        hasSession: !!session,
        hasToken: !!token,
        hasUser: !!(session?.user),
        tokenId: token?.id,
        tokenEmail: token?.email,
        tokenRole: token?.role
      })

      if (token && session?.user) {
        // Map token data to session with explicit type checking
        session.user.id = token.id
        session.user.role = token.role
        session.user.avatar = token.avatar
        session.user.phone = token.phone
        
        console.log('✅ Session synchronized successfully:', {
          id: session.user.id,
          email: session.user.email,
          role: session.user.role,
          hasAvatar: !!session.user.avatar,
          hasPhone: !!session.user.phone,
          syncTime: new Date().toISOString()
        })
      } else {
        console.error('❌ Session synchronization failed:', {
          reason: !token ? 'No token' : !session ? 'No session' : !session.user ? 'No session.user' : 'Unknown',
          hasToken: !!token,
          hasSession: !!session,
          hasUser: !!(session?.user),
          tokenData: token ? { 
            id: token.id, 
            email: token.email, 
            role: token.role,
            sub: token.sub 
          } : null,
          sessionData: session ? { 
            userExists: !!session.user,
            expires: session.expires 
          } : null,
          timestamp: new Date().toISOString()
        })
      }
      
      return session
    },

    async redirect({ url, baseUrl }): Promise<string> {
      console.log('🔄 Redirect callback triggered:', { 
        url, 
        baseUrl,
        timestamp: new Date().toISOString()
      })
      
      // Handle logout redirect
      if (url.includes('/auth/logout') || url.includes('signout')) {
        console.log('🚪 Logout redirect detected, sending to home')
        return baseUrl
      }
      
      // Handle post-login redirect - enhanced for admin dashboard
      if (url.includes('/admin/dashboard') || url.includes('admin')) {
        console.log('🔐 Admin dashboard redirect detected')
        return `${baseUrl}/admin/dashboard`
      }
      
      // Handle callback URL parameter
      const urlObj = new URL(url, baseUrl)
      const callbackUrl = urlObj.searchParams.get('callbackUrl')
      if (callbackUrl) {
        // Ensure callback URL is safe (same origin)
        if (callbackUrl.startsWith('/') && !callbackUrl.startsWith('//')) {
          console.log('📍 Using callback URL:', callbackUrl)
          return `${baseUrl}${callbackUrl}`
        }
        // If callback URL is absolute, check if it's same origin
        try {
          const callbackUrlObj = new URL(callbackUrl)
          const baseUrlObj = new URL(baseUrl)
          if (callbackUrlObj.origin === baseUrlObj.origin) {
            console.log('🏠 Same origin callback URL:', callbackUrl)
            return callbackUrl
          }
        } catch (e) {
          console.warn('⚠️ Invalid callback URL:', callbackUrl)
        }
      }
      
      // Allows relative callback URLs
      if (url.startsWith('/')) {
        console.log('📍 Relative URL redirect:', url)
        return `${baseUrl}${url}`
      }
      
      // Allows callback URLs on the same origin
      if (url.startsWith(baseUrl)) {
        console.log('🏠 Same origin redirect:', url)
        return url
      }
      
      // Default to admin dashboard for authenticated users
      console.log('🏠 Default redirect to admin dashboard')
      return `${baseUrl}/admin/dashboard`
    },

    async signIn({ user, account, profile, email, credentials }): Promise<boolean> {
      console.log('✅ SignIn callback triggered:', {
        userEmail: user.email,
        userId: user.id,
        userRole: user.role,
        provider: account?.provider
      })
      // Always allow sign in for credentials provider
      return true
    }
  },

  // Custom pages
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/welcome'
  },

  // Event handlers for logging and monitoring
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.info('User signed in successfully:', { 
        userId: user.id, 
        email: user.email, 
        isNewUser,
        provider: account?.provider 
      })
    },
    async signOut({ session, token }) {
      console.info('User signed out:', { 
        userId: token?.id, 
        email: token?.email 
      })
    },
    async createUser({ user }) {
      console.info('New user created:', { 
        userId: user.id, 
        email: user.email 
      })
    },
    async updateUser({ user }) {
      console.info('User updated:', { 
        userId: user.id, 
        email: user.email 
      })
    },
    async linkAccount({ user, account, profile }) {
      console.info('Account linked:', { 
        userId: user.id, 
        provider: account.provider 
      })
    },
    async session({ session, token }) {
      // Session accessed - can be used for analytics
      if (process.env.NODE_ENV === 'development') {
        console.debug('Session accessed:', { userId: token?.id })
      }
    }
  },

  // Theme configuration
  theme: {
    colorScheme: 'light',
    brandColor: '#8CD4E6', // MF DOOM brand blue
    logo: '/images/mf-doom-logo.png',
    buttonText: '#ffffff'
  },

  // Enable CSRF protection
  useSecureCookies: process.env.NODE_ENV === 'production',
} 