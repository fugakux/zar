'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getUser, getCart } from '@/lib/auth'
import CartOverlay from './CartOverlay'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [cartCount, setCartCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    setUser(getUser())
    setCartCount(getCart().reduce((sum, item) => sum + item.quantity, 0))
  }, [])

  const refreshCart = () => {
    setCartCount(getCart().reduce((sum, item) => sum + item.quantity, 0))
  }

  const navItems = [
    'HOME',
    'SHIRTS',
    'HOODIES',
    'PANTS',
    'LEATHERS',
    'ACCESSORIES',
    'II',
    'III',
  ]

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/shop">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer h-10 md:h-12 flex items-center"
              >
                <Image
                  src="/Zlogo_txt.svg"
                  alt="Logo"
                  width={120}
                  height={48}
                  className="h-full w-auto"
                  priority
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navItems.map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  whileHover={{ y: -2 }}
                  className="text-xs font-medium tracking-wider hover:text-gray-600 transition-colors"
                >
                  {item}
                </motion.a>
              ))}
            </nav>

            {/* Cart, User & Mobile Menu */}
            <div className="flex items-center gap-3 md:gap-4">
              {user ? (
                <Link href="/profile">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold cursor-pointer"
                  >
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      user.username.slice(0, 2).toUpperCase()
                    )}
                  </motion.div>
                </Link>
              ) : (
                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs md:text-sm tracking-wider hover:text-gray-600 transition-colors"
                  >
                    SIGN IN
                  </motion.button>
                </Link>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setCartOpen(true)
                  refreshCart()
                }}
                className="text-xs md:text-sm tracking-wider hover:text-gray-600 transition-colors"
              >
                CART ({cartCount})
              </motion.button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2"
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span className={`w-full h-0.5 bg-black transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                  <span className={`w-full h-0.5 bg-black transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`w-full h-0.5 bg-black transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          height: mobileMenuOpen ? 'auto' : 0,
          opacity: mobileMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="lg:hidden overflow-hidden bg-white border-b border-gray-200"
      >
        <nav className="px-4 py-4 space-y-4">
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              className="block text-sm font-medium tracking-wider hover:text-gray-600 transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>
      </motion.div>

      {/* Cart Overlay */}
      <CartOverlay 
        isOpen={cartOpen} 
        onClose={() => {
          setCartOpen(false)
          refreshCart()
        }} 
      />
    </>
  )
}

