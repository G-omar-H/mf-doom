import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Fetch specific product with complete details
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: {
          select: { url: true }
        },
        inventoryItems: {
          select: {
            quantityAvailable: true
          }
        },
        variants: {
          select: {
            id: true,
            name: true,
            type: true,
            options: true
          }
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            title: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                name: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        orderItems: {
          where: {
            order: {
              status: 'DELIVERED'
            }
          },
          select: {
            quantity: true,
            totalPrice: true
          }
        },
        productViews: {
          select: { id: true }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Calculate analytics
    const totalStock = product.inventoryItems.reduce((sum, inv) => sum + inv.quantityAvailable, 0)
    const totalSold = product.orderItems.reduce((sum, item) => sum + item.quantity, 0)
    const totalRevenue = product.orderItems.reduce((sum, item) => sum + Number(item.totalPrice), 0)
    const avgRating = product.reviews.length > 0 
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
      : 0
    const viewCount = product.productViews.length

    // Transform product for frontend
    const transformedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
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
      updatedAt: product.updatedAt,
      variants: product.variants.map(variant => ({
        id: variant.id,
        name: variant.name,
        type: variant.type,
        options: variant.options
      })),
      reviews: product.reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        title: review.title || '',
        content: review.content,
        userName: review.user.name,
        createdAt: review.createdAt
      })),
      salesAnalytics: {
        totalRevenue,
        totalOrders: product.orderItems.length,
        conversionRate: viewCount > 0 ? (totalSold / viewCount) * 100 : 0,
        viewCount
      }
    }

    return NextResponse.json({ product: transformedProduct })

  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const updateData = await request.json()

    // Prepare update object
    const productUpdate: any = {}
    
    if (updateData.name !== undefined) productUpdate.name = updateData.name
    if (updateData.description !== undefined) productUpdate.description = updateData.description
    if (updateData.price !== undefined) productUpdate.price = updateData.price
    if (updateData.compareAtPrice !== undefined) productUpdate.compareAtPrice = updateData.compareAtPrice
    if (updateData.category !== undefined) productUpdate.category = updateData.category
    if (updateData.status !== undefined) productUpdate.status = updateData.status
    if (updateData.featured !== undefined) productUpdate.featured = updateData.featured
    if (updateData.tags !== undefined) productUpdate.tags = updateData.tags

    // Handle images update if provided
    if (updateData.images !== undefined) {
      // First delete all existing images
      await prisma.productImage.deleteMany({
        where: { productId: params.id }
      })
      
      // Then create new images
      if (updateData.images.length > 0) {
        await prisma.productImage.createMany({
          data: updateData.images.map((url: string, index: number) => ({
            productId: params.id,
            url,
            position: index,
            altText: `${updateData.name || 'Product'} - Image ${index + 1}`
          }))
        })
      }
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: productUpdate,
      include: {
        images: {
          orderBy: { position: 'asc' }
        }
      }
    })

    return NextResponse.json({
      message: 'Product updated successfully',
      product: {
        id: updatedProduct.id,
        name: updatedProduct.name,
        status: updatedProduct.status,
        featured: updatedProduct.featured,
        images: updatedProduct.images.map((img: any) => img.url),
        updatedAt: updatedProduct.updatedAt
      }
    })

  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        orderItems: { select: { id: true } }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if product has order items (might want to prevent deletion)
    if (product.orderItems.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete product with existing orders. Consider archiving instead.' },
        { status: 400 }
      )
    }

    // Delete product (this will cascade delete related records due to schema constraints)
    await prisma.product.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: 'Product deleted successfully'
    })

  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 