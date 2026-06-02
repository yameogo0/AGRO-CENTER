// Réponse générique de l'API
export interface ApiResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Headers
}

export interface ApiError<T = any> extends Error {
  status: number
  data: T
  isNetworkError?: boolean
  isTimeout?: boolean
}

// ========== Types métier ==========
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  location?: string
  walletAddress?: string
  verified: boolean
  createdAt: string
}

export interface UserStats {
  followers: number
  following: number
  rating: number
  reviews: number
  piEarned: number
  servicesOffered: number
}

export interface Service {
  id: string
  title: string
  description: string
  provider: User
  category: string
  price: number
  duration: string
  availability: 'available' | 'busy' | 'unavailable'
  tags: string[]
  bookings: number
  createdAt: string
}

export interface Booking {
  id: string
  serviceId: string
  serviceTitle: string
  client: User
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  amount: number
}

export interface Conversation {
  id: string
  participants: User[]
  lastMessage: Message
  unreadCount: number
  pinned: boolean
  archived: boolean
  isGroup?: boolean
  groupName?: string
}

export interface Message {
  id: string
  senderId: string
  content: string
  type: 'text' | 'image' | 'file' | 'payment'
  timestamp: string
  read: boolean
  delivered: boolean
}

export interface PiTransaction {
  id: string
  amount: number
  type: 'sent' | 'received'
  from?: string
  to?: string
  description: string
  date: string
  status: 'pending' | 'completed' | 'failed'
  txHash: string
}