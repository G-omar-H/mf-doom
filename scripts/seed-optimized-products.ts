import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ProductData {
  name: string
  description: string
  price: number
  compareAtPrice?: number
  category: 'T_SHIRTS' | 'HOODIES' | 'BEANIES' | 'SNEAKERS' | 'VINYL' | 'ACCESSORIES' | 'ART'
  subcategory: string
  images: string[]
  featured?: boolean
  tags: string[]
  sku: string
  weight?: number
  variants?: {
    name: string
    type: 'SIZE' | 'COLOR' | 'EDITION' | 'FINISH' | 'MATERIAL'
    options: string[]
    required?: boolean
  }[]
}

const products: ProductData[] = [
  // ==================== VINYL RECORDS ====================
  {
    name: "Operation: Doomsday - The Complete Book Edition",
    description: "The legendary debut album that established the villain's reign. Complete book edition featuring rare artwork, liner notes, and the complete Doomsday chronicles. A must-have for any serious collector of underground hip-hop history.",
    price: 89,
    compareAtPrice: 105,
    category: "VINYL",
    subcategory: "Albums",
    images: [
      "/images/vinyl/operation-doomsday-book-cover.jpg",
      "/images/vinyl/operation-doomsday-book-open.jpg",
      "/images/vinyl/operation-doomsday-book-gatefold.jpg",
      "/images/vinyl/operation-doomsday-book-spine.jpg",
      "/images/vinyl/operation-doomsday-book-box.jpg"
    ],
    featured: true,
    tags: ["operation doomsday", "debut album", "book edition", "rare", "collector", "underground"],
    sku: "DOOM-VINYL-OD-BOOK",
    weight: 0.6,
    variants: [
      {
        name: "Edition",
        type: "EDITION",
        options: ["Standard Black Vinyl", "Limited Colored Vinyl", "Deluxe Book Edition"],
        required: true
      }
    ]
  },
  {
    name: "Madvillainy - The Villain Chronicles",
    description: "The acclaimed collaboration between MF DOOM and Madlib that redefined underground hip-hop. Features the complete Madvillainy experience with detailed tracklist and original artwork. ALL CAPS when you spell the man name.",
    price: 79,
    compareAtPrice: 89,
    category: "VINYL",
    subcategory: "Albums", 
    images: [
      "/images/vinyl/madvillainy-vinyl-front.jpg",
      "/images/vinyl/madvillainy-vinyl-back.jpg",
      "/images/vinyl/madvillainy-vinyl-gatefold.jpg",
      "/images/vinyl/madvillainy-vinyl-detail.jpg",
      "/images/vinyl/madvillainy-vinyl-angle.jpg",
      "/images/vinyl/madvillainy-vinyl-tracklist.jpg"
    ],
    featured: true,
    tags: ["madvillainy", "madlib", "collaboration", "classic", "underground", "all caps"],
    sku: "DOOM-VINYL-MAD-CHR",
    weight: 0.5,
    variants: [
      {
        name: "Edition",
        type: "EDITION", 
        options: ["Standard Black Vinyl", "Limited Gatefold Edition"],
        required: true
      }
    ]
  },
  {
    name: "MM..FOOD - The Culinary Chronicles",
    description: "DOOM's food-themed masterpiece pressed on premium vinyl. A conceptual journey through the villain's kitchen with beats that satisfy the soul. Each track a different course in the ultimate hip-hop meal.",
    price: 75,
    compareAtPrice: 85,
    category: "VINYL", 
    subcategory: "Albums",
    images: [
      "/images/vinyl/mm-food-vinyl-main.jpg",
      "/images/vinyl/mm-food-vinyl-detail.jpg"
    ],
    featured: true,
    tags: ["mm food", "food theme", "conceptual", "culinary", "masterpiece"],
    sku: "DOOM-VINYL-MMF-CUL",
    weight: 0.5
  },

  // ==================== T-SHIRTS ====================
  {
    name: "Metal Face Villain Tee - Classic Brown",
    description: "The iconic Metal Face design on premium cotton. This brown colorway pays homage to the original villain aesthetic with vintage-inspired graphics that capture DOOM's legendary mystique.",
    price: 45,
    compareAtPrice: 55,
    category: "T_SHIRTS",
    subcategory: "T-Shirts",
    images: ["/images/T-Shirts/mf-doom-the-metal-face-tshirt-brown-front.jpg"],
    featured: true,
    tags: ["metal face", "classic", "brown", "vintage", "iconic", "villain"],
    sku: "DOOM-TEE-MF-BROWN",
    weight: 0.2,
    variants: [
      {
        name: "Size",
        type: "SIZE",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        required: true
      }
    ]
  },
  {
    name: "Worst Guy Chronicles Cartoon Tee",
    description: "Featuring DOOM's cartoon character artwork in all its villainous glory. Perfect for fans who appreciate the comic book aesthetic that defined the masked legend's visual identity.",
    price: 42,
    category: "T_SHIRTS",
    subcategory: "T-Shirts",
    images: ["/images/T-Shirts/mf-doom-the-worst-guy-cartoon-character-tshirt.jpg"],
    tags: ["worst guy", "cartoon", "comic", "character art", "villain chronicles"],
    sku: "DOOM-TEE-WG-CART",
    weight: 0.2,
    variants: [
      {
        name: "Size", 
        type: "SIZE",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        required: true
      }
    ]
  },
  {
    name: "Mask Sleeve Detail Tee - Storm Grey",
    description: "Subtle yet striking design featuring the iconic mask graphic positioned on the sleeve. For the sophisticated DOOM fan who prefers understated villain style.",
    price: 44,
    category: "T_SHIRTS",
    subcategory: "T-Shirts", 
    images: ["/images/T-Shirts/mf-doom-mask-sleeve-graphic-tshirt-grey-side.jpg"],
    tags: ["mask", "sleeve", "grey", "subtle", "sophisticated", "detail"],
    sku: "DOOM-TEE-MS-GREY",
    weight: 0.2,
    variants: [
      {
        name: "Size",
        type: "SIZE", 
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        required: true
      }
    ]
  },
  {
    name: "Microphone Villain Distressed Tee",
    description: "Vintage-washed tee featuring microphone artwork with authentic distressed styling. The worn-in feel captures the raw energy of DOOM's underground origins.",
    price: 40,
    category: "T_SHIRTS",
    subcategory: "T-Shirts",
    images: ["/images/T-Shirts/mf-doom-microphone-distressed-tshirt-front.jpg"],
    tags: ["microphone", "distressed", "vintage", "underground", "raw", "worn"],
    sku: "DOOM-TEE-MIC-DIST",
    weight: 0.2,
    variants: [
      {
        name: "Size",
        type: "SIZE",
        options: ["XS", "S", "M", "L", "XL", "XXL"], 
        required: true
      }
    ]
  },
  {
    name: "OneTwo Boombox Mask Fusion Tee",
    description: "Classic boombox design merged with the legendary mask in perfect hip-hop harmony. Multiple viewing angles showcase the intricate detail of this timeless design.",
    price: 46,
    category: "T_SHIRTS", 
    subcategory: "T-Shirts",
    images: [
      "/images/T-Shirts/mf-doom-onetwo-boombox-mask-tshirt-front-view.jpg",
      "/images/T-Shirts/mf-doom-onetwo-boombox-mask-tshirt-alt-view.jpg"
    ],
    featured: true,
    tags: ["boombox", "onetwo", "classic", "hip hop", "fusion", "timeless"],
    sku: "DOOM-TEE-BB-FUSION",
    weight: 0.2,
    variants: [
      {
        name: "Size",
        type: "SIZE",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        required: true
      }
    ]
  },
  {
    name: "Operation Doomsday Comic Chronicles Tee",
    description: "Limited edition comic book style design celebrating the legendary Operation Doomsday era. Features both front and back printing with authentic comic book aesthetics.",
    price: 50,
    compareAtPrice: 62,
    category: "T_SHIRTS",
    subcategory: "T-Shirts",
    images: ["/images/T-Shirts/mf-doom-operation-doomsday-comic-tshirt-front-back.jpg"],
    featured: true,
    tags: ["operation doomsday", "comic", "limited edition", "chronicles", "double print"],
    sku: "DOOM-TEE-OD-COMIC",
    weight: 0.2,
    variants: [
      {
        name: "Size",
        type: "SIZE",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        required: true
      }
    ]
  },
  {
    name: "Boombox Halo Graffiti Tee - Midnight Black", 
    description: "Street art inspired design featuring boombox halo graffiti on premium dark fabric. Where underground hip-hop meets urban art culture.",
    price: 48,
    category: "T_SHIRTS",
    subcategory: "T-Shirts",
    images: ["/images/T-Shirts/mf-doom-boombox-halo-graffiti-tshirt-dark-front.png"],
    tags: ["graffiti", "halo", "street art", "midnight black", "urban", "underground"],
    sku: "DOOM-TEE-BH-GRAF",
    weight: 0.2,
    variants: [
      {
        name: "Size",
        type: "SIZE",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        required: true
      }
    ]
  },
  {
    name: "Classic Graffiti Logo Tee - Storm Grey",
    description: "Clean and bold typography showcasing the classic DOOM graffiti logo. Timeless design with maximum street credibility.",
    price: 43,
    category: "T_SHIRTS",
    subcategory: "T-Shirts", 
    images: ["/images/T-Shirts/mf-doom-graffiti-logo-tshirt-grey-front.jpg"],
    tags: ["graffiti", "logo", "storm grey", "typography", "classic", "street"],
    sku: "DOOM-TEE-GL-GREY",
    weight: 0.2,
    variants: [
      {
        name: "Size",
        type: "SIZE",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        required: true
      }
    ]
  },
  {
    name: "Mask Album Art Tee - Minimalist Edition",
    description: "Album-inspired mask graphic with minimalist aesthetic on premium cotton. Less is more when the design speaks volumes.",
    price: 45,
    category: "T_SHIRTS", 
    subcategory: "T-Shirts",
    images: ["/images/T-Shirts/mf-doom-mask-album-graphic-tshirt-front.jpg"],
    tags: ["album art", "mask", "minimalist", "premium cotton", "graphic"],
    sku: "DOOM-TEE-MA-MIN",
    weight: 0.2,
    variants: [
      {
        name: "Size",
        type: "SIZE",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        required: true
      }
    ]
  },
  {
    name: "All Caps Madvillain Chronicles Tee - Grey",
    description: "Tribute to the legendary Madvillain collaboration with ALL CAPS back print design. Remember: ALL CAPS when you spell the man name.",
    price: 49,
    compareAtPrice: 59,
    category: "T_SHIRTS",
    subcategory: "T-Shirts",
    images: ["/images/T-Shirts/mf-doom-all-caps-madvillain-tshirt-grey-back.jpg"],
    featured: true,
    tags: ["madvillain", "all caps", "collaboration", "grey", "back print", "tribute"],
    sku: "DOOM-TEE-AC-MAD",
    weight: 0.2,
    variants: [
      {
        name: "Size",
        type: "SIZE", 
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        required: true
      }
    ]
  },

  // ==================== HOODIES ====================
  {
    name: "Metal Face Silhouette Hoodie - Shadow Grey",
    description: "Premium heavyweight hoodie featuring the iconic mask silhouette in striking detail. Ultimate comfort meets legendary style for the dedicated villain devotee.",
    price: 89,
    compareAtPrice: 99,
    category: "HOODIES",
    subcategory: "Hoodies",
    images: ["/images/Hoodies/MF DOOM Mask Silhouette Hoodie (Dark Grey).png"],
    featured: true,
    tags: ["silhouette", "mask", "shadow grey", "heavyweight", "premium"],
    sku: "DOOM-HOOD-MS-GREY",
    weight: 0.8,
    variants: [
      {
        name: "Size",
        type: "SIZE",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        required: true
      }
    ]
  },
  {
    name: "Back Script Puffed Hoodie - Villain Grey",
    description: "Elevated design featuring raised puffed script on the back. Premium tactile experience with unmatched villain sophistication.",
    price: 95,
    compareAtPrice: 110,
    category: "HOODIES",
    subcategory: "Hoodies",
    images: ["/images/Hoodies/MF DOOM Back Script Puffed Hoodie (Grey).png"],
    featured: true,
    tags: ["script", "puffed", "villain grey", "back print", "raised", "premium"],
    sku: "DOOM-HOOD-BS-GREY",
    weight: 0.8,
    variants: [
      {
        name: "Size",
        type: "SIZE",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        required: true
      }
    ]
  },
  {
    name: "Street Graffiti Hoodie - Villain Green",
    description: "Vibrant green hoodie with authentic street graffiti DOOM artwork. Where underground culture meets premium fashion in perfect harmony.",
    price: 92,
    category: "HOODIES",
    subcategory: "Hoodies", 
    images: ["/images/Hoodies/MF DOOM Graffiti Hoodie (Green).png"],
    tags: ["graffiti", "villain green", "street", "vibrant", "underground"],
    sku: "DOOM-HOOD-GR-GREEN",
    weight: 0.8,
    variants: [
      {
        name: "Size",
        type: "SIZE",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        required: true
      }
    ]
  },
  {
    name: "Mask Back Puffed Statement Hoodie - Midnight",
    description: "Bold statement piece featuring large puffed mask design on the back. For those who aren't afraid to showcase their villain allegiance.",
    price: 94,
    category: "HOODIES",
    subcategory: "Hoodies",
    images: ["/images/Hoodies/MF DOOM Mask Back Puffed Hoodie (Black).png"],
    tags: ["mask", "back", "puffed", "midnight black", "statement", "bold"],
    sku: "DOOM-HOOD-MB-BLACK",
    weight: 0.8,
    variants: [
      {
        name: "Size",
        type: "SIZE",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        required: true
      }
    ]
  },
  {
    name: "Simple Mask Essential Hoodie - Forest Green",
    description: "Clean minimalist mask design perfect for everyday villain style. Understated elegance with unmistakable DOOM identity.",
    price: 82,
    category: "HOODIES",
    subcategory: "Hoodies",
    images: ["/images/Hoodies/Simple MF DOOM Mask Hoodie (Dark Green).png"],
    tags: ["simple", "mask", "forest green", "minimalist", "everyday", "essential"],
    sku: "DOOM-HOOD-SM-GREEN",
    weight: 0.8,
    variants: [
      {
        name: "Size",
        type: "SIZE",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        required: true
      }
    ]
  },
  {
    name: "Vintage Mask Chronicles Hoodie - Retro Green",
    description: "Vintage-inspired mask graphic with retro aesthetic meets modern comfort. A bridge between DOOM's classic era and contemporary style.",
    price: 90,
    category: "HOODIES",
    subcategory: "Hoodies",
    images: ["/images/Hoodies/Vintage MF DOOM Mask Graphic Hoodie (Green).png"],
    tags: ["vintage", "mask", "retro green", "chronicles", "classic", "modern"],
    sku: "DOOM-HOOD-VM-GREEN",
    weight: 0.8,
    variants: [
      {
        name: "Size",
        type: "SIZE",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        required: true
      }
    ]
  },
  {
    name: "Raised Graffiti Puffed Hoodie - Shadow Black",
    description: "Premium puffed print technique brings graffiti design to life with lasting quality and dimensional texture.",
    price: 96,
    category: "HOODIES",
    subcategory: "Hoodies",
    images: ["/images/Hoodies/MF DOOM Graffiti Puffed Hoodie (Black).png"],
    tags: ["graffiti", "puffed", "shadow black", "raised", "premium", "texture"],
    sku: "DOOM-HOOD-GP-BLACK",
    weight: 0.8,
    variants: [
      {
        name: "Size",
        type: "SIZE",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        required: true
      }
    ]
  },
  {
    name: "Mask & Logo Fusion Hoodie - Essential Black",
    description: "Perfect balance of mask and logo in clean, essential design. The ultimate DOOM hoodie for the discerning villain fan.",
    price: 86,
    category: "HOODIES",
    subcategory: "Hoodies",
    images: ["/images/Hoodies/MF DOOM Mask & Logo Simple Hoodie (Black).png"],
    tags: ["mask", "logo", "fusion", "essential black", "balance", "ultimate"],
    sku: "DOOM-HOOD-ML-BLACK",
    weight: 0.8,
    variants: [
      {
        name: "Size",
        type: "SIZE",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        required: true
      }
    ]
  },
  {
    name: "Mask Zip-Up Convenience Hoodie",
    description: "Premium zip-up design with mask artwork and high-quality zipper hardware. Perfect layering piece for the mobile villain lifestyle.",
    price: 102,
    compareAtPrice: 118,
    category: "HOODIES",
    subcategory: "Hoodies",
    images: ["/images/Hoodies/MF DOOM Mask Zip-Up Hoodie.png"],
    featured: true,
    tags: ["zip-up", "mask", "convenience", "layering", "premium", "mobile"],
    sku: "DOOM-HOOD-ZU-MASK",
    weight: 0.9,
    variants: [
      {
        name: "Size",
        type: "SIZE",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        required: true
      }
    ]
  },
  {
    name: "Simple Graffiti Logo Hoodie - Street Black",
    description: "Clean graffiti logo design with authentic street credibility. Simple yet effective statement of villain allegiance.",
    price: 84,
    category: "HOODIES",
    subcategory: "Hoodies",
    images: ["/images/Hoodies/MF DOOM Simple Graffiti Logo Hoodie (Black).png"],
    tags: ["simple", "graffiti", "logo", "street black", "credibility", "statement"],
    sku: "DOOM-HOOD-SG-BLACK",
    weight: 0.8,
    variants: [
      {
        name: "Size",
        type: "SIZE",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        required: true
      }
    ]
  },
  {
    name: "Mask with Sleeve Details Hoodie - Tactical Black",
    description: "Multi-element design featuring mask with additional graffiti details on sleeves. Comprehensive villain aesthetic from every angle.",
    price: 88,
    category: "HOODIES",
    subcategory: "Hoodies",
    images: ["/images/Hoodies/MF DOOM Simple Mask Hoodie with Sleeve Graffiti (Black).png"],
    tags: ["mask", "sleeve", "details", "tactical black", "multi-element", "comprehensive"],
    sku: "DOOM-HOOD-MSD-BLACK",
    weight: 0.8,
    variants: [
      {
        name: "Size",
        type: "SIZE",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        required: true
      }
    ]
  },
  {
    name: "Madvillainy Album Art Knit Hoodie - Collector's Edition",
    description: "Limited edition knit hoodie featuring the legendary Madvillainy album cover artwork. Premium knit construction for the ultimate collector.",
    price: 115,
    compareAtPrice: 135,
    category: "HOODIES",
    subcategory: "Hoodies",
    images: ["/images/Hoodies/Madvillainy Album Cover Knit Hoodie.png"],
    featured: true,
    tags: ["madvillainy", "album art", "knit", "collector's edition", "limited", "legendary"],
    sku: "DOOM-HOOD-MAD-KNIT",
    weight: 0.9,
    variants: [
      {
        name: "Size",
        type: "SIZE",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        required: true
      }
    ]
  },

  // ==================== BEANIES ====================
  {
    name: "Metal Face Embroidered Beanie - Villain Green",
    description: "Premium knit beanie with embroidered mask design perfect for cold weather villain style. Essential headwear for the dedicated fan.",
    price: 38,
    compareAtPrice: 45,
    category: "BEANIES",
    subcategory: "Beanies",
    images: ["/images/Beanies/mf-doom-mask-knit-beanie-green-flat.jpeg"],
    tags: ["metal face", "embroidered", "villain green", "knit", "winter", "essential"],
    sku: "DOOM-BEAN-MF-GREEN",
    weight: 0.1,
    variants: [
      {
        name: "Style",
        type: "FINISH",
        options: ["Flat Knit", "Ribbed Knit"],
        required: true
      }
    ]
  },
  {
    name: "Graffiti Patch Folded Beanie - Street Green",
    description: "Street-inspired design with graffiti-style mask patch on premium folded beanie construction. Where urban culture meets cold weather necessity.",
    price: 42,
    category: "BEANIES",
    subcategory: "Beanies",
    images: ["/images/Beanies/mf-doom-mask-graffiti-patch-beanie-green-folded.jpeg"],
    tags: ["graffiti", "patch", "street green", "folded", "urban", "street"],
    sku: "DOOM-BEAN-GP-GREEN",
    weight: 0.1,
    variants: [
      {
        name: "Style",
        type: "FINISH",
        options: ["Folded Cuff", "Straight Knit"],
        required: true
      }
    ]
  },

  // ==================== SNEAKERS ====================
  {
    name: "BAPE STA x DOOM Mask Embroidered - Collector's Edition",
    description: "Exclusive BAPE STA collaboration featuring intricate embroidered DOOM mask details. Premium leather construction with collectible appeal for serious sneaker enthusiasts.",
    price: 320,
    compareAtPrice: 380,
    category: "SNEAKERS",
    subcategory: "Sneakers",
    images: [
      "/images/Sneakers/BAPE_Sta_Mask_Embroidered/mf-doom-bapesta-mask-embroidered-sneaker-pair-angled.jpeg",
      "/images/Sneakers/BAPE_Sta_Mask_Embroidered/mf-doom-bapesta-mask-embroidered-sneaker-rear-view.jpeg",
      "/images/Sneakers/BAPE_Sta_Mask_Embroidered/mf-doom-bapesta-mask-embroidered-sneaker-heel-detail-right.jpeg",
      "/images/Sneakers/BAPE_Sta_Mask_Embroidered/mf-doom-bapesta-mask-embroidered-sneaker-angle-view.jpeg"
    ],
    featured: true,
    tags: ["bape", "sta", "embroidered", "collector's edition", "leather", "collaboration"],
    sku: "DOOM-SNKR-BAPE-EMB",
    weight: 1.2,
    variants: [
      {
        name: "Size",
        type: "SIZE",
        options: ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
        required: true
      }
    ]
  },
  {
    name: "BAPE STA x DOOM Character Graphics - Limited Edition", 
    description: "Rare BAPE STA featuring exclusive DOOM character artwork and graphics. Premium materials meet collector-grade design for the ultimate sneaker experience.",
    price: 340,
    compareAtPrice: 395,
    category: "SNEAKERS",
    subcategory: "Sneakers",
    images: [
      "/images/Sneakers/BAPE_Sta_Character_Graphic/mf-doom-bapesta-character-graphic-sneaker-top-angle.jpeg",
      "/images/Sneakers/BAPE_Sta_Character_Graphic/mf-doom-bapesta-character-graphic-sneaker-rear-view.jpeg",
      "/images/Sneakers/BAPE_Sta_Character_Graphic/mf-doom-bapesta-character-graphic-sneaker-right-side-profile.jpeg",
      "/images/Sneakers/BAPE_Sta_Character_Graphic/mf-doom-bapesta-character-graphic-sneaker-pair-rear.jpeg"
    ],
    featured: true,
    tags: ["bape", "sta", "character graphics", "limited edition", "rare", "collector"],
    sku: "DOOM-SNKR-BAPE-CHAR",
    weight: 1.2,
    variants: [
      {
        name: "Size",
        type: "SIZE",
        options: ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
        required: true
      }
    ]
  }
]

