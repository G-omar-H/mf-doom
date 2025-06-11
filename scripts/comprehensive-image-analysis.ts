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

// Enhanced pricing with more categories
const PRICING = {
  APPAREL: {
    hoodie: { min: 79.99, max: 119.99 },
    tshirt: { min: 34.99, max: 54.99 },
    shirt: { min: 39.99, max: 59.99 },
    cap: { min: 39.99, max: 49.99 },
    shoes: { min: 119.99, max: 179.99 },
    knit: { min: 49.99, max: 69.99 },
    beanie: { min: 29.99, max: 39.99 }
  },
  VINYL: {
    lp: { min: 34.99, max: 49.99 },
    album: { min: 34.99, max: 49.99 },
    deluxe: { min: 59.99, max: 89.99 },
    limited: { min: 79.99, max: 129.99 },
    cassette: { min: 19.99, max: 29.99 },
    cd: { min: 16.99, max: 24.99 },
    single: { min: 14.99, max: 24.99 }
  },
  ACCESSORIES: {
    collectible: { min: 149.99, max: 299.99 },
    figure: { min: 149.99, max: 299.99 },
    pin: { min: 14.99, max: 24.99 },
    bottle_opener: { min: 19.99, max: 29.99 },
    mug: { min: 19.99, max: 29.99 },
    keychain: { min: 12.99, max: 19.99 }
  },
  ART: {
    print: { min: 24.99, max: 89.99 },
    poster: { min: 19.99, max: 39.99 },
    photography: { min: 49.99, max: 149.99 },
    artwork: { min: 39.99, max: 149.99 }
  }
}

// Recursively get all image files
function getAllImageFiles(dir: string, baseDir: string = ''): string[] {
  const files: string[] = []
  const items = fs.readdirSync(dir)
  
  for (const item of items) {
    const fullPath = path.join(dir, item)
    const relativePath = path.join(baseDir, item)
    
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...getAllImageFiles(fullPath, relativePath))
    } else if (item.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      files.push(relativePath)
    }
  }
  
  return files
}

// Intelligent grouping based on patterns and content analysis
function groupImagesByProduct(images: string[]): Array<{
  group: string[]
  category: 'APPAREL' | 'VINYL' | 'ACCESSORIES' | 'ART'
  productType: string
  theme: string
}> {
  const groups: Array<{
    group: string[]
    category: 'APPAREL' | 'VINYL' | 'ACCESSORIES' | 'ART'
    productType: string
    theme: string
  }> = []

  // Categorize by directory structure first
  const categorizedImages = {
    apparel: images.filter(img => img.includes('apparel/') || 
      img.toLowerCase().includes('hoodie') || 
      img.toLowerCase().includes('shirt') || 
      img.toLowerCase().includes('tee') ||
      img.toLowerCase().includes('cap') ||
      img.toLowerCase().includes('knit') ||
      img.toLowerCase().includes('beanie')),
    vinyl: images.filter(img => img.includes('vinyl/') || 
      img.toLowerCase().includes('vinyl') || 
      img.toLowerCase().includes('cassette') || 
      img.toLowerCase().includes('cd') ||
      img.toLowerCase().includes('album') ||
      img.toLowerCase().includes('dlx')),
    accessories: images.filter(img => img.includes('accessories/') || 
      img.toLowerCase().includes('figure') || 
      img.toLowerCase().includes('mug') || 
      img.toLowerCase().includes('opener') ||
      img.toLowerCase().includes('pin')),
    art: images.filter(img => img.includes('art/') || 
      img.includes('photography/'))
  }

  // Process remaining images not caught by directory structure
  const processedImages = new Set([
    ...categorizedImages.apparel,
    ...categorizedImages.vinyl,
    ...categorizedImages.accessories,
    ...categorizedImages.art
  ])
  
  const remainingImages = images.filter(img => !processedImages.has(img))

  // Group APPAREL items
  const apparelGroups = groupApparelItems([...categorizedImages.apparel, ...remainingImages.filter(img => 
    img.toLowerCase().includes('book') && (img.toLowerCase().includes('hood') || img.toLowerCase().includes('shirt')) ||
    img.toLowerCase().includes('comic') && img.toLowerCase().includes('tee') ||
    img.toLowerCase().includes('diner') && img.toLowerCase().includes('tee') ||
    img.toLowerCase().includes('doomsday') && (img.toLowerCase().includes('black') || img.toLowerCase().includes('green')) ||
    img.toLowerCase().includes('eyes') && (img.toLowerCase().includes('tee') || img.toLowerCase().includes('cap') || img.toLowerCase().includes('knit')) ||
    img.toLowerCase().includes('blue') && (img.toLowerCase().includes('felt') || img.toLowerCase().includes('caps') || img.toLowerCase().includes('ankle'))
  )])
  groups.push(...apparelGroups)

  // Group VINYL items  
  const vinylGroups = groupVinylItems([...categorizedImages.vinyl, ...remainingImages.filter(img =>
    img.toLowerCase().includes('mm-food') ||
    img.toLowerCase().includes('madvillainy') ||
    img.toLowerCase().includes('operation-doomsday') ||
    img.toLowerCase().includes('curls')
  )])
  groups.push(...vinylGroups)

  // Group ACCESSORIES
  const accessoryGroups = groupAccessoryItems([...categorizedImages.accessories, ...remainingImages.filter(img =>
    img.toLowerCase().includes('doom-figure') ||
    img.toLowerCase().includes('coffee') ||
    img.toLowerCase().includes('bottle')
  )])
  groups.push(...accessoryGroups)

  // Group ART items
  const artGroups = groupArtItems(categorizedImages.art)
  groups.push(...artGroups)

  return groups
}

