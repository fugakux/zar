'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import { saveUser } from '@/lib/auth'

export default function LandingPage() {
  const router = useRouter()
  const [isExiting, setIsExiting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showSignIn, setShowSignIn] = useState(false)
  const [username, setUsername] = useState('')

  const handleLogoClick = () => {
    setShowModal(true)
  }

  const handleShopClick = () => {
    setIsExiting(true)
    setTimeout(() => {
      router.push('/shop')
    }, 800)
  }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      saveUser(username.trim())
      setIsExiting(true)
      setTimeout(() => {
        router.push('/profile')
      }, 800)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 bg-white flex items-center justify-center group"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          duration: 1,
          ease: "easeOut"
        }}
        whileHover={{ scale: showModal ? 1 : 1.05 }}
        className="relative w-full max-w-md px-8 cursor-pointer"
        onClick={showModal ? undefined : handleLogoClick}
      >
        {/* Subtle pulsing animation */}
        <motion.div
          animate={{
            scale: showModal ? 1 : [1, 1.02, 1],
          }}
          transition={{
            duration: 3,
            repeat: showModal ? 0 : Infinity,
            ease: "easeInOut"
          }}
          className="text-center relative"
        >
          {/* SVG Logo */}
          <div className="w-full flex justify-center relative">
            <motion.div
              animate={{
                filter: showModal ? 'brightness(1) drop-shadow(0 0 0px rgba(0,0,0,0))' : [
                  'brightness(1) drop-shadow(0 0 0px rgba(0,0,0,0))',
                  'brightness(1.2) drop-shadow(0 0 20px rgba(0,0,0,0.1))',
                  'brightness(1) drop-shadow(0 0 0px rgba(0,0,0,0))',
                ]
              }}
              transition={{
                duration: 4,
                repeat: showModal ? 0 : Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="relative"
            >
              <Image
                src="/Zlogo.svg"
                alt="Logo"
                width={400}
                height={400}
                className="w-full h-auto max-w-[300px] md:max-w-[400px] transition-all duration-300"
                priority
              />
              
              {/* Flash effect overlay */}
              {!showModal && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                  animate={{
                    x: ['-100%', '200%'],
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut"
                  }}
                  style={{
                    mixBlendMode: 'overlay',
                  }}
                />
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Subtle glow ring on hover */}
        {!showModal && (
          <motion.div
            className="absolute inset-0 rounded-full opacity-0 blur-2xl"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.05 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'radial-gradient(circle, rgba(0,0,0,0.1) 0%, transparent 70%)',
            }}
          />
        )}
      </motion.div>

      {/* Corner indicator - subtle visual cue */}
      {!showModal && (
        <motion.div
          className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-black opacity-0 group-hover:opacity-20"
          animate={{
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => {
              setShowModal(false)
              setShowSignIn(false)
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {!showSignIn ? (
                <>
                  <div className="space-y-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleShopClick}
                      className="w-full bg-black text-white py-4 rounded-lg font-medium tracking-wide hover:bg-gray-800 transition-colors"
                    >
                      SHOP
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowSignIn(true)}
                      className="w-full border-2 border-black text-black py-4 rounded-lg font-medium tracking-wide hover:bg-gray-50 transition-colors"
                    >
                      SIGN IN
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-center mb-8 tracking-tight">
                    Sign In
                  </h2>
                  <form onSubmit={handleSignIn} className="space-y-6">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium mb-2 tracking-wide">
                        USERNAME
                      </label>
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none transition-colors"
                        placeholder="Enter your username"
                        required
                        autoFocus
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full bg-black text-white py-4 rounded-lg font-medium tracking-wide hover:bg-gray-800 transition-colors"
                    >
                      CONTINUE
                    </motion.button>
                    <button
                      type="button"
                      onClick={() => setShowSignIn(false)}
                      className="w-full text-sm text-gray-500 hover:text-black transition-colors"
                    >
                      Back
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

