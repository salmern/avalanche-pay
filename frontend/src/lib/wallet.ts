import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi'
import { avalancheFuji } from 'viem/chains'
import { reconnect } from '@wagmi/core'

// Avalanche Fuji Testnet configuration
export const fujiChain = {
  ...avalancheFuji,
  rpcUrls: {
    default: {
      http: ['https://api.avax-test.network/ext/bc/C/rpc'],
    },
    public: {
      http: ['https://api.avax-test.network/ext/bc/C/rpc'],
    },
  },
}

// WalletConnect project ID (get from https://cloud.walletconnect.com)
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

const metadata = {
  name: 'Avalanche Pay',
  description: 'Instant global payments on Avalanche',
  url: 'https://avalanche-pay.vercel.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

const chains = [fujiChain] as const

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
} as any)

// Initialize Web3Modal
export const web3Modal = createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#9333EA',
  },
} as any)

// Reconnect on page load
reconnect(config)

// USDC Contract Address on Fuji Testnet
export const USDC_ADDRESS = '0x5425890298aed601595a70AB815c96711a31Bc65' // Circle USDC on Fuji

// USDC ABI (minimal for transfers)
export const USDC_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
] as const
