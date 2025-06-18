const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Helper function to extract product name from filename
function extractProductName(filename) {
  // Remove file extension and mf-doom prefix
  let baseName = path.parse(filename).name;
  baseName = baseName.replace(/^mf-doom-/, '');
  
  // Remove view/angle descriptors to group similar products
  baseName = baseName
    .replace(/-front-view$/, '')
    .replace(/-alt-view$/, '')
    .replace(/-front$/, '')
    .replace(/-back$/, '')
    .replace(/-side$/, '')
    .replace(/-rear-view$/, '')
    .replace(/-pair-rear$/, '')
    .replace(/-top-angle$/, '')
    .replace(/-right-side-profile$/, '')
    .replace(/-angle-view$/, '')
    .replace(/-heel-detail-right$/, '')
    .replace(/-pair-angled$/, '')
    .replace(/-folded$/, '')
    .replace(/-flat$/, '')
    .replace(/-front-back$/, '');
  
  // Convert to proper title case
  const cleanName = baseName
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/Tshirt/gi, 'T-Shirt')
    .replace(/Bapesta/gi, 'BAPE Sta')
    .replace(/Graffiti Patch/gi, 'Graffiti Patch')
    .replace(/Multi Color/gi, 'Multi-Color')
    .replace(/All Caps/gi, 'ALL CAPS')
    .replace(/Onetwo/gi, 'One Two');
    
  return cleanName.trim();
}

// Helper function to generate slug
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Helper function to determine category based on folder
function getCategoryFromFolder(folderName) {
  // Map each folder to its specific category
  const categoryMap = {
    'T-Shirts': 'T_SHIRTS',
    'Hoodies': 'HOODIES', 
    'Beanies': 'BEANIES',
    'Sneakers': 'SNEAKERS',
    'Vinyl': 'VINYL',
    'Accessories': 'ACCESSORIES',
    'Art': 'ART'
  };
  
  return categoryMap[folderName] || 'ACCESSORIES';
}

// Update the Prisma enum to match our categories
// Note: You'll need to update your schema.prisma file to include these categories

// Helper function to estimate price based on category and product type
function estimatePrice(category, productName) {
  const name = productName.toLowerCase();
  
  switch(category) {
    case 'T_SHIRTS':
      return 35.00;
    case 'HOODIES':
      return 65.00;
    case 'BEANIES':
      return 28.00;
    case 'SNEAKERS':
      return 350.00;
    case 'VINYL':
      return 45.00;
    case 'ACCESSORIES':
      return 25.00;
    case 'ART':
      return 55.00;
    default:
      return 30.00;
  }
}

// Helper function to generate product description
function generateDescription(category, productName) {
  const lowerName = productName.toLowerCase();
  
  if (lowerName.includes('mask')) {
    return `Official MF DOOM ${productName} featuring the iconic metal mask design. Premium quality materials and authentic artwork.`;
  }
  
  if (lowerName.includes('madvillain')) {
    return `${productName} from the legendary Madvillain collaboration. High-quality construction with exclusive artwork.`;
  }
  
  if (lowerName.includes('operation doomsday')) {
    return `${productName} featuring artwork from the classic Operation Doomsday album. Limited edition design for true fans.`;
  }
  
  if (lowerName.includes('bape')) {
    return `Exclusive ${productName} collaboration piece. Premium sneaker with unique MF DOOM design elements.`;
  }
  
  // Category-specific descriptions
  switch(category) {
    case 'T_SHIRTS':
      return `Premium ${productName} featuring authentic MF DOOM artwork. Made with high-quality cotton for comfort and style.`;
    case 'HOODIES':
      return `Cozy ${productName} with authentic MF DOOM design. Perfect for layering and everyday wear.`;
    case 'BEANIES':
      return `Warm and stylish ${productName} featuring MF DOOM branding. Perfect for cold weather and street style.`;
    case 'SNEAKERS':
      return `Limited edition ${productName} collaboration. Premium sneaker with unique MF DOOM design elements.`;
    case 'VINYL':
      return `Limited edition vinyl featuring the iconic sounds of MF DOOM. Pressed on high-quality vinyl for optimal sound quality.`;
    case 'ACCESSORIES':
      return `Official MF DOOM ${productName.toLowerCase()} accessory. Perfect for any fan of the legendary artist.`;
    case 'ART':
      return `Exclusive MF DOOM artwork piece. Limited edition collectible for serious fans and art enthusiasts.`;
    default:
      return `Official MF DOOM ${productName}. Authentic merchandise for dedicated fans of the legendary artist.`;
  }
}

