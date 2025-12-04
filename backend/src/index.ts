// ==========================================
// FILE 2: backend/src/index.ts
// ==========================================
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import TelegramBot from 'node-telegram-bot-api'
import { ethers } from 'ethers'
import { supabase, initDatabase } from './db.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
  credentials: true
}))
app.use(express.json())

// Telegram bot (optional - only if token is provided)
let bot: TelegramBot | null = null
const ENABLE_BOT = process.env.ENABLE_TELEGRAM_BOT === 'true'

if (ENABLE_BOT && process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_TOKEN !== 'your_bot_token_here') {
  try {
    // Validate token format (basic check)
    const token = process.env.TELEGRAM_BOT_TOKEN
    if (!token.match(/^\d+:[A-Za-z0-9_-]+$/)) {
      throw new Error('Invalid bot token format')
    }

    bot = new TelegramBot(token, {
      polling: {
        interval: 300,
        autoStart: true,
        params: {
          timeout: 10
        }
      }
    })

    // Handle polling errors (non-fatal)
    bot.on('polling_error', (error) => {
      console.log('⚠️  Telegram polling error (non-fatal):', error.code || error.message)
    })

    // Handle webhook errors
    bot.on('webhook_error', (error) => {
      console.error('⚠️  Telegram webhook error:', error.message)
    })

    // Test bot connection with timeout
    const connectionTimeout = setTimeout(() => {
      console.warn('⚠️  Telegram bot connection timeout - bot may not be fully functional')
    }, 5000)

    bot.getMe()
      .then((botInfo) => {
        clearTimeout(connectionTimeout)
        console.log(`📱 Telegram bot initialized successfully: @${botInfo.username}`)
      })
      .catch((error) => {
        clearTimeout(connectionTimeout)
        console.error('⚠️  Telegram bot connection failed:', error.message)
        console.log('ℹ️  Server will continue running, but bot features will be unavailable')
        // Don't set bot to null - let it try to recover
      })

    console.log('📱 Telegram bot initialization started...')
  } catch (error: any) {
    console.error('❌ Telegram bot failed to initialize:', error.message)
    console.log('ℹ️  Server will continue running without Telegram bot')
    bot = null
  }
} else {
  console.log('ℹ️  Telegram bot disabled (set ENABLE_TELEGRAM_BOT=true to enable)')
}

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

    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          telegram_id,
          username,
          wallet_address,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'telegram_id' }
      )
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/users/:telegram_id', async (req, res) => {
  try {
    const { telegram_id } = req.params

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegram_id)
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(data)
  } catch (error: any) {
    res.status(404).json({ error: 'User not found' })
  }
})

