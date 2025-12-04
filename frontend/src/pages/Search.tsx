import { useState, useEffect } from 'react'
import { apiClient, User } from '../lib/api'
import { showBackButton, hideBackButton, hapticFeedback } from '../lib/telegram'
import toast from 'react-hot-toast'

interface SearchProps {
  onBack: () => void
  onSelectUser?: (username: string) => void
}

export function Search({ onBack, onSelectUser }: SearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [recentContacts, setRecentContacts] = useState<User[]>([])

  useEffect(() => {
    showBackButton(onBack)
    return () => hideBackButton()
  }, [onBack])

  useEffect(() => {
    // Load recent contacts from localStorage
    const recent = localStorage.getItem('recentContacts')
    if (recent) {
      setRecentContacts(JSON.parse(recent))
    }
  }, [])

  useEffect(() => {
    if (query.length >= 2) {
      searchUsers()
    } else {
      setResults([])
    }
  }, [query])

  const searchUsers = async () => {
    setIsLoading(true)
    try {
      const users = await apiClient.searchUsers(query)
      setResults(users)
    } catch (error) {
      console.error('Search failed:', error)
      toast.error('Search failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectUser = (user: User) => {
    hapticFeedback('light')
    
    // Add to recent contacts
    const recent = [user, ...recentContacts.filter(u => u.username !== user.username)].slice(0, 10)
    setRecentContacts(recent)
    localStorage.setItem('recentContacts', JSON.stringify(recent))

    if (onSelectUser) {
      onSelectUser(user.username)
    }
  }

  return (
    <div className="min-h-screen pb-20 px-4 pt-8">
      <h1 className="text-3xl font-bold text-white mb-6">Search Users</h1>

      {/* Search Input */}
      <div className="relative mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by username..."
          className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400"
          autoFocus
        />
        <svg
          className="w-5 h-5 text-purple-300 absolute left-4 top-1/2 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        </div>
      )}

      {/* Search Results */}
      {query.length >= 2 && !isLoading && (
        <div className="space-y-3 mb-6">
          <p className="text-purple-200 text-sm font-semibold">Search Results</p>
          {results.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <p className="text-white">No users found</p>
              <p className="text-purple-200 text-sm mt-1">Try a different search term</p>
            </div>
          ) : (
            results.map((user) => (
              <button
                key={user.username}
                onClick={() => handleSelectUser(user)}
                className="w-full bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all text-left"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-orange-400 flex items-center justify-center text-white font-bold text-lg mr-3">
                    {user.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">@{user.username}</p>
                    <p className="text-purple-300 text-xs font-mono">
                      {user.wallet_address.slice(0, 8)}...{user.wallet_address.slice(-6)}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-purple-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* Recent Contacts */}
      {query.length < 2 && recentContacts.length > 0 && (
        <div className="space-y-3">
          <p className="text-purple-200 text-sm font-semibold">Recent Contacts</p>
          {recentContacts.map((user) => (
            <button
              key={user.username}
              onClick={() => handleSelectUser(user)}
              className="w-full bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all text-left"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-orange-400 flex items-center justify-center text-white font-bold text-lg mr-3">
                  {user.username[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">@{user.username}</p>
                  <p className="text-purple-300 text-xs font-mono">
                    {user.wallet_address.slice(0, 8)}...{user.wallet_address.slice(-6)}
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-purple-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Empty State */}
      {query.length < 2 && recentContacts.length === 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center">
          <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <p className="text-white font-semibold mb-2">Search for users</p>
          <p className="text-purple-200 text-sm">Find friends by their username to send money</p>
        </div>
      )}
    </div>
  )
}
