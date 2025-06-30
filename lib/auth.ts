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
  
  // Session configuration
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours - how often to update the session
  },

  // JWT configuration
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Cookie configuration for enhanced security
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        // Remove domain restriction that was causing cookie issues
        // domain: process.env.NODE_ENV === 'production' ? process.env.NEXTAUTH_URL_DOMAIN : undefined,
      }
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
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
        
        // Ensure session is properly established
        console.log('Session callback - Session established for user:', token.email)
      }
      return session
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },

    async signIn({ user, account, profile, email, credentials }) {
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