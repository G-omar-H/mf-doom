const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testAPI() {
  try {
    console.log('🧪 Testing API logic...');
    
    // Test the same query that the API uses
    const products = await prisma.product.findMany({
      where: {
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
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    console.log(`Found ${products.length} products`);
    
    if (products.length > 0) {
      console.log('\n📦 Sample product transformation:');
      const product = products[0];
      
      const transformed = {
        ...product,
        stock: product.inventoryItems.reduce((sum, item) => sum + item.quantityAvailable, 0),
        price: Number(product.price),
        compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
        images: product.images.map(img => img.url),
        variants: product.variants.map(variant => ({
          id: variant.id,
          name: variant.name,
          type: variant.type.toLowerCase(),
          options: variant.options,
        })),
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
      
      console.log(`Product: ${transformed.name}`);
      console.log(`Category: ${transformed.category}`);
      console.log(`Price: $${transformed.price}`);
      console.log(`Images: ${transformed.images.length} (${transformed.images[0] || 'none'})`);
      console.log(`Stock: ${transformed.stock}`);
      
      // Test category filtering
      console.log('\n🏷️ Testing category filtering:');
      const tshirts = await prisma.product.findMany({
        where: {
          status: 'ACTIVE',
          category: 'T_SHIRTS'
        }
      });
      console.log(`T-Shirts: ${tshirts.length} products`);
      
      const hoodies = await prisma.product.findMany({
        where: {
          status: 'ACTIVE',
          category: 'HOODIES'
        }
      });
      console.log(`Hoodies: ${hoodies.length} products`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAPI(); 