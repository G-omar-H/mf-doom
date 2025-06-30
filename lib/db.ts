import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Improved Prisma configuration for better Vercel + Supabase reliability
const createPrismaClient = (): PrismaClient | null => {
  if (!process.env.DATABASE_URL) {
    console.log('DATABASE_URL not found, skipping Prisma initialization')
    return null
  }
  
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Better connection handling for Vercel serverless
    errorFormat: 'pretty',
  })
}

// Connection pooling and retry logic
export const prisma: PrismaClient | null = (() => {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  const client = createPrismaClient()
  
  if (client && process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client
  }
  
  return client
})()

// Connection health check utility
export async function checkDatabaseConnection(): Promise<boolean> {
  if (!prisma) return false
  
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

// Retry wrapper for database operations
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error: any) {
      lastError = error
      
      // Don't retry on authentication or permission errors
      if (error.code === 'P2025' || error.code === 'P2002') {
        throw error
      }
      
      // Wait before retrying (exponential backoff)
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
      }
    }
  }
  
  throw lastError
} 