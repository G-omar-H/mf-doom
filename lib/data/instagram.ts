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
    media_url: '/images/art/photography/doom-mask-artistic-moody.jpg',
    media_type: 'IMAGE',
    caption: '🎭 The mask speaks in silence... New artistic photography piece capturing the eternal villain aesthetic. Available now. #MFDOOM #VillainAesthetic #FineArt',
    permalink: 'https://instagram.com/thismfdoom_',
    timestamp: new Date('2024-01-22').toISOString()
  },
  {
    id: 'doom_post_2',
    media_url: '/images/T-Shirts/mf-doom-all-caps-madvillain-tshirt-grey-back.jpg',
    media_type: 'IMAGE',
    caption: '🎯 ALL CAPS when you spell the man name. New Madvillain tribute tee paying respect to the legendary collaboration. Rest in power. #MFDOOM #ALLCAPS #Madvillain',
    permalink: 'https://instagram.com/thismfdoom_',
    timestamp: new Date('2024-01-20').toISOString()
  },
  {
    id: 'doom_post_3',
    media_url: '/images/Beanies/mf-doom-mask-beanie-green-folded.jpeg',
    media_type: 'IMAGE',
    caption: '🧢 Metal Face Graffiti Patch Beanie - Villain Green. Keep your head warm while keeping the culture alive. Premium knit, iconic design. #MFDOOM #MetalFace #VillainGreen',
    permalink: 'https://instagram.com/thismfdoom_',
    timestamp: new Date('2024-01-18').toISOString()
  },
  {
    id: 'doom_post_4',
    media_url: '/images/Sneakers/BAPE_Sta_Mask_Embroidered/mf-doom-bapesta-mask-embroidered-sneaker-pair-angled.jpeg',
    media_type: 'IMAGE',
    caption: '👟 DOOM x BAPE collaboration where street meets luxury. Limited edition mask embroidery on premium BAPE STA silhouette. The villain would approve. #MFDOOM #BAPE #Collaboration',
    permalink: 'https://instagram.com/thismfdoom_',
    timestamp: new Date('2024-01-16').toISOString()
  },
  {
    id: 'doom_post_5',
    media_url: '/images/T-Shirts/mf-doom-graffiti-logo-tshirt-grey-front.jpg',
    media_type: 'IMAGE',
    caption: '🎨 Graffiti-style DOOM logo tee - paying homage to hip-hop\'s roots. From the underground to your wardrobe. Art meets music. #MFDOOM #Graffiti #HipHop #StreetArt',
    permalink: 'https://instagram.com/thismfdoom_',
    timestamp: new Date('2024-01-14').toISOString()
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