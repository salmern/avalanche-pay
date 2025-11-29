import { Pool } from 'pg'

// Create PostgreSQL connection pool
export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'avalanche_pay',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database')
})

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err)
})

// Initialize database tables
export async function initDatabase() {
  const client = await pool.connect()
  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        telegram_id BIGINT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        wallet_address TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Create transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        from_address TEXT NOT NULL,
        to_address TEXT NOT NULL,
        amount TEXT NOT NULL,
        token TEXT DEFAULT 'USDC',
        tx_hash TEXT,
        status TEXT DEFAULT 'pending',
        fee TEXT DEFAULT '0',
        timestamp TIMESTAMP DEFAULT NOW()
      )
    `)

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id)
    `)
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)
    `)
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address)
    `)
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_transactions_from ON transactions(from_address)
    `)
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_transactions_to ON transactions(to_address)
    `)
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp DESC)
    `)

    console.log('✅ Database tables initialized')
  } catch (error) {
    console.error('❌ Database initialization error:', error)
    throw error
  } finally {
    client.release()
  }
}