app.get('/api/users/username/:username', async (req, res) => {
  try {
    const { username } = req.params

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(data)
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
    const { from_address, to_address, amount, token, note, privacy, from_username, to_username } = req.body

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        from_address,
        to_address,
        from_username,
        to_username,
        amount,
        token: token || 'USDC',
        status: 'pending',
        fee: '0.0001',
        note,
        privacy: privacy || 'public',
        timestamp: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

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

    const { data, error } = await supabase
      .from('transactions')
      .update({
        tx_hash,
        status: 'completed'
      })
      .eq('id', transaction_id)
      .select()
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'Transaction not found' })
    }

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/transactions/:wallet_address', async (req, res) => {
  try {
    const { wallet_address } = req.params

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .or(`from_address.eq.${wallet_address},to_address.eq.${wallet_address}`)
      .order('timestamp', { ascending: false })
      .limit(50)

    if (error) throw error

    res.json(data || [])
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Notification endpoint
app.post('/api/notify', async (req, res) => {
  try {
    const { telegram_id, message } = req.body

    if (bot) {
      try {
        await bot.sendMessage(telegram_id, message, {
          parse_mode: 'Markdown',
        })
        res.json({ success: true })
      } catch (botError: any) {
        console.error('Failed to send Telegram message:', botError.message)
        res.status(500).json({
          success: false,
          error: 'Failed to send message via Telegram',
          details: botError.message
        })
      }
    } else {
      res.json({ success: false, message: 'Telegram bot not configured' })
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Feed endpoints
app.get('/api/feed', async (req, res) => {
  try {
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('privacy', 'public')
      .eq('status', 'completed')
      .order('timestamp', { ascending: false })
      .limit(50)

    if (txError) throw txError

    // Get reactions for each transaction
    const transactionsWithReactions = await Promise.all(
      (transactions || []).map(async (tx) => {
        const { data: reactions } = await supabase
          .from('reactions')
          .select('emoji')
          .eq('transaction_id', tx.id)

        // Group reactions by emoji
        const reactionCounts: Record<string, number> = {}
        reactions?.forEach((r) => {
          reactionCounts[r.emoji] = (reactionCounts[r.emoji] || 0) + 1
        })

        return {
          ...tx,
          reactions: reactionCounts
        }
      })
    )

    res.json(transactionsWithReactions)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/feed/reaction', async (req, res) => {
  try {
    const { item_id, emoji, username } = req.body

    const { error } = await supabase
      .from('reactions')
      .insert({
        transaction_id: item_id,
        username,
        emoji,
        created_at: new Date().toISOString()
      })

    if (error && error.code !== '23505') { // Ignore duplicate key errors
      throw error
    }

    res.json({ success: true })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Payment request endpoints
app.post('/api/requests/create', async (req, res) => {
  try {
    const { from_username, to_username, amount, note } = req.body

    const { data, error } = await supabase
      .from('payment_requests')
      .insert({
        from_username,
        to_username,
        amount,
        note,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/requests/incoming/:username', async (req, res) => {
  try {
    const { username } = req.params

    const { data, error } = await supabase
      .from('payment_requests')
      .select('*')
      .eq('to_username', username)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    res.json(data || [])
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/requests/outgoing/:username', async (req, res) => {
  try {
    const { username } = req.params

    const { data, error } = await supabase
      .from('payment_requests')
      .select('*')
      .eq('from_username', username)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    res.json(data || [])
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/requests/update', async (req, res) => {
  try {
    const { request_id, status } = req.body

    const { data, error } = await supabase
      .from('payment_requests')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', request_id)
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Profile endpoints
app.get('/api/profile/:username', async (req, res) => {
  try {
    const { username } = req.params

    const { data, error } = await supabase
      .from('users')
      .select('username, bio, avatar, privacy, wallet_address')
      .eq('username', username)
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/profile/update', async (req, res) => {
  try {
    const { username, bio, avatar, privacy } = req.body

    const updateData: any = { updated_at: new Date().toISOString() }
    if (bio !== undefined) updateData.bio = bio
    if (avatar !== undefined) updateData.avatar = avatar
    if (privacy !== undefined) updateData.privacy = privacy

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('username', username)
      .select('username, bio, avatar, privacy, wallet_address')
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Search users
app.get('/api/users/search', async (req, res) => {
  try {
    const { q } = req.query

    if (!q || typeof q !== 'string' || q.length < 2) {
      return res.json([])
    }

    const { data, error } = await supabase
      .from('users')
      .select('username, wallet_address, created_at')
      .ilike('username', `%${q}%`)
      .limit(20)

    if (error) throw error

    res.json(data || [])
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Telegram bot handlers (only if bot is initialized)
if (bot) {
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id

    try {
      const webappUrl = process.env.WEBAPP_URL || ''
      const isHttps = webappUrl.startsWith('https://')

      // Only include Web App button if URL is HTTPS (Telegram requirement)
      const messageOptions: any = {
        parse_mode: 'Markdown',
      }

      if (isHttps) {
        messageOptions.reply_markup = {
          inline_keyboard: [
            [
              {
                text: '🚀 Open Avalanche Pay',
                web_app: { url: webappUrl },
              },
            ],
          ],
        }
      }

      await bot!.sendMessage(
        chatId,
        `🚀 *Welcome to Avalanche Pay!*\\n\\nThe fastest way to send money globally.\\n\\n✨ Features:\\n• Send money by username\\n• <800ms settlement\\n• <$0.001 fees\\n• Powered by Avalanche${isHttps ? '\\n\\nOpen the app to get started! 👇' : '\\n\\n_Note: Web app is in development mode. Deploy to production for full functionality._'}`,
        messageOptions
      )
    } catch (error: any) {
      console.error('Failed to send /start message:', error.message)
    }
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

        try {
          await bot!.sendMessage(
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
        } catch (error: any) {
          console.error('Failed to send payment prompt:', error.message)
        }
      }
    }
  })
}

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