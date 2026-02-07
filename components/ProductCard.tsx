'use client'

import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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

interface ProductCardProps {
  product: Product
  onClick: (product: Product, position: { top: number; left: number; width: number; height: number }) => void
  isOpen?: boolean
}

export default function ProductCard({ product, onClick, isOpen }: ProductCardProps) {
  const imageRef = useRef<HTMLDivElement>(null)
  const [isClicked, setIsClicked] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Reset when overlay closes
  useEffect(() => {
    if (!isOpen && isClicked) {
      setTimeout(() => setIsClicked(false), 400)
    }
  }, [isOpen, isClicked])

  const handleClick = () => {
    // On mobile, navigate to product page
    if (isMobile) {
      router.push(`/product/${product.id}`)
      return
    }

    // On desktop, show overlay
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect()
      setIsClicked(true)
      onClick(product, {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      })
    }
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer"
      onClick={handleClick}
    >
      {/* Product Image Container */}
      <div ref={imageRef} className="relative aspect-[3/4] bg-gray-200 overflow-hidden mb-3">
        {/* Product Image - hides when clicked on desktop */}
        <img
          src={`/products/images/${product.image}`}
          alt={product.name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isClicked && !isMobile ? 'opacity-0' : 'opacity-100'}`}
        />

        {/* Placeholder Logo - shows when clicked on desktop only */}
        {isClicked && !isMobile && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <Image
              src="/Zlogo.svg"
              alt="Logo"
              width={100}
              height={100}
              className="w-1/2 h-auto opacity-20"
            />
          </div>
        )}

        {/* Sold Out Badge */}
        {product.soldOut && (
          <div className="absolute top-4 left-0 bg-white px-3 py-1 text-xs font-bold tracking-wider z-10">
            SOLD OUT
          </div>
        )}

        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black"
        />
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <h3 className="text-xs md:text-sm font-medium tracking-wide uppercase">
          {product.name}
        </h3>
        <p className="text-xs md:text-sm font-medium">
          ${product.price}
        </p>
      </div>
    </motion.div>
  )
}

