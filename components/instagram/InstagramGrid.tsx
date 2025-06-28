'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface InstagramPost {
  id: string
  media_url: string
  media_type: 'IMAGE' | 'VIDEO'
  caption: string
  permalink: string
}

interface InstagramGridProps {
  limit?: number
  className?: string
}

export function InstagramGrid({ limit = 4, className = '' }: InstagramGridProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/instagram?limit=${limit}`)
        if (response.ok) {
          const data = await response.json()
          setPosts(data.posts || [])
        } else {
          console.error('Failed to fetch Instagram posts')
        }
      } catch (error) {
        console.error('Error loading Instagram posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [limit])

  if (loading) {
    return (
      <div className={`grid grid-cols-2 gap-2 ${className}`}>
        {Array.from({ length: limit }).map((_, index) => (
          <div key={index} className="animate-pulse bg-gray-200 aspect-square rounded-lg"></div>
        ))}
      </div>
    )
  }

  if (!posts.length) {
    return (
      <div className={`${className} flex items-center justify-center min-h-[200px]`}>
        <div className="text-center p-6">
          <div className="text-gray-400 mb-2 text-2xl">📸</div>
          <div className="text-gray-600 font-medium mb-2">No posts available</div>
          <div className="text-gray-500 text-sm">
            Visit{' '}
            <a 
              href="https://instagram.com/thismfdoom_" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              @thismfdoom_
            </a>
            {' '}on Instagram
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-2">
        {posts.map((post, index) => (
          <motion.a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            {/* Always render as image thumbnail - for videos this will show the poster/thumbnail */}
            <Image
              src={post.media_url}
              alt={post.caption}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 25vw, 15vw"
              // For videos, this will try to show the thumbnail frame
              onError={(e) => {
                // If video URL fails as image, try with a poster frame parameter
                const target = e.target as HTMLImageElement
                if (post.media_type === 'VIDEO' && !target.src.includes('#t=0.1')) {
                  target.src = post.media_url + '#t=0.1'
                }
              }}
            />
            
            {/* Instagram overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <svg 
                className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
              </svg>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  )
} 