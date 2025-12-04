import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { WalletProvider } from './providers/WalletProvider'
import { Home } from './pages/Home'
import { Send } from './pages/Send'
import { Receive } from './pages/Receive'
import { History } from './pages/History'
import { Feed } from './pages/Feed'
import { Request } from './pages/Request'
import { Profile } from './pages/Profile'
import { Search } from './pages/Search'
import { SplitBill } from './pages/SplitBill'
import { Onboarding } from './pages/Onboarding'
import { useStore } from './store/useStore'
import { Navigation } from './components/Navigation'

type Page = 'home' | 'send' | 'receive' | 'history' | 'feed' | 'request' | 'profile' | 'search' | 'split' | 'onboarding'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const { initUser, user, showOnboarding } = useStore()

  useEffect(() => {
    initUser()
  }, [initUser])

  useEffect(() => {
    // Show onboarding for new users
    if (showOnboarding && !user) {
      setCurrentPage('onboarding')
    }
  }, [showOnboarding, user])

  const renderPage = () => {
    switch (currentPage) {
      case 'onboarding':
        return <Onboarding onComplete={() => setCurrentPage('home')} />
      case 'home':
        return <Home onNavigate={setCurrentPage} />
      case 'send':
        return <Send onBack={() => setCurrentPage('home')} />
      case 'receive':
        return <Receive onBack={() => setCurrentPage('home')} />
      case 'history':
        return <History onBack={() => setCurrentPage('home')} />
      case 'feed':
        return <Feed onBack={() => setCurrentPage('home')} />
      case 'request':
        return <Request onBack={() => setCurrentPage('home')} onNavigate={setCurrentPage} />
      case 'profile':
        return <Profile onBack={() => setCurrentPage('home')} />
      case 'search':
        return <Search onBack={() => setCurrentPage('home')} />
      case 'split':
        return <SplitBill onBack={() => setCurrentPage('home')} />
      default:
        return <Home onNavigate={setCurrentPage} />
    }
  }

  return (
    <WalletProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-orange-500">
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1F2937',
              color: '#fff',
            },
          }}
        />
        {renderPage()}
        {currentPage !== 'onboarding' && (
          <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
        )}
      </div>
    </WalletProvider>
  )
}

export default App
