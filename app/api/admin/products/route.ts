import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    // Fetch all products with complete details
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        images: {
          select: { url: true }
        },
        inventoryItems: {
          select: {
            quantityAvailable: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        },
        orderItems: {
          select: {
            quantity: true
          }
        }
      }
    })

    // Transform products for admin interface
    const transformedProducts = products.map(product => {
      const totalStock = product.inventoryItems.reduce((sum: number, inv: any) => sum + inv.quantityAvailable, 0)
      const avgRating = product.reviews.length > 0 
        ? product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length 
        : 0
      const totalSold = product.orderItems.reduce((sum: number, item: any) => sum + item.quantity, 0)

      return {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
        category: product.category,
        status: product.status,
        featured: product.featured,
        stock: totalStock,
        totalSold,
        avgRating: Number(avgRating.toFixed(1)),
        reviewCount: product.reviews.length,
        images: product.images.map(img => img.url),
        tags: product.tags,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }
    })

    return NextResponse.json({
      products: transformedProducts,
      total: transformedProducts.length
    })

  } catch (error) {
    console.error('Admin products API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    const {
      name,
      description,
      price,
      compareAtPrice,
      category,
      status = 'DRAFT',
      featured = false,
      tags = [],
      images = []
    } = await request.json()

    // Validate required fields
    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, price, and category are required' },
        { status: 400 }
      )
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: 'At least one product image is required' },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    // Check if slug exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug }
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'A product with this name already exists' },
        { status: 400 }
      )
    }

    // Create product with all data
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        compareAtPrice: compareAtPrice || null,
        category,
        status,
        featured,
        tags,
        // Create product images
        images: {
          create: images.map((url: string, index: number) => ({
            url,
            position: index,
            altText: `${name} - Image ${index + 1}`
          }))
        }
      },
      include: {
        images: {
          orderBy: { position: 'asc' }
        }
      }
    })

    // Transform response to match frontend expectations
    const transformedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      category: product.category,
      status: product.status,
      featured: product.featured,
      tags: product.tags,
      images: product.images.map((img: any) => img.url),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }

    return NextResponse.json({
      message: 'Product created successfully',
      product: transformedProduct
    })

  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 