import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import TelegramBot from 'node-telegram-bot-api'
import { ethers } from 'ethers'
import { pool, initDatabase } from './db.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
  credentials: true
}))
app.use(express.json())

// Telegram bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true })

// Avalanche provider (Fuji testnet)
const provider = new ethers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')

// USDC contract on Fuji
const USDC_ADDRESS = '0x5425890298aed601595a70AB815c96711a31Bc65'
const USDC_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
]

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// User endpoints
app.post('/api/users/set-username', async (req, res) => {
  try {
    const { telegram_id, username, wallet_address } = req.body

    const result = await pool.query(
      `INSERT INTO users (telegram_id, username, wallet_address, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (telegram_id) 
       DO UPDATE SET username = $2, wallet_address = $3, updated_at = NOW()
       RETURNING *`,
      [telegram_id, username, wallet_address]
    )

    res.json(result.rows[0])
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/users/:telegram_id', async (req, res) => {
  try {
    const { telegram_id } = req.params

    const result = await pool.query(
      'SELECT * FROM users WHERE telegram_id = $1',
      [telegram_id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(result.rows[0])
  } catch (error: any) {
    res.status(404).json({ error: 'User not found' })
  }
})

app.get('/api/users/username/:username', async (req, res) => {
  try {
    const { username } = req.params

    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(result.rows[0])
  } catch (error: any) {
    res.status(404).json({ error: 'User not found' })
  }
})

// Balance endpoint
app.get('/api/balance/:wallet_address', async (req, res) => {
  try {
    const { wallet_address } = req.params

    // Get USDC balance
    const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider)
    const usdcBalance = await usdcContract.balanceOf(wallet_address)
    const usdcFormatted = ethers.formatUnits(usdcBalance, 6)

    // Get AVAX balance
    const avaxBalance = await provider.getBalance(wallet_address)
    const avaxFormatted = ethers.formatEther(avaxBalance)

    res.json({
      usdc: parseFloat(usdcFormatted).toFixed(2),
      avax: parseFloat(avaxFormatted).toFixed(4),
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Transaction endpoints
app.post('/api/transactions/create', async (req, res) => {
  try {
    const { from_address, to_address, amount, token } = req.body

    const result = await pool.query(
      `INSERT INTO transactions (from_address, to_address, amount, token, status, fee, timestamp)
       VALUES ($1, $2, $3, $4, 'pending', '0.0001', NOW())
       RETURNING *`,
      [from_address, to_address, amount, token || 'USDC']
    )

    const data = result.rows[0]

    res.json({
      transactionId: data.id,
      intentData: {
        from: from_address,
        to: to_address,
        amount,
        token,
      },
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/transactions/submit', async (req, res) => {
  try {
    const { transaction_id, tx_hash } = req.body

    const result = await pool.query(
      `UPDATE transactions 
       SET tx_hash = $1, status = 'completed'
       WHERE id = $2
       RETURNING *`,
      [tx_hash, transaction_id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' })
    }

    res.json(result.rows[0])
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/transactions/:wallet_address', async (req, res) => {
  try {
    const { wallet_address } = req.params

    const result = await pool.query(
      `SELECT * FROM transactions 
       WHERE from_address = $1 OR to_address = $1
       ORDER BY timestamp DESC
       LIMIT 50`,
      [wallet_address]
    )

    res.json(result.rows)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Notification endpoint
app.post('/api/notify', async (req, res) => {
  try {
    const { telegram_id, message } = req.body

    await bot.sendMessage(telegram_id, message, {
      parse_mode: 'Markdown',
    })

    res.json({ success: true })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Telegram bot handlers
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id
  const username = msg.from?.username

  await bot.sendMessage(
    chatId,
    `🚀 *Welcome to Avalanche Pay!*\n\nThe fastest way to send money globally.\n\n✨ Features:\n• Send money by username\n• <800ms settlement\n• <$0.001 fees\n• Powered by Avalanche\n\nOpen the app to get started! 👇`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🚀 Open Avalanche Pay',
              web_app: { url: process.env.WEBAPP_URL! },
            },
          ],
        ],
      },
    }
  )
})

bot.on('message', async (msg) => {
  const chatId = msg.chat.id
  const text = msg.text

  // Handle send command: send @username 25
  if (text?.startsWith('send ')) {
    const parts = text.split(' ')
    if (parts.length >= 3) {
      const recipient = parts[1]
      const amount = parts[2]

      await bot.sendMessage(
        chatId,
        `💸 Send $${amount} USDC to ${recipient}?`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: `✅ Send $${amount} USDC`,
                  web_app: {
                    url: `${process.env.WEBAPP_URL}?action=send&to=${recipient}&amount=${amount}`,
                  },
                },
              ],
            ],
          },
        }
      )
    }
  }
})

// Initialize database and start server
async function start() {
  try {
    await initDatabase()
    app.listen(PORT, () => {
      console.log(`🚀 Avalanche Pay API running on port ${PORT}`)
      console.log(`📱 Telegram bot active`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

start()
