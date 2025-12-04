import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useStore } from '../store/useStore'
import { apiClient, PaymentRequest } from '../lib/api'
import { hapticFeedback, showBackButton, hideBackButton } from '../lib/telegram'
import toast from 'react-hot-toast'

interface RequestProps {
  onBack: () => void
  onNavigate: (page: 'send') => void
}

export function Request({ onBack, onNavigate }: RequestProps) {
  const { address } = useAccount()
  const { user } = useStore()
  const [activeTab, setActiveTab] = useState<'create' | 'incoming' | 'outgoing'>('create')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [incomingRequests, setIncomingRequests] = useState<PaymentRequest[]>([])
  const [outgoingRequests, setOutgoingRequests] = useState<PaymentRequest[]>([])

  useEffect(() => {
    showBackButton(onBack)
    return () => hideBackButton()
  }, [onBack])

  useEffect(() => {
    if (user) {
      loadRequests()
    }
  }, [user, activeTab])

  const loadRequests = async () => {
    if (!user) return
    
    try {
      if (activeTab === 'incoming') {
        const requests = await apiClient.getIncomingRequests(user.username)
        setIncomingRequests(requests)
      } else if (activeTab === 'outgoing') {
        const requests = await apiClient.getOutgoingRequests(user.username)
        setOutgoingRequests(requests)
      }
    } catch (error) {
      console.error('Failed to load requests:', error)
    }
  }

  const handleCreateRequest = async () => {
    if (!user || !recipient || !amount) {
      toast.error('Please fill all required fields')
      return
    }

    hapticFeedback('light')
    setIsLoading(true)

    try {
      const cleanRecipient = recipient.replace('@', '')
      await apiClient.createPaymentRequest(user.username, cleanRecipient, amount, note)
      
      hapticFeedback('success')
      toast.success(`Request sent to @${cleanRecipient}!`)
      
      setRecipient('')
      setAmount('')
      setNote('')
      setActiveTab('outgoing')
    } catch (error: any) {
      hapticFeedback('error')
      toast.error(error.message || 'Failed to create request')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePayRequest = async (request: PaymentRequest) => {
    hapticFeedback('light')
    // Navigate to send page with pre-filled data
    onNavigate('send')
    // TODO: Pass request data to Send page
  }

  const handleDeclineRequest = async (requestId: string) => {
    hapticFeedback('light')
    try {
      await apiClient.updateRequestStatus(requestId, 'declined')
      hapticFeedback('success')
      toast.success('Request declined')
      await loadRequests()
    } catch (error) {
      hapticFeedback('error')
      toast.error('Failed to decline request')
    }
  }

  const handleCancelRequest = async (requestId: string) => {
    hapticFeedback('light')
    try {
      await apiClient.updateRequestStatus(requestId, 'cancelled')
      hapticFeedback('success')
      toast.success('Request cancelled')
      await loadRequests()
    } catch (error) {
      hapticFeedback('error')
      toast.error('Failed to cancel request')
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="min-h-screen pb-20 px-4 pt-8">
      <h1 className="text-3xl font-bold text-white mb-6">Request Money</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'create'
              ? 'bg-white text-purple-600'
              : 'bg-white/10 text-white border border-white/20'
          }`}
        >
          Create
        </button>
        <button
          onClick={() => setActiveTab('incoming')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all relative ${
            activeTab === 'incoming'
              ? 'bg-white text-purple-600'
              : 'bg-white/10 text-white border border-white/20'
          }`}
        >
          Incoming
          {incomingRequests.filter(r => r.status === 'pending').length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {incomingRequests.filter(r => r.status === 'pending').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('outgoing')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'outgoing'
              ? 'bg-white text-purple-600'
              : 'bg-white/10 text-white border border-white/20'
          }`}
        >
          Sent
        </button>
      </div>

      {/* Create Request Form */}
      {activeTab === 'create' && (
        <div className="space-y-4">
          <div>
            <label className="text-purple-200 text-sm mb-2 block">From</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="@username"
              className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
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

          <div>
            <label className="text-purple-200 text-sm mb-2 block">Note (optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's this for?"
              className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400"
            />
          </div>

          <button
            onClick={handleCreateRequest}
            disabled={!recipient || !amount || isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending Request...' : 'Request Money'}
          </button>
        </div>
      )}

      {/* Incoming Requests */}
      {activeTab === 'incoming' && (
        <div className="space-y-4">
          {incomingRequests.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center">
              <p className="text-white font-semibold mb-2">No incoming requests</p>
              <p className="text-purple-200 text-sm">Requests from others will appear here</p>
            </div>
          ) : (
            incomingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold">@{request.from_username}</p>
                    <p className="text-purple-300 text-xs">{formatTime(request.created_at)}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                    request.status === 'paid' ? 'bg-green-500/20 text-green-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {request.status}
                  </div>
                </div>

                <p className="text-2xl font-bold text-white mb-2">
                  ${parseFloat(request.amount).toFixed(2)}
                </p>

                {request.note && (
                  <p className="text-purple-200 text-sm mb-3">{request.note}</p>
                )}

                {request.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePayRequest(request)}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-orange-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all"
                    >
                      Pay ${parseFloat(request.amount).toFixed(2)}
                    </button>
                    <button
                      onClick={() => handleDeclineRequest(request.id)}
                      className="px-6 bg-red-500/20 text-red-300 font-semibold py-3 rounded-xl hover:bg-red-500/30 transition-all"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Outgoing Requests */}
      {activeTab === 'outgoing' && (
        <div className="space-y-4">
          {outgoingRequests.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center">
              <p className="text-white font-semibold mb-2">No sent requests</p>
              <p className="text-purple-200 text-sm">Your payment requests will appear here</p>
            </div>
          ) : (
            outgoingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold">@{request.to_username}</p>
                    <p className="text-purple-300 text-xs">{formatTime(request.created_at)}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                    request.status === 'paid' ? 'bg-green-500/20 text-green-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {request.status}
                  </div>
                </div>

                <p className="text-2xl font-bold text-white mb-2">
                  ${parseFloat(request.amount).toFixed(2)}
                </p>

                {request.note && (
                  <p className="text-purple-200 text-sm mb-3">{request.note}</p>
                )}

                {request.status === 'pending' && (
                  <button
                    onClick={() => handleCancelRequest(request.id)}
                    className="w-full bg-red-500/20 text-red-300 font-semibold py-3 rounded-xl hover:bg-red-500/30 transition-all"
                  >
                    Cancel Request
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
