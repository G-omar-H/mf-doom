'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn, Package } from 'lucide-react'

interface ImageGalleryProps {
  images: string[]
  productName: string
  currentImage: number
  onImageChange: (index: number) => void
}

export default function ImageGallery({ images, productName, currentImage, onImageChange }: ImageGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalImageIndex, setModalImageIndex] = useState(0)
  const [imageLoadError, setImageLoadError] = useState<Record<number, boolean>>({})
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  const hasImages = images && images.length > 0

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen])

  const openModal = (index: number) => {
    setModalImageIndex(index)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const nextImage = () => {
    if (isModalOpen) {
      setModalImageIndex((prev) => (prev + 1) % images.length)
    } else {
      const newIndex = (currentImage + 1) % images.length
      onImageChange(newIndex)
    }
  }

  const prevImage = () => {
    if (isModalOpen) {
      setModalImageIndex((prev) => (prev - 1 + images.length) % images.length)
    } else {
      const newIndex = (currentImage - 1 + images.length) % images.length
      onImageChange(newIndex)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isModalOpen) return
    
    switch (e.key) {
      case 'Escape':
        closeModal()
        break
      case 'ArrowRight':
        nextImage()
        break
      case 'ArrowLeft':
        prevImage()
        break
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen])

  const handleImageError = (index: number) => {
    setImageLoadError(prev => ({ ...prev, [index]: true }))
  }

  // Touch handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (images.length > 1) {
      if (isLeftSwipe) {
        nextImage()
      } else if (isRightSwipe) {
        prevImage()
      }
    }

    touchStartX.current = 0
    touchEndX.current = 0
  }

  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-4">
        <div 
          className="relative h-64 sm:h-80 md:h-96 lg:h-[600px] bg-gray-50 cursor-pointer group"
          onClick={() => hasImages && !imageLoadError[currentImage] && openModal(currentImage)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {hasImages && !imageLoadError[currentImage] ? (
            <>
              <Image
                src={images[currentImage]}
                alt={productName}
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                onError={() => handleImageError(currentImage)}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                priority
              />
              {/* Zoom overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                <ZoomIn className="text-white opacity-0 group-hover:opacity-80 transition-opacity duration-300" size={48} />
              </div>
              {/* Mobile navigation hints */}
              {images.length > 1 && (
                <>
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 sm:hidden opacity-60">
                    <ChevronLeft size={24} className="text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 sm:hidden opacity-60">
                    <ChevronRight size={24} className="text-white drop-shadow-lg" />
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
              <Package size={48} className="text-gray-400 mb-4 sm:w-24 sm:h-24" />
              <span className="text-sm sm:text-lg text-gray-500 text-center break-words max-w-full">{productName}</span>
            </div>
          )}
        </div>
        
        {/* Image indicators for mobile */}
        {hasImages && images.length > 1 && (
          <div className="flex justify-center gap-1 py-3 sm:hidden">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => onImageChange(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImage ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery - Hidden on mobile to save space */}
      {hasImages && images.length > 1 && (
        <div className="hidden sm:grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
          {images.map((image: string, index: number) => (
            <button
              key={index}
              onClick={() => {
                onImageChange(index)
                if (!imageLoadError[index]) {
                  openModal(index)
                }
              }}
              className={`relative aspect-square rounded-lg overflow-hidden group transition-all duration-200 ${
                currentImage === index 
                  ? 'ring-2 ring-blue-500 ring-offset-2' 
                  : 'hover:ring-2 hover:ring-gray-300'
              }`}
            >
              {!imageLoadError[index] ? (
                <Image
                  src={image}
                  alt={`${productName} ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-110"
                  onError={() => handleImageError(index)}
                  sizes="120px"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Package size={20} className="text-gray-400" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && hasImages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-60 text-white hover:text-gray-300 transition-colors p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 touch-manipulation"
            >
              <X size={24} />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 z-60 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
              {modalImageIndex + 1} / {images.length}
            </div>

            {/* Navigation Buttons - Hidden on mobile, swipe instead */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setModalImageIndex((prev) => (prev - 1 + images.length) % images.length)
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-60 text-white hover:text-gray-300 transition-colors p-3 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 hidden sm:block touch-manipulation"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setModalImageIndex((prev) => (prev + 1) % images.length)
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-60 text-white hover:text-gray-300 transition-colors p-3 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 hidden sm:block touch-manipulation"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Main Modal Image */}
            <motion.div
              key={modalImageIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative max-w-[90vw] max-h-[80vh] w-auto h-auto">
                <Image
                  src={images[modalImageIndex]}
                  alt={`${productName} ${modalImageIndex + 1}`}
                  width={1200}
                  height={1200}
                  className="object-contain max-w-full max-h-full w-auto h-auto"
                  onError={() => handleImageError(modalImageIndex)}
                />
              </div>
            </motion.div>

            {/* Touch gestures hint for mobile */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-xs opacity-70 text-center max-w-xs">
              {images.length > 1 && (
                <p className="sm:hidden">Swipe left/right to navigate • Tap to close</p>
              )}
              <p className="hidden sm:block">Use arrow keys or click buttons to navigate • Press ESC to close</p>
            </div>

            {/* Mobile swipe indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      setModalImageIndex(index)
                    }}
                    className={`w-2 h-2 rounded-full transition-all touch-manipulation ${
                      index === modalImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 