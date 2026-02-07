'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import ProductGrid from '@/components/ProductGrid'
import TierDisplay from '@/components/TierDisplay'

export default function ShopPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-white"
    >
      <Header />
      <TierDisplay variant="compact" />
      <ProductGrid />
    </motion.div>
  )
}

