export interface User {
  username: string
  createdAt: number
  profilePicture?: string
}

export interface CartItem {
  productId: string
  name: string
  price: number
  size: string
  quantity: number
  image: string
}

export interface OrderHistory {
  id: string
  items: CartItem[]
  total: number
  date: number
}

export const AUTH_KEY = 'zario_user'
export const CART_KEY = 'zario_cart'
export const HISTORY_KEY = 'zario_history'

export function saveUser(username: string, profilePicture?: string): User {
  const user: User = {
    username,
    createdAt: Date.now(),
    profilePicture,
  }
  
  // Check if user already exists
  const existingUser = getUser()
  if (existingUser) {
    user.createdAt = existingUser.createdAt
    if (profilePicture === undefined && existingUser.profilePicture) {
      user.profilePicture = existingUser.profilePicture
    }
  }
  
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
  return user
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem(AUTH_KEY)
  if (!userStr) return null
  return JSON.parse(userStr)
}

export function logout() {
  localStorage.removeItem(AUTH_KEY)
}

export function clearAllData() {
  localStorage.removeItem(AUTH_KEY)
  localStorage.removeItem(CART_KEY)
  localStorage.removeItem(HISTORY_KEY)
}

export function updateProfilePicture(dataUrl: string) {
  const user = getUser()
  if (!user) return
  user.profilePicture = dataUrl
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
}

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  const cartStr = localStorage.getItem(CART_KEY)
  if (!cartStr) return []
  return JSON.parse(cartStr)
}

export function addToCart(item: CartItem) {
  const cart = getCart()
  const existingIndex = cart.findIndex(
    (i) => i.productId === item.productId && i.size === item.size
  )
  
  if (existingIndex > -1) {
    cart[existingIndex].quantity += item.quantity
  } else {
    cart.push(item)
  }
  
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  return cart
}

export function removeFromCart(productId: string, size: string) {
  const cart = getCart()
  const filtered = cart.filter(
    (item) => !(item.productId === productId && item.size === size)
  )
  localStorage.setItem(CART_KEY, JSON.stringify(filtered))
  return filtered
}

export function clearCart() {
  localStorage.setItem(CART_KEY, JSON.stringify([]))
}

export function getOrderHistory(): OrderHistory[] {
  if (typeof window === 'undefined') return []
  const historyStr = localStorage.getItem(HISTORY_KEY)
  if (!historyStr) return []
  return JSON.parse(historyStr)
}

export function addToHistory(order: OrderHistory) {
  const history = getOrderHistory()
  history.unshift(order)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}

// Tier System
export interface TierInfo {
  name: string
  symbol: string
  threshold: number
  color: string
}

export const TIERS: TierInfo[] = [
  { name: 'No Tier', symbol: '0', threshold: 0, color: 'gray' },
  { name: 'Tier 1', symbol: 'I', threshold: 1000, color: 'blue' },
  { name: 'Tier 2', symbol: 'II', threshold: 5000, color: 'purple' },
  { name: 'Sacred Diamonds', symbol: '💎', threshold: 10000, color: 'gold' },
]

export function getTotalSpent(): number {
  const history = getOrderHistory()
  return history.reduce((sum, order) => sum + order.total, 0)
}

export function getCurrentTier(): TierInfo {
  const totalSpent = getTotalSpent()
  
  // Find the highest tier the user has reached
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (totalSpent >= TIERS[i].threshold) {
      return TIERS[i]
    }
  }
  
  return TIERS[0] // No Tier
}

export function getNextTier(): TierInfo | null {
  const currentTier = getCurrentTier()
  const currentIndex = TIERS.findIndex(t => t.name === currentTier.name)
  
  if (currentIndex < TIERS.length - 1) {
    return TIERS[currentIndex + 1]
  }
  
  return null // Already at max tier
}

export function getProgressToNextTier(): number {
  const totalSpent = getTotalSpent()
  const nextTier = getNextTier()
  
  if (!nextTier) return 100 // Max tier reached
  
  const currentTier = getCurrentTier()
  const progress = ((totalSpent - currentTier.threshold) / (nextTier.threshold - currentTier.threshold)) * 100
  
  return Math.min(Math.max(progress, 0), 100)
}

export function getAmountToNextTier(): number {
  const totalSpent = getTotalSpent()
  const nextTier = getNextTier()
  
  if (!nextTier) return 0
  
  return Math.max(nextTier.threshold - totalSpent, 0)
}

