import { hapticFeedback } from '../lib/telegram'

type Page = 'home' | 'send' | 'receive' | 'history' | 'feed' | 'request' | 'profile' | 'search' | 'split'

interface NavigationProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const handleNavigate = (page: Page) => {
    hapticFeedback('light')
    onNavigate(page)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
        <button
          onClick={() => handleNavigate('home')}
          className={`flex flex-col items-center justify-center flex-1 ${
            currentPage === 'home' ? 'text-purple-400' : 'text-gray-400'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1">Home</span>
        </button>

        <button
          onClick={() => handleNavigate('feed')}
          className={`flex flex-col items-center justify-center flex-1 ${
            currentPage === 'feed' ? 'text-purple-400' : 'text-gray-400'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="text-xs mt-1">Feed</span>
        </button>

        <button
          onClick={() => handleNavigate('send')}
          className={`flex flex-col items-center justify-center flex-1 ${
            currentPage === 'send' ? 'text-purple-400' : 'text-gray-400'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <span className="text-xs mt-1">Send</span>
        </button>

        <button
          onClick={() => handleNavigate('history')}
          className={`flex flex-col items-center justify-center flex-1 ${
            currentPage === 'history' ? 'text-purple-400' : 'text-gray-400'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs mt-1">History</span>
        </button>

        <button
          onClick={() => handleNavigate('profile')}
          className={`flex flex-col items-center justify-center flex-1 ${
            currentPage === 'profile' ? 'text-purple-400' : 'text-gray-400'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </nav>
  )
}
