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

  console.log(`Instagram API called with limit: ${limit}`)

  try {
    const username = 'thismfdoom_'
    
    // Method 1: Instagram Basic Display API (Free - Official Instagram API)
    if (process.env.INSTAGRAM_ACCESS_TOKEN) {
    try {
        console.log('Attempting Instagram Basic Display API...')
      const response = await fetch(
          `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink,caption,timestamp&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}&limit=${limit}`,
        {
          headers: {
              'Accept': 'application/json',
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
          console.log('Instagram Basic Display API successful')
          
          if (data.data && data.data.length > 0) {
            const formattedPosts = data.data.map((post: any) => {
              // For videos, use thumbnail_url if available, otherwise use media_url
              const displayUrl = post.media_type === 'VIDEO' && post.thumbnail_url 
                ? post.thumbnail_url 
                : post.media_url
              
              return {
                id: post.id,
                media_url: displayUrl,
                media_type: post.media_type.toUpperCase(),
                caption: post.caption || '',
                permalink: post.permalink,
                timestamp: post.timestamp
              }
            })
            // Filter out videos that don't have thumbnail_url and still have .mp4 URLs
            .filter((post: any) => !post.media_url.includes('.mp4'))

          return NextResponse.json({
            posts: formattedPosts,
            total: formattedPosts.length,
            account: '@thismfdoom_',
              source: 'instagram_basic_display'
          })
          }
        } else {
          console.log(`Instagram Basic Display API failed: ${response.status}`)
      }
    } catch (error) {
        console.error('Instagram Basic Display API error:', error)
      }
    }

    // Method 2: Multiple RSS Feed Aggregators (Free)
    const rssSources = [
      `https://api.rss2json.com/v1/api.json?rss_url=https://rsshub.app/instagram/user/${username}&count=${limit}`,
      `https://api.rss2json.com/v1/api.json?rss_url=https://rss.app/feeds/v1.1/instagram/${username}.json&count=${limit}`,
      `https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.instagram.com/${username}/`)}`,
    ]

    for (let i = 0; i < rssSources.length; i++) {
      try {
        console.log(`Attempting RSS source ${i + 1}...`)
        const response = await fetch(rssSources[i], {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; InstagramFeed/1.0)',
            'Accept': 'application/json',
          }
        })

      if (response.ok) {
        const data = await response.json()
          
          if (i < 2 && data.status === 'ok' && data.items?.length > 0) {
            // RSS2JSON format
            const posts = data.items.slice(0, limit).map((item: any, index: number) => ({
              id: `rss_${i}_${index}_${Date.now()}`,
              media_url: item.enclosure?.link || item.thumbnail || 'https://via.placeholder.com/400x400?text=Instagram+Post',
              media_type: 'IMAGE',
              caption: item.title || item.description?.replace(/<[^>]*>/g, '').substring(0, 100) + '...' || '',
              permalink: item.link || `https://instagram.com/${username}`,
              timestamp: item.pubDate || new Date().toISOString()
            }))

            if (posts.length > 0) {
              console.log(`RSS source ${i + 1} successful`)
              return NextResponse.json({
                posts,
                total: posts.length,
                account: '@thismfdoom_',
                source: `rss_${i + 1}`
              })
            }
          } else if (i === 2 && data.contents) {
            // AllOrigins format - parse Instagram page
            const html = data.contents
            if (html.includes('"display_url"')) {
              // Extract posts from Instagram page JSON
              const jsonMatch = html.match(/"display_url":"([^"]+)"/g)
              if (jsonMatch && jsonMatch.length > 0) {
                const posts = jsonMatch.slice(0, limit).map((match: string, index: number) => {
                  const url = match.match(/"display_url":"([^"]+)"/)?.[1]?.replace(/\\u0026/g, '&')
                  return {
                    id: `scraped_${index}_${Date.now()}`,
                    media_url: url || 'https://via.placeholder.com/400x400?text=Instagram+Post',
                    media_type: 'IMAGE',
                    caption: `Latest post from @${username}`,
                    permalink: `https://instagram.com/${username}`,
                    timestamp: new Date().toISOString()
                  }
                })

                if (posts.length > 0) {
                  console.log(`Scraping source successful`)
                  return NextResponse.json({
                    posts,
                    total: posts.length,
                    account: '@thismfdoom_',
                    source: 'scraped'
                  })
                }
              }
            }
          }
        }
      } catch (error) {
        console.error(`RSS source ${i + 1} error:`, error)
        continue
      }
    }

    // Method 3: Instagram oEmbed API (Free - for specific posts)
    if (process.env.INSTAGRAM_POST_URLS) {
      try {
        console.log('Attempting Instagram oEmbed API...')
        const postUrls = process.env.INSTAGRAM_POST_URLS.split(',').slice(0, limit)
        const embedPromises = postUrls.map(async (url: string, index: number) => {
          try {
            const response = await fetch(
              `https://api.instagram.com/oembed/?url=${encodeURIComponent(url.trim())}`
            )
            if (response.ok) {
              const data = await response.json()
              return {
                id: `embed_${index}_${Date.now()}`,
                media_url: data.thumbnail_url || 'https://via.placeholder.com/400x400?text=Instagram+Post',
                media_type: 'IMAGE',
                caption: data.title || '',
                permalink: url.trim(),
                timestamp: new Date().toISOString()
              }
            }
          } catch (error) {
            console.error('oEmbed error for URL:', url, error)
          }
          return null
        })

        const embedResults = await Promise.all(embedPromises)
        const validEmbeds = embedResults.filter(Boolean)

        if (validEmbeds.length > 0) {
          console.log('Instagram oEmbed API successful')
          return NextResponse.json({
            posts: validEmbeds,
            total: validEmbeds.length,
            account: '@thismfdoom_',
            source: 'oembed'
          })
      }
    } catch (error) {
        console.error('Instagram oEmbed API error:', error)
      }
    }

    // Method 4: Picuki.com proxy (Free alternative)
    try {
      console.log('Attempting Picuki proxy...')
      const response = await fetch(
        `https://www.picuki.com/profile/${username}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          }
        }
      )
      
      if (response.ok) {
        const html = await response.text()
        // Extract image URLs from Picuki page
        const imageMatches = html.match(/data-src="([^"]+\.jpg[^"]*)"/g)
        if (imageMatches && imageMatches.length > 0) {
          const posts = imageMatches.slice(0, limit).map((match: string, index: number) => {
            const url = match.match(/data-src="([^"]+)"/)?.[1]
            return {
              id: `picuki_${index}_${Date.now()}`,
              media_url: url || 'https://via.placeholder.com/400x400?text=Instagram+Post',
            media_type: 'IMAGE',
              caption: `Latest post from @${username}`,
              permalink: `https://instagram.com/${username}`,
              timestamp: new Date().toISOString()
            }
          })

          if (posts.length > 0) {
            console.log('Picuki proxy successful')
          return NextResponse.json({
            posts,
            total: posts.length,
            account: '@thismfdoom_',
              source: 'picuki'
          })
          }
        }
      }
    } catch (error) {
      console.error('Picuki proxy error:', error)
    }

    // Fallback: Use local Instagram data
    console.log('All Instagram fetching methods failed, using local data for @thismfdoom_')
    const localPosts = getInstagramPosts(limit)
    
    if (localPosts.length > 0) {
      console.log(`Returning ${localPosts.length} local Instagram posts`)
      return NextResponse.json({
        posts: localPosts,
        total: localPosts.length,
        account: '@thismfdoom_',
        source: 'local'
      })
    }

    // If no local data either, return empty array
    console.log('No Instagram posts available at all')
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