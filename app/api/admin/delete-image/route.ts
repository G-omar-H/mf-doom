import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { imagePath } = body

    if (!imagePath) {
      return NextResponse.json(
        { error: 'Image path required' },
        { status: 400 }
      )
    }

    // Convert URL path to filesystem path
    const filename = imagePath.split('/').pop()
    const filepath = join(process.cwd(), 'public', 'images', 'products', filename)

    // Check if file exists and delete it
    if (existsSync(filepath)) {
      await unlink(filepath)
      return NextResponse.json({
        message: 'Image deleted successfully'
      })
    } else {
      return NextResponse.json(
        { error: 'Image file not found' },
        { status: 404 }
      )
    }

  } catch (error) {
    console.error('Image deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 