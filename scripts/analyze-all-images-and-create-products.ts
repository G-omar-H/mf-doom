import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

interface ProductData {
  name: string
  description: string
  price: number
  category: 'APPAREL' | 'VINYL' | 'ACCESSORIES' | 'ART'
  subcategory?: string
  images: string[]
  featured: boolean
  variants?: Array<{
    name: string
    type: 'SIZE' | 'COLOR' | 'EDITION' | 'FINISH' | 'MATERIAL'
    options: string[]
  }>
  tags: string[]
}

// Product pricing based on category and type
const PRICING = {
  APPAREL: {
    hoodie: { min: 79.99, max: 119.99 },
    tshirt: { min: 34.99, max: 54.99 },
    cap: { min: 39.99, max: 49.99 },
    shoes: { min: 119.99, max: 179.99 },
    knit: { min: 49.99, max: 69.99 }
  },
  VINYL: {
    lp: { min: 34.99, max: 49.99 },
    deluxe: { min: 59.99, max: 89.99 },
    limited: { min: 79.99, max: 129.99 },
    cassette: { min: 19.99, max: 29.99 },
    cd: { min: 16.99, max: 24.99 }
  },
  ACCESSORIES: {
    collectible: { min: 149.99, max: 299.99 },
    pin: { min: 14.99, max: 24.99 },
    bottle_opener: { min: 19.99, max: 29.99 },
    mug: { min: 19.99, max: 29.99 }
  },
  ART: {
    print: { min: 24.99, max: 89.99 },
    poster: { min: 19.99, max: 39.99 },
    photography: { min: 49.99, max: 149.99 }
  }
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
      subcategory: productData.subcategory,
      featured: productData.featured,
      tags: productData.tags,
      status: 'ACTIVE',
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
        altText: `${productData.name} - Image ${i + 1}`,
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
      sku: `DOOM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      quantityOnHand: Math.floor(Math.random() * 30) + 10, // Random stock between 10-40
      quantityAvailable: Math.floor(Math.random() * 30) + 10
    }
  })

  console.log(`✅ Created product: ${productData.name}`)
  return product
}

function getRandomPrice(category: keyof typeof PRICING, type: string): number {
  const categoryPricing = PRICING[category]
  const priceRange = (categoryPricing as any)[type] || { min: 29.99, max: 79.99 }
  const price = Math.random() * (priceRange.max - priceRange.min) + priceRange.min
  return Math.round(price * 100) / 100
}

async function analyzeAndCreateProducts() {
  await clearDatabase()

  // APPAREL PRODUCTS
  console.log('\n🎽 Creating APPAREL products...')

  // Blue Streetwear Collection (Premium Hoodie)
  await createProduct({
    name: 'MF DOOM Blue Premium Hoodie',
    description: 'Premium blue hoodie featuring intricate DOOM branding with detailed embroidery, felt appliques, and superior construction. Showcases multiple design elements including caps, tags, and quality stitching throughout.',
    price: getRandomPrice('APPAREL', 'hoodie'),
    category: 'APPAREL',
    subcategory: 'hoodies',
    images: [
      '/images/BlueFelt_1800x18001032.jpg',
      '/images/BlueCaps_1800x1800eb5b.jpg',
      '/images/BlueEmbroidery_1800x1800eb5b.jpg',
      '/images/BlueTag_1800x1800eb5b.jpg',
      '/images/BlueClose_1800x1800d88c.jpg',
      '/images/BlueClose2_1800x18003937.jpg',
      '/images/BlueFolded_1800x18003937.jpg'
    ],
    featured: true,
    variants: [
      { name: 'Size', type: 'SIZE', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ],
    tags: ['premium', 'embroidered', 'limited-edition', 'streetwear']
  })

  // Blue Sneakers Collection
  await createProduct({
    name: 'MF DOOM Blue Signature Sneakers',
    description: 'Limited edition blue sneakers featuring custom DOOM design elements. High-quality construction with detailed eyelets, premium cord lacing, and ankle support. Comes with custom box packaging.',
    price: getRandomPrice('APPAREL', 'shoes'),
    category: 'APPAREL',
    subcategory: 'footwear',
    images: [
      '/images/Blue1_1800x180041d5.jpg',
      '/images/Blue2_1800x180041d5.jpg',
      '/images/Blue3_1800x18002b1e.jpg',
      '/images/BlueAnkle_1800x1800eb5b.jpg',
      '/images/BlueEyeletsCord_1800x1800eb5b.jpg',
      '/images/BlueAngle_1800x1800a84e.jpg',
      '/images/BlueAngle2_1800x1800a84e.jpg',
      '/images/BlueBox1_1800x1800b88c.jpg',
      '/images/BlueBox2_1800x1800a84e.jpg'
    ],
    featured: true,
    variants: [
      { name: 'Size', type: 'SIZE', options: ['7', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'] }
    ],
    tags: ['limited-edition', 'custom-design', 'premium-footwear']
  })

  // Operation: Doomsday Book Collection - Black Hoodie
  await createProduct({
    name: 'Operation: Doomsday Book Collection Black Hoodie',
    description: 'Exclusive black hoodie from the Operation: Doomsday book collection series. Features unique artwork inspired by the classic album and special edition book release. Premium cotton blend construction.',
    price: getRandomPrice('APPAREL', 'hoodie'),
    category: 'APPAREL',
    subcategory: 'hoodies',
    images: [
      '/images/BOOKBLACKHOOD_1800x18009cef.jpg',
      '/images/BOOKBLACKHOODFRONT_1800x18009cef.jpg',
      '/images/BOOKBLACKHOODBACK_1800x18009cef.jpg'
    ],
    featured: true,
    variants: [
      { name: 'Size', type: 'SIZE', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ],
    tags: ['book-collection', 'operation-doomsday', 'premium', 'exclusive']
  })

  // Operation: Doomsday Book Collection - Storm Hoodie
  await createProduct({
    name: 'Operation: Doomsday Book Collection Storm Hoodie',
    description: 'Premium storm-colored hoodie from the Operation: Doomsday book collection. Features exclusive artwork and design elements from the special edition series.',
    price: getRandomPrice('APPAREL', 'hoodie'),
    category: 'APPAREL',
    subcategory: 'hoodies',
    images: [
      '/images/BOOKSTORMHOOD_1800x1800db19.jpg',
      '/images/BOOKSTORMHOODFRONT_1800x1800db19.jpg',
      '/images/BOOKSTORMHOODBACK_1800x1800db19.jpg'
    ],
    featured: false,
    variants: [
      { name: 'Size', type: 'SIZE', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ],
    tags: ['book-collection', 'operation-doomsday', 'storm-colorway']
  })

  // T-Shirt Collection
  await createProduct({
    name: 'Operation: Doomsday Book Collection Black T-Shirt',
    description: 'Classic black t-shirt featuring Operation: Doomsday book collection artwork. High-quality cotton construction with front and back graphics.',
    price: getRandomPrice('APPAREL', 'tshirt'),
    category: 'APPAREL',
    subcategory: 'tshirts',
    images: [
      '/images/BOOKBLACKSHIRT_1800x180044c5.jpg',
      '/images/BOOKBLACKSHIRTFRONT_1800x180044c5.jpg',
      '/images/BOOKBLACKSHIRTBACK_1800x18009969.jpg'
    ],
    featured: false,
    variants: [
      { name: 'Size', type: 'SIZE', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ],
    tags: ['book-collection', 'classic-fit', 'cotton']
  })

  await createProduct({
    name: 'Operation: Doomsday Book Collection Storm T-Shirt',
    description: 'Storm-colored t-shirt from the Operation: Doomsday book collection featuring exclusive artwork on front and back.',
    price: getRandomPrice('APPAREL', 'tshirt'),
    category: 'APPAREL',
    subcategory: 'tshirts',
    images: [
      '/images/BOOKSTORMSHIRT_1800x180017c0.jpg',
      '/images/BOOKSTORMSHIRTFRONT_1800x1800eb2e.jpg',
      '/images/BOOKSTORMSHIRTBACK_1800x1800eb2e.jpg'
    ],
    featured: false,
    variants: [
      { name: 'Size', type: 'SIZE', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ],
    tags: ['book-collection', 'storm-colorway', 'exclusive']
  })

  await createProduct({
    name: 'Operation: Doomsday Book Collection White T-Shirt',
    description: 'Clean white t-shirt featuring Operation: Doomsday book collection graphics. Premium cotton with front and back designs.',
    price: getRandomPrice('APPAREL', 'tshirt'),
    category: 'APPAREL',
    subcategory: 'tshirts',
    images: [
      '/images/BOOKWHITESHIRT_1800x1800d59e.jpg',
      '/images/BOOKWHITESHIRTFRONT_1800x1800d59e.jpg',
      '/images/BOOKWHITESHIRTBACK_1800x1800d59e.jpg'
    ],
    featured: false,
    variants: [
      { name: 'Size', type: 'SIZE', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ],
    tags: ['book-collection', 'white-colorway', 'clean-design']
  })

  // Comic Theme Collection
  await createProduct({
    name: 'MF DOOM Comic Style Green T-Shirt',
    description: 'Vintage-inspired green t-shirt featuring comic book style DOOM artwork. Close-up details show quality printing and design elements. Stacked presentation showcases the fit.',
    price: getRandomPrice('APPAREL', 'tshirt'),
    category: 'APPAREL',
    subcategory: 'tshirts',
    images: [
      '/images/ComicTeeGreenFront_1800x18003a0f.jpg',
      '/images/ComicTeeGreenBack_1800x180087cc.jpg',
      '/images/ComicTeeGreenClose_1800x180087cc.jpg',
      '/images/ComicTeeGreenStacked_1800x18003a0f.jpg'
    ],
    featured: false,
    variants: [
      { name: 'Size', type: 'SIZE', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ],
    tags: ['comic-style', 'vintage-inspired', 'green-colorway']
  })

  await createProduct({
    name: 'MF DOOM Comic Style White T-Shirt',
    description: 'Clean white t-shirt with comic book inspired DOOM graphics. Features detailed artwork with close-up shots showing print quality.',
    price: getRandomPrice('APPAREL', 'tshirt'),
    category: 'APPAREL',
    subcategory: 'tshirts',
    images: [
      '/images/ComicTeeWhiteFront_1800x1800f7d7.jpg',
      '/images/ComicTeeWhiteBack_1800x1800f7d7.jpg',
      '/images/ComicTeeWhiteClose_1800x1800f7d7.jpg',
      '/images/ComicTeeWhiteStacked_1800x1800f7d7.jpg'
    ],
    featured: false,
    variants: [
      { name: 'Size', type: 'SIZE', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ],
    tags: ['comic-style', 'white-colorway', 'clean-print']
  })

  // Diner Collection
  await createProduct({
    name: 'MF DOOM Diner Black T-Shirt',
    description: 'Black t-shirt featuring diner-themed DOOM artwork. Close-up details reveal intricate design work and premium printing quality.',
    price: getRandomPrice('APPAREL', 'tshirt'),
    category: 'APPAREL',
    subcategory: 'tshirts',
    images: [
      '/images/DinerTeeBlackFront_1800x18008132.jpg',
      '/images/DinerTeeBlackClose_1800x18002d5e.jpg'
    ],
    featured: false,
    variants: [
      { name: 'Size', type: 'SIZE', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ],
    tags: ['diner-theme', 'black-colorway', 'detailed-print']
  })

  await createProduct({
    name: 'MF DOOM Diner White T-Shirt',
    description: 'White t-shirt with diner-inspired DOOM graphics. Features clean design work with detailed close-up photography showing quality.',
    price: getRandomPrice('APPAREL', 'tshirt'),
    category: 'APPAREL',
    subcategory: 'tshirts',
    images: [
      '/images/DinerTeeWhiteFront_1800x18002ff8.jpg',
      '/images/DinerTeeWhiteClose_1800x180090b3.jpg'
    ],
    featured: false,
    variants: [
      { name: 'Size', type: 'SIZE', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ],
    tags: ['diner-theme', 'white-colorway', 'clean-design']
  })

  // Doomsday 25th Anniversary Collection
  await createProduct({
    name: 'Doomsday 25th Anniversary Black T-Shirt',
    description: 'Commemorative black t-shirt celebrating 25 years of Operation: Doomsday. Features anniversary artwork on front and back with stacked presentation.',
    price: getRandomPrice('APPAREL', 'tshirt'),
    category: 'APPAREL',
    subcategory: 'tshirts',
    images: [
      '/images/Doomsday25BlackFront_1800x18000ae5.jpg',
      '/images/Doomsday25BlackBack_1800x18000ae5.jpg',
      '/images/Doomsday25BlackStacked_1800x18000ae5.jpg'
    ],
    featured: true,
    variants: [
      { name: 'Size', type: 'SIZE', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ],
    tags: ['25th-anniversary', 'commemorative', 'doomsday', 'limited-edition']
  })

  await createProduct({
    name: 'Doomsday 25th Anniversary Green T-Shirt',
    description: 'Limited edition green colorway celebrating 25 years of Operation: Doomsday. Premium anniversary design with front, back, and stacked views.',
    price: getRandomPrice('APPAREL', 'tshirt'),
    category: 'APPAREL',
    subcategory: 'tshirts',
    images: [
      '/images/Doomsday25GreenFront_1800x18007c0c.jpg',
      '/images/Doomsday25GreenBack_1800x18007c0c.jpg',
      '/images/Doomsday25GreenStacked_1800x18007c0c.jpg'
    ],
    featured: true,
    variants: [
      { name: 'Size', type: 'SIZE', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ],
    tags: ['25th-anniversary', 'commemorative', 'green-colorway', 'limited-edition']
  })

  // Eyes Collection
  await createProduct({
    name: 'MF DOOM Eyes T-Shirt',
    description: 'Unique design featuring the iconic DOOM eyes motif. Available in front, back, and stacked presentations showcasing the artistic design.',
    price: getRandomPrice('APPAREL', 'tshirt'),
    category: 'APPAREL',
    subcategory: 'tshirts',
    images: [
      '/images/eyes_tee_front_720_1800x180048cb.jpg',
      '/images/eyes_tee_back_720_1800x180048cb.jpg',
      '/images/eyes_tee_stacked_720_1800x180048cb.jpg'
    ],
    featured: false,
    variants: [
      { name: 'Size', type: 'SIZE', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ],
    tags: ['eyes-motif', 'artistic-design', 'unique']
  })

  // Cap Collection
  await createProduct({
    name: 'MF DOOM Eyes Baseball Cap',
    description: 'Premium baseball cap featuring the Eyes design motif. Shown from front and back angles with quality construction details.',
    price: getRandomPrice('APPAREL', 'cap'),
    category: 'APPAREL',
    subcategory: 'headwear',
    images: [
      '/images/EyesCapFront_1800x1800547f.jpg',
      '/images/EyesCapBack_1800x1800547f.jpg'
    ],
    featured: false,
    variants: [
      { name: 'Size', type: 'SIZE', options: ['One Size'] }
    ],
    tags: ['baseball-cap', 'eyes-design', 'headwear']
  })

  // Knit Collection
  await createProduct({
    name: 'MF DOOM Eyes Knit Beanie',
    description: 'Premium knit beanie featuring Eyes design with close-up detail shots showing the quality knitting and construction.',
    price: getRandomPrice('APPAREL', 'knit'),
    category: 'APPAREL',
    subcategory: 'headwear',
    images: [
      '/images/EyesKnitClose_1800x1800cf70.jpg'
    ],
    featured: false,
    variants: [
      { name: 'Size', type: 'SIZE', options: ['One Size'] }
    ],
    tags: ['knit-beanie', 'eyes-design', 'winter-wear']
  })

  // VINYL PRODUCTS
  console.log('\n🎵 Creating VINYL products...')

  // MM..FOOD Collection
  await createProduct({
    name: 'MM..FOOD Vinyl LP',
    description: 'MF DOOM\'s acclaimed album MM..FOOD on premium vinyl. Features the classic food-themed artwork and includes tracks like "Rapp Snitch Knishes" and "Beef Rapp". High-quality pressing with detailed packaging.',
    price: getRandomPrice('VINYL', 'lp'),
    category: 'VINYL',
    subcategory: 'albums',
    images: [
      '/images/mm-food-vinyl-main.jpg',
      '/images/mm-food-vinyl-detail.jpg'
    ],
    featured: true,
    variants: [
      { name: 'Edition', type: 'EDITION', options: ['Standard Black', 'Limited Color'] }
    ],
    tags: ['mm-food', 'classic-album', 'food-theme', 'essential']
  })

  // Madvillainy Collection
  await createProduct({
    name: 'Madvillainy Vinyl LP - MF DOOM x Madlib',
    description: 'The legendary collaboration between MF DOOM and Madlib. Classic hip-hop album featuring "All Caps", "Accordion" and more. Includes gatefold packaging with detailed tracklist and liner notes.',
    price: getRandomPrice('VINYL', 'lp'),
    category: 'VINYL',
    subcategory: 'albums',
    images: [
      '/images/madvillainy-vinyl-front.jpg',
      '/images/madvillainy-vinyl-back.jpg',
      '/images/madvillainy-vinyl-detail.jpg',
      '/images/madvillainy-vinyl-angle.jpg',
      '/images/madvillainy-vinyl-gatefold.jpg',
      '/images/madvillainy-vinyl-tracklist.jpg'
    ],
    featured: true,
    variants: [
      { name: 'Edition', type: 'EDITION', options: ['Standard Black', 'Limited Pressing'] }
    ],
    tags: ['madvillainy', 'madlib-collaboration', 'classic', 'essential', 'gatefold']
  })

  // Operation: Doomsday Book Edition
  await createProduct({
    name: 'Operation: Doomsday Deluxe Book Edition',
    description: 'Deluxe book edition of MF DOOM\'s debut album Operation: Doomsday. Features premium book packaging with gatefold design, spine detail, and includes the classic vinyl pressing. Limited edition collector\'s item.',
    price: getRandomPrice('VINYL', 'deluxe'),
    category: 'VINYL',
    subcategory: 'deluxe-editions',
    images: [
      '/images/operation-doomsday-book-cover.jpg',
      '/images/operation-doomsday-book-open.jpg',
      '/images/operation-doomsday-book-gatefold.jpg',
      '/images/operation-doomsday-book-spine.jpg',
      '/images/operation-doomsday-book-box.jpg'
    ],
    featured: true,
    variants: [
      { name: 'Edition', type: 'EDITION', options: ['Deluxe Book Edition'] }
    ],
    tags: ['operation-doomsday', 'deluxe', 'book-edition', 'debut-album', 'collector']
  })

  // DLX Vinyl Collection
  await createProduct({
    name: 'MF DOOM Deluxe Vinyl Collection',
    description: 'Premium deluxe vinyl collection featuring special packaging and multiple vinyl pressings. Includes interior artwork and detailed liner notes. Limited edition collector\'s set.',
    price: getRandomPrice('VINYL', 'deluxe'),
    category: 'VINYL',
    subcategory: 'deluxe-editions',
    images: [
      '/images/DLXVinylFront_1800x1800373b.jpg',
      '/images/DLXVinylBack_1800x18009c7d.jpg',
      '/images/DLXVinylInterior_1800x1800d66f.jpg',
      '/images/DLXVinyl01_1800x18001013.jpg',
      '/images/DLXVinyl02_1800x180020f1.jpg',
      '/images/DLXVinyl7_1800x180019ea.jpg'
    ],
    featured: true,
    variants: [
      { name: 'Edition', type: 'EDITION', options: ['Deluxe Collection'] }
    ],
    tags: ['deluxe', 'collection', 'premium-packaging', 'limited-edition']
  })

  // CD Collection
  await createProduct({
    name: 'MF DOOM CD Collection',
    description: 'Compact disc collection featuring premium packaging with detailed artwork. Includes front and back cover art, sleeve details, and angle shots showing the complete package.',
    price: getRandomPrice('VINYL', 'cd'),
    category: 'VINYL',
    subcategory: 'cds',
    images: [
      '/images/CD_Front_1800x180020d1.jpg',
      '/images/CD_Back_1800x1800c992.jpg',
      '/images/CD_Sleeve_1800x18006a33.jpg',
      '/images/CDAngle_1800x18001381.jpg',
      '/images/CDFront_1800x18001381.jpg',
      '/images/CDBack_1800x18001381.jpg',
      '/images/CDInterior_1800x1800e302.jpg'
    ],
    featured: false,
    variants: [
      { name: 'Format', type: 'EDITION', options: ['Standard CD'] }
    ],
    tags: ['cd', 'compact-disc', 'complete-collection']
  })

  // Cassette Collection
  await createProduct({
    name: 'MF DOOM Cassette Collection',
    description: 'Retro cassette collection featuring classic DOOM albums. Includes front and back artwork, unpackaged views, interior details, and standing presentation. Perfect for analog enthusiasts.',
    price: getRandomPrice('VINYL', 'cassette'),
    category: 'VINYL',
    subcategory: 'cassettes',
    images: [
      '/images/CassetteFront_1800x18009e32.jpg',
      '/images/CassetteBack_1800x18009e32.jpg',
      '/images/CassetteInterior_1800x18009e32.jpg',
      '/images/CassetteStanding_1800x18009e32.jpg',
      '/images/Cassette_Front_1800x1800fa9e.jpg',
      '/images/Cassette_FrontUnpack_1800x18003459.jpg',
      '/images/Cassette_BackUnpack_1800x18007444.jpg'
    ],
    featured: false,
    variants: [
      { name: 'Format', type: 'EDITION', options: ['Standard Cassette'] }
    ],
    tags: ['cassette', 'retro', 'analog', 'vintage-format']
  })

  // Special Vinyl
  await createProduct({
    name: 'Curls All Caps Vinyl',
    description: 'Special pressing featuring the track "All Caps" with unique artwork. Premium vinyl pressing with detailed packaging.',
    price: getRandomPrice('VINYL', 'limited'),
    category: 'VINYL',
    subcategory: 'singles',
    images: [
      '/images/Curls_AllCaps-Vinyl_1800x1800a494.jpg'
    ],
    featured: false,
    variants: [
      { name: 'Edition', type: 'EDITION', options: ['Limited Pressing'] }
    ],
    tags: ['all-caps', 'special-pressing', 'single']
  })

  // ACCESSORIES
  console.log('\n🎯 Creating ACCESSORIES products...')

  // DOOM Collectible Figure
  await createProduct({
    name: 'MF DOOM Super7 Collectible Figure',
    description: 'Premium collectible figure by Super7 featuring MF DOOM in his iconic mask. Includes detailed packaging, multiple display angles, finest bowl accessory, and unboxed presentation. Limited edition collector\'s item.',
    price: getRandomPrice('ACCESSORIES', 'collectible'),
    category: 'ACCESSORIES',
    subcategory: 'collectibles',
    images: [
      '/images/accessories/doom-super7-collectible-figure.jpg',
      '/images/accessories/doom-super7-figure-packaging.jpg',
      '/images/accessories/doom-super7-figure-display.jpg',
      '/images/accessories/doom-super7-figure-unboxed.jpg',
      '/images/accessories/doom-super7-figure-angle2.jpg',
      '/images/accessories/doom-super7-figure-detail.jpg',
      '/images/accessories/doom-super7-figure-finest-bowl.jpg',
      '/images/DOOM-Figure_1800x1800a5bf.jpg'
    ],
    featured: true,
    variants: [
      { name: 'Edition', type: 'EDITION', options: ['Limited Collector Edition'] }
    ],
    tags: ['super7', 'collectible', 'figure', 'limited-edition', 'premium']
  })

  // Coffee Mug
  await createProduct({
    name: 'MF DOOM Coffee Mug',
    description: 'Premium ceramic coffee mug featuring MF DOOM artwork. Shows front and back designs with stacked presentation. Perfect for morning coffee or tea.',
    price: getRandomPrice('ACCESSORIES', 'mug'),
    category: 'ACCESSORIES',
    subcategory: 'drinkware',
    images: [
      '/images/CoffeeMugFront_1800x18007534.jpg',
      '/images/CoffeeMugBack_1800x1800ed6e.jpg',
      '/images/CoffeeMugStacked_1800x18007534.jpg'
    ],
    featured: false,
    variants: [
      { name: 'Material', type: 'MATERIAL', options: ['Ceramic'] }
    ],
    tags: ['coffee-mug', 'ceramic', 'drinkware', 'daily-use']
  })

  // Bottle Opener
  await createProduct({
    name: 'MF DOOM Bottle Opener',
    description: 'Premium metal bottle opener featuring DOOM branding. Durable construction with detailed metalwork.',
    price: getRandomPrice('ACCESSORIES', 'bottle_opener'),
    category: 'ACCESSORIES',
    subcategory: 'tools',
    images: [
      '/images/BottleOpener_1800x18005199.jpg'
    ],
    featured: false,
    variants: [
      { name: 'Material', type: 'MATERIAL', options: ['Metal'] }
    ],
    tags: ['bottle-opener', 'metal', 'utility', 'bar-tool']
  })

  // Pin Collection
  await createProduct({
    name: 'MF DOOM Metal Pin',
    description: 'Premium enamel pin featuring MF DOOM design. High-quality metal construction with secure backing and detailed artwork.',
    price: getRandomPrice('ACCESSORIES', 'pin'),
    category: 'ACCESSORIES',
    subcategory: 'pins',
    images: [
      '/images/BluePin_1800x1800e218.jpg'
    ],
    featured: false,
    variants: [
      { name: 'Finish', type: 'FINISH', options: ['Enamel'] }
    ],
    tags: ['enamel-pin', 'metal', 'collectible', 'accessory']
  })

  console.log('\n🎉 Product creation complete!')
  
  // Final statistics
  const productCount = await prisma.product.count()
  const imageCount = await prisma.productImage.count()
  const variantCount = await prisma.productVariant.count()
  const inventoryCount = await prisma.inventoryItem.count()
  
  console.log('\n📊 Final Statistics:')
  console.log(`   Products created: ${productCount}`)
  console.log(`   Images added: ${imageCount}`)
  console.log(`   Variants created: ${variantCount}`)
  console.log(`   Inventory items: ${inventoryCount}`)
  
  // Category breakdown
  const apparelCount = await prisma.product.count({ where: { category: 'APPAREL' } })
  const vinylCount = await prisma.product.count({ where: { category: 'VINYL' } })
  const accessoriesCount = await prisma.product.count({ where: { category: 'ACCESSORIES' } })
  
  console.log('\n📈 Category Breakdown:')
  console.log(`   APPAREL: ${apparelCount} products`)
  console.log(`   VINYL: ${vinylCount} products`)
  console.log(`   ACCESSORIES: ${accessoriesCount} products`)
  
  console.log('\n✨ All MF DOOM products have been successfully analyzed and created!')
}

// Run the analysis
analyzeAndCreateProducts()
  .catch((error) => {
    console.error('❌ Error:', error)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 