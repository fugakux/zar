'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import ProductOverlay from './ProductOverlay'

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

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [imagePosition, setImagePosition] = useState<any>(null)

  useEffect(() => {
    // Load all products from JSON files
    const loadProducts = async () => {
      const productFiles = ['1', '2', '3', '4', '5', '6', '7', '8']

      const loadedProducts = await Promise.all(
        productFiles.map(async (file) => {
          try {
            const response = await fetch(`/products/json/${file}.json`)
            return await response.json()
          } catch (error) {
            console.error(`Failed to load ${file}:`, error)
            return null
          }
        })
      )

      setProducts(loadedProducts.filter(Boolean))
    }

    loadProducts()
  }, [])

  const handleProductClick = (product: Product, position: any) => {
    setImagePosition(position)
    setSelectedProduct(product)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <>
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={item}>
              <ProductCard 
                product={product} 
                onClick={handleProductClick}
                isOpen={selectedProduct?.id === product.id}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <ProductOverlay
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => {
          setSelectedProduct(null)
          setImagePosition(null)
        }}
        imagePosition={imagePosition}
      />
    </>
  )
}

