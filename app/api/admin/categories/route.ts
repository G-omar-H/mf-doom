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

    // Get all categories from enum with product counts
    const categoryData = await Promise.all([
      // T_SHIRTS
      prisma.product.count({ where: { category: 'T_SHIRTS' } }),
      // HOODIES  
      prisma.product.count({ where: { category: 'HOODIES' } }),
      // BEANIES
      prisma.product.count({ where: { category: 'BEANIES' } }),
      // SNEAKERS
      prisma.product.count({ where: { category: 'SNEAKERS' } }),
      // VINYL
      prisma.product.count({ where: { category: 'VINYL' } }),
      // ACCESSORIES
      prisma.product.count({ where: { category: 'ACCESSORIES' } }),
      // ART
      prisma.product.count({ where: { category: 'ART' } }),
    ])

    const categories = [
      {
        id: 'T_SHIRTS',
        name: 'T-Shirts',
        slug: 't-shirts',
        description: 'Premium MF DOOM t-shirts and tees',
        isActive: true,
        productCount: categoryData[0],
        createdAt: new Date().toISOString()
      },
      {
        id: 'HOODIES',
        name: 'Hoodies',
        slug: 'hoodies',
        description: 'Comfortable MF DOOM hoodies and sweatshirts',
        isActive: true,
        productCount: categoryData[1],
        createdAt: new Date().toISOString()
      },
      {
        id: 'BEANIES',
        name: 'Beanies',
        slug: 'beanies',
        description: 'Stylish MF DOOM beanies and winter wear',
        isActive: true,
        productCount: categoryData[2],
        createdAt: new Date().toISOString()
      },
      {
        id: 'SNEAKERS',
        name: 'Sneakers',
        slug: 'sneakers',
        description: 'Limited edition MF DOOM footwear',
        isActive: true,
        productCount: categoryData[3],
        createdAt: new Date().toISOString()
      },
      {
        id: 'VINYL',
        name: 'Vinyl',
        slug: 'vinyl',
        description: 'Classic MF DOOM vinyl records and albums',
        isActive: true,
        productCount: categoryData[4],
        createdAt: new Date().toISOString()
      },
      {
        id: 'ACCESSORIES',
        name: 'Accessories',
        slug: 'accessories', 
        description: 'MF DOOM accessories and collectibles',
        isActive: true,
        productCount: categoryData[5],
        createdAt: new Date().toISOString()
      },
      {
        id: 'ART',
        name: 'Art',
        slug: 'art',
        description: 'Original MF DOOM artwork and prints',
        isActive: true,
        productCount: categoryData[6],
        createdAt: new Date().toISOString()
      }
    ]

    return NextResponse.json({
      categories,
      total: categories.length
    })

  } catch (error) {
    console.error('Admin categories API error:', error)
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

    return NextResponse.json(
      { error: 'Cannot create new categories. Categories are predefined enums. Use PUT to update existing categories.' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Category creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 