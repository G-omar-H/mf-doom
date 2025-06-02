import { Product } from '@/types'

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'MF DOOM Green Hoodie',
    description: 'Premium olive green hoodie featuring the iconic MF DOOM mask graphic with bold lettering. A streetwear essential for true DOOM fans.',
    price: 89.99,
    category: 'apparel',
    images: [],
    stock: 15,
    featured: true,
    variants: [
      { type: 'size', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ]
  },
  {
    id: '2',
    name: 'DOOM Signature Black Hoodie',
    description: 'Black hoodie with distressed DOOM mask print and authentic signature. Features poem text on the back celebrating the villain\'s legacy.',
    price: 94.99,
    category: 'apparel',
    images: [],
    stock: 12,
    featured: true,
    variants: [
      { type: 'size', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ]
  },
  {
    id: '3',
    name: 'The Illest Villain T-Shirt',
    description: 'Cream-colored tee featuring "THE ILLEST VILLAIN" text with DOOM sitting pose graphic. Back print includes iconic mask design and lyric references.',
    price: 45.99,
    category: 'apparel',
    images: [],
    stock: 20,
    featured: false,
    variants: [
      { type: 'size', options: ['S', 'M', 'L', 'XL', 'XXL'] },
      { type: 'color', options: ['Cream', 'White'] }
    ]
  },
  {
    id: '4',
    name: 'DOOM Mask Black T-Shirt',
    description: 'Classic black tee with silver DOOM text and mask graphic. Simple yet powerful design representing the masked villain.',
    price: 39.99,
    category: 'apparel',
    images: [],
    stock: 25,
    featured: false,
    variants: [
      { type: 'size', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ]
  },
  {
    id: '5',
    name: 'Comic Book DOOM T-Shirt',
    description: 'Black tee featuring vintage comic book style artwork of MF DOOM. Inspired by classic Marvel aesthetics with "ALL CAPS" messaging.',
    price: 42.99,
    category: 'apparel',
    images: [],
    stock: 18,
    featured: false,
    variants: [
      { type: 'size', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ]
  },
  {
    id: '6',
    name: 'Cartoon DOOM T-Shirt',
    description: 'Playful cream tee with cartoon-style MF DOOM character. Features the villain in casual stance with graffiti-style lettering.',
    price: 39.99,
    category: 'apparel',
    images: [],
    stock: 22,
    featured: false,
    variants: [
      { type: 'size', options: ['S', 'M', 'L', 'XL', 'XXL'] },
      { type: 'color', options: ['Cream', 'Sand'] }
    ]
  },
  {
    id: '7',
    name: 'MF DOOM Tour T-Shirt',
    description: 'Vintage-inspired tour tee featuring MF DOOM mask graphic with tour dates and signature. Premium cotton construction.',
    price: 44.99,
    category: 'apparel',
    images: [],
    stock: 16,
    featured: false,
    variants: [
      { type: 'size', options: ['S', 'M', 'L', 'XL', 'XXL'] },
      { type: 'color', options: ['Sand', 'Vintage White'] }
    ]
  },
  {
    id: '8',
    name: 'Madvillainy Vinyl LP',
    description: 'The legendary collaboration between MF DOOM and Madlib. Essential hip-hop album featuring "All Caps", "Accordion" and more classics.',
    price: 34.99,
    category: 'vinyl',
    images: [],
    stock: 30,
    featured: true,
    variants: []
  },
  {
    id: '9',
    name: 'Operation: Doomsday Vinyl',
    description: 'MF DOOM\'s debut solo album on vinyl. The album that started it all, featuring "Doomsday", "Rhymes Like Dimes" and more underground classics.',
    price: 39.99,
    category: 'vinyl',
    images: [],
    stock: 25,
    featured: true,
    variants: [
      { type: 'edition', options: ['Standard Black', 'Limited Color'] }
    ]
  },
  {
    id: '10',
    name: 'MM..FOOD Vinyl LP',
    description: 'MF DOOM\'s classic food-themed album. Features "Rapp Snitch Knishes", "Beef Rapp" and more culinary wordplay masterpieces.',
    price: 36.99,
    category: 'vinyl',
    images: [],
    stock: 20,
    featured: false,
    variants: []
  },
  {
    id: '11',
    name: 'DOOM Mask Ring',
    description: 'Premium stainless steel ring featuring the iconic MF DOOM mask design. Adjustable sizing with detailed etching.',
    price: 149.99,
    category: 'accessories',
    images: [],
    stock: 10,
    featured: true,
    variants: [
      { type: 'finish', options: ['Silver', 'Gunmetal'] }
    ]
  },
  {
    id: '12',
    name: 'DOOM Mask Keychain',
    description: 'Metal keychain featuring a 3D MF DOOM mask with pink star background. Perfect for keeping the villain close at all times.',
    price: 24.99,
    category: 'accessories',
    images: [],
    stock: 35,
    featured: false,
    variants: []
  },
  {
    id: '13',
    name: 'DOOM Metal Face Pin Set',
    description: 'Set of 3 enamel pins featuring different MF DOOM mask designs. High-quality metal construction with secure backing.',
    price: 29.99,
    category: 'accessories',
    images: [],
    stock: 28,
    featured: false,
    variants: []
  },
  {
    id: '14',
    name: 'Madvillain Poster',
    description: 'High-quality print of the iconic Madvillainy album cover. Museum-grade paper, perfect for framing.',
    price: 24.99,
    category: 'art',
    images: [],
    stock: 40,
    featured: false,
    variants: [
      { type: 'size', options: ['18x24"', '24x36"'] }
    ]
  },
  {
    id: '15',
    name: 'DOOM Portrait Art Print',
    description: 'Limited edition art print featuring MF DOOM in his signature mask. Signed and numbered by the artist.',
    price: 79.99,
    category: 'art',
    images: [],
    stock: 15,
    featured: true,
    variants: [
      { type: 'size', options: ['11x14"', '16x20"', '20x24"'] }
    ]
  }
] 