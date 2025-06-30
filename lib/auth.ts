import { NextAuthOptions, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      avatar?: string
      phone?: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: string
    avatar?: string
    phone?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    avatar?: string
    phone?: string
  }
}

export const authOptions: NextAuthOptions = {
  // Remove PrismaAdapter to fix conflict with JWT strategy
  // The adapter was causing session establishment issues with the new password reset fields
  
  // Security configuration
  secret: process.env.NEXTAUTH_SECRET,
  
  // Session configuration - FIXED for better sync
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 60 * 60, // 1 hour - more frequent updates for better sync (was 4 hours)
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
          // Validate input
          if (!credentials?.email || !credentials?.password) {
            console.warn('Missing email or password in login attempt')
            return null
          }

          if (!prisma) {
            console.error('Database connection not available')
            return null
          }

          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(credentials.email)) {
            console.warn('Invalid email format:', credentials.email)
            return null
          }

          // Find user - exclude password reset fields to avoid conflicts
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase().trim()
            },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              role: true,
              avatar: true,
              phone: true,
              // Explicitly exclude password reset fields
            }
          })

          if (!user) {
            console.warn('User not found:', credentials.email)
            return null
          }

          if (!user.password) {
            console.warn('User has no password set:', credentials.email)
            return null
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            console.warn('Invalid password for user:', credentials.email)
            return null
          }

          console.info('Successful login:', credentials.email)

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar ?? undefined,
            phone: user.phone ?? undefined,
          }
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user, account, profile, trigger }): Promise<JWT> {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.role = user.role
        token.avatar = user.avatar ?? undefined
        token.phone = user.phone ?? undefined
        
        // Ensure token is properly set on initial login
        console.log('JWT callback - Initial login for user:', user.email)
      }

      // Handle token refresh
      if (trigger === 'update' && prisma) {
        try {
          const refreshedUser = await prisma.user.findUnique({
            where: { id: token.id },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              avatar: true,
              phone: true,
            }
          })

          if (refreshedUser) {
            token.name = refreshedUser.name ?? undefined
            token.email = refreshedUser.email ?? undefined
            token.role = refreshedUser.role
            token.avatar = refreshedUser.avatar ?? undefined
            token.phone = refreshedUser.phone ?? undefined
          }
        } catch (error) {
          console.error('Error refreshing user data:', error)
        }
      }

      return token
    },

    async session({ session, token }): Promise<any> {
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.avatar = token.avatar
        session.user.phone = token.phone
        
        // Ensure session is properly established with production logging
        if (process.env.NODE_ENV === 'production') {
          console.log('✅ Production session established for user:', token.email, 'Role:', token.role)
        } else {
          console.log('Session callback - Session established for user:', token.email)
        }
      } else {
        // Log session callback issues for debugging
        console.error('❌ Session callback issue:', {
          hasToken: !!token,
          hasSession: !!session,
          hasUser: !!(session?.user),
          tokenData: token ? { id: token.id, email: token.email, role: token.role } : null
        })
      }
      return session
    },

    async redirect({ url, baseUrl }): Promise<string> {
      console.log('Redirect callback:', { url, baseUrl })
      
      // Handle logout redirect
      if (url.includes('/auth/logout') || url.includes('signout')) {
        console.log('Logout redirect detected, sending to home')
        return baseUrl
      }
      
      // Handle login redirect
      if (url.includes('/auth/login') || url.includes('signin')) {
        console.log('Login redirect detected, checking for callback URL')
        // Check if there's a callbackUrl parameter
        const urlObj = new URL(url, baseUrl)
        const callbackUrl = urlObj.searchParams.get('callbackUrl')
        
        if (callbackUrl) {
          // Validate callback URL is safe
          if (callbackUrl.startsWith('/') && !callbackUrl.startsWith('//')) {
            console.log('Using callback URL:', callbackUrl)
            return `${baseUrl}${callbackUrl}`
          }
        }
        
        // Default redirect after login
        console.log('No valid callback URL, redirecting to dashboard')
        return `${baseUrl}/admin/dashboard`
      }
      
      // Allows relative callback URLs
      if (url.startsWith('/')) {
        console.log('Relative URL redirect:', url)
        return `${baseUrl}${url}`
      }
      
      // Allows callback URLs on the same origin
      if (url.startsWith(baseUrl)) {
        console.log('Same origin redirect:', url)
        return url
      }
      
      // Default to base URL for safety
      console.log('Default redirect to baseUrl')
      return baseUrl
    },

    async signIn({ user, account, profile, email, credentials }): Promise<boolean> {
      console.log('SignIn callback triggered for user:', user.email)
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

  // Debug mode for development
  debug: process.env.NODE_ENV === 'development',

  // Enable CSRF protection
  useSecureCookies: process.env.NODE_ENV === 'production',
} 