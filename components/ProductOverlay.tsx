'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { addToCart } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useNotification } from './NotificationProvider'

interface Product {
  id: string
  name: string
  price: number
  soldOut: boolean
  image: string
  description: string
  sizes: string[]
  category: string
}

interface ProductOverlayProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  imagePosition?: { top: number; left: number; width: number; height: number }
}

export default function ProductOverlay({ product, isOpen, onClose, imagePosition }: ProductOverlayProps) {
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()
  const { showNotification } = useNotification()

  // Overlay position settings - Adjust these values to change position
  const VERTICAL_OFFSET = -250// Negative moves UP, positive moves DOWN (in pixels)
  const OVERLAY_MAX_WIDTH = 400 // Maximum width of overlay
  
  // Calculate center position
  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0
  const centerY = typeof window !== 'undefined' ? (window.innerHeight / 2) + VERTICAL_OFFSET : 0
  const targetWidth = typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.9, OVERLAY_MAX_WIDTH) : OVERLAY_MAX_WIDTH

  // Prevent body scroll when overlay is open (desktop only)
  useEffect(() => {
    if (isOpen && window.innerWidth >= 768) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [isOpen])

  if (!product) return null

  const handleAddToCart = () => {
    if (!selectedSize) {
      showNotification('Please select a size', 'error')
      return
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity,
      image: product.image,
    })

    showNotification('Added to cart!')
    onClose()
  }

  const handleBuyNow = () => {
    if (!selectedSize) {
      showNotification('Please select a size', 'error')
      return
    }

    const item = {
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity,
      image: product.image,
    }

    // Create order and add to history
    const { addToHistory, clearCart } = require('@/lib/auth')
    const order = {
      id: Date.now().toString(),
      items: [item],
      total: product.price * quantity,
      date: Date.now(),
    }
    
    addToHistory(order)
    showNotification('Purchase successful!')
    onClose()
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Centered Container - Travels from card position */}
          <motion.div
            style={{ position: 'fixed' }}
            initial={imagePosition ? {
              top: imagePosition.top,
              left: imagePosition.left,
              width: imagePosition.width,
              height: imagePosition.height,
              translateX: 0,
              translateY: 0,
            } : {
              top: centerY,
              left: centerX,
              width: targetWidth,
              translateX: '-50%',
              translateY: '-50%',
              scale: 0.9,
              opacity: 0,
            }}
            animate={{
              top: centerY,
              left: centerX,
              width: targetWidth,
              translateX: '-50%',
              translateY: '-50%',
              scale: 1,
              opacity: 1,
            }}
            exit={imagePosition ? {
              top: imagePosition.top,
              left: imagePosition.left,
              width: imagePosition.width,
              height: imagePosition.height,
              translateX: 0,
              translateY: 0,
            } : {
              scale: 0.9,
              opacity: 0,
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 200,
            }}
            className="z-[61] rounded-lg shadow-2xl bg-white"
          >
            {/* Product Image */}
            <div className="aspect-[3/4] bg-gray-200 relative flex-shrink-0">
              <img
                src={`/products/images/${product.image}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Sold out badge */}
              {product.soldOut && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-xs font-bold tracking-wider">
                  SOLD OUT
                </div>
              )}
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-black transition-colors z-10"
              >
                ✕
              </button>
              </div>

              {/* Details Section - Fades in */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  delay: 0.2,
                  duration: 0.3,
                }}
                className="overflow-hidden"
              >
                <div className="p-6 bg-white">
                <h2 className="text-2xl font-bold tracking-tight mb-2">{product.name}</h2>
                <p className="text-2xl font-bold mb-4">${product.price}</p>
                <p className="text-gray-600 text-sm mb-6">{product.description}</p>

                {!product.soldOut && (
                  <>
                    {/* Size Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-3 tracking-wide">SIZE</label>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-6 py-2 border-2 rounded-lg font-medium text-sm transition-colors ${
                              selectedSize === size
                                ? 'border-black bg-black text-white'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-3 tracking-wide">QUANTITY</label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddToCart}
                        className="w-full bg-black text-white py-4 rounded-lg font-medium tracking-wide hover:bg-gray-800 transition-colors"
                      >
                        ADD TO CART
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleBuyNow}
                        className="w-full border-2 border-black text-black py-4 rounded-lg font-medium tracking-wide hover:bg-gray-50 transition-colors"
                      >
                        BUY NOW
                      </motion.button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