async function clearDatabase() {
  console.log('🗑️  Clearing existing database...')
  
  // Delete in correct order due to foreign key constraints
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.inventoryItem.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  
  console.log('✅ Database cleared successfully')
}

async function seedProducts() {
  console.log('🎭 Starting optimized MF DOOM product seeding...')

  let addedCount = 0

  for (const productData of products) {
    try {
      // Create the product
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          slug: productData.name.toLowerCase()
            .replace(/[^a-z0-9\s\-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-'),
          description: productData.description,
          price: productData.price,
          compareAtPrice: productData.compareAtPrice,
          category: productData.category,
          subcategory: productData.subcategory,
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
            altText: `${productData.name} - View ${i + 1}`,
            position: i
          }
        })
      }

      // Add inventory with good stock levels
      await prisma.inventoryItem.create({
        data: {
          productId: product.id,
          sku: `${productData.sku}-STOCK`,
          quantityAvailable: 25,
          quantityOnHand: 25,
          reorderPoint: 5
        }
      })

      // Add variants if specified
      if (productData.variants) {
        for (const variant of productData.variants) {
          await prisma.productVariant.create({
            data: {
              productId: product.id,
              name: variant.name,
              type: variant.type,
              options: variant.options,
              required: variant.required !== false // Default to true
            }
          })
        }
      }

      console.log(`✅ Added: ${productData.name}`)
      addedCount++

    } catch (error) {
      console.error(`❌ Error adding ${productData.name}:`, error)
    }
  }

  return addedCount
}

async function main() {
  try {
    // Clear existing data
    await clearDatabase()
    
    // Seed new optimized products
    const addedCount = await seedProducts()

    console.log(`\n🎉 Optimized seeding completed!`)
    console.log(`📦 Products added: ${addedCount}`)
    console.log(`🎭 Total villain products: ${addedCount}`)
    console.log(`\n🔥 ALL CAPS when you spell the man name!`)

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