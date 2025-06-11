import { PrismaClient } from '@prisma/client'
import { products } from '../lib/data/products'

const prisma = new PrismaClient()

async function migrateProducts() {
  console.log('🚀 Starting product migration...')
  console.log(`📦 Found ${products.length} products to migrate`)

  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    try {
      console.log(`\n⏳ Migrating ${i + 1}/${products.length}: ${product.name}`)

      // Create product
      const createdProduct = await prisma.product.create({
        data: {
          name: product.name,
          slug: product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          description: product.description,
          price: product.price,
          category: product.category.toUpperCase() as any,
          featured: product.featured || false,
          status: 'ACTIVE',
          sku: `DOOM-${product.id.toUpperCase()}`,
          tags: [], // You can add tags later
        },
      })

      // Create variants if they exist
      if (product.variants && product.variants.length > 0) {
        for (const variant of product.variants) {
          await prisma.productVariant.create({
            data: {
              productId: createdProduct.id,
              name: variant.name || variant.type,
              type: variant.type.toUpperCase() as any,
              options: variant.options,
              required: true,
            },
          })
        }
        console.log(`   ✅ Created ${product.variants.length} variants`)
      }

      // Create inventory item
      await prisma.inventoryItem.create({
        data: {
          productId: createdProduct.id,
          sku: `${createdProduct.sku}-DEFAULT`,
          quantityOnHand: product.stock,
          quantityAvailable: product.stock,
          reorderPoint: 5,
          reorderQuantity: 10,
        },
      })

      console.log(`   ✅ Set inventory: ${product.stock} units`)
      console.log(`   🎯 Created product: ${product.name}`)
    } catch (error) {
      console.error(`   ❌ Failed to migrate ${product.name}:`, error)
    }
  }

  console.log('\n🎉 Migration complete!')
  console.log('\n📊 Summary:')
  
  // Get final counts
  const productCount = await prisma.product.count()
  const variantCount = await prisma.productVariant.count()
  const inventoryCount = await prisma.inventoryItem.count()
  
  console.log(`   Products: ${productCount}`)
  console.log(`   Variants: ${variantCount}`)
  console.log(`   Inventory items: ${inventoryCount}`)
}

migrateProducts()
  .catch((error) => {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  }) 