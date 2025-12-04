import { useState } from 'react'
import { useAccount } from 'wagmi'
import { web3Modal } from '../lib/wallet'
import { useStore } from '../store/useStore'
import { getTelegramUser, hapticFeedback } from '../lib/telegram'
import toast from 'react-hot-toast'

interface OnboardingProps {
  onComplete: () => void
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const { address, isConnected } = useAccount()
  const { setUsername, completeOnboarding } = useStore()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [manualUsername, setManualUsername] = useState('')
  const tgUser = getTelegramUser()
  
  // Development mode: allow testing without Telegram
  const isDevelopment = !tgUser

  const handleConnect = async () => {
    hapticFeedback('light')
    web3Modal.open()
  }

  const handleSetUsername = async () => {
    if (!address) {
      toast.error('Please connect your wallet first')
      return
    }

    // Use manual username in development mode, Telegram username in production
    const username = isDevelopment ? manualUsername : tgUser?.username

    if (!username) {
      if (isDevelopment) {
        toast.error('Please enter a username')
      } else {
        toast.error('Please set a Telegram username first!\n\nGo to: Telegram Settings → Username', {
          duration: 5000,
          icon: '⚠️',
        })
      }
      return
    }

    hapticFeedback('light')
    setIsLoading(true)

    try {
      await setUsername(username, address)
      hapticFeedback('success')
      setStep(3)
    } catch (error: any) {
      hapticFeedback('error')
      console.error('Set username error:', error)
      toast.error(error.message || 'Failed to set username')
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = () => {
    hapticFeedback('success')
    completeOnboarding()
    onComplete()
  }

  if (step === 1) {
    return (
      <div className="min-h-screen px-4 flex flex-col items-center justify-center">
        <div className="max-w-md w-full">
          {/* Logo/Icon */}
          <div className="bg-white/10 backdrop-blur-lg w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/20">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-white text-center mb-4">
            Welcome to<br />Avalanche Pay
          </h1>
          
          <p className="text-purple-200 text-center mb-8">
            Send money globally in under a second with near-zero fees
          </p>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
              <div className="flex items-center">
                <div className="bg-green-500/20 p-3 rounded-xl mr-4">
                  <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">Lightning Fast</p>
                  <p className="text-purple-200 text-sm">Settles in &lt;800ms</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
              <div className="flex items-center">
                <div className="bg-blue-500/20 p-3 rounded-xl mr-4">
                  <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">Ultra Low Fees</p>
                  <p className="text-purple-200 text-sm">~$0.003 per transaction</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
              <div className="flex items-center">
                <div className="bg-purple-500/20 p-3 rounded-xl mr-4">
                  <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">Username Payments</p>
                  <p className="text-purple-200 text-sm">Send to @username, not addresses</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              hapticFeedback('light')
              setStep(2)
            }}
            className="w-full bg-white text-purple-600 font-bold py-4 rounded-2xl hover:bg-purple-50 transition-all transform active:scale-95"
          >
            Get Started
          </button>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="min-h-screen px-4 flex flex-col items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-lg w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Connect Your Wallet
          </h2>
          
          <p className="text-purple-200 text-center mb-8">
            Connect your Avalanche wallet to start sending and receiving money
          </p>

          {!isConnected ? (
            <button
              onClick={handleConnect}
              className="w-full bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-all transform active:scale-95 mb-4"
            >
              Connect Wallet
            </button>
          ) : (
            <>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-xs">Connected Wallet</p>
                    <p className="text-white font-mono text-sm">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>
                  </div>
                  <div className="bg-green-500/20 px-3 py-1 rounded-full">
                    <p className="text-green-300 text-xs font-semibold">✓ Connected</p>
                  </div>
                </div>
              </div>

              {isDevelopment ? (
                <>
                  <div className="bg-blue-500/20 backdrop-blur-lg rounded-2xl p-4 mb-4 border border-blue-500/30">
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-blue-300 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-blue-300 font-semibold mb-1">Development Mode</p>
                        <p className="text-blue-200 text-sm">
                          Testing without Telegram. Enter any username below.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="text-purple-200 text-sm mb-2 block">Choose a Username</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-semibold">@</span>
                      <input
                        type="text"
                        value={manualUsername}
                        onChange={(e) => setManualUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                        placeholder="username"
                        maxLength={20}
                        className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl pl-10 pr-4 py-4 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400"
                      />
                    </div>
                    <p className="text-purple-300 text-xs mt-2">Letters, numbers, and underscores only</p>
                  </div>

                  <button
                    onClick={handleSetUsername}
                    disabled={isLoading || !manualUsername}
                    className="w-full bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-all transform active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? 'Setting Username...' : `Set Username (@${manualUsername || 'username'})`}
                  </button>
                </>
              ) : !tgUser?.username ? (
                <div className="bg-yellow-500/20 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-yellow-500/30">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-yellow-300 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="text-yellow-300 font-semibold mb-1">Telegram Username Required</p>
                      <p className="text-yellow-200 text-sm">
                        Please set a Telegram username in your Telegram settings before continuing.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleSetUsername}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-all transform active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? 'Setting Username...' : `Set Username (@${tgUser.username})`}
                </button>
              )}
            </>
          )}

          <button
            onClick={() => {
              hapticFeedback('light')
              setStep(1)
            }}
            className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition-all mt-3"
          >
            Back
          </button>
        </div>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="min-h-screen px-4 flex flex-col items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-green-500/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-white text-center mb-4">
            You're All Set!
          </h2>
          
          <p className="text-purple-200 text-center mb-8">
            Your account is ready. Start sending money to friends instantly!
          </p>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
            <div className="text-center">
              <p className="text-purple-200 text-sm mb-2">Your Username</p>
              <p className="text-white text-2xl font-bold mb-4">@{isDevelopment ? manualUsername : tgUser?.username}</p>
              <p className="text-purple-200 text-xs">
                Friends can send you money using this username
              </p>
            </div>
          </div>

          <button
            onClick={handleComplete}
            className="w-full bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-all transform active:scale-95"
          >
            Start Using Avalanche Pay
          </button>
        </div>
      </div>
    )
  }

  return null
}
