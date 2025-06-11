import { Product } from '@/types'

export const products: Product[] = [
  {
    id: '1',
    name: 'MF DOOM Mask Hoodie',
    description: 'Premium black hoodie featuring the iconic MF DOOM mask design. Made with high-quality cotton blend for comfort and durability.',
    price: 89.99,
    category: 'apparel',
    images: ['/images/hoodie-black-front.jpg', '/images/hoodie-black-back.jpg'],
    stock: 15,
    featured: true,
    variants: [
      { id: '1-size', name: 'Size', type: 'size', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Operation Doomsday Vinyl',
    description: 'Classic vinyl pressing of MF DOOM\'s debut solo album. Includes original artwork and liner notes.',
    price: 39.99,
    category: 'vinyl',
    images: ['/images/operation-doomsday-vinyl.jpg'],
    stock: 8,
    featured: true,
    variants: [
      { id: '2-size', name: 'Size', type: 'size', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: 'ALL CAPS T-Shirt',
    description: 'Tribute to the classic track "ALL CAPS" - remember all caps when you spell the man name.',
    price: 29.99,
    category: 'apparel',
    images: ['/images/allcaps-tee-front.jpg', '/images/allcaps-tee-back.jpg'],
    stock: 25,
    featured: false,
    variants: [
      { id: '3-size', name: 'Size', type: 'size', options: ['S', 'M', 'L', 'XL', 'XXL'] },
      { id: '3-color', name: 'Color', type: 'color', options: ['Cream', 'White'] }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '4',
    name: 'Villain Snapback',
    description: 'Classic snapback cap with embroidered VILLAIN text. One size fits all.',
    price: 34.99,
    category: 'apparel',
    images: ['/images/villain-snapback.jpg'],
    stock: 12,
    featured: false,
    variants: [
      { id: '4-size', name: 'Size', type: 'size', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '5',
    name: 'MM..FOOD Deluxe Vinyl',
    description: 'Deluxe edition of MM..FOOD with bonus tracks and exclusive artwork.',
    price: 59.99,
    category: 'vinyl',
    images: ['/images/mmfood-deluxe-vinyl.jpg'],
    stock: 6,
    featured: true,
    variants: [
      { id: '5-size', name: 'Size', type: 'size', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '6',
    name: 'Madvillain Tee',
    description: 'Collaboration tee featuring Madvillain artwork from the acclaimed album with Madlib.',
    price: 32.99,
    category: 'apparel',
    images: ['/images/madvillain-tee.jpg'],
    stock: 18,
    featured: false,
    variants: [
      { id: '6-size', name: 'Size', type: 'size', options: ['S', 'M', 'L', 'XL', 'XXL'] },
      { id: '6-color', name: 'Color', type: 'color', options: ['Cream', 'Sand'] }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '7',
    name: 'Metal Face T-Shirt',
    description: 'Premium tee featuring the Metal Face design with high-quality screen printing.',
    price: 27.99,
    category: 'apparel',
    images: ['/images/metalface-tee.jpg'],
    stock: 22,
    featured: false,
    variants: [
      { id: '7-size', name: 'Size', type: 'size', options: ['S', 'M', 'L', 'XL', 'XXL'] },
      { id: '7-color', name: 'Color', type: 'color', options: ['Sand', 'Vintage White'] }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '8',
    name: 'Born Like This Vinyl',
    description: 'Final studio album vinyl with gatefold artwork.',
    price: 44.99,
    category: 'vinyl',
    images: [],
    stock: 5,
    featured: true,
    variants: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '9',
    name: 'Special Herbs Vinyl Box Set',
    description: 'Complete collection of Special Herbs instrumentals in limited edition box set.',
    price: 199.99,
    category: 'vinyl',
    images: [],
    stock: 3,
    featured: true,
    variants: [
      { id: '9-edition', name: 'Edition', type: 'edition', options: ['Standard Black', 'Limited Color'] }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '10',
    name: 'Viktor Vaughn Vaudeville Villain',
    description: 'Vinyl pressing of the Viktor Vaughn alter-ego album.',
    price: 41.99,
    category: 'vinyl',
    images: [],
    stock: 7,
    featured: false,
    variants: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '11',
    name: 'DOOM Mask Pin',
    description: 'Enamel pin featuring the iconic MF DOOM mask. Perfect for jackets, bags, or display.',
    price: 12.99,
    category: 'accessories',
    images: [],
    stock: 50,
    featured: false,
    variants: [
      { id: '11-finish', name: 'Finish', type: 'finish', options: ['Silver', 'Gunmetal'] }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '12',
    name: 'Villain Patch',
    description: 'Embroidered patch with VILLAIN text. Iron-on backing for easy application.',
    price: 8.99,
    category: 'accessories',
    images: [],
    stock: 40,
    featured: false,
    variants: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '13',
    name: 'Metal Face Sticker Pack',
    description: 'Pack of 5 vinyl stickers featuring various MF DOOM designs.',
    price: 6.99,
    category: 'accessories',
    images: [],
    stock: 100,
    featured: false,
    variants: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '14',
    name: 'DOOM Poster Print',
    description: 'High-quality art print featuring MF DOOM artwork. Printed on premium paper.',
    price: 24.99,
    category: 'art',
    images: [],
    stock: 20,
    featured: false,
    variants: [
      { id: '14-size', name: 'Size', type: 'size', options: ['18x24"', '24x36"'] }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '15',
    name: 'Villain Portrait',
    description: 'Limited edition art print of MF DOOM portrait by acclaimed artist.',
    price: 49.99,
    category: 'art',
    images: [],
    stock: 10,
    featured: true,
    variants: [
      { id: '15-size', name: 'Size', type: 'size', options: ['11x14"', '16x20"', '20x24"'] }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
] 