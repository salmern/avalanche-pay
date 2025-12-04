import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import { useStore } from '../store/useStore'
import { apiClient, User } from '../lib/api'
import { USDC_ADDRESS, USDC_ABI } from '../lib/wallet'
import { hapticFeedback, showBackButton, hideBackButton } from '../lib/telegram'
import { Confetti } from '../components/Confetti'
import toast from 'react-hot-toast'

interface SplitBillProps {
  onBack: () => void
}

interface Participant {
  username: string
  wallet_address: string
  amount: string
}

export function SplitBill({ onBack }: SplitBillProps) {
  const { address } = useAccount()
  const { user } = useStore()
  const [totalAmount, setTotalAmount] = useState('')
  const [participants, setParticipants] = useState<Participant[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [completedPayments, setCompletedPayments] = useState(0)

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isSuccess } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    showBackButton(onBack)
    return () => hideBackButton()
  }, [onBack])

  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchUsers()
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const searchUsers = async () => {
    try {
      const users = await apiClient.searchUsers(searchQuery)
      // Filter out already added participants and self
      const filtered = users.filter(
        u => u.username !== user?.username && 
        !participants.some(p => p.username === u.username)
      )
      setSearchResults(filtered)
    } catch (error) {
      console.error('Search failed:', error)
    }
  }

  const addParticipant = (user: User) => {
    hapticFeedback('light')
    setParticipants([...participants, {
      username: user.username,
      wallet_address: user.wallet_address,
      amount: '0',
    }])
    setSearchQuery('')
    setSearchResults([])
  }

  const removeParticipant = (username: string) => {
    hapticFeedback('light')
    setParticipants(participants.filter(p => p.username !== username))
  }

  const splitEvenly = () => {
    if (!totalAmount || participants.length === 0) return
    
    hapticFeedback('light')
    const total = parseFloat(totalAmount)
    const perPerson = (total / (participants.length + 1)).toFixed(2) // +1 for self
    
    setParticipants(participants.map(p => ({
      ...p,
      amount: perPerson,
    })))
  }

  const updateParticipantAmount = (username: string, amount: string) => {
    setParticipants(participants.map(p =>
      p.username === username ? { ...p, amount } : p
    ))
  }

  const handleSplitBill = async () => {
    if (!address || !user || participants.length === 0) {
      toast.error('Please add participants')
      return
    }

    const totalSplit = participants.reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0)
    if (totalSplit === 0) {
      toast.error('Please set amounts')
      return
    }

    hapticFeedback('light')
    setIsLoading(true)
    setCompletedPayments(0)

    try {
      // Send payment requests to all participants
      for (const participant of participants) {
        if (parseFloat(participant.amount) > 0) {
          await apiClient.createPaymentRequest(
            user.username,
            participant.username,
            participant.amount,
            note || `Split bill: $${totalAmount}`
          )
          
          // Notify participant
          const recipientUser = await apiClient.getUserByUsername(participant.username)
          if (recipientUser) {
            await apiClient.notifyUser(
              recipientUser.telegram_id,
              `💸 @${user.username} requested $${participant.amount} for: ${note || 'Split bill'}`
            )
          }
          
          setCompletedPayments(prev => prev + 1)
        }
      }

      hapticFeedback('success')
      setShowSuccess(true)
      toast.success('Split bill requests sent!')
    } catch (error: any) {
      hapticFeedback('error')
      console.error('Split bill failed:', error)
      toast.error(error.message || 'Failed to split bill')
    } finally {
      setIsLoading(false)
    }
  }

  const totalRequested = participants.reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0)

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
          
          <h2 className="text-3xl font-bold text-white mb-2">Requests Sent!</h2>
          <p className="text-purple-200 mb-6">
            Sent {participants.length} payment requests totaling ${totalRequested.toFixed(2)}
          </p>

          <button
            onClick={() => {
              setShowSuccess(false)
              setParticipants([])
              setTotalAmount('')
              setNote('')
            }}
            className="w-full bg-white text-purple-600 font-semibold py-4 rounded-2xl hover:bg-purple-50 transition-all"
          >
            Split Another Bill
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 px-4 pt-8">
      <h1 className="text-3xl font-bold text-white mb-6">Split Bill</h1>

      {/* Total Amount */}
      <div className="mb-6">
        <label className="text-purple-200 text-sm mb-2 block">Total Amount</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-2xl font-bold">$</span>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl pl-10 pr-4 py-4 text-white text-2xl font-bold placeholder-purple-300/50 focus:outline-none focus:border-purple-400"
          />
        </div>
      </div>

      {/* Note */}
      <div className="mb-6">
        <label className="text-purple-200 text-sm mb-2 block">What's this for?</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Dinner, drinks, etc."
          className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400"
        />
      </div>

      {/* Add Participants */}
      <div className="mb-6">
        <label className="text-purple-200 text-sm mb-2 block">Add People</label>
        <div className="relative mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search username..."
            className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400"
          />
          <svg
            className="w-5 h-5 text-purple-300 absolute left-4 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 mb-3 max-h-48 overflow-y-auto">
            {searchResults.map((user) => (
              <button
                key={user.username}
                onClick={() => addParticipant(user)}
                className="w-full p-3 hover:bg-white/10 transition-all text-left flex items-center border-b border-white/10 last:border-0"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm mr-3">
                  {user.username[0].toUpperCase()}
                </div>
                <p className="text-white font-semibold">@{user.username}</p>
              </button>
            ))}
          </div>
        )}

        {/* Participants List */}
        {participants.length > 0 && (
          <div className="space-y-2 mb-3">
            {participants.map((participant) => (
              <div
                key={participant.username}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-3 border border-white/20 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-orange-400 flex items-center justify-center text-white font-bold">
                  {participant.username[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">@{participant.username}</p>
                </div>
                <input
                  type="number"
                  value={participant.amount}
                  onChange={(e) => updateParticipantAmount(participant.username, e.target.value)}
                  placeholder="0.00"
                  className="w-24 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-400"
                />
                <button
                  onClick={() => removeParticipant(participant.username)}
                  className="text-red-300 hover:text-red-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Split Evenly Button */}
        {participants.length > 0 && totalAmount && (
          <button
            onClick={splitEvenly}
            className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition-all"
          >
            Split ${totalAmount} Evenly ({participants.length + 1} people)
          </button>
        )}
      </div>

      {/* Summary */}
      {participants.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-white/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-purple-200 text-sm">Total Requested</span>
            <span className="text-white font-bold text-lg">${totalRequested.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-purple-200 text-sm">Your Share</span>
            <span className="text-white font-bold text-lg">
              ${totalAmount ? (parseFloat(totalAmount) - totalRequested).toFixed(2) : '0.00'}
            </span>
          </div>
        </div>
      )}

      {/* Send Requests Button */}
      <button
        onClick={handleSplitBill}
        disabled={participants.length === 0 || totalRequested === 0 || isLoading}
        className="w-full bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading 
          ? `Sending Requests... (${completedPayments}/${participants.length})`
          : `Send ${participants.length} Request${participants.length !== 1 ? 's' : ''}`
        }
      </button>
    </div>
  )
}
