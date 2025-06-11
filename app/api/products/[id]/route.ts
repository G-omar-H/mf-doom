import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
        status: 'ACTIVE',
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
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Transform product to match existing interface
    const transformedProduct = {
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
    }

    return NextResponse.json(transformedProduct)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
} 