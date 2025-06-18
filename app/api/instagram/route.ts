import { NextRequest, NextResponse } from 'next/server'

interface InstagramPost {
  id: string
  media_url: string
  media_type: string
  caption: string
  permalink: string
  timestamp: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '6')

  try {
    // Check if Instagram access token is available
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN

    if (accessToken) {
      // Real Instagram API call
      try {
        const response = await fetch(
          `https://graph.instagram.com/me/media?fields=id,media_url,media_type,caption,permalink,timestamp&access_token=${accessToken}&limit=${limit}`
        )
        
        if (response.ok) {
          const data = await response.json()
          return NextResponse.json({
            posts: data.data || [],
            total: data.data?.length || 0,
            account: '@thismfdoom_',
            source: 'instagram'
          })
        }
      } catch (error) {
        console.error('Instagram API error:', error)
        // Fall back to mock data if API fails
      }
    }

    // Try to fetch from Instagram's public API (alternative approach)
    try {
      // Note: This is a simplified approach. For production, you should use the official API
      const username = 'thismfdoom_'
      
      // For now, we'll use realistic mock data that represents your actual Instagram content
      // You can replace this with actual API calls once you set up Instagram Basic Display API
    } catch (error) {
      console.error('Public Instagram fetch error:', error)
    }

    // Mock data representing typical @thismfdoom_ Instagram content
    const mockPosts: InstagramPost[] = [
      {
        id: 'mock_1',
        media_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
        media_type: 'IMAGE',
        caption: '🎭 New MF DOOM tribute pieces dropping soon! Remember ALL CAPS when you spell the man name. What\'s your favorite DOOM track? Drop it in the comments 👇 #MFDOOM #HipHop #Villain #RIPDoom #MetalFace',
        permalink: 'https://instagram.com/thismfdoom_',
        timestamp: new Date().toISOString()
      },
      {
        id: 'mock_2',
        media_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
        media_type: 'IMAGE',
        caption: '🔥 Behind the scenes: Designing the perfect tribute to the masked villain. Every detail matters when honoring a legend. #MFDOOM #Design #Tribute #BehindTheScenes',
        permalink: 'https://instagram.com/thismfdoom_',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'mock_3',
        media_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&flip=h',
        media_type: 'IMAGE',
        caption: '📚 "Operation Doomsday" - Where it all began. DOOM\'s debut solo album changed hip-hop forever. What\'s your favorite track from this masterpiece? #OperationDoomsday #MFDOOM #HipHopHistory',
        permalink: 'https://instagram.com/thismfdoom_',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'mock_4',
        media_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&flip=h',
        media_type: 'IMAGE',
        caption: '🎵 Madvillain Monday! The collaboration between DOOM and Madlib gave us some of the most creative hip-hop ever made. "Madvillainy" is pure genius. #Madvillain #MFDOOM #Madlib #MadvillainMonday',
        permalink: 'https://instagram.com/thismfdoom_',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'mock_5',
        media_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&brightness=0.8',
        media_type: 'IMAGE',
        caption: '🎭 The mask isn\'t just an accessory - it\'s a statement. DOOM taught us that the art speaks louder than the artist. Respect the craft, honor the legacy. #MFDOOM #MetalFace #HipHopPhilosophy',
        permalink: 'https://instagram.com/thismfdoom_',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'mock_6',
        media_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&brightness=0.8',
        media_type: 'IMAGE',
        caption: '🏪 Our mission: Keeping DOOM\'s legacy alive through authentic merchandise and community. Every purchase supports hip-hop culture and honors the villain\'s memory. #MFDOOM #HipHopCulture #Community',
        permalink: 'https://instagram.com/thismfdoom_',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'mock_7',
        media_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&saturation=0.8',
        media_type: 'IMAGE',
        caption: '📱 Follow @thismfdoom_ for daily DOOM content, exclusive drops, and to connect with fellow fans worldwide. The villain\'s influence never dies. #MFDOOM #Community #FollowUs',
        permalink: 'https://instagram.com/thismfdoom_',
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'mock_8',
        media_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&saturation=0.8',
        media_type: 'IMAGE',
        caption: '🎤 "Just remember ALL CAPS when you spell the man name" - Words that echo through hip-hop history. DOOM\'s wordplay was unmatched. What\'s your favorite DOOM bar? #MFDOOM #ALLCAPS #HipHopLyrics',
        permalink: 'https://instagram.com/thismfdoom_',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    // Return limited number of posts
    const posts = mockPosts.slice(0, limit)

    return NextResponse.json({
      posts,
      total: mockPosts.length,
      account: '@thismfdoom_',
      source: 'mock'
    })

  } catch (error) {
    console.error('Error fetching Instagram posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Instagram posts' },
      { status: 500 }
    )
  }
}

/* 
To use real Instagram data, add to your .env file:
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token

To get an Instagram access token:
1. Go to developers.facebook.com
2. Create an app
3. Add Instagram Basic Display product
4. Follow the authentication flow
5. Get a long-lived access token

Example environment variable:
INSTAGRAM_ACCESS_TOKEN=IGQVJXa1FYc2Z...
*/ 