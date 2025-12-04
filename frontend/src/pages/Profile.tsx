import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useStore } from '../store/useStore'
import { apiClient, UserProfile } from '../lib/api'
import { showBackButton, hideBackButton, hapticFeedback } from '../lib/telegram'
import toast from 'react-hot-toast'

interface ProfileProps {
  onBack: () => void
}

export function Profile({ onBack }: ProfileProps) {
  const { address } = useAccount()
  const { user, transactions } = useStore()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState('')
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('public')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    showBackButton(onBack)
    return () => hideBackButton()
  }, [onBack])

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    if (!user) return
    
    try {
      const data = await apiClient.getUserProfile(user.username)
      setProfile(data)
      setBio(data.bio || '')
      setAvatar(data.avatar || '')
      setPrivacy(data.privacy || 'public')
    } catch (error) {
      console.error('Failed to load profile:', error)
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return

    hapticFeedback('light')
    setIsLoading(true)

    try {
      await apiClient.updateUserProfile(user.username, {
        bio,
        avatar,
        privacy,
      })

      hapticFeedback('success')
      toast.success('Profile updated!')
      setIsEditing(false)
      await loadProfile()
    } catch (error: any) {
      hapticFeedback('error')
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const stats = {
    sent: transactions.filter(t => t.from_address.toLowerCase() === address?.toLowerCase()).length,
    received: transactions.filter(t => t.to_address.toLowerCase() === address?.toLowerCase()).length,
    total: transactions.reduce((sum, t) => {
      const amount = parseFloat(t.amount)
      if (t.from_address.toLowerCase() === address?.toLowerCase()) {
        return sum - amount
      } else {
        return sum + amount
      }
    }, 0),
  }

  return (
    <div className="min-h-screen pb-20 px-4 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        {!isEditing && (
          <button
            onClick={() => {
              hapticFeedback('light')
              setIsEditing(true)
            }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 px-4 py-2 rounded-xl text-white font-semibold hover:bg-white/20 transition-all"
          >
            Edit
          </button>
        )}
      </div>

      {/* Profile Header */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-6 border border-white/20">
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-orange-400 flex items-center justify-center text-white text-4xl font-bold mb-4">
            {avatar || (user?.username?.[0].toUpperCase() || '?')}
          </div>

          {/* Username */}
          <h2 className="text-2xl font-bold text-white mb-2">
            @{user?.username || 'username'}
          </h2>

          {/* Bio */}
          {isEditing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              maxLength={150}
              className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 resize-none"
              rows={3}
            />
          ) : (
            <p className="text-purple-200 text-sm mb-4">
              {profile?.bio || 'No bio yet'}
            </p>
          )}

          {/* Wallet Address */}
          <div className="bg-white/5 rounded-xl px-4 py-2 mt-2">
            <p className="text-purple-300 text-xs font-mono">
              {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : 'Not connected'}
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      {isEditing && (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-white/20">
          <p className="text-white font-semibold mb-3">Privacy Settings</p>
          <div className="space-y-2">
            {(['public', 'friends', 'private'] as const).map((option) => (
              <button
                key={option}
                onClick={() => {
                  hapticFeedback('light')
                  setPrivacy(option)
                }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                  privacy === option
                    ? 'bg-purple-500/30 border-2 border-purple-400'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <p className="text-white font-semibold capitalize">{option}</p>
                <p className="text-purple-200 text-xs">
                  {option === 'public' && 'Everyone can see your transactions'}
                  {option === 'friends' && 'Only friends can see your transactions'}
                  {option === 'private' && 'Only you can see your transactions'}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      {isEditing && (
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => {
              hapticFeedback('light')
              setIsEditing(false)
              setBio(profile?.bio || '')
              setPrivacy(profile?.privacy || 'public')
            }}
            className="flex-1 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-4 rounded-2xl hover:bg-white/20 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveProfile}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center">
          <p className="text-2xl font-bold text-white">{stats.sent}</p>
          <p className="text-purple-200 text-xs">Sent</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center">
          <p className="text-2xl font-bold text-white">{stats.received}</p>
          <p className="text-purple-200 text-xs">Received</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center">
          <p className="text-2xl font-bold text-white">${Math.abs(stats.total).toFixed(0)}</p>
          <p className="text-purple-200 text-xs">Volume</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
        <p className="text-white font-semibold mb-3">Recent Activity</p>
        {transactions.slice(0, 5).length === 0 ? (
          <p className="text-purple-200 text-sm text-center py-4">No recent activity</p>
        ) : (
          <div className="space-y-2">
            {transactions.slice(0, 5).map((tx) => {
              const isSent = tx.from_address.toLowerCase() === address?.toLowerCase()
              return (
                <div key={tx.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full ${isSent ? 'bg-orange-500/20' : 'bg-green-500/20'} flex items-center justify-center mr-3`}>
                      <svg className={`w-4 h-4 ${isSent ? 'text-orange-300' : 'text-green-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isSent ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0 0l-4-4m4 4l4-4" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{isSent ? 'Sent' : 'Received'}</p>
                      <p className="text-purple-300 text-xs">{new Date(tx.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className={`font-bold ${isSent ? 'text-orange-300' : 'text-green-300'}`}>
                    {isSent ? '-' : '+'}${parseFloat(tx.amount).toFixed(2)}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
