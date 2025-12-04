import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface User {
  telegram_id: number
  username: string
  wallet_address: string
  created_at: string
}

export interface Transaction {
  id: string
  from_address: string
  to_address: string
  amount: string
  token: string
  tx_hash: string
  status: 'pending' | 'completed' | 'failed'
  fee: string
  timestamp: string
  note?: string
  privacy?: 'public' | 'friends' | 'private'
}

export interface FeedItem {
  id: string
  from_username: string
  to_username: string
  amount: string
  note?: string
  timestamp: string
  privacy: 'public' | 'friends' | 'private'
  reactions?: Record<string, number>
  user_reacted?: string[]
}

export interface PaymentRequest {
  id: string
  from_username: string
  to_username: string
  amount: string
  note?: string
  status: 'pending' | 'paid' | 'declined' | 'cancelled'
  created_at: string
}

export interface UserProfile {
  username: string
  bio?: string
  avatar?: string
  privacy: 'public' | 'friends' | 'private'
  wallet_address: string
}

export const apiClient = {
  // User endpoints
  async setUsername(telegramId: number, username: string, walletAddress: string): Promise<User> {
    const { data } = await api.post('/api/users/set-username', {
      telegram_id: telegramId,
      username,
      wallet_address: walletAddress,
    })
    return data
  },

  async getUser(telegramId: number): Promise<User | null> {
    try {
      const { data } = await api.get(`/api/users/${telegramId}`)
      return data
    } catch (error) {
      return null
    }
  },

  async getUserByUsername(username: string): Promise<User | null> {
    try {
      const { data } = await api.get(`/api/users/username/${username}`)
      return data
    } catch (error) {
      return null
    }
  },

  // Transaction endpoints
  async createTransaction(
    fromAddress: string,
    toAddress: string,
    amount: string,
    token: string = 'USDC',
    note?: string,
    privacy: 'public' | 'friends' | 'private' = 'public',
    fromUsername?: string,
    toUsername?: string
  ): Promise<{ intentData: any; transactionId: string }> {
    const { data } = await api.post('/api/transactions/create', {
      from_address: fromAddress,
      to_address: toAddress,
      amount,
      token,
      note,
      privacy,
      from_username: fromUsername,
      to_username: toUsername,
    })
    return data
  },

  async submitTransaction(transactionId: string, txHash: string): Promise<Transaction> {
    const { data } = await api.post('/api/transactions/submit', {
      transaction_id: transactionId,
      tx_hash: txHash,
    })
    return data
  },

  async getTransactions(walletAddress: string): Promise<Transaction[]> {
    const { data } = await api.get(`/api/transactions/${walletAddress}`)
    return data
  },

  async getBalance(walletAddress: string): Promise<{ usdc: string; avax: string }> {
    const { data } = await api.get(`/api/balance/${walletAddress}`)
    return data
  },

  // Notification endpoint
  async notifyUser(telegramId: number, message: string): Promise<void> {
    await api.post('/api/notify', {
      telegram_id: telegramId,
      message,
    })
  },

  // Feed endpoints
  async getFeed(filter: 'all' | 'friends' = 'all'): Promise<FeedItem[]> {
    const { data } = await api.get(`/api/feed?filter=${filter}`)
    return data
  },

  async addReaction(itemId: string, emoji: string): Promise<void> {
    await api.post('/api/feed/reaction', {
      item_id: itemId,
      emoji,
    })
  },

  // Payment request endpoints
  async createPaymentRequest(
    fromUsername: string,
    toUsername: string,
    amount: string,
    note?: string
  ): Promise<PaymentRequest> {
    const { data } = await api.post('/api/requests/create', {
      from_username: fromUsername,
      to_username: toUsername,
      amount,
      note,
    })
    return data
  },

  async getIncomingRequests(username: string): Promise<PaymentRequest[]> {
    const { data } = await api.get(`/api/requests/incoming/${username}`)
    return data
  },

  async getOutgoingRequests(username: string): Promise<PaymentRequest[]> {
    const { data } = await api.get(`/api/requests/outgoing/${username}`)
    return data
  },

  async updateRequestStatus(
    requestId: string,
    status: 'paid' | 'declined' | 'cancelled'
  ): Promise<void> {
    await api.post('/api/requests/update', {
      request_id: requestId,
      status,
    })
  },

  // Profile endpoints
  async getUserProfile(username: string): Promise<UserProfile> {
    const { data } = await api.get(`/api/profile/${username}`)
    return data
  },

  async updateUserProfile(
    username: string,
    updates: { bio?: string; avatar?: string; privacy?: 'public' | 'friends' | 'private' }
  ): Promise<UserProfile> {
    const { data } = await api.post('/api/profile/update', {
      username,
      ...updates,
    })
    return data
  },

  // Search users
  async searchUsers(query: string): Promise<User[]> {
    const { data } = await api.get(`/api/users/search?q=${encodeURIComponent(query)}`)
    return data
  },
}
