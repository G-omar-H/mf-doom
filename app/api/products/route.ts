import { NextRequest, NextResponse } from 'next/server'
import { prisma, withRetry, checkDatabaseConnection } from '@/lib/db'

export async function GET(request: NextRequest) {
  // Check if Prisma is available (might be null during build time)
  if (!prisma) {
    return NextResponse.json(
      { error: 'Database not available' },
      { status: 503 }
    )
  }

  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')

  try {
    // Use retry logic for database operations
    const products = await withRetry(async () => {
      // Quick connection check
      const isConnected = await checkDatabaseConnection()
      if (!isConnected) {
        throw new Error('Database connection failed')
      }

      return await prisma!.product.findMany({
        where: {
          status: 'ACTIVE',
          ...(category && category !== 'all' && { 
            category: category.toUpperCase() as any 
          }),
          ...(featured === 'true' && { featured: true }),
        },
        include: {
          images: {
            select: {
              url: true,
              altText: true,
              position: true
            },
            orderBy: { position: 'asc' }
          },
          variants: {
            select: {
              id: true,
              name: true,
              type: true,
              options: true
            }
          },
          inventoryItems: {
            select: {
              quantityAvailable: true,
              quantityOnHand: true,
            }
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        // Add timeout protection
        take: 100, // Limit results for better performance
      })
    }, 3, 1000) // 3 retries with 1s base delay

    // Transform products to match existing interface
    const transformedProducts = products.map((product: any) => ({
      ...product,
      // Calculate total stock from inventory items
      stock: product.inventoryItems.reduce((sum: number, item: any) => sum + item.quantityAvailable, 0),
      // Convert Decimal to number for frontend
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
      // Transform images to URL strings
      images: product.images.map((img: any) => img.url),
      // Transform variants to match existing structure
      variants: product.variants.map((variant: any) => ({
        id: variant.id,
        name: variant.name,
        type: variant.type.toLowerCase(),
        options: variant.options,
      })),
      // Keep existing date format
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }))

    return NextResponse.json(transformedProducts, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    
    // Return more specific error information
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products'
    
    return NextResponse.json(
      { 
        error: errorMessage,
        timestamp: new Date().toISOString(),
        category: category || 'all'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Check if Prisma is available (might be null during build time)
  if (!prisma) {
    return NextResponse.json(
      { error: 'Database not available' },
      { status: 503 }
    )
  }

  // Admin only - create new product
  try {
    const body = await request.json()
    
    const product = await prisma.product.create({
      data: {
        ...body,
        slug: body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        category: body.category.toUpperCase(),
      },
      include: {
        images: true,
        variants: true,
        inventoryItems: true,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
} 