'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { getCart, removeFromCart, clearCart, addToHistory, type CartItem } from '@/lib/auth'
import { useNotification } from './NotificationProvider'

interface CartOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartOverlay({ isOpen, onClose }: CartOverlayProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const { showNotification } = useNotification()

  useEffect(() => {
    if (isOpen) {
      setCart(getCart())
    }
  }, [isOpen])

  const handleRemove = (productId: string, size: string) => {
    removeFromCart(productId, size)
    setCart(getCart())
  }

  const handleCheckout = () => {
    if (cart.length === 0) return

    // Create order from cart items
    const order = {
      id: Date.now().toString(),
      items: cart,
      total: cartTotal,
      date: Date.now(),
    }

    // Add to order history
    addToHistory(order)

    // Clear the cart
    clearCart()
    setCart([])

    // Show success and close
    showNotification('Order placed successfully!')
    onClose()
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Sliding Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl z-[60] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold tracking-tight">YOUR CART</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-400 mb-6">Your cart is empty</p>
                  <button
                    onClick={onClose}
                    className="text-sm text-black underline hover:no-underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={`${item.productId}-${item.size}`}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 pb-4 border-b border-gray-200"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-24 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={`/products/images/${item.image}`}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col">
                        <h3 className="font-medium text-sm mb-1">{item.name}</h3>
                        <p className="text-xs text-gray-500 mb-2">
                          Size: {item.size} • Qty: {item.quantity}
                        </p>
                        <p className="font-medium text-sm">${item.price * item.quantity}</p>
                        <button
                          onClick={() => handleRemove(item.productId, item.size)}
                          className="text-xs text-red-500 hover:text-red-700 mt-auto self-start"
                        >
                          Remove
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl">${cartTotal}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-4 rounded-lg font-medium tracking-wide hover:bg-gray-800 transition-colors"
                >
                  CHECKOUT
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

