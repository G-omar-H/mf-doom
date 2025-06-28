import { PrismaClient, Prisma, ProductCategory, UserRole, OrderStatus, PaymentStatus, FulfillmentStatus } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@mfdoomshop.local' },
    update: {},
    create: {
      email: 'admin@mfdoomshop.local',
      name: 'MF DOOM Admin',
      password: await hash('doom_admin_123', 10),
      role: UserRole.ADMIN,
      phone: '+1-555-DOOM-ADM',
    },
  })

  // Create test customer
  const testUser = await prisma.user.upsert({
    where: { email: 'test@customer.local' },
    update: {},
    create: {
      email: 'test@customer.local',
      name: 'Test Customer',
      password: await hash('password123', 10),
      role: UserRole.CUSTOMER,
      phone: '+1-555-TEST-123',
    },
  })

  console.log('✅ Created users')

  // Create products with real images from public folder
  const products = [
    // T-SHIRTS
    {
      name: 'ALL CAPS Metal Face T-Shirt',
      slug: 'all-caps-metal-face-tshirt',
      description: 'Premium cotton t-shirt featuring the iconic Metal Face mask design. Remember ALL CAPS when you spell the man name.',
      price: 29.99,
      compareAtPrice: 39.99,
      category: ProductCategory.T_SHIRTS,
      tags: ['metal face', 'all caps', 'classic', 'cotton'],
      featured: true,
      images: [
        '/images/T-Shirts/mf-doom-mask-photo-realistic-tee-charcoal.png',
        '/images/T-Shirts/mf-doom-logo-mask-tee-black-front-back.jpg',
      ]
    },
    {
      name: 'DOOM Super Villain Microphone Tee',
      slug: 'doom-super-villain-microphone-tee',
      description: 'Classic super villain design featuring DOOM with microphone. Premium quality cotton blend.',
      price: 27.99,
      compareAtPrice: 34.99,
      category: ProductCategory.T_SHIRTS,
      tags: ['super villain', 'microphone', 'classic', 'white'],
      featured: true,
      images: [
        '/images/T-Shirts/mf-doom-super-villain-microphone-tee-white.png',
        '/images/T-Shirts/mf-doom-vintage-wash-front-back-tee-black.jpg',
      ]
    },
    {
      name: 'DOOM Gothic Typography Mask Tee',
      slug: 'doom-gothic-typography-mask-tee',
      description: 'Gothic typography design with the iconic DOOM mask. Cream colored premium tee.',
      price: 25.99,
      category: ProductCategory.T_SHIRTS,
      tags: ['gothic', 'typography', 'mask', 'cream'],
      images: [
        '/images/T-Shirts/mf-doom-gothic-typography-mask-tee-cream.png',
        '/images/T-Shirts/mf-doom-mask-silhouette-tee-cream.jpg',
      ]
    },
    {
      name: 'Madvillainy Collage Tee',
      slug: 'madvillainy-collage-tee',
      description: 'Artistic collage design inspired by the legendary Madvillainy album.',
      price: 32.99,
      category: ProductCategory.T_SHIRTS,
      tags: ['madvillainy', 'collage', 'artistic', 'black'],
      images: [
        '/images/T-Shirts/mf-doom-madvillainy-collage-tee-black.jpg',
        '/images/T-Shirts/mf-doom-comic-book-cover-tee-black.png',
      ]
    },
    
    // HOODIES
    {
      name: 'DOOM Mask Hoodie - Premium',
      slug: 'doom-mask-hoodie-premium',
      description: 'Heavy-weight pullover hoodie with embroidered DOOM mask. Perfect for the villain in training.',
      price: 69.99,
      compareAtPrice: 89.99,
      category: ProductCategory.HOODIES,
      tags: ['hoodie', 'mask', 'embroidered', 'premium'],
      featured: true,
      images: [
        '/images/Hoodies/MF DOOM Mask & Logo Simple Hoodie (Black).png',
        '/images/Hoodies/MF DOOM Simple Mask Hoodie with Sleeve Graffiti (Black).png',
      ]
    },
    {
      name: 'Vintage DOOM Mask Graphic Hoodie',
      slug: 'vintage-doom-mask-graphic-hoodie',
      description: 'Vintage-style graphic hoodie with classic DOOM mask design in forest green.',
      price: 75.99,
      category: ProductCategory.HOODIES,
      tags: ['vintage', 'graphic', 'green', 'mask'],
      featured: true,
      images: [
        '/images/Hoodies/Vintage MF DOOM Mask Graphic Hoodie (Green).png',
        '/images/Hoodies/Simple MF DOOM Mask Hoodie (Dark Green).png',
      ]
    },
    {
      name: 'Madvillainy Album Cover Hoodie',
      slug: 'madvillainy-album-cover-hoodie',
      description: 'Knit hoodie featuring the iconic Madvillainy album artwork.',
      price: 79.99,
      category: ProductCategory.HOODIES,
      tags: ['madvillainy', 'album cover', 'knit', 'artistic'],
      images: [
        '/images/Hoodies/Madvillainy Album Cover Knit Hoodie.png',
        '/images/Hoodies/mf-doom-hoodie-multi-color-design-mockups.jpg',
      ]
    },
    {
      name: 'DOOM Graffiti Puffed Hoodie',
      slug: 'doom-graffiti-puffed-hoodie',
      description: 'Street-style hoodie with puffed graffiti design and DOOM branding.',
      price: 72.99,
      category: ProductCategory.HOODIES,
      tags: ['graffiti', 'puffed', 'street style', 'black'],
      images: [
        '/images/Hoodies/MF DOOM Graffiti Puffed Hoodie (Black).png',
        '/images/Hoodies/MF DOOM Graffiti Hoodie (Green).png',
      ]
    },

    // VINYL RECORDS
    {
      name: 'Operation: Doomsday Vinyl - Complete Set',
      slug: 'operation-doomsday-vinyl-complete',
      description: 'Limited edition vinyl pressing of the legendary debut album Operation: Doomsday. Includes original artwork, liner notes, and bonus content.',
      price: 44.99,
      compareAtPrice: 59.99,
      category: ProductCategory.VINYL,
      tags: ['vinyl', 'operation doomsday', 'limited edition', 'classic', 'complete set'],
      featured: true,
      images: [
        '/images/vinyl/operation-doomsday/operation-doomsday-complete-set.jpg',
        '/images/vinyl/operation-doomsday/operation-doomsday-vinyl-records.jpg',
        '/images/vinyl/operation-doomsday/operation-doomsday-vinyl-set-detail.jpg',
      ]
    },
    {
      name: 'Operation: Doomsday Book Edition',
      slug: 'operation-doomsday-book-edition',
      description: 'Special book edition with vinyl records, featuring lyrics, tracklist, and exclusive artwork.',
      price: 52.99,
      category: ProductCategory.VINYL,
      tags: ['vinyl', 'book edition', 'lyrics', 'exclusive'],
      images: [
        '/images/vinyl/operation-doomsday-book-cover.jpg',
        '/images/vinyl/operation-doomsday/operation-doomsday-book-lyrics.jpg',
        '/images/vinyl/operation-doomsday/operation-doomsday-book-tracklist.jpg',
      ]
    },
    {
      name: 'Madvillainy Vinyl Record',
      slug: 'madvillainy-vinyl-record',
      description: 'Classic Madvillainy album on vinyl with gatefold artwork and detailed tracklist.',
      price: 39.99,
      compareAtPrice: 49.99,
      category: ProductCategory.VINYL,
      tags: ['vinyl', 'madvillainy', 'gatefold', 'classic'],
      featured: true,
      images: [
        '/images/vinyl/madvillainy-vinyl-front.jpg',
        '/images/vinyl/madvillainy-vinyl-gatefold.jpg',
        '/images/vinyl/madvillainy-vinyl-tracklist.jpg',
      ]
    },
    {
      name: 'MM..FOOD Vinyl',
      slug: 'mmfood-vinyl',
      description: 'Special edition vinyl of MM..FOOD with detailed packaging and premium pressing.',
      price: 37.99,
      category: ProductCategory.VINYL,
      tags: ['vinyl', 'mmfood', 'special edition', 'premium'],
      images: [
        '/images/vinyl/mm-food-vinyl-main.jpg',
        '/images/vinyl/mm-food-vinyl-detail.jpg',
      ]
    },

    // BEANIES
    {
      name: 'DOOM Mask Beanie - Green',
      slug: 'doom-mask-beanie-green',
      description: 'Knitted beanie with DOOM mask embroidery in forest green. Keep your dome warm while plotting world domination.',
      price: 24.99,
      category: ProductCategory.BEANIES,
      tags: ['beanie', 'mask', 'green', 'embroidered', 'winter'],
      images: [
        '/images/Beanies/mf-doom-mask-beanie-green-flat.jpeg',
        '/images/Beanies/mf-doom-mask-beanie-green-folded.jpeg',
      ]
    },

    // ART
    {
      name: 'DOOM Mask Artistic Print',
      slug: 'doom-mask-artistic-print',
      description: 'High-quality artistic photography print featuring DOOM mask in moody lighting. Perfect for the lair.',
      price: 29.99,
      category: ProductCategory.ART,
      tags: ['art print', 'photography', 'moody', 'wall art', 'mask'],
      images: [
        '/images/art/photography/doom-mask-artistic-moody.jpg',
      ]
    }
  ]

  const createdProducts = []
  
  for (const productData of products) {
    const { images, ...productInfo } = productData
    
    const product = await prisma.product.create({
      data: {
        ...productInfo,
        price: new Prisma.Decimal(productData.price),
        compareAtPrice: productData.compareAtPrice ? new Prisma.Decimal(productData.compareAtPrice) : null,
        images: {
          create: images.map((url, index) => ({
            url,
            altText: `${productData.name} - Image ${index + 1}`,
            position: index,
          })),
        },
        variants: {
          create: productData.category === ProductCategory.T_SHIRTS || productData.category === ProductCategory.HOODIES ? [
            {
              name: 'Size',
              type: 'SIZE',
              options: ['S', 'M', 'L', 'XL', 'XXL'],
              required: true,
            },
            {
              name: 'Color',
              type: 'COLOR',
              options: ['Black', 'Gray', 'White', 'Green', 'Cream', 'Charcoal'],
              required: false,
            }
          ] : productData.category === ProductCategory.VINYL ? [
            {
              name: 'Edition',
              type: 'EDITION',
              options: ['Standard', 'Limited', 'Collector', 'Complete Set'],
              required: true,
            }
          ] : productData.category === ProductCategory.BEANIES ? [
            {
              name: 'Size',
              type: 'SIZE',
              options: ['One Size'],
              required: true,
            }
          ] : []
        },
      },
    })

    createdProducts.push(product)
  }

  console.log('✅ Created products with real images')

  // Create inventory items
  for (const product of createdProducts) {
    if (product.category === ProductCategory.T_SHIRTS || product.category === ProductCategory.HOODIES) {
      const sizes = ['S', 'M', 'L', 'XL', 'XXL']
      const colors = ['Black', 'Gray', 'White', 'Green', 'Cream', 'Charcoal']
      
      for (const size of sizes) {
        for (const color of colors) {
          await prisma.inventoryItem.create({
            data: {
              productId: product.id,
              sku: `${product.slug}-${size}-${color}`.toUpperCase(),
              variantCombination: { Size: size, Color: color },
              quantityOnHand: Math.floor(Math.random() * 50) + 10,
              quantityAvailable: Math.floor(Math.random() * 50) + 10,
              reorderPoint: 5,
              reorderQuantity: 20,
            },
          })
        }
      }
    } else if (product.category === ProductCategory.VINYL) {
      const editions = ['Standard', 'Limited', 'Collector', 'Complete Set']
      
      for (const edition of editions) {
        await prisma.inventoryItem.create({
          data: {
            productId: product.id,
            sku: `${product.slug}-${edition}`.toUpperCase(),
            variantCombination: { Edition: edition },
            quantityOnHand: Math.floor(Math.random() * 30) + 5,
            quantityAvailable: Math.floor(Math.random() * 30) + 5,
            reorderPoint: 3,
            reorderQuantity: 15,
          },
        })
      }
    } else {
      await prisma.inventoryItem.create({
        data: {
          productId: product.id,
          sku: product.slug.toUpperCase(),
          quantityOnHand: Math.floor(Math.random() * 100) + 20,
          quantityAvailable: Math.floor(Math.random() * 100) + 20,
          reorderPoint: 10,
          reorderQuantity: 50,
        },
      })
    }
  }

  console.log('✅ Created inventory items with variants')

  // Create a sample order
  const sampleOrder = await prisma.order.create({
    data: {
      orderNumber: `DOOM-${Date.now()}`,
      userId: testUser.id,
      status: OrderStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PAID,
      fulfillmentStatus: FulfillmentStatus.UNFULFILLED,
      subtotal: new Prisma.Decimal(114.97),
      taxAmount: new Prisma.Decimal(9.20),
      shippingAmount: new Prisma.Decimal(0),
      totalAmount: new Prisma.Decimal(124.17),
      paymentMethod: 'paypal',
      shippingAddress: {
        name: 'Test Customer',
        line1: '123 Villain Lane',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'US',
        phone: '+1-555-TEST-123',
      },
      billingAddress: {
        name: 'Test Customer',
        line1: '123 Villain Lane',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'US',
        phone: '+1-555-TEST-123',
      },
      orderItems: {
        create: [
          {
            productId: createdProducts[0].id, // ALL CAPS Metal Face T-Shirt
            unitPrice: createdProducts[0].price,
            totalPrice: new Prisma.Decimal(createdProducts[0].price.toNumber() * 2),
            quantity: 2,
            variantSelection: { Size: 'L', Color: 'Black' },
            productSnapshot: {
              name: createdProducts[0].name,
              description: createdProducts[0].description,
              price: createdProducts[0].price,
              category: createdProducts[0].category,
              images: createdProducts[0].slug,
            },
          },
          {
            productId: createdProducts[8].id, // Operation: Doomsday Vinyl
            unitPrice: createdProducts[8].price,
            totalPrice: createdProducts[8].price,
            quantity: 1,
            variantSelection: { Edition: 'Limited' },
            productSnapshot: {
              name: createdProducts[8].name,
              description: createdProducts[8].description,
              price: createdProducts[8].price,
              category: createdProducts[8].category,
              images: createdProducts[8].slug,
            },
          },
          {
            productId: createdProducts[12].id, // DOOM Mask Beanie
            unitPrice: createdProducts[12].price,
            totalPrice: createdProducts[12].price,
            quantity: 1,
            variantSelection: { Size: 'One Size' },
            productSnapshot: {
              name: createdProducts[12].name,
              description: createdProducts[12].description,
              price: createdProducts[12].price,
              category: createdProducts[12].category,
              images: createdProducts[12].slug,
            },
          },
        ],
      },
    },
  })

  console.log('✅ Created sample order')

  // Create some product reviews
  await prisma.productReview.create({
    data: {
      productId: createdProducts[0].id,
      userId: testUser.id,
      rating: 5,
      title: 'Perfect fit, ALL CAPS quality!',
      content: 'This shirt is amazing. The quality is top-notch and the design is iconic. The photo-realistic mask print is incredible. Remember ALL CAPS when you spell the man name!',
      verified: true,
    },
  })

  await prisma.productReview.create({
    data: {
      productId: createdProducts[8].id,
      userId: testUser.id,
      rating: 5,
      title: 'Essential for any DOOM collection',
      content: 'Operation: Doomsday on vinyl is a must-have. The complete set comes with everything - vinyl, artwork, liner notes. The sound quality is excellent and the packaging is beautiful.',
      verified: true,
    },
  })

  await prisma.productReview.create({
    data: {
      productId: createdProducts[4].id,
      userId: testUser.id,
      rating: 5,
      title: 'Premium hoodie, worth every penny',
      content: 'The DOOM mask hoodie is incredible quality. Heavy weight material, perfect embroidery, and the fit is spot on. Perfect for any villain in training.',
      verified: true,
    },
  })

  await prisma.productReview.create({
    data: {
      productId: createdProducts[10].id,
      userId: testUser.id,
      rating: 5,
      title: 'Madvillainy masterpiece on vinyl',
      content: 'The gatefold artwork is stunning and the pressing quality is top tier. This album sounds even better on vinyl. Essential for any hip-hop collection.',
      verified: true,
    },
  })

  console.log('✅ Created product reviews')

  console.log('🎉 Database seeded successfully!')
  console.log(`📊 Created:`)
  console.log(`   - ${createdProducts.length} products (using real images from public folder)`)
  console.log(`   - 2 users (1 admin, 1 customer)`)
  console.log(`   - 1 sample order with 3 items`)
  console.log(`   - 4 product reviews`)
  console.log(`   - Multiple inventory items with variants`)
  console.log(``)
  console.log(`🖼️  Products organized by category:`)
  console.log(`   - T-Shirts: 4 products`)
  console.log(`   - Hoodies: 4 products`)
  console.log(`   - Vinyl: 4 products`)
  console.log(`   - Beanies: 1 product`)
  console.log(`   - Art: 1 product`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 