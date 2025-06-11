import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearAllProducts() {
  try {
    console.log('🗑️  Clearing all existing products from database...')
    
    // Delete in correct order due to foreign key constraints
    await prisma.productReview.deleteMany()
    await prisma.wishlistItem.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.inventoryItem.deleteMany()
    await prisma.productVariant.deleteMany()
    await prisma.productImage.deleteMany()
    await prisma.product.deleteMany()
    
    console.log('✅ All products cleared successfully!')
    
    // Reset auto-increment counters
    await prisma.$executeRaw`ALTER SEQUENCE products_id_seq RESTART WITH 1`
    await prisma.$executeRaw`ALTER SEQUENCE product_images_id_seq RESTART WITH 1`
    await prisma.$executeRaw`ALTER SEQUENCE product_variants_id_seq RESTART WITH 1`
    
    console.log('🔄 Database sequences reset')
    
  } catch (error) {
    console.error('❌ Error clearing products:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearAllProducts() 