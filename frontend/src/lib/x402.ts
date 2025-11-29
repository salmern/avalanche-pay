import { parseUnits, formatUnits } from 'viem'

// x402 Intent structure (ERC-7730 compatible)
export interface Intent {
  from: string
  to: string
  token: string
  amount: string
  chainId: number
  deadline: number
  nonce: string
}

// Create an x402 intent for USDC transfer
export async function createIntent(
  from: string,
  to: string,
  amount: string,
  tokenAddress: string,
  chainId: number = 43113 // Fuji testnet
): Promise<Intent> {
  const deadline = Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
  const nonce = Math.floor(Math.random() * 1000000).toString()

  return {
    from,
    to,
    token: tokenAddress,
    amount: parseUnits(amount, 6).toString(), // USDC has 6 decimals
    chainId,
    deadline,
    nonce,
  }
}

// Encode intent for signing
export function encodeIntent(intent: Intent): string {
  return JSON.stringify(intent)
}

// Estimate fee (x402 intents have minimal fees)
export function estimateFee(): { fee: string; feeUsd: string } {
  return {
    fee: '0.0001', // ~0.0001 AVAX
    feeUsd: '0.003', // ~$0.003
  }
}

// Simulate intent execution (in production, this would call a solver/relayer)
export async function executeIntent(
  _intent: Intent,
  _signature: string
): Promise<{ txHash: string; executionTime: number }> {
  const startTime = Date.now()
  
  // In production, this would:
  // 1. Submit intent + signature to x402 solver network
  // 2. Solver validates and executes the transfer
  // 3. Returns transaction hash
  
  // For demo, we'll simulate with a direct transfer
  // The actual implementation would use the x402 SDK or solver API
  
  await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
  
  const executionTime = Date.now() - startTime
  const mockTxHash = '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
  
  return {
    txHash: mockTxHash,
    executionTime,
  }
}

// Format amount for display
export function formatAmount(amount: string, decimals: number = 6): string {
  return formatUnits(BigInt(amount), decimals)
}