function groupApparelItems(images: string[]) {
  const groups = []
  
  // Blue Premium Collection (Hoodie + Sneakers)
  const blueHoodieImages = images.filter(img => 
    img.toLowerCase().includes('blue') && 
    (img.toLowerCase().includes('felt') || img.toLowerCase().includes('caps') || 
     img.toLowerCase().includes('embroidery') || img.toLowerCase().includes('tag') ||
     img.toLowerCase().includes('close') || img.toLowerCase().includes('folded'))
  )
  if (blueHoodieImages.length > 0) {
    groups.push({
      group: blueHoodieImages,
      category: 'APPAREL' as const,
      productType: 'hoodie',
      theme: 'blue-premium'
    })
  }

  const blueSneakerImages = images.filter(img => 
    img.toLowerCase().includes('blue') && 
    (img.toLowerCase().includes('ankle') || img.toLowerCase().includes('eyelets') || 
     img.toLowerCase().includes('angle') || img.toLowerCase().includes('box')) &&
    !blueHoodieImages.includes(img)
  )
  if (blueSneakerImages.length > 0) {
    groups.push({
      group: blueSneakerImages,
      category: 'APPAREL' as const,
      productType: 'shoes',
      theme: 'blue-sneakers'
    })
  }

  // Operation Doomsday Book Collection
  const bookCollectionImages = images.filter(img => img.toLowerCase().includes('book'))
  const bookHoodies = bookCollectionImages.filter(img => img.toLowerCase().includes('hood'))
  const bookShirts = bookCollectionImages.filter(img => img.toLowerCase().includes('shirt'))

  // Group by color variants
  const bookHoodieColors = ['black', 'storm']
  const bookShirtColors = ['black', 'storm', 'white']

  bookHoodieColors.forEach(color => {
    const colorImages = bookHoodies.filter(img => img.toLowerCase().includes(color))
    if (colorImages.length > 0) {
      groups.push({
        group: colorImages,
        category: 'APPAREL' as const,
        productType: 'hoodie',
        theme: `operation-doomsday-${color}`
      })
    }
  })

  bookShirtColors.forEach(color => {
    const colorImages = bookShirts.filter(img => img.toLowerCase().includes(color))
    if (colorImages.length > 0) {
      groups.push({
        group: colorImages,
        category: 'APPAREL' as const,
        productType: 'tshirt',
        theme: `operation-doomsday-${color}`
      })
    }
  })

  // Comic Collection
  const comicImages = images.filter(img => img.toLowerCase().includes('comic'))
  const comicColors = ['green', 'white']
  comicColors.forEach(color => {
    const colorImages = comicImages.filter(img => img.toLowerCase().includes(color))
    if (colorImages.length > 0) {
      groups.push({
        group: colorImages,
        category: 'APPAREL' as const,
        productType: 'tshirt',
        theme: `comic-${color}`
      })
    }
  })

  // Diner Collection
  const dinerImages = images.filter(img => img.toLowerCase().includes('diner'))
  const dinerColors = ['black', 'white']
  dinerColors.forEach(color => {
    const colorImages = dinerImages.filter(img => img.toLowerCase().includes(color))
    if (colorImages.length > 0) {
      groups.push({
        group: colorImages,
        category: 'APPAREL' as const,
        productType: 'tshirt',
        theme: `diner-${color}`
      })
    }
  })

  // 25th Anniversary Collection
  const anniversaryImages = images.filter(img => img.toLowerCase().includes('doomsday25'))
  const anniversaryColors = ['black', 'green']
  anniversaryColors.forEach(color => {
    const colorImages = anniversaryImages.filter(img => img.toLowerCase().includes(color))
    if (colorImages.length > 0) {
      groups.push({
        group: colorImages,
        category: 'APPAREL' as const,
        productType: 'tshirt',
        theme: `anniversary-${color}`
      })
    }
  })

  // Eyes Collection
  const eyesImages = images.filter(img => img.toLowerCase().includes('eyes'))
  const eyesTees = eyesImages.filter(img => img.toLowerCase().includes('tee'))
  const eyesCaps = eyesImages.filter(img => img.toLowerCase().includes('cap'))
  const eyesKnits = eyesImages.filter(img => img.toLowerCase().includes('knit'))

  if (eyesTees.length > 0) {
    groups.push({
      group: eyesTees,
      category: 'APPAREL' as const,
      productType: 'tshirt',
      theme: 'eyes'
    })
  }

  if (eyesCaps.length > 0) {
    groups.push({
      group: eyesCaps,
      category: 'APPAREL' as const,
      productType: 'cap',
      theme: 'eyes'
    })
  }

  if (eyesKnits.length > 0) {
    groups.push({
      group: eyesKnits,
      category: 'APPAREL' as const,
      productType: 'knit',
      theme: 'eyes'
    })
  }

  return groups
}