async function scanImagesAndCreateProducts() {
  const imagesDir = path.join(process.cwd(), 'public', 'images');
  
  try {
    console.log('🔍 Scanning images directory...');
    
    // Clear existing products first
    console.log('🗑️ Clearing existing products...');
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    
    // Group products by their base name to combine multiple angles
    const productGroups = {};
    
    // Scan all image files
    await scanDirectory(imagesDir, '', productGroups);
    
    console.log(`\n📦 Found ${Object.keys(productGroups).length} unique products`);
    
    // Create products from groups
    for (const [productKey, group] of Object.entries(productGroups)) {
      await createProductFromGroup(productKey, group);
    }
    
    console.log('\n✅ Database seeding completed!');
    
    // Show summary by category
    const products = await prisma.product.findMany({
      select: { category: true }
    });
    
    const categoryCounts = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📊 Products by Category:');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} products`);
    });
    
    const totalProducts = await prisma.product.count();
    const totalImages = await prisma.productImage.count();
    console.log(`\nTotal: ${totalProducts} products with ${totalImages} images`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function scanDirectory(dirPath, relativePath, productGroups) {
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item.name);
    const newRelativePath = relativePath ? `${relativePath}/${item.name}` : item.name;
    
    if (item.isDirectory()) {
      // Recursively scan subdirectories
      await scanDirectory(itemPath, newRelativePath, productGroups);
    } else if (item.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(item.name)) {
      // Process image file
      const category = getCategoryFromPath(newRelativePath);
      const productName = extractProductName(item.name);
      const productKey = `${category}-${generateSlug(productName)}`;
      
      if (!productGroups[productKey]) {
        productGroups[productKey] = {
          name: productName,
          category: category,
          categoryPath: getCategoryPath(newRelativePath),
          images: []
        };
      }
      
      productGroups[productKey].images.push({
        filename: item.name,
        relativePath: newRelativePath
      });
    }
  }
}

function getCategoryFromPath(relativePath) {
  const parts = relativePath.split('/');
  const topLevelFolder = parts[0];
  return getCategoryFromFolder(topLevelFolder);
}

function getCategoryPath(relativePath) {
  const parts = relativePath.split('/');
  return parts[0]; // Return the top-level folder name
}

async function createProductFromGroup(productKey, group) {
  const { name, category, categoryPath, images } = group;
  
  const slug = generateSlug(name);
  const price = estimatePrice(category, name);
  const description = generateDescription(category, name);
  
  console.log(`📦 Creating: ${name} [${category}] (${images.length} images)`);
  
  // Create product
  const product = await prisma.product.create({
    data: {
      name: name,
      slug: slug,
      description: description,
      price: price,
      category: category,
      subcategory: categoryPath,
      status: 'ACTIVE',
      featured: Math.random() > 0.7, // 30% chance to be featured
      tags: ['mf-doom', 'official', categoryPath.toLowerCase(), 'authentic', category.toLowerCase()],
      seoTitle: `${name} - Official MF DOOM Merchandise`,
      seoDescription: description
    }
  });
  
  // Add images to product
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const imagePath = `/images/${image.relativePath}`;
    
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: imagePath,
        altText: `${name} - View ${i + 1}`,
        position: i
      }
    });
    
    console.log(`  🖼️ Added: ${image.filename}`);
  }
}

// Run the seeding function
scanImagesAndCreateProducts(); 