import { create } from 'zustand'
import { getTelegramUser } from '../lib/telegram'
import { apiClient, User, Transaction } from '../lib/api'

interface AppState {
  user: User | null
  balance: { usdc: string; avax: string }
  transactions: Transaction[]
  isLoading: boolean
  lastRecipient: string | null
  
  // Actions
  initUser: () => Promise<void>
  setUsername: (username: string, walletAddress: string) => Promise<void>
  updateBalance: (walletAddress: string) => Promise<void>
  loadTransactions: (walletAddress: string) => Promise<void>
  setLastRecipient: (recipient: string) => void
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  balance: { usdc: '0', avax: '0' },
  transactions: [],
  isLoading: false,
  lastRecipient: null,

  initUser: async () => {
    const tgUser = getTelegramUser()
    if (!tgUser) return

    set({ isLoading: true })
    try {
      const user = await apiClient.getUser(tgUser.id)
      set({ user })
      
      if (user?.wallet_address) {
        await get().updateBalance(user.wallet_address)
        await get().loadTransactions(user.wallet_address)
      }
    } catch (error) {
      console.error('Failed to init user:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  setUsername: async (username: string, walletAddress: string) => {
    const tgUser = getTelegramUser()
    if (!tgUser) throw new Error('Telegram user not found')

    set({ isLoading: true })
    try {
      const user = await apiClient.setUsername(tgUser.id, username, walletAddress)
      set({ user })
      await get().updateBalance(walletAddress)
    } catch (error) {
      console.error('Failed to set username:', error)
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  updateBalance: async (walletAddress: string) => {
    try {
      const balance = await apiClient.getBalance(walletAddress)
      set({ balance })
    } catch (error) {
      console.error('Failed to update balance:', error)
    }
  },

  loadTransactions: async (walletAddress: string) => {
    try {
      const transactions = await apiClient.getTransactions(walletAddress)
      set({ transactions })
    } catch (error) {
      console.error('Failed to load transactions:', error)
    }
  },

  setLastRecipient: (recipient: string) => {
    set({ lastRecipient: recipient })
  },
}))
