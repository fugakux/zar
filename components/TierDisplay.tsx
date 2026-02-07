'use client'

import { motion } from 'framer-motion'
import { getTotalSpent, getCurrentTier, getNextTier, getProgressToNextTier, getAmountToNextTier, TIERS, type TierInfo, getUser } from '@/lib/auth'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface TierDisplayProps {
  variant?: 'full' | 'compact'
  showAnimation?: boolean
}

export default function TierDisplay({ variant = 'full', showAnimation = false }: TierDisplayProps) {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [totalSpent, setTotalSpent] = useState(0)
  const [currentTier, setCurrentTier] = useState<TierInfo>(TIERS[0])
  const [nextTier, setNextTier] = useState<TierInfo | null>(null)
  const [progress, setProgress] = useState(0)
  const [amountNeeded, setAmountNeeded] = useState(0)

  const updateTierInfo = () => {
    const user = getUser()
    setIsSignedIn(!!user)
    
    if (user) {
      setTotalSpent(getTotalSpent())
      setCurrentTier(getCurrentTier())
      setNextTier(getNextTier())
      setProgress(getProgressToNextTier())
      setAmountNeeded(getAmountToNextTier())
    }
  }

  useEffect(() => {
    updateTierInfo()
  }, [])

  // Refresh when orders change
  useEffect(() => {
    const interval = setInterval(updateTierInfo, 1000)
    return () => clearInterval(interval)
  }, [])

  // Show sign in message if not signed in
  if (!isSignedIn && variant === 'compact') {
    return (
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 py-3 px-4">
        <div className="max-w-[1920px] mx-auto flex items-center justify-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-black transition-colors">
            <span className="font-medium">Sign in to earn tiers</span> →
          </Link>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return null // Don't show full tier display if not signed in
  }

  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 py-3 px-4">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          {/* Current Tier */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2
              ${currentTier.name === 'No Tier' ? 'bg-gray-200 border-gray-400 text-gray-600' : ''}
              ${currentTier.name === 'Tier 1' ? 'bg-blue-100 border-blue-500 text-blue-700' : ''}
              ${currentTier.name === 'Tier 2' ? 'bg-purple-100 border-purple-500 text-purple-700' : ''}
              ${currentTier.name === 'Sacred Diamonds' ? 'bg-yellow-100 border-yellow-500 text-yellow-700' : ''}
            `}>
              {currentTier.symbol}
            </div>
            <div>
              <div className="text-sm font-bold">{currentTier.name}</div>
              <div className="text-xs text-gray-500">${totalSpent.toLocaleString()} spent</div>
            </div>
          </div>

          {/* Progress to Next Tier */}
          {nextTier && (
            <div className="flex-1 max-w-md mx-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Next: {nextTier.name}</span>
                <span>${amountNeeded.toLocaleString()} to go</span>
              </div>
              <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`h-full
                    ${nextTier.name === 'Tier 1' ? 'bg-blue-500' : ''}
                    ${nextTier.name === 'Tier 2' ? 'bg-purple-500' : ''}
                    ${nextTier.name === 'Sacred Diamonds' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : ''}
                  `}
                />
              </div>
            </div>
          )}

          {!nextTier && (
            <div className="text-sm font-bold text-yellow-600">🎉 Max Tier Reached!</div>
          )}
        </div>
      </div>
    )
  }

  // Full variant for profile page
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold mb-4">Your Tier Status</h3>
      
      {/* Current Tier Display */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl border-4
          ${currentTier.name === 'No Tier' ? 'bg-gray-200 border-gray-400 text-gray-600' : ''}
          ${currentTier.name === 'Tier 1' ? 'bg-blue-100 border-blue-500 text-blue-700' : ''}
          ${currentTier.name === 'Tier 2' ? 'bg-purple-100 border-purple-500 text-purple-700' : ''}
          ${currentTier.name === 'Sacred Diamonds' ? 'bg-yellow-100 border-yellow-500 text-yellow-700 text-2xl' : ''}
        `}>
          {currentTier.symbol}
        </div>
        <div>
          <div className="text-2xl font-bold">{currentTier.name}</div>
          <div className="text-gray-600">Total Spent: ${totalSpent.toLocaleString()}</div>
        </div>
      </div>

      {/* All Tiers Progress */}
      <div className="space-y-4">
        {TIERS.slice(1).map((tier, index) => {
          const tierProgress = Math.min(Math.max(((totalSpent - tier.threshold) / tier.threshold) * 100 + 100, 0), 100)
          const isUnlocked = totalSpent >= tier.threshold
          const isNext = nextTier?.name === tier.name

          return (
            <div key={tier.name} className={`${isNext ? 'ring-2 ring-blue-500 rounded-lg p-3' : 'p-3'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2
                    ${!isUnlocked ? 'bg-gray-100 border-gray-300 text-gray-400' : ''}
                    ${isUnlocked && tier.name === 'Tier 1' ? 'bg-blue-100 border-blue-500 text-blue-700' : ''}
                    ${isUnlocked && tier.name === 'Tier 2' ? 'bg-purple-100 border-purple-500 text-purple-700' : ''}
                    ${isUnlocked && tier.name === 'Sacred Diamonds' ? 'bg-yellow-100 border-yellow-500 text-yellow-700' : ''}
                  `}>
                    {tier.symbol}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{tier.name}</div>
                    <div className="text-xs text-gray-500">${tier.threshold.toLocaleString()} required</div>
                  </div>
                </div>
                {isUnlocked && (
                  <div className="text-green-600 font-bold text-sm">✓ Unlocked</div>
                )}
                {!isUnlocked && isNext && (
                  <div className="text-blue-600 font-bold text-sm">${amountNeeded.toLocaleString()} to go</div>
                )}
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: isNext ? `${progress}%` : isUnlocked ? '100%' : '0%' }}
                  transition={{ duration: showAnimation ? 1 : 0.5, ease: 'easeOut' }}
                  className={`h-full
                    ${tier.name === 'Tier 1' ? 'bg-blue-500' : ''}
                    ${tier.name === 'Tier 2' ? 'bg-purple-500' : ''}
                    ${tier.name === 'Sacred Diamonds' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : ''}
                  `}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

