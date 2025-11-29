import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import { useStore } from '../store/useStore'
import { apiClient } from '../lib/api'
import { USDC_ADDRESS, USDC_ABI } from '../lib/wallet'
import { hapticFeedback, showBackButton, hideBackButton } from '../lib/telegram'
import { Confetti } from '../components/Confetti'
import { estimateFee } from '../lib/x402'
import toast from 'react-hot-toast'

interface SendProps {
  onBack: () => void
}

export function Send({ onBack }: SendProps) {
  const { address } = useAccount()
  const { user, lastRecipient, setLastRecipient, updateBalance } = useStore()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [txDetails, setTxDetails] = useState<{ hash: string; time: number } | null>(null)

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isSuccess } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    showBackButton(onBack)
    return () => hideBackButton()
  }, [onBack])

  useEffect(() => {
    if (lastRecipient) {
      setRecipient(lastRecipient)
    }
  }, [lastRecipient])

  useEffect(() => {
    if (isSuccess && hash) {
      handleSuccess(hash)
    }
  }, [isSuccess, hash])

  const handleSuccess = async (txHash: string) => {
    const endTime = Date.now()
    const executionTime = endTime - (txDetails?.time || endTime)
    
    setTxDetails({ hash: txHash, time: executionTime })
    setShowSuccess(true)
    hapticFeedback('success')
    
    // Update balance
    if (address) {
      await updateBalance(address)
    }

    // Notify recipient
    try {
      const recipientUser = await apiClient.getUserByUsername(recipient.replace('@', ''))
      if (recipientUser) {
        await apiClient.notifyUser(
          recipientUser.telegram_id,
          `You received $${amount} USDC from @${user?.username}!`
        )
      }
    } catch (error) {
      console.error('Failed to notify recipient:', error)
    }

    setIsLoading(false)
  }

  const handleSend = async () => {
    if (!address || !recipient || !amount) {
      toast.error('Please fill all fields')
      return
    }

    const cleanRecipient = recipient.replace('@', '')
    
    hapticFeedback('light')
    setIsLoading(true)
    setTxDetails({ hash: '', time: Date.now() })

    try {
      // Get recipient address
      const recipientUser = await apiClient.getUserByUsername(cleanRecipient)
      if (!recipientUser) {
        toast.error('Recipient not found')
        setIsLoading(false)
        return
      }

      // Create transaction record
      await apiClient.createTransaction(
        address,
        recipientUser.wallet_address,
        amount
      )

      // Execute transfer using x402 intent pattern
      const amountInWei = parseUnits(amount, 6) // USDC has 6 decimals

      writeContract({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [recipientUser.wallet_address as `0x${string}`, amountInWei],
      })

      setLastRecipient(recipient)
    } catch (error: any) {
      console.error('Send failed:', error)
      hapticFeedback('error')
      toast.error(error.message || 'Transaction failed')
      setIsLoading(false)
    }
  }

  const handleQuickAmount = (value: string) => {
    hapticFeedback('light')
    setAmount(value)
  }

  const fee = estimateFee()

  if (showSuccess) {
    return (
      <div className="min-h-screen pb-20 px-4 flex flex-col items-center justify-center">
        <Confetti />
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center max-w-md">
          <div className="bg-green-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">Payment Sent!</h2>
          <p className="text-purple-200 mb-6">
            ${amount} USDC sent to {recipient}
          </p>

          <div className="bg-white/5 rounded-2xl p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-purple-200">Speed</span>
              <span className="text-white font-semibold">{txDetails?.time || 0}ms</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-purple-200">Fee</span>
              <span className="text-white font-semibold">${fee.feeUsd}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-purple-200">Network</span>
              <span className="text-white font-semibold">Avalanche</span>
            </div>
          </div>

          {txDetails?.hash && (
            <a
              href={`https://testnet.snowtrace.io/tx/${txDetails.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-300 text-sm underline mb-6 block"
            >
              View on Explorer
            </a>
          )}

          <button
            onClick={() => {
              setShowSuccess(false)
              setRecipient('')
              setAmount('')
              setTxDetails(null)
            }}
            className="w-full bg-white text-purple-600 font-semibold py-4 rounded-2xl hover:bg-purple-50 transition-all"
          >
            Send Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 px-4 pt-8">
      <h1 className="text-3xl font-bold text-white mb-8">Send Money</h1>

      {/* Recipient Input */}
      <div className="mb-6">
        <label className="text-purple-200 text-sm mb-2 block">To</label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="@username"
          className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400"
        />
      </div>

      {/* Amount Input */}
      <div className="mb-6">
        <label className="text-purple-200 text-sm mb-2 block">Amount (USDC)</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-2xl font-bold">$</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl pl-10 pr-4 py-4 text-white text-2xl font-bold placeholder-purple-300/50 focus:outline-none focus:border-purple-400"
          />
        </div>
      </div>

      {/* Quick Amount Buttons */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {['5', '10', '25', '50'].map((value) => (
          <button
            key={value}
            onClick={() => handleQuickAmount(value)}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl py-3 text-white font-semibold hover:bg-white/20 transition-all"
          >
            ${value}
          </button>
        ))}
      </div>

      {/* Fee Display */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-white/10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-purple-200 text-sm">Network Fee</span>
          <span className="text-white font-semibold">${fee.feeUsd}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-purple-200 text-sm">Estimated Time</span>
          <span className="text-white font-semibold">&lt;800ms</span>
        </div>
      </div>

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={!recipient || !amount || isLoading || isPending}
        className="w-full bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading || isPending ? 'Sending...' : `Send $${amount || '0'} USDC`}
      </button>
    </div>
  )
}
