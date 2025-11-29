import { hapticFeedback } from '../lib/telegram'

interface NavigationProps {
  currentPage: 'home' | 'send' | 'receive' | 'history'
  onNavigate: (page: 'home' | 'send' | 'receive' | 'history') => void
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const handleNavigate = (page: 'home' | 'send' | 'receive' | 'history') => {
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
          onClick={() => handleNavigate('receive')}
          className={`flex flex-col items-center justify-center flex-1 ${
            currentPage === 'receive' ? 'text-purple-400' : 'text-gray-400'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0 0l-4-4m4 4l4-4" />
          </svg>
          <span className="text-xs mt-1">Receive</span>
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
      </div>
    </nav>
  )
}
