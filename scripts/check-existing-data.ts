import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkExistingData() {
  console.log('🔍 Checking existing database data...\n')

  try {
    // Check existing products
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
        category: true,
        featured: true,
        status: true
      }
    })

    console.log(`📦 Existing Products: ${products.length}`)
    if (products.length > 0) {
      console.log('📋 Current products:')
      products.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name} (${product.sku}) - ${product.category} ${product.featured ? '⭐' : ''}`)
      })
      console.log('')
    }

    // Check categories being used
    const categories = await prisma.product.groupBy({
      by: ['category'],
      _count: {
        category: true
      }
    })

    console.log('📊 Products by Category:')
    categories.forEach(cat => {
      console.log(`  ${cat.category}: ${cat._count.category} products`)
    })
    console.log('')

    // Check product images
    const images = await prisma.productImage.count()
    console.log(`🖼️  Total Product Images: ${images}`)

    // Check inventory items
    const inventory = await prisma.inventoryItem.count()
    console.log(`📋 Inventory Items: ${inventory}`)

    // Check product variants
    const variants = await prisma.productVariant.count()
    console.log(`🎯 Product Variants: ${variants}`)

    console.log('\n✅ Database check completed!')

  } catch (error) {
    console.error('❌ Error checking database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkExistingData() 