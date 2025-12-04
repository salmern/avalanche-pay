import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useStore } from '../store/useStore'
import { showBackButton, hideBackButton } from '../lib/telegram'

interface HistoryProps {
  onBack: () => void
}

export function History({ onBack }: HistoryProps) {
  const { address } = useAccount()
  const { transactions, loadTransactions } = useStore()

  useEffect(() => {
    showBackButton(onBack)
    return () => hideBackButton()
  }, [onBack])

  useEffect(() => {
    if (address) {
      loadTransactions(address)
    }
  }, [address, loadTransactions])

  return (
    <div className="min-h-screen pb-20 px-4 pt-8">
      <h1 className="text-3xl font-bold text-white mb-8">Transaction History</h1>

      {transactions.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center">
          <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-white font-semibold mb-2">No transactions yet</p>
          <p className="text-purple-200 text-sm">Your transaction history will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => {
            const isSent = tx.from_address.toLowerCase() === address?.toLowerCase()
            const amount = parseFloat(tx.amount)
            
            return (
              <div
                key={tx.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className={`${isSent ? 'bg-orange-500/20' : 'bg-green-500/20'} p-2 rounded-lg mr-3`}>
                      <svg className={`w-5 h-5 ${isSent ? 'text-orange-300' : 'text-green-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isSent ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0 0l-4-4m4 4l4-4" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{isSent ? 'Sent' : 'Received'}</p>
                      <p className="text-purple-200 text-xs">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${isSent ? 'text-orange-300' : 'text-green-300'}`}>
                      {isSent ? '-' : '+'}${amount.toFixed(2)}
                    </p>
                    <p className="text-purple-200 text-xs">{tx.token}</p>
                  </div>
                </div>

                {tx.note && (
                  <p className="text-purple-200 text-sm mb-2">{tx.note}</p>
                )}
                
                {tx.tx_hash && (
                  <a
                    href={`https://testnet.snowtrace.io/tx/${tx.tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-300 text-xs underline"
                  >
                    View on Explorer
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
