import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

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
  const search = searchParams.get('search')

  // Map navigation categories to actual product categories
  const getCategoryFilter = (navCategory: string | null) => {
    if (!navCategory || navCategory === 'all') return undefined

    const categoryMap: Record<string, string[]> = {
      'apparel': ['T_SHIRTS', 'HOODIES', 'BEANIES', 'SNEAKERS'],
      'vinyl': ['VINYL'],
      'accessories': ['ACCESSORIES'],
      'art': ['ART'],
      // Also support direct category names
      't_shirts': ['T_SHIRTS'],
      'hoodies': ['HOODIES'], 
      'beanies': ['BEANIES'],
      'sneakers': ['SNEAKERS']
    }

    const categories = categoryMap[navCategory.toLowerCase()]
    if (categories) {
      return categories.length === 1 
        ? { category: categories[0] as any }
        : { category: { in: categories as any[] } }
    }

    return undefined
  }

  try {
    const categoryFilter = getCategoryFilter(category)
    
    const products = await prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        ...categoryFilter,
        ...(featured === 'true' && { featured: true }),
        ...(search && {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive'
              }
            },
            {
              description: {
                contains: search,
                mode: 'insensitive'
              }
            },
            {
              tags: {
                hasSome: search.split(' ')
              }
            }
          ]
        }),
      },
      include: {
        images: true,
        variants: true,
        inventoryItems: {
          select: {
            quantityAvailable: true,
            quantityOnHand: true,
          }
        },
      },
      orderBy: search ? [
        // Prioritize exact name matches
        {
          name: 'asc'
        },
        {
          createdAt: 'desc'
        }
      ] : {
        createdAt: 'desc',
      },
    })

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

    return NextResponse.json(transformedProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
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