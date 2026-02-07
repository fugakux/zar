'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { addToCart } from '@/lib/auth'
import Header from '@/components/Header'
import Link from 'next/link'
import { useNotification } from '@/components/NotificationProvider'

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

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { showNotification } = useNotification()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetch(`/products/json/${params.id}.json`)
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error('Failed to load product:', error)
      }
    }
    loadProduct()
  }, [params.id])

  const handleAddToCart = () => {
    if (!product || !selectedSize) {
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
  }

  const handleBuyNow = () => {
    if (!product || !selectedSize) {
      showNotification('Please select a size', 'error')
      return
    }

    const { addToHistory } = require('@/lib/auth')
    const order = {
      id: Date.now().toString(),
      items: [{
        productId: product.id,
        name: product.name,
        price: product.price,
        size: selectedSize,
        quantity,
        image: product.image,
      }],
      total: product.price * quantity,
      date: Date.now(),
    }
    
    addToHistory(order)
    showNotification('Purchase successful!')
    router.push('/profile')
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-white"
    >
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Back Button */}
        <Link href="/shop">
          <button className="flex items-center text-sm mb-4 hover:text-gray-600 transition-colors">
            ← Back to Shop
          </button>
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={`/products/images/${product.image}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.soldOut && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-xs font-bold tracking-wider">
                SOLD OUT
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold tracking-tight mb-2">{product.name}</h1>
            <p className="text-3xl font-bold mb-4">${product.price}</p>
            <p className="text-gray-600 text-sm mb-8">{product.description}</p>

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
                <div className="mb-8">
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
                <div className="space-y-3 mt-auto">
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
        </div>
      </div>
    </motion.div>
  )
}