function groupVinylItems(images: string[]) {
  const groups = []

  // MM..FOOD
  const mmFoodImages = images.filter(img => img.toLowerCase().includes('mm-food'))
  if (mmFoodImages.length > 0) {
    groups.push({
      group: mmFoodImages,
      category: 'VINYL' as const,
      productType: 'lp',
      theme: 'mm-food'
    })
  }

  // Madvillainy
  const madvillainImages = images.filter(img => img.toLowerCase().includes('madvillainy'))
  if (madvillainImages.length > 0) {
    groups.push({
      group: madvillainImages,
      category: 'VINYL' as const,
      productType: 'lp',
      theme: 'madvillainy'
    })
  }

  // Operation Doomsday Book Edition
  const operationDoomsdayImages = images.filter(img => img.toLowerCase().includes('operation-doomsday'))
  if (operationDoomsdayImages.length > 0) {
    groups.push({
      group: operationDoomsdayImages,
      category: 'VINYL' as const,
      productType: 'deluxe',
      theme: 'operation-doomsday'
    })
  }

  // DLX Collection
  const dlxImages = images.filter(img => img.toLowerCase().includes('dlx'))
  if (dlxImages.length > 0) {
    groups.push({
      group: dlxImages,
      category: 'VINYL' as const,
      productType: 'deluxe',
      theme: 'deluxe-collection'
    })
  }

  // CD Collection
  const cdImages = images.filter(img => img.toLowerCase().includes('cd'))
  if (cdImages.length > 0) {
    groups.push({
      group: cdImages,
      category: 'VINYL' as const,
      productType: 'cd',
      theme: 'cd-collection'
    })
  }

  // Cassette Collection
  const cassetteImages = images.filter(img => img.toLowerCase().includes('cassette'))
  if (cassetteImages.length > 0) {
    groups.push({
      group: cassetteImages,
      category: 'VINYL' as const,
      productType: 'cassette',
      theme: 'cassette-collection'
    })
  }

  // Special Singles
  const curlsImages = images.filter(img => img.toLowerCase().includes('curls'))
  if (curlsImages.length > 0) {
    groups.push({
      group: curlsImages,
      category: 'VINYL' as const,
      productType: 'single',
      theme: 'all-caps'
    })
  }

  return groups
}

