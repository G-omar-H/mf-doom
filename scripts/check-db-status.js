const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDB() {
  try {
    console.log('🔍 Checking database status...');
    
    const count = await prisma.product.count();
    console.log('Total products in DB:', count);
    
    if (count > 0) {
      const products = await prisma.product.findMany({
        take: 3,
        include: { images: true }
      });
      
      console.log('\n📦 Sample products:');
      products.forEach(p => {
        console.log(`- ${p.name} (${p.category}) - ${p.images.length} images`);
        if (p.images.length > 0) {
          console.log(`  First image: ${p.images[0].url}`);
        }
      });
      
      // Check categories
      const categories = await prisma.product.groupBy({
        by: ['category'],
        _count: { category: true }
      });
      
      console.log('\n📊 Products by category:');
      categories.forEach(cat => {
        console.log(`  ${cat.category}: ${cat._count.category} products`);
      });
      
    } else {
      console.log('❌ No products found in database!');
    }
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDB(); 