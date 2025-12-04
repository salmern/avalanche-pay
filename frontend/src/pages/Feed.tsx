import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useStore } from '../store/useStore'
import { showBackButton, hideBackButton, hapticFeedback } from '../lib/telegram'
import { apiClient, FeedItem } from '../lib/api'
import toast from 'react-hot-toast'

interface FeedProps {
  onBack: () => void
}

const EMOJI_REACTIONS = ['❤️', '🔥', '👍', '😂', '🎉', '💯']

export function Feed({ onBack }: FeedProps) {
  const { address } = useAccount()
  const { user } = useStore()
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'friends'>('all')

  useEffect(() => {
    showBackButton(onBack)
    return () => hideBackButton()
  }, [onBack])

  useEffect(() => {
    loadFeed()
  }, [filter])

  const loadFeed = async () => {
    setIsLoading(true)
    try {
      const data = await apiClient.getFeed(filter)
      setFeed(data)
    } catch (error) {
      console.error('Failed to load feed:', error)
      toast.error('Failed to load feed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReaction = async (itemId: string, emoji: string) => {
    if (!user) return
    
    hapticFeedback('light')
    try {
      await apiClient.addReaction(itemId, emoji)
      await loadFeed()
      hapticFeedback('success')
    } catch (error) {
      console.error('Failed to add reaction:', error)
      toast.error('Failed to add reaction')
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen pb-20 px-4 pt-8">
      <h1 className="text-3xl font-bold text-white mb-6">Activity Feed</h1>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            filter === 'all'
              ? 'bg-white text-purple-600'
              : 'bg-white/10 text-white border border-white/20'
          }`}
        >
          All Activity
        </button>
        <button
          onClick={() => setFilter('friends')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            filter === 'friends'
              ? 'bg-white text-purple-600'
              : 'bg-white/10 text-white border border-white/20'
          }`}
        >
          Friends
        </button>
      </div>

      {/* Feed Items */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-purple-200 mt-4">Loading feed...</p>
        </div>
      ) : feed.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center">
          <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-white font-semibold mb-2">No activity yet</p>
          <p className="text-purple-200 text-sm">Payments will appear here when you or your friends make transactions</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feed.map((item) => (
            <div
              key={item.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-orange-400 flex items-center justify-center text-white font-bold mr-3">
                    {item.from_username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-semibold">
                      @{item.from_username}
                      <span className="text-purple-200 font-normal"> paid </span>
                      @{item.to_username}
                    </p>
                    <p className="text-purple-300 text-xs">{formatTime(item.timestamp)}</p>
                  </div>
                </div>
                {item.privacy === 'private' && (
                  <div className="bg-purple-500/20 px-2 py-1 rounded-lg">
                    <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Amount and Note */}
              <div className="mb-3">
                <p className="text-2xl font-bold text-white mb-1">
                  ${parseFloat(item.amount).toFixed(2)}
                </p>
                {item.note && (
                  <p className="text-purple-200 text-sm">{item.note}</p>
                )}
              </div>

              {/* Reactions */}
              <div className="flex items-center gap-2 flex-wrap">
                {EMOJI_REACTIONS.map((emoji) => {
                  const count = item.reactions?.[emoji] || 0
                  const hasReacted = item.user_reacted?.includes(emoji)
                  
                  return (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(item.id, emoji)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        hasReacted
                          ? 'bg-purple-500/30 border-2 border-purple-400'
                          : 'bg-white/10 border border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {emoji} {count > 0 && <span className="text-white ml-1">{count}</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
