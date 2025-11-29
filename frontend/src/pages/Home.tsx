import { useEffect } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { web3Modal } from '../lib/wallet'
import { useStore } from '../store/useStore'
import { getTelegramUser, hapticFeedback } from '../lib/telegram'
import toast from 'react-hot-toast'

interface HomeProps {
  onNavigate: (page: 'send' | 'receive' | 'history') => void
}

export function Home({ onNavigate }: HomeProps) {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { user, balance, setUsername, updateBalance } = useStore()
  const tgUser = getTelegramUser()

  useEffect(() => {
    if (address && isConnected) {
      updateBalance(address)
    }
  }, [address, isConnected, updateBalance])

  const handleConnect = async () => {
    hapticFeedback('light')
    web3Modal.open()
  }

  const handleSetUsername = async () => {
    if (!address) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!tgUser?.username) {
      toast.error('Please set a Telegram username first!\n\nGo to: Telegram Settings → Username', {
        duration: 5000,
        icon: '⚠️',
      })
      return
    }

    hapticFeedback('light')
    try {
      await setUsername(tgUser.username, address)
      hapticFeedback('success')
      toast.success(`Username @${tgUser.username} set successfully!`)
    } catch (error: any) {
      hapticFeedback('error')
      console.error('Set username error:', error)
      toast.error(error.message || 'Failed to set username')
    }
  }

  const handleDisconnect = () => {
    hapticFeedback('light')
    disconnect()
    toast.success('Wallet disconnected')
  }

  const handleQuickAction = (action: 'send' | 'receive') => {
    hapticFeedback('light')
    onNavigate(action)
  }

  return (
    <div className="min-h-screen pb-20 px-4">
      {/* Header */}
      <div className="pt-8 pb-6">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Avalanche Pay
        </h1>
        <p className="text-purple-200 text-center text-sm">
          Instant global payments • &lt;$0.001 fees
        </p>
      </div>

      {/* Balance Card */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-6 border border-white/20">
        <div className="text-center">
          <p className="text-purple-200 text-sm mb-2">Your Balance</p>
          <h2 className="text-5xl font-bold text-white mb-1">
            ${balance.usdc}
          </h2>
          <p className="text-purple-200 text-sm">USDC</p>
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-purple-200 text-xs">
              {balance.avax} AVAX
            </p>
          </div>
        </div>
      </div>

      {/* Wallet Connection */}
      {!isConnected ? (
        <button
          onClick={handleConnect}
          className="w-full bg-white text-purple-600 font-semibold py-4 rounded-2xl mb-4 hover:bg-purple-50 transition-all transform active:scale-95"
        >
          Connect Wallet
        </button>
      ) : (
        <>
          {/* Connected Wallet Info */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-4 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-purple-200 text-xs">Connected Wallet</p>
                <p className="text-white font-mono text-sm">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>
              <button
                onClick={handleDisconnect}
                className="bg-red-500/20 text-red-300 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-500/30 transition-all"
              >
                Disconnect
              </button>
            </div>
          </div>

          {!user ? (
            <button
              onClick={handleSetUsername}
              className="w-full bg-gradient-to-r from-purple-500 to-orange-500 text-white font-semibold py-4 rounded-2xl mb-4 hover:opacity-90 transition-all transform active:scale-95"
            >
              Set My Username (@{tgUser?.username || 'username'})
            </button>
          ) : (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-xs">Username</p>
                  <p className="text-white font-semibold">@{user.username}</p>
                </div>
                <div className="bg-green-500/20 px-3 py-1 rounded-full">
                  <p className="text-green-300 text-xs font-semibold">Active</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => handleQuickAction('send')}
          disabled={!isConnected || !user}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex flex-col items-center">
            <div className="bg-purple-500/20 p-3 rounded-full mb-3">
              <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <p className="text-white font-semibold">Send</p>
          </div>
        </button>

        <button
          onClick={() => handleQuickAction('receive')}
          disabled={!isConnected || !user}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex flex-col items-center">
            <div className="bg-orange-500/20 p-3 rounded-full mb-3">
              <svg className="w-6 h-6 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0 0l-4-4m4 4l4-4" />
              </svg>
            </div>
            <p className="text-white font-semibold">Receive</p>
          </div>
        </button>
      </div>

      {/* Features */}
      <div className="space-y-3">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
          <div className="flex items-center">
            <div className="bg-green-500/20 p-2 rounded-lg mr-3">
              <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Lightning Fast</p>
              <p className="text-purple-200 text-xs">Settles in &lt;800ms</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
          <div className="flex items-center">
            <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
              <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Ultra Low Fees</p>
              <p className="text-purple-200 text-xs">~$0.003 per transaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
