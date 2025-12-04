-- ==========================================
-- Avalanche Pay - Supabase Database Setup
-- ==========================================
-- Run this SQL in your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- 1. Create users table
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  wallet_address TEXT NOT NULL,
  bio TEXT,
  avatar TEXT,
  privacy TEXT DEFAULT 'public',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id BIGSERIAL PRIMARY KEY,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  from_username TEXT,
  to_username TEXT,
  amount TEXT NOT NULL,
  token TEXT DEFAULT 'USDC',
  tx_hash TEXT,
  status TEXT DEFAULT 'pending',
  fee TEXT DEFAULT '0',
  note TEXT,
  privacy TEXT DEFAULT 'public',
  timestamp TIMESTAMP DEFAULT NOW()
);

-- 3. Create payment_requests table
CREATE TABLE IF NOT EXISTS payment_requests (
  id BIGSERIAL PRIMARY KEY,
  from_username TEXT NOT NULL,
  to_username TEXT NOT NULL,
  amount TEXT NOT NULL,
  note TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Create reactions table
CREATE TABLE IF NOT EXISTS reactions (
  id BIGSERIAL PRIMARY KEY,
  transaction_id BIGINT REFERENCES transactions(id),
  username TEXT NOT NULL,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(transaction_id, username, emoji)
);

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_transactions_from ON transactions(from_address);
CREATE INDEX IF NOT EXISTS idx_transactions_to ON transactions(to_address);
CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_payment_requests_to ON payment_requests(to_username);
CREATE INDEX IF NOT EXISTS idx_payment_requests_from ON payment_requests(from_username);
CREATE INDEX IF NOT EXISTS idx_reactions_transaction ON reactions(transaction_id);

-- 6. Enable Row Level Security (RLS) - Optional but recommended
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- 7. Create policies for public access (adjust as needed)
-- Allow all operations for now (you can restrict later)
CREATE POLICY "Enable all access for users" ON users FOR ALL USING (true);
CREATE POLICY "Enable all access for transactions" ON transactions FOR ALL USING (true);
CREATE POLICY "Enable all access for payment_requests" ON payment_requests FOR ALL USING (true);
CREATE POLICY "Enable all access for reactions" ON reactions FOR ALL USING (true);

-- Done! Your database is ready.
-- You should see: "Success. No rows returned"
