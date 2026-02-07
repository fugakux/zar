'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { getUser, clearAllData, updateProfilePicture, getCart, getOrderHistory, type User, type CartItem, type OrderHistory } from '@/lib/auth'
import Header from '@/components/Header'
import Link from 'next/link'
import { useNotification } from '@/components/NotificationProvider'
import TierDisplay from '@/components/TierDisplay'

export default function ProfilePage() {
  const router = useRouter()
  const { showNotification } = useNotification()
  const [user, setUser] = useState<User | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [history, setHistory] = useState<OrderHistory[]>([])
  const [activeTab, setActiveTab] = useState<'cart' | 'history'>('cart')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const userData = getUser()
    if (!userData) {
      router.push('/')
      return
    }
    setUser(userData)
    setCart(getCart())
    setHistory(getOrderHistory())
  }, [router])

  const handleLogout = () => {
    clearAllData()
    router.push('/')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const dataUrl = reader.result as string
      updateProfilePicture(dataUrl)
      const updatedUser = getUser()
      setUser(updatedUser)
    }
    reader.readAsDataURL(file)
  }

  const handleCheckout = () => {
    if (cart.length === 0) return

    const { addToHistory, clearCart } = require('@/lib/auth')
    
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
    
    // Update state
    setCart([])
    setHistory([order, ...history])

    showNotification('Order placed successfully!')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (!user) {
    return null
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12 pb-8 border-b border-gray-200">
          {/* Profile Picture */}
          <div className="relative group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-32 h-32 rounded-full bg-black text-white flex items-center justify-center text-4xl font-bold cursor-pointer overflow-hidden"
              onClick={() => fileInputRef.current?.click()}
            >
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                getInitials(user.username)
              )}
            </motion.div>
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              Upload
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight mb-2">{user.username}</h1>
            <p className="text-gray-500 text-sm mb-4">
              Member since {formatDate(user.createdAt)}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="px-6 py-2 border-2 border-black text-black rounded-lg font-medium text-sm hover:bg-black hover:text-white transition-colors"
            >
              LOGOUT
            </motion.button>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-2xl font-bold">{cart.length}</div>
              <div className="text-xs text-gray-500 tracking-wide">IN CART</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{history.length}</div>
              <div className="text-xs text-gray-500 tracking-wide">ORDERS</div>
            </div>
          </div>
        </div>

        {/* Tier Display */}
        <div className="mb-8">
          <TierDisplay variant="full" />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('cart')}
            className={`px-6 py-3 font-medium text-sm tracking-wide border-b-2 transition-colors ${
              activeTab === 'cart'
                ? 'border-black text-black'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            CURRENT CART
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-medium text-sm tracking-wide border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-black text-black'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            ORDER HISTORY
          </button>
        </div>

        {/* Content */}
        {activeTab === 'cart' ? (
          <div>
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-400 mb-6">Your cart is empty</p>
                <Link href="/shop">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-3 bg-black text-white rounded-lg font-medium text-sm"
                  >
                    START SHOPPING
                  </motion.button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <motion.div
                    key={`${item.productId}-${item.size}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0"></div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-500">Size: {item.size} • Qty: {item.quantity}</p>
                    </div>
                    <div className="font-medium">${item.price * item.quantity}</div>
                  </motion.div>
                ))}
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl">${cartTotal}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="w-full bg-black text-white py-4 rounded-lg font-medium text-sm"
                  >
                    CHECKOUT
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {history.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-400">No order history yet</p>
              </div>
            ) : (
              <div className="space-y-6">
                {history.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Order #{order.id}</p>
                        <p className="text-sm font-medium">{formatDate(order.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">${order.total}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={`${item.productId}-${item.size}`} className="text-sm text-gray-600">
                          {item.name} (Size: {item.size}, Qty: {item.quantity})
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

