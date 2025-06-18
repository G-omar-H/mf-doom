const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addInventoryToProducts() {
  try {
    console.log('📦 Adding inventory to products...');
    
    const products = await prisma.product.findMany({
      include: {
        inventoryItems: true
      }
    });
    
    console.log(`Found ${products.length} products`);
    
    for (const product of products) {
      if (product.inventoryItems.length === 0) {
        // Create a basic inventory item for each product
        const inventory = await prisma.inventoryItem.create({
          data: {
            productId: product.id,
            sku: `${product.slug}-default`,
            quantityOnHand: 50, // Default stock
            quantityReserved: 0,
            quantityAvailable: 50,
            reorderPoint: 5,
            reorderQuantity: 25,
            cost: Number(product.price) * 0.6 // 60% of retail price as cost
          }
        });
        
        console.log(`  ✅ Added inventory for: ${product.name} (50 units)`);
      } else {
        console.log(`  ⏭️ Skipped: ${product.name} (already has inventory)`);
      }
    }
    
    console.log('\n📊 Final inventory summary:');
    const inventoryCount = await prisma.inventoryItem.count();
    console.log(`Total inventory items: ${inventoryCount}`);
    
    // Test stock calculation
    const testProduct = await prisma.product.findFirst({
      include: {
        inventoryItems: {
          select: {
            quantityAvailable: true,
            quantityOnHand: true,
          }
        },
      }
    });
    
    if (testProduct) {
      const stock = testProduct.inventoryItems.reduce((sum, item) => sum + item.quantityAvailable, 0);
      console.log(`Sample product "${testProduct.name}" stock: ${stock}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addInventoryToProducts(); 