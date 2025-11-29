import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { WalletProvider } from './providers/WalletProvider'
import { Home } from './pages/Home'
import { Send } from './pages/Send'
import { Receive } from './pages/Receive'
import { History } from './pages/History'
import { useStore } from './store/useStore'
import { Navigation } from './components/Navigation'

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'send' | 'receive' | 'history'>('home')
  const { initUser } = useStore()

  useEffect(() => {
    initUser()
  }, [initUser])

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />
      case 'send':
        return <Send onBack={() => setCurrentPage('home')} />
      case 'receive':
        return <Receive onBack={() => setCurrentPage('home')} />
      case 'history':
        return <History onBack={() => setCurrentPage('home')} />
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
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      </div>
    </WalletProvider>
  )
}

export default App
