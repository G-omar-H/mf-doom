import { NextRequest, NextResponse } from 'next/server'
import { getInstagramPosts } from '@/lib/data/instagram'

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
    const username = 'thismfdoom_'
    
    // Method 1: Try Insta-Scraper API (free tier)
    try {
      const response = await fetch(
        `https://instagram-scraper-2022.p.rapidapi.com/ig/posts_username/?user=${username}&batch_size=${limit}`,
        {
          headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || 'demo_key',
            'X-RapidAPI-Host': 'instagram-scraper-2022.p.rapidapi.com'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        const posts = data.result || []
        
        const formattedPosts = posts.slice(0, limit).map((post: any) => ({
          id: post.id || post.pk || Math.random().toString(),
          media_url: post.image_versions2?.candidates?.[0]?.url || post.display_url || post.thumbnail_url,
          media_type: post.media_type === 2 ? 'VIDEO' : 'IMAGE',
          caption: post.caption?.text || post.caption || '',
          permalink: `https://instagram.com/p/${post.code || post.shortcode}/`,
          timestamp: new Date((post.taken_at || post.taken_at_timestamp) * 1000).toISOString()
        }))

        if (formattedPosts.length > 0 && formattedPosts[0].media_url) {
          return NextResponse.json({
            posts: formattedPosts,
            total: formattedPosts.length,
            account: '@thismfdoom_',
            source: 'rapidapi_scraper'
          })
        }
      }
    } catch (error) {
      console.error('RapidAPI Instagram scraper error:', error)
    }

    // Method 2: Try Instagram public feed via proxy
    try {
      const response = await fetch(
        `https://www.instagram.com/web/search/topsearch/?query=${username}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json',
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        const user = data.users?.find((u: any) => u.user.username === username)
        
        if (user) {
          // This gives us basic user info, but we need another call for posts
          const postsResponse = await fetch(
            `https://www.instagram.com/${username}/?__a=1`,
            {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
              }
            }
          )
          
          if (postsResponse.ok) {
            const postsData = await postsResponse.json()
            const posts = postsData?.graphql?.user?.edge_owner_to_timeline_media?.edges || []
            
            const formattedPosts = posts.slice(0, limit).map((edge: any) => ({
              id: edge.node.id,
              media_url: edge.node.display_url,
              media_type: edge.node.is_video ? 'VIDEO' : 'IMAGE',
              caption: edge.node.edge_media_to_caption?.edges[0]?.node?.text || '',
              permalink: `https://instagram.com/p/${edge.node.shortcode}/`,
              timestamp: new Date(edge.node.taken_at_timestamp * 1000).toISOString()
            }))

            if (formattedPosts.length > 0) {
              return NextResponse.json({
                posts: formattedPosts,
                total: formattedPosts.length,
                account: '@thismfdoom_',
                source: 'instagram_public'
              })
            }
          }
        }
      }
    } catch (error) {
      console.error('Instagram public API error:', error)
    }

    // Method 3: Try RSS2JSON service
    try {
      const response = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=https://rsshub.app/instagram/user/${username}&count=${limit}`
      )
      
      if (response.ok) {
        const data = await response.json()
        if (data.status === 'ok' && data.items?.length > 0) {
          const posts = data.items.slice(0, limit).map((item: any, index: number) => ({
            id: `rss_${index}_${Date.now()}`,
            media_url: item.enclosure?.link || item.thumbnail || 'https://via.placeholder.com/400x400?text=Instagram+Post',
            media_type: 'IMAGE',
            caption: item.title || item.description?.replace(/<[^>]*>/g, '').substring(0, 100) + '...' || '',
            permalink: item.link || `https://instagram.com/${username}`,
            timestamp: item.pubDate || new Date().toISOString()
          }))

          return NextResponse.json({
            posts,
            total: posts.length,
            account: '@thismfdoom_',
            source: 'rss'
          })
        }
      }
    } catch (error) {
      console.error('RSS feed error:', error)
    }

    // If all methods fail, use local Instagram data as fallback
    console.log('All Instagram fetching methods failed, using local data for @thismfdoom_')
    const localPosts = getInstagramPosts(limit)
    
    if (localPosts.length > 0) {
      return NextResponse.json({
        posts: localPosts,
        total: localPosts.length,
        account: '@thismfdoom_',
        source: 'local'
      })
    }

    // If no local data either, return empty array
    return NextResponse.json({
      posts: [],
      total: 0,
      account: '@thismfdoom_',
      source: 'unavailable',
      message: 'Instagram posts temporarily unavailable. Please visit @thismfdoom_ directly on Instagram.'
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