function groupAccessoryItems(images: string[]) {
  const groups = []

  // Collectible Figures
  const figureImages = images.filter(img => 
    img.toLowerCase().includes('figure') || 
    img.toLowerCase().includes('doom-super7') ||
    img.toLowerCase().includes('collectible')
  )
  if (figureImages.length > 0) {
    groups.push({
      group: figureImages,
      category: 'ACCESSORIES' as const,
      productType: 'figure',
      theme: 'super7-collectible'
    })
  }

  // Coffee Mug
  const mugImages = images.filter(img => img.toLowerCase().includes('mug'))
  if (mugImages.length > 0) {
    groups.push({
      group: mugImages,
      category: 'ACCESSORIES' as const,
      productType: 'mug',
      theme: 'coffee'
    })
  }

  // Bottle Opener
  const openerImages = images.filter(img => img.toLowerCase().includes('opener'))
  if (openerImages.length > 0) {
    groups.push({
      group: openerImages,
      category: 'ACCESSORIES' as const,
      productType: 'bottle_opener',
      theme: 'utility'
    })
  }

  // Pins
  const pinImages = images.filter(img => img.toLowerCase().includes('pin'))
  if (pinImages.length > 0) {
    groups.push({
      group: pinImages,
      category: 'ACCESSORIES' as const,
      productType: 'pin',
      theme: 'enamel'
    })
  }

  return groups
}

function groupArtItems(images: string[]) {
  const groups = []

  // Photography
  const photoImages = images.filter(img => img.includes('photography/'))
  if (photoImages.length > 0) {
    groups.push({
      group: photoImages,
      category: 'ART' as const,
      productType: 'photography',
      theme: 'photography'
    })
  }

  return groups
}

