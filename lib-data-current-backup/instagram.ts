// Instagram posts data for @thismfdoom_
// Update this file manually with your latest Instagram posts

export interface InstagramPost {
  id: string
  media_url: string
  media_type: 'IMAGE' | 'VIDEO'
  caption: string
  permalink: string
  timestamp: string
}

// Add your real Instagram posts here
// To get the data: Visit instagram.com/thismfdoom_, right-click on a post, "Copy link address"
// For images: right-click on the image, "Copy image address"
export const instagramPosts: InstagramPost[] = [
  {
    id: 'doom_post_1',
    media_url: '/images/T-Shirts/mf-doom-all-caps-madvillain-tshirt-grey-back.jpg',
    media_type: 'IMAGE',
    caption: '🎭 New ALL CAPS tribute tee available now! Remember ALL CAPS when you spell the man name. Rest in power to the masked villain. #MFDOOM #ALLCAPS #HipHop #RIPDoom',
    permalink: 'https://instagram.com/thismfdoom_',
    timestamp: new Date('2024-01-20').toISOString()
  },
  {
    id: 'doom_post_2',
    media_url: '/images/Hoodies/mf-doom-mask-graphic-hoodie-front.jpg',
    media_type: 'IMAGE',
    caption: '🔥 Fresh DOOM mask hoodie drop! The villain\'s legacy lives on through authentic streetwear. Quality materials, iconic design. #MFDOOM #Streetwear #MetalFace #HipHopFashion',
    permalink: 'https://instagram.com/thismfdoom_',
    timestamp: new Date('2024-01-18').toISOString()
  },
  {
    id: 'doom_post_3',
    media_url: '/images/Sneakers/BAPE_Sta_Mask_Embroidered/mf-doom-bapesta-mask-embroidered-sneaker-pair-angled.jpeg',
    media_type: 'IMAGE',
    caption: '👟 DOOM x BAPE collaboration sneakers - where hip-hop meets high fashion. Limited edition mask embroidery. The villain would approve. #MFDOOM #BAPE #Sneakers #HipHopCulture',
    permalink: 'https://instagram.com/thismfdoom_',
    timestamp: new Date('2024-01-16').toISOString()
  },
  {
    id: 'doom_post_4',
    media_url: '/images/T-Shirts/mf-doom-graffiti-logo-tshirt-grey-front.jpg',
    media_type: 'IMAGE',
    caption: '🎨 Graffiti-style DOOM logo tee - paying homage to hip-hop\'s roots. From the underground to your wardrobe. Art meets music. #MFDOOM #Graffiti #HipHop #StreetArt',
    permalink: 'https://instagram.com/thismfdoom_',
    timestamp: new Date('2024-01-14').toISOString()
  },
  {
    id: 'doom_post_5',
    media_url: '/images/Beanies/mf-doom-mask-knit-beanie-green-flat.jpeg',
    media_type: 'IMAGE',
    caption: '🧢 Stay warm with the DOOM mask beanie. Perfect for winter sessions and keeping the villain\'s spirit alive. Comfort meets style. #MFDOOM #Beanie #WinterWear #HipHopStyle',
    permalink: 'https://instagram.com/thismfdoom_',
    timestamp: new Date('2024-01-12').toISOString()
  },
  {
    id: 'doom_post_6',
    media_url: '/images/T-Shirts/mf-doom-boombox-halo-graffiti-tshirt-dark-front.png',
    media_type: 'IMAGE',
    caption: '📻 Boombox halo design - where old school meets eternal. The beats never die, the culture lives on. Classic hip-hop vibes. #MFDOOM #Boombox #OldSchool #HipHopCulture',
    permalink: 'https://instagram.com/thismfdoom_',
    timestamp: new Date('2024-01-10').toISOString()
  }
]

export function getInstagramPosts(limit: number = 6): InstagramPost[] {
  return instagramPosts.slice(0, limit)
}

export function getInstagramPostsCount(): number {
  return instagramPosts.length
} 