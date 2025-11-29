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
    token: string = 'USDC'
  ): Promise<{ intentData: any; transactionId: string }> {
    const { data } = await api.post('/api/transactions/create', {
      from_address: fromAddress,
      to_address: toAddress,
      amount,
      token,
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
}