// Generate product names and descriptions based on analysis
function generateProductInfo(group: {
  group: string[]
  category: 'APPAREL' | 'VINYL' | 'ACCESSORIES' | 'ART'
  productType: string
  theme: string
}): Omit<ProductData, 'images'> {
  const { category, productType, theme } = group

  // Base product info templates
  const productTemplates: Record<string, Record<string, Record<string, any>>> = {
    APPAREL: {
      hoodie: {
        'blue-premium': {
          name: 'MF DOOM Blue Premium Hoodie',
          description: 'Premium blue hoodie featuring intricate DOOM branding with detailed embroidery, felt appliques, and superior construction. Multiple design elements showcase quality craftsmanship.',
          subcategory: 'hoodies',
          variants: [{ name: 'Size', type: 'SIZE' as const, options: ['S', 'M', 'L', 'XL', 'XXL'] }],
          tags: ['premium', 'embroidered', 'limited-edition', 'streetwear']
        },
        'operation-doomsday-black': {
          name: 'Operation: Doomsday Book Collection Black Hoodie',
          description: 'Exclusive black hoodie from the Operation: Doomsday book collection series. Features unique artwork inspired by the classic album and special edition book release.',
          subcategory: 'hoodies',
          variants: [{ name: 'Size', type: 'SIZE' as const, options: ['S', 'M', 'L', 'XL', 'XXL'] }],
          tags: ['book-collection', 'operation-doomsday', 'premium', 'exclusive']
        },
        'operation-doomsday-storm': {
          name: 'Operation: Doomsday Book Collection Storm Hoodie',
          description: 'Premium storm-colored hoodie from the Operation: Doomsday book collection. Features exclusive artwork and design elements from the special edition series.',
          subcategory: 'hoodies',
          variants: [{ name: 'Size', type: 'SIZE' as const, options: ['S', 'M', 'L', 'XL', 'XXL'] }],
          tags: ['book-collection', 'operation-doomsday', 'storm-colorway']
        }
      },
      tshirt: {
        'operation-doomsday-black': {
          name: 'Operation: Doomsday Book Collection Black T-Shirt',
          description: 'Classic black t-shirt featuring Operation: Doomsday book collection artwork. High-quality cotton construction with front and back graphics.',
          subcategory: 'tshirts',
          variants: [{ name: 'Size', type: 'SIZE' as const, options: ['S', 'M', 'L', 'XL', 'XXL'] }],
          tags: ['book-collection', 'classic-fit', 'cotton']
        },
        'operation-doomsday-storm': {
          name: 'Operation: Doomsday Book Collection Storm T-Shirt',
          description: 'Storm-colored t-shirt from the Operation: Doomsday book collection featuring exclusive artwork on front and back.',
          subcategory: 'tshirts',
          variants: [{ name: 'Size', type: 'SIZE' as const, options: ['S', 'M', 'L', 'XL', 'XXL'] }],
          tags: ['book-collection', 'storm-colorway', 'exclusive']
        },
        'operation-doomsday-white': {
          name: 'Operation: Doomsday Book Collection White T-Shirt',
          description: 'Clean white t-shirt featuring Operation: Doomsday book collection graphics. Premium cotton with front and back designs.',
          subcategory: 'tshirts',
          variants: [{ name: 'Size', type: 'SIZE' as const, options: ['S', 'M', 'L', 'XL', 'XXL'] }],
          tags: ['book-collection', 'white-colorway', 'clean-design']
        },
        'comic-green': {
          name: 'MF DOOM Comic Style Green T-Shirt',
          description: 'Vintage-inspired green t-shirt featuring comic book style DOOM artwork. Quality printing with detailed design elements.',
          subcategory: 'tshirts',
          variants: [{ name: 'Size', type: 'SIZE' as const, options: ['S', 'M', 'L', 'XL', 'XXL'] }],
          tags: ['comic-style', 'vintage-inspired', 'green-colorway']
        },
        'comic-white': {
          name: 'MF DOOM Comic Style White T-Shirt',
          description: 'Clean white t-shirt with comic book inspired DOOM graphics. Features detailed artwork with premium print quality.',
          subcategory: 'tshirts',
          variants: [{ name: 'Size', type: 'SIZE' as const, options: ['S', 'M', 'L', 'XL', 'XXL'] }],
          tags: ['comic-style', 'white-colorway', 'clean-print']
        },
        'diner-black': {
          name: 'MF DOOM Diner Black T-Shirt',
          description: 'Black t-shirt featuring diner-themed DOOM artwork. Premium printing quality with intricate design details.',
          subcategory: 'tshirts',
          variants: [{ name: 'Size', type: 'SIZE' as const, options: ['S', 'M', 'L', 'XL', 'XXL'] }],
          tags: ['diner-theme', 'black-colorway', 'detailed-print']
        },
        'diner-white': {
          name: 'MF DOOM Diner White T-Shirt',
          description: 'White t-shirt with diner-inspired DOOM graphics. Clean design work with detailed printing.',
          subcategory: 'tshirts',
          variants: [{ name: 'Size', type: 'SIZE' as const, options: ['S', 'M', 'L', 'XL', 'XXL'] }],
          tags: ['diner-theme', 'white-colorway', 'clean-design']
        },
        'anniversary-black': {
          name: 'Doomsday 25th Anniversary Black T-Shirt',
          description: 'Commemorative black t-shirt celebrating 25 years of Operation: Doomsday. Features anniversary artwork on front and back.',
          subcategory: 'tshirts',
          variants: [{ name: 'Size', type: 'SIZE' as const, options: ['S', 'M', 'L', 'XL', 'XXL'] }],
          tags: ['25th-anniversary', 'commemorative', 'doomsday', 'limited-edition']
        },
        'anniversary-green': {
          name: 'Doomsday 25th Anniversary Green T-Shirt',
          description: 'Limited edition green colorway celebrating 25 years of Operation: Doomsday. Premium anniversary design.',
          subcategory: 'tshirts',
          variants: [{ name: 'Size', type: 'SIZE' as const, options: ['S', 'M', 'L', 'XL', 'XXL'] }],
          tags: ['25th-anniversary', 'commemorative', 'green-colorway', 'limited-edition']
        },
        'eyes': {
          name: 'MF DOOM Eyes T-Shirt',
          description: 'Unique design featuring the iconic DOOM eyes motif. Artistic design showcasing detailed print work.',
          subcategory: 'tshirts',
          variants: [{ name: 'Size', type: 'SIZE' as const, options: ['S', 'M', 'L', 'XL', 'XXL'] }],
          tags: ['eyes-motif', 'artistic-design', 'unique']
        }
      },
      shoes: {
        'blue-sneakers': {
          name: 'MF DOOM Blue Signature Sneakers',
          description: 'Limited edition blue sneakers featuring custom DOOM design elements. High-quality construction with detailed eyelets and premium materials.',
          subcategory: 'footwear',
          variants: [{ name: 'Size', type: 'SIZE' as const, options: ['7', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'] }],
          tags: ['limited-edition', 'custom-design', 'premium-footwear']
        }
      },
      cap: {
        'eyes': {
          name: 'MF DOOM Eyes Baseball Cap',
          description: 'Premium baseball cap featuring the Eyes design motif. Quality construction with adjustable fit.',
          subcategory: 'headwear',
          variants: [{ name: 'Size', type: 'SIZE' as const, options: ['One Size'] }],
          tags: ['baseball-cap', 'eyes-design', 'headwear']
        }
      },
      knit: {
        'eyes': {
          name: 'MF DOOM Eyes Knit Beanie',
          description: 'Premium knit beanie featuring Eyes design. Quality knitting with detailed construction.',
          subcategory: 'headwear',
          variants: [{ name: 'Size', type: 'SIZE' as const, options: ['One Size'] }],
          tags: ['knit-beanie', 'eyes-design', 'winter-wear']
        }
      }
    },
    VINYL: {
      lp: {
        'mm-food': {
          name: 'MM..FOOD Vinyl LP',
          description: 'MF DOOM\'s acclaimed album MM..FOOD on premium vinyl. Features the classic food-themed artwork and includes tracks like "Rapp Snitch Knishes" and "Beef Rapp".',
          subcategory: 'albums',
          variants: [{ name: 'Edition', type: 'EDITION' as const, options: ['Standard Black', 'Limited Color'] }],
          tags: ['mm-food', 'classic-album', 'food-theme', 'essential']
        },
        'madvillainy': {
          name: 'Madvillainy Vinyl LP - MF DOOM x Madlib',
          description: 'The legendary collaboration between MF DOOM and Madlib. Classic hip-hop album featuring "All Caps", "Accordion" and more.',
          subcategory: 'albums',
          variants: [{ name: 'Edition', type: 'EDITION' as const, options: ['Standard Black', 'Limited Pressing'] }],
          tags: ['madvillainy', 'madlib-collaboration', 'classic', 'essential']
        }
      },
      deluxe: {
        'operation-doomsday': {
          name: 'Operation: Doomsday Deluxe Book Edition',
          description: 'Deluxe book edition of MF DOOM\'s debut album Operation: Doomsday. Features premium book packaging with gatefold design and vinyl pressing.',
          subcategory: 'deluxe-editions',
          variants: [{ name: 'Edition', type: 'EDITION' as const, options: ['Deluxe Book Edition'] }],
          tags: ['operation-doomsday', 'deluxe', 'book-edition', 'debut-album']
        },
        'deluxe-collection': {
          name: 'MF DOOM Deluxe Vinyl Collection',
          description: 'Premium deluxe vinyl collection featuring special packaging and multiple vinyl pressings. Limited edition collector\'s set.',
          subcategory: 'deluxe-editions',
          variants: [{ name: 'Edition', type: 'EDITION' as const, options: ['Deluxe Collection'] }],
          tags: ['deluxe', 'collection', 'premium-packaging', 'limited-edition']
        }
      },
      cd: {
        'cd-collection': {
          name: 'MF DOOM CD Collection',
          description: 'Compact disc collection featuring premium packaging with detailed artwork. Complete package with liner notes.',
          subcategory: 'cds',
          variants: [{ name: 'Format', type: 'EDITION' as const, options: ['Standard CD'] }],
          tags: ['cd', 'compact-disc', 'complete-collection']
        }
      },
      cassette: {
        'cassette-collection': {
          name: 'MF DOOM Cassette Collection',
          description: 'Retro cassette collection featuring classic DOOM albums. Perfect for analog enthusiasts with vintage appeal.',
          subcategory: 'cassettes',
          variants: [{ name: 'Format', type: 'EDITION' as const, options: ['Standard Cassette'] }],
          tags: ['cassette', 'retro', 'analog', 'vintage-format']
        }
      },
      single: {
        'all-caps': {
          name: 'Curls All Caps Vinyl',
          description: 'Special pressing featuring the track "All Caps" with unique artwork. Premium vinyl pressing with detailed packaging.',
          subcategory: 'singles',
          variants: [{ name: 'Edition', type: 'EDITION' as const, options: ['Limited Pressing'] }],
          tags: ['all-caps', 'special-pressing', 'single']
        }
      }
    },
    ACCESSORIES: {
      figure: {
        'super7-collectible': {
          name: 'MF DOOM Super7 Collectible Figure',
          description: 'Premium collectible figure by Super7 featuring MF DOOM in his iconic mask. Includes detailed packaging and accessories.',
          subcategory: 'collectibles',
          variants: [{ name: 'Edition', type: 'EDITION' as const, options: ['Limited Collector Edition'] }],
          tags: ['super7', 'collectible', 'figure', 'limited-edition', 'premium']
        }
      },
      mug: {
        'coffee': {
          name: 'MF DOOM Coffee Mug',
          description: 'Premium ceramic coffee mug featuring MF DOOM artwork. Perfect for morning coffee or tea.',
          subcategory: 'drinkware',
          variants: [{ name: 'Material', type: 'MATERIAL' as const, options: ['Ceramic'] }],
          tags: ['coffee-mug', 'ceramic', 'drinkware', 'daily-use']
        }
      },
      bottle_opener: {
        'utility': {
          name: 'MF DOOM Bottle Opener',
          description: 'Premium metal bottle opener featuring DOOM branding. Durable construction with detailed metalwork.',
          subcategory: 'tools',
          variants: [{ name: 'Material', type: 'MATERIAL' as const, options: ['Metal'] }],
          tags: ['bottle-opener', 'metal', 'utility', 'bar-tool']
        }
      },
      pin: {
        'enamel': {
          name: 'MF DOOM Metal Pin',
          description: 'Premium enamel pin featuring MF DOOM design. High-quality metal construction with secure backing.',
          subcategory: 'pins',
          variants: [{ name: 'Finish', type: 'FINISH' as const, options: ['Enamel'] }],
          tags: ['enamel-pin', 'metal', 'collectible', 'accessory']
        }
      }
    },
    ART: {
      photography: {
        'photography': {
          name: 'MF DOOM Photography Print',
          description: 'Professional photography print featuring MF DOOM. High-quality print on premium paper.',
          subcategory: 'prints',
          variants: [{ name: 'Size', type: 'SIZE' as const, options: ['8x10"', '11x14"', '16x20"'] }],
          tags: ['photography', 'print', 'professional', 'high-quality']
        }
      }
    }
  }

  const template = productTemplates[category]?.[productType]?.[theme] || {
    name: `MF DOOM ${productType} - ${theme}`,
    description: `Premium MF DOOM ${productType} featuring unique design elements.`,
    subcategory: productType,
    variants: [],
    tags: [theme, productType]
  }

  return {
    ...template,
    category,
    price: getRandomPrice(category, productType),
    featured: Math.random() > 0.7 // 30% chance of being featured
  }
}

function getRandomPrice(category: keyof typeof PRICING, type: string): number {
  const categoryPricing = PRICING[category]
  const priceRange = (categoryPricing as any)[type] || { min: 29.99, max: 79.99 }
  const price = Math.random() * (priceRange.max - priceRange.min) + priceRange.min
  return Math.round(price * 100) / 100
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
        url: `/images/${productData.images[i]}`,
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

  // Create inventory item
  await prisma.inventoryItem.create({
    data: {
      productId: product.id,
      sku: `DOOM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      quantityOnHand: Math.floor(Math.random() * 30) + 10,
      quantityAvailable: Math.floor(Math.random() * 30) + 10
    }
  })

  console.log(`✅ Created product: ${productData.name}`)
  return product
}

async function comprehensiveImageAnalysis() {
  await clearDatabase()
  
  const publicImagesPath = path.join(__dirname, '..', 'public', 'images')
  console.log(`🔍 Scanning all images in: ${publicImagesPath}`)
  
  // Get all image files recursively
  const allImages = getAllImageFiles(publicImagesPath)
  console.log(`📷 Found ${allImages.length} total images`)
  
  // Group images intelligently by product
  const productGroups = groupImagesByProduct(allImages)
  console.log(`📦 Identified ${productGroups.length} product groups`)
  
  let productCount = 0
  let imageCount = 0
  
  for (const group of productGroups) {
    const productInfo = generateProductInfo(group)
    const productData: ProductData = {
      ...productInfo,
      images: group.group
    }
    
    await createProduct(productData)
    productCount++
    imageCount += group.group.length
  }
  
  // Final statistics
  const finalProductCount = await prisma.product.count()
  const finalImageCount = await prisma.productImage.count()
  const variantCount = await prisma.productVariant.count()
  const inventoryCount = await prisma.inventoryItem.count()
  
  console.log('\n🎉 Comprehensive analysis complete!')
  console.log('\n📊 Final Statistics:')
  console.log(`   Products created: ${finalProductCount}`)
  console.log(`   Images processed: ${finalImageCount}`)
  console.log(`   Variants created: ${variantCount}`)
  console.log(`   Inventory items: ${inventoryCount}`)
  
  // Category breakdown
  const apparelCount = await prisma.product.count({ where: { category: 'APPAREL' } })
  const vinylCount = await prisma.product.count({ where: { category: 'VINYL' } })
  const accessoriesCount = await prisma.product.count({ where: { category: 'ACCESSORIES' } })
  const artCount = await prisma.product.count({ where: { category: 'ART' } })
  
  console.log('\n📈 Category Breakdown:')
  console.log(`   APPAREL: ${apparelCount} products`)
  console.log(`   VINYL: ${vinylCount} products`)
  console.log(`   ACCESSORIES: ${accessoriesCount} products`)
  console.log(`   ART: ${artCount} products`)
  
  console.log('\n✨ All MF DOOM products from image analysis created successfully!')
}

// Run the comprehensive analysis
comprehensiveImageAnalysis()
  .catch((error) => {
    console.error('❌ Error:', error)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 