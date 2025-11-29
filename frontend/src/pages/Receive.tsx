import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { QRCodeSVG } from 'qrcode.react'
import { useStore } from '../store/useStore'
import { hapticFeedback, showBackButton, hideBackButton } from '../lib/telegram'
import toast from 'react-hot-toast'

interface ReceiveProps {
  onBack: () => void
}

export function Receive({ onBack }: ReceiveProps) {
  const { address } = useAccount()
  const { user } = useStore()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    showBackButton(onBack)
    return () => hideBackButton()
  }, [onBack])

  const paymentLink = user ? `https://t.me/AvalanchePayBot?start=pay_${user.username}` : ''

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      hapticFeedback('success')
      setCopied(true)
      toast.success('Address copied!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCopyLink = () => {
    if (paymentLink) {
      navigator.clipboard.writeText(paymentLink)
      hapticFeedback('success')
      toast.success('Payment link copied!')
    }
  }

  const handleShare = () => {
    if (typeof navigator.share === 'function' && paymentLink) {
      navigator.share({
        title: 'Pay me on Avalanche Pay',
        text: `Send me money instantly with Avalanche Pay!`,
        url: paymentLink,
      })
      hapticFeedback('light')
    }
  }

  return (
    <div className="min-h-screen pb-20 px-4 pt-8">
      <h1 className="text-3xl font-bold text-white mb-8">Receive Money</h1>

      {/* QR Code */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-6 border border-white/20">
        <div className="bg-white p-6 rounded-2xl mb-6">
          {address && (
            <QRCodeSVG
              value={address}
              size={256}
              level="H"
              className="w-full h-auto"
            />
          )}
        </div>

        <div className="text-center">
          <p className="text-purple-200 text-sm mb-2">Your Username</p>
          <p className="text-white text-2xl font-bold mb-4">
            @{user?.username || 'Not set'}
          </p>
        </div>
      </div>

      {/* Wallet Address */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-4 border border-white/20">
        <p className="text-purple-200 text-xs mb-2">Wallet Address</p>
        <div className="flex items-center justify-between">
          <p className="text-white text-sm font-mono truncate mr-2">
            {address ? `${address.slice(0, 10)}...${address.slice(-8)}` : 'Not connected'}
          </p>
          <button
            onClick={handleCopyAddress}
            className="bg-purple-500/20 px-4 py-2 rounded-xl text-purple-300 text-sm font-semibold hover:bg-purple-500/30 transition-all"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Payment Link */}
      {user && (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-4 border border-white/20">
          <p className="text-purple-200 text-xs mb-2">Payment Link</p>
          <div className="flex items-center justify-between">
            <p className="text-white text-sm truncate mr-2">
              t.me/AvalanchePayBot?start=pay_{user.username}
            </p>
            <button
              onClick={handleCopyLink}
              className="bg-orange-500/20 px-4 py-2 rounded-xl text-orange-300 text-sm font-semibold hover:bg-orange-500/30 transition-all whitespace-nowrap"
            >
              Copy Link
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {typeof navigator.share === 'function' && user && (
          <button
            onClick={handleShare}
            className="w-full bg-gradient-to-r from-purple-500 to-orange-500 text-white font-semibold py-4 rounded-2xl hover:opacity-90 transition-all transform active:scale-95"
          >
            Share Payment Link
          </button>
        )}

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
          <div className="flex items-start">
            <div className="bg-blue-500/20 p-2 rounded-lg mr-3 mt-1">
              <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-1">How to receive</p>
              <p className="text-purple-200 text-xs leading-relaxed">
                Share your username or QR code with anyone. They can send you USDC instantly on Avalanche with near-zero fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
