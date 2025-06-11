import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

interface ProductData {
  name: string
  description: string
  price: number
  category: 'APPAREL' | 'VINYL' | 'ACCESSORIES' | 'ART'
  images: string[]
  featured: boolean
  variants?: Array<{
    name: string
    type: 'SIZE' | 'COLOR' | 'EDITION' | 'FINISH' | 'MATERIAL'
    options: string[]
  }>
}

async function clearDatabase() {
  console.log('🗑️  Clearing existing products...')
  
  await prisma.productReview.deleteMany()
  await prisma.wishlistItem.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.inventoryItem.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  
  console.log('✅ Database cleared')
}

async function createProduct(productData: ProductData) {
  const product = await prisma.product.create({
    data: {
      name: productData.name,
      slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: productData.description,
      price: productData.price,
      category: productData.category,
      featured: productData.featured,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  // Add images
  for (let i = 0; i < productData.images.length; i++) {
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: productData.images[i],
        altText: `${productData.name} image`,
        position: i
      }
    })
  }

  // Add variants
  if (productData.variants) {
    for (const variant of productData.variants) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          name: variant.name,
          type: variant.type,
          options: variant.options
        }
      })
    }
  }

  // Create basic inventory item
  await prisma.inventoryItem.create({
    data: {
      productId: product.id,
      sku: `${product.id}-default`,
      quantityOnHand: 25,
      quantityAvailable: 25
    }
  })

  console.log(`✅ Created product: ${productData.name}`)
  return product
}

async function analyzeAndCreateProducts() {
  await clearDatabase()
  
  // Blue Streetwear Collection (Hoodie/Sweatshirt)
  await createProduct({
    name: 'DOOM Blue Streetwear Hoodie',
    description: 'Premium blue hoodie featuring MF DOOM branding with detailed embroidery, felt appliques, and quality construction. Multiple angles show the craftsmanship and design details.',
    price: 89.99,
    category: 'APPAREL',
    images: [
      '/images/BlueFelt_1800x18001032.jpg',
      '/images/BlueFolded_1800x18003937.jpg',
      '/images/BlueClose_1800x1800d88c.jpg',
      '/images/BlueClose2_1800x18003937.jpg',
      '/images/BlueCaps_1800x1800eb5b.jpg',
      '/images/BlueEmbroidery_1800x1800eb5b.jpg',
      '/images/BlueTag_1800x1800eb5b.jpg'
    ],
    featured: true,
    variants: [
      { name: 'Size', type: 'SIZE', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ]
  })

  // Blue Sneakers/Shoes
  await createProduct({
    name: 'DOOM Blue Sneakers',
    description: 'Blue sneakers with eyelets and cord details. Features premium construction with DOOM branding. Multiple angles showcase the design and fit.',
    price: 129.99,
    category: 'APPAREL',
    images: [
      '/images/Blue1_1800x180041d5.jpg',
      '/images/Blue2_1800x180041d5.jpg',
      '/images/Blue3_1800x18002b1e.jpg',
      '/images/BlueAngle_1800x1800a84e.jpg',
      '/images/BlueAngle2_1800x1800a84e.jpg',
      '/images/BlueAnkle_1800x1800eb5b.jpg',
      '/images/BlueEyeletsCord_1800x1800eb5b.jpg',
      '/images/BlueBox1_1800x1800b88c.jpg',
      '/images/BlueBox2_1800x1800a84e.jpg'
    ],
    featured: true,
    variants: [
      { name: 'Size', type: 'SIZE', options: ['7', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'] }
    ]
  })

  // DOOM Pin/Accessory
  await createProduct({
    name: 'DOOM Metal Pin',
    description: 'Premium enamel pin featuring MF DOOM design. High-quality metal construction with secure backing.',
    price: 19.99,
    category: 'ACCESSORIES',
    images: ['/images/BluePin_1800x1800e218.jpg'],
    featured: false
  })

  // Operation: Doomsday Book Collection - Black Hoodie
  await createProduct({
    name: 'Operation: Doomsday Book Collection - Black Hoodie',
    description: 'Premium black hoodie from the Operation: Doomsday book collection. Features exclusive artwork and designs from the special edition book release.',
    price: 95.99,
    category: 'APPAREL',
    images: [
      '/images/BOOKBLACKHOOD_1800x18009cef.jpg',
      '/images/BOOKBLACKHOODFRONT_1800x18009cef.jpg',
      '/images/BOOKBLACKHOODBACK_1800x18009cef.jpg'
    ],
    featured: true,
    variants: [
      { name: 'Size', type: 'SIZE', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ]
  })

  // Coffee Mug
  await createProduct({
    name: 'DOOM Coffee Mug',
    description: 'Ceramic coffee mug featuring MF DOOM artwork. Perfect for morning coffee or tea sessions.',
    price: 19.99,
    category: 'ACCESSORIES',
    images: [
      '/images/CoffeeMugFront_1800x18007534.jpg',
      '/images/CoffeeMugBack_1800x1800ed6e.jpg',
      '/images/CoffeeMugStacked_1800x18007534.jpg'
    ],
    featured: false
  })

  console.log('🎉 First batch of products created successfully!')
}

analyzeAndCreateProducts()
  .catch(console.error)
  .finally(() => prisma.$disconnect()) 