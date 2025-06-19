import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ProductData {
  name: string
  description: string
  price: number
  compareAtPrice?: number
  category: string
  images: string[]
  featured?: boolean
  tags: string[]
  sku: string
  weight?: number
}

const products: ProductData[] = [
  // T-SHIRTS
  {
    name: "MF DOOM Metal Face T-Shirt",
    description: "Premium brown t-shirt featuring the iconic Metal Face design. Comfortable cotton blend with vintage-inspired graphics.",
    price: 45,
    compareAtPrice: 55,
    category: "T_SHIRTS",
    images: ["/images/T-Shirts/mf-doom-the-metal-face-tshirt-brown-front.jpg"],
    featured: true,
    tags: ["metal face", "vintage", "brown", "iconic"],
    sku: "DOOM-TEE-MF-01",
    weight: 0.2
  },
  {
    name: "MF DOOM Worst Guy Cartoon T-Shirt",
    description: "Unique cartoon-style design featuring DOOM's character art. Perfect for fans of the villain's comic book aesthetic.",
    price: 40,
    category: "T_SHIRTS",
    images: ["/images/T-Shirts/mf-doom-the-worst-guy-cartoon-character-tshirt.jpg"],
    tags: ["cartoon", "comic", "worst guy", "character"],
    sku: "DOOM-TEE-WG-01",
    weight: 0.2
  },
  {
    name: "MF DOOM Mask Sleeve Graphic T-Shirt",
    description: "Grey t-shirt with detailed mask graphic on the sleeve. Subtle yet striking design for the sophisticated DOOM fan.",
    price: 42,
    category: "T_SHIRTS",
    images: ["/images/T-Shirts/mf-doom-mask-sleeve-graphic-tshirt-grey-side.jpg"],
    tags: ["mask", "sleeve", "grey", "subtle"],
    sku: "DOOM-TEE-MS-01",
    weight: 0.2
  },
  {
    name: "MF DOOM Microphone Distressed T-Shirt",
    description: "Distressed style t-shirt featuring microphone artwork. Vintage wash gives it an authentic, worn-in feel.",
    price: 38,
    category: "T_SHIRTS",
    images: ["/images/T-Shirts/mf-doom-microphone-distressed-tshirt-front.jpg"],
    tags: ["microphone", "distressed", "vintage", "worn"],
    sku: "DOOM-TEE-MIC-01",
    weight: 0.2
  },
  {
    name: "MF DOOM OneTwo Boombox Mask T-Shirt",
    description: "Classic boombox design combined with the iconic mask. Available in multiple view angles for the perfect fit.",
    price: 44,
    category: "T_SHIRTS",
    images: [
      "/images/T-Shirts/mf-doom-onetwo-boombox-mask-tshirt-front-view.jpg",
      "/images/T-Shirts/mf-doom-onetwo-boombox-mask-tshirt-alt-view.jpg"
    ],
    featured: true,
    tags: ["boombox", "onetwo", "classic", "hip hop"],
    sku: "DOOM-TEE-BB-01",
    weight: 0.2
  },
  {
    name: "MF DOOM Operation Doomsday Comic T-Shirt",
    description: "Limited edition comic book style design featuring Operation Doomsday artwork. Front and back print.",
    price: 48,
    compareAtPrice: 60,
    category: "T_SHIRTS",
    images: ["/images/T-Shirts/mf-doom-operation-doomsday-comic-tshirt-front-back.jpg"],
    featured: true,
    tags: ["operation doomsday", "comic", "limited", "album"],
    sku: "DOOM-TEE-OD-01",
    weight: 0.2
  },
  {
    name: "MF DOOM Boombox Halo Graffiti T-Shirt",
    description: "Dark t-shirt with boombox halo graffiti design. Street art inspired graphics with premium print quality.",
    price: 46,
    category: "T_SHIRTS",
    images: ["/images/T-Shirts/mf-doom-boombox-halo-graffiti-tshirt-dark-front.png"],
    tags: ["graffiti", "halo", "street art", "dark"],
    sku: "DOOM-TEE-BH-01",
    weight: 0.2
  },
  {
    name: "MF DOOM Graffiti Logo T-Shirt",
    description: "Grey t-shirt featuring classic DOOM graffiti logo. Clean design with bold typography.",
    price: 41,
    category: "T_SHIRTS",
    images: ["/images/T-Shirts/mf-doom-graffiti-logo-tshirt-grey-front.jpg"],
    tags: ["graffiti", "logo", "grey", "typography"],
    sku: "DOOM-TEE-GL-01",
    weight: 0.2
  },
  {
    name: "MF DOOM Mask Album Graphic T-Shirt",
    description: "Album-inspired mask graphic on premium cotton. Minimalist design with maximum impact.",
    price: 43,
    category: "T_SHIRTS",
    images: ["/images/T-Shirts/mf-doom-mask-album-graphic-tshirt-front.jpg"],
    tags: ["album", "mask", "minimalist", "cotton"],
    sku: "DOOM-TEE-MA-01",
    weight: 0.2
  },
  {
    name: "MF DOOM All Caps Madvillain T-Shirt",
    description: "Grey t-shirt with ALL CAPS Madvillain design on the back. Tribute to the classic collaboration.",
    price: 47,
    compareAtPrice: 58,
    category: "T_SHIRTS",
    images: ["/images/T-Shirts/mf-doom-all-caps-madvillain-tshirt-grey-back.jpg"],
    featured: true,
    tags: ["madvillain", "all caps", "collaboration", "grey"],
    sku: "DOOM-TEE-AC-01",
    weight: 0.2
  },

  // HOODIES
  {
    name: "MF DOOM Mask Silhouette Hoodie",
    description: "Dark grey hoodie with striking mask silhouette design. Premium heavyweight cotton blend for ultimate comfort.",
    price: 85,
    compareAtPrice: 95,
    category: "HOODIES",
    images: ["/images/Hoodies/MF DOOM Mask Silhouette Hoodie (Dark Grey).png"],
    featured: true,
    tags: ["silhouette", "mask", "dark grey", "heavyweight"],
    sku: "DOOM-HOOD-MS-01",
    weight: 0.8
  },
  {
    name: "MF DOOM Back Script Puffed Hoodie",
    description: "Grey hoodie with puffed script design on the back. Raised print gives a premium tactile feel.",
    price: 95,
    compareAtPrice: 110,
    category: "HOODIES",
    images: ["/images/Hoodies/MF DOOM Back Script Puffed Hoodie (Grey).png"],
    featured: true,
    tags: ["script", "puffed", "grey", "back print"],
    sku: "DOOM-HOOD-BS-01",
    weight: 0.8
  },
  {
    name: "MF DOOM Graffiti Hoodie",
    description: "Vibrant green hoodie with authentic graffiti-style DOOM artwork. Street culture meets premium fashion.",
    price: 90,
    category: "HOODIES",
    images: ["/images/Hoodies/MF DOOM Graffiti Hoodie (Green).png"],
    tags: ["graffiti", "green", "street", "vibrant"],
    sku: "DOOM-HOOD-GR-01",
    weight: 0.8
  },
  {
    name: "MF DOOM Mask Back Puffed Hoodie",
    description: "Black hoodie with large puffed mask design on the back. Bold statement piece for true fans.",
    price: 92,
    category: "HOODIES",
    images: ["/images/Hoodies/MF DOOM Mask Back Puffed Hoodie (Black).png"],
    tags: ["mask", "back", "puffed", "black", "statement"],
    sku: "DOOM-HOOD-MB-01",
    weight: 0.8
  },
  {
    name: "Simple MF DOOM Mask Hoodie",
    description: "Dark green hoodie with clean, minimalist mask design. Perfect for everyday wear with subtle DOOM style.",
    price: 78,
    category: "HOODIES",
    images: ["/images/Hoodies/Simple MF DOOM Mask Hoodie (Dark Green).png"],
    tags: ["simple", "mask", "dark green", "minimalist", "everyday"],
    sku: "DOOM-HOOD-SM-01",
    weight: 0.8
  },
  {
    name: "Vintage MF DOOM Mask Graphic Hoodie",
    description: "Green hoodie with vintage-inspired mask graphic. Retro aesthetic meets modern comfort.",
    price: 88,
    category: "HOODIES",
    images: ["/images/Hoodies/Vintage MF DOOM Mask Graphic Hoodie (Green).png"],
    tags: ["vintage", "mask", "green", "retro", "graphic"],
    sku: "DOOM-HOOD-VM-01",
    weight: 0.8
  },
  {
    name: "MF DOOM Graffiti Puffed Hoodie",
    description: "Black hoodie with raised graffiti design. Premium puffed print technique for lasting quality.",
    price: 93,
    category: "HOODIES",
    images: ["/images/Hoodies/MF DOOM Graffiti Puffed Hoodie (Black).png"],
    tags: ["graffiti", "puffed", "black", "premium", "raised"],
    sku: "DOOM-HOOD-GP-01",
    weight: 0.8
  },
  {
    name: "MF DOOM Mask & Logo Simple Hoodie",
    description: "Black hoodie featuring both mask and logo in a clean, balanced design. Essential DOOM merchandise.",
    price: 82,
    category: "HOODIES",
    images: ["/images/Hoodies/MF DOOM Mask & Logo Simple Hoodie (Black).png"],
    tags: ["mask", "logo", "simple", "black", "essential"],
    sku: "DOOM-HOOD-ML-01",
    weight: 0.8
  },
  {
    name: "MF DOOM Mask Zip-Up Hoodie",
    description: "Convenient zip-up hoodie with mask design. Perfect layering piece with premium zipper hardware.",
    price: 98,
    compareAtPrice: 115,
    category: "HOODIES",
    images: ["/images/Hoodies/MF DOOM Mask Zip-Up Hoodie.png"],
    featured: true,
    tags: ["zip-up", "mask", "layering", "convenience", "premium"],
    sku: "DOOM-HOOD-ZU-01",
    weight: 0.9
  },
  {
    name: "MF DOOM Simple Graffiti Logo Hoodie",
    description: "Black hoodie with simple yet effective graffiti logo. Clean design with street credibility.",
    price: 80,
    category: "HOODIES",
    images: ["/images/Hoodies/MF DOOM Simple Graffiti Logo Hoodie (Black).png"],
    tags: ["simple", "graffiti", "logo", "black", "street"],
    sku: "DOOM-HOOD-SG-01",
    weight: 0.8
  },
  {
    name: "MF DOOM Mask Hoodie with Sleeve Graffiti",
    description: "Black hoodie featuring mask design with additional graffiti details on the sleeves. Multi-element design.",
    price: 86,
    category: "HOODIES",
    images: ["/images/Hoodies/MF DOOM Simple Mask Hoodie with Sleeve Graffiti (Black).png"],
    tags: ["mask", "sleeve", "graffiti", "black", "multi-element"],
    sku: "DOOM-HOOD-MS-02",
    weight: 0.8
  },
  {
    name: "Madvillainy Album Cover Knit Hoodie",
    description: "Limited edition knit hoodie featuring the iconic Madvillainy album cover. Premium knit construction.",
    price: 105,
    compareAtPrice: 125,
    category: "HOODIES",
    images: ["/images/Hoodies/Madvillainy Album Cover Knit Hoodie.png"],
    featured: true,
    tags: ["madvillainy", "album cover", "knit", "limited", "iconic"],
    sku: "DOOM-HOOD-MAD-01",
    weight: 0.9
  },

  // SNEAKERS
  {
    name: "BAPE STA MF DOOM Mask Embroidered Sneakers",
    description: "Limited edition BAPE STA collaboration featuring embroidered DOOM mask. Premium leather construction with collectible appeal.",
    price: 285,
    compareAtPrice: 320,
    category: "SNEAKERS",
    images: [
      "/images/Sneakers/BAPE_Sta_Mask_Embroidered/mf-doom-bapesta-mask-embroidered-sneaker-pair-angled.jpeg",
      "/images/Sneakers/BAPE_Sta_Mask_Embroidered/mf-doom-bapesta-mask-embroidered-sneaker-rear-view.jpeg",
      "/images/Sneakers/BAPE_Sta_Mask_Embroidered/mf-doom-bapesta-mask-embroidered-sneaker-heel-detail-right.jpeg",
      "/images/Sneakers/BAPE_Sta_Mask_Embroidered/mf-doom-bapesta-mask-embroidered-sneaker-angle-view.jpeg"
    ],
    featured: true,
    tags: ["bape", "sta", "embroidered", "limited", "collaboration", "leather"],
    sku: "DOOM-SNKR-BAPE-01",
    weight: 1.2
  },
  {
    name: "BAPE STA MF DOOM Character Graphic Sneakers",
    description: "BAPE STA featuring DOOM character graphics. Collectible sneaker with unique character artwork and premium materials.",
    price: 295,
    compareAtPrice: 330,
    category: "SNEAKERS",
    images: [
      "/images/Sneakers/BAPE_Sta_Character_Graphic/mf-doom-bapesta-character-graphic-sneaker-top-angle.jpeg",
      "/images/Sneakers/BAPE_Sta_Character_Graphic/mf-doom-bapesta-character-graphic-sneaker-rear-view.jpeg",
      "/images/Sneakers/BAPE_Sta_Character_Graphic/mf-doom-bapesta-character-graphic-sneaker-right-side-profile.jpeg",
      "/images/Sneakers/BAPE_Sta_Character_Graphic/mf-doom-bapesta-character-graphic-sneaker-pair-rear.jpeg"
    ],
    featured: true,
    tags: ["bape", "sta", "character", "graphic", "collectible", "artwork"],
    sku: "DOOM-SNKR-BAPE-02",
    weight: 1.2
  },

  // BEANIES
  {
    name: "MF DOOM Mask Knit Beanie",
    description: "Green knit beanie with embroidered mask design. Perfect for colder weather with classic DOOM style.",
    price: 35,
    compareAtPrice: 42,
    category: "BEANIES",
    images: ["/images/Beanies/mf-doom-mask-knit-beanie-green-flat.jpeg"],
    tags: ["knit", "mask", "green", "embroidered", "winter"],
    sku: "DOOM-BEAN-MK-01",
    weight: 0.1
  },
  {
    name: "MF DOOM Mask Graffiti Patch Beanie",
    description: "Green folded beanie with graffiti-style mask patch. Street-inspired design with premium construction.",
    price: 38,
    category: "BEANIES",
    images: ["/images/Beanies/mf-doom-mask-graffiti-patch-beanie-green-folded.jpeg"],
    tags: ["graffiti", "patch", "green", "folded", "street"],
    sku: "DOOM-BEAN-GP-01",
    weight: 0.1
  }
]

async function main() {
  console.log('🎭 Starting MF DOOM product database seeding...')

  try {
    // Clear existing products (optional - remove if you want to keep existing ones)
    // await prisma.product.deleteMany()
    // console.log('🗑️  Cleared existing products')

    let addedCount = 0
    let skippedCount = 0

    for (const productData of products) {
      try {
        // Check if product with this SKU already exists
        const existingProduct = await prisma.product.findUnique({
          where: { sku: productData.sku }
        })

        if (existingProduct) {
          console.log(`⏭️  Skipping existing product: ${productData.name}`)
          skippedCount++
          continue
        }

        // Create the product
        const product = await prisma.product.create({
          data: {
            name: productData.name,
            slug: productData.name.toLowerCase()
              .replace(/[^a-z0-9\s]/g, '')
              .replace(/\s+/g, '-'),
            description: productData.description,
            price: productData.price,
            compareAtPrice: productData.compareAtPrice,
            category: productData.category as any,
            sku: productData.sku,
            tags: productData.tags,
            featured: productData.featured || false,
            weight: productData.weight,
            status: 'ACTIVE',
          }
        })

        // Add product images
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

        // Add inventory
        await prisma.inventoryItem.create({
          data: {
            productId: product.id,
            sku: `${productData.sku}-INV`,
            quantityAvailable: 50, // Default stock
            quantityOnHand: 50,
            reorderPoint: 10
          }
        })

        // Add size variants for apparel
        if (['T_SHIRTS', 'HOODIES'].includes(productData.category)) {
          await prisma.productVariant.create({
            data: {
              productId: product.id,
              name: 'Size',
              type: 'SIZE',
              options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
              required: true
            }
          })
        }

        // Add size variants for sneakers
        if (productData.category === 'SNEAKERS') {
          await prisma.productVariant.create({
            data: {
              productId: product.id,
              name: 'Size',
              type: 'SIZE',
              options: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
              required: true
            }
          })
        }

        console.log(`✅ Added product: ${productData.name}`)
        addedCount++

      } catch (error) {
        console.error(`❌ Error adding product ${productData.name}:`, error)
      }
    }

    console.log(`\n🎉 Seeding completed!`)
    console.log(`📦 Products added: ${addedCount}`)
    console.log(`⏭️  Products skipped: ${skippedCount}`)
    console.log(`📊 Total products in database: ${addedCount + skippedCount}`)

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  }) 