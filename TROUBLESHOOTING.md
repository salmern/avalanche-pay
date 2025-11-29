# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### 1. CORS Errors ✅ FIXED

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
```bash
# Restart the backend
cd backend
npm run dev
```

The backend now allows both port 3000 and 5173.

See [CORS_FIX.md](CORS_FIX.md) for details.

---

### 2. PostgreSQL Connection Failed

**Error:**
```
Error: Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL
```
OR
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**

#### A. Install PostgreSQL
```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql
```

#### B. Start PostgreSQL
```bash
# Linux
sudo systemctl start postgresql

# macOS
brew services start postgresql
```

#### C. Create Database
```bash
./setup-postgres.sh
```

OR manually:
```bash
sudo -u postgres psql -c "CREATE DATABASE avalanche_pay;"
```

#### D. Update backend/.env
```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=avalanche_pay
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```

See [POSTGRES_SETUP.md](POSTGRES_SETUP.md) for detailed guide.

---

### 3. Module Not Found Errors

**Error:**
```
Cannot find module 'pg'
```

**Solution:**
```bash
cd backend
npm install
```

OR for frontend:
```bash
cd frontend
npm install
```

---

### 4. TypeScript Compilation Errors

**Error:**
```
error TS2339: Property 'env' does not exist on type 'ImportMeta'
```

**Solution:**
Already fixed! The file `frontend/src/vite-env.d.ts` was created.

If you still see errors:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

### 5. Wallet Won't Connect

**Error:**
- Wallet connection fails
- "Network not supported"

**Solution:**

#### A. Switch to Fuji Testnet
1. Open your wallet (MetaMask/Core)
2. Click network dropdown
3. Add Avalanche Fuji Testnet:
   - **Network Name**: Avalanche Fuji C-Chain
   - **RPC URL**: https://api.avax-test.network/ext/bc/C/rpc
   - **Chain ID**: 43113
   - **Symbol**: AVAX
   - **Explorer**: https://testnet.snowtrace.io

#### B. Check WalletConnect Project ID
Edit `frontend/.env`:
```bash
VITE_WALLETCONNECT_PROJECT_ID=your_actual_project_id
```

Get one at: https://cloud.walletconnect.com

#### C. Try Different Wallet
- Core Wallet: https://core.app
- MetaMask: https://metamask.io

---

### 6. Frontend Won't Start

**Error:**
```
sh: 1: vite: not found
```

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

### 7. Backend Won't Start

**Error:**
```
Error: Cannot find module './db.js'
```

**Solution:**
```bash
cd backend
npm run build
npm run dev
```

---

### 8. Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::4000
```

**Solution:**

#### Option 1: Kill the process
```bash
# Find process on port 4000
lsof -ti:4000 | xargs kill -9

# Or for port 5173
lsof -ti:5173 | xargs kill -9
```

#### Option 2: Change port
Edit `backend/.env`:
```bash
PORT=4001
```

Edit `frontend/.env`:
```bash
VITE_API_URL=http://localhost:4001
```

---

### 9. Telegram Bot Not Responding

**Error:**
- Bot doesn't reply to /start
- No welcome message

**Solution:**

#### A. Check bot token
Edit `backend/.env`:
```bash
TELEGRAM_BOT_TOKEN=your_actual_bot_token
```

Get token from @BotFather on Telegram.

#### B. Restart backend
```bash
cd backend
npm run dev
```

#### C. Check backend logs
Look for:
```
📱 Telegram bot active
```

If you see errors, the token might be invalid.

---

### 10. Database Tables Not Created

**Error:**
```
relation "users" does not exist
```

**Solution:**

The backend creates tables automatically on startup.

#### A. Check backend logs
You should see:
```
✅ Connected to PostgreSQL database
✅ Database tables initialized
```

#### B. If not, manually create tables
```bash
psql -U postgres avalanche_pay
```

Then paste:
```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  wallet_address TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

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
);
```

---

### 11. Balance Shows $0

**Possible causes:**
- Not on Fuji testnet
- No USDC in wallet
- Wrong USDC contract address

**Solution:**

#### A. Get test AVAX
https://faucet.avax.network/

#### B. Swap for USDC
https://traderjoexyz.com/avalanche/trade
- Switch to Fuji testnet
- Swap AVAX → USDC

#### C. Verify USDC contract
Should be: `0x5425890298aed601595a70AB815c96711a31Bc65`

---

### 12. Transaction Fails

**Error:**
- Transaction rejected
- Insufficient funds

**Solution:**

#### A. Check AVAX balance
You need AVAX for gas fees (~0.001 AVAX per transaction)

#### B. Check USDC balance
Make sure you have enough USDC to send

#### C. Check recipient exists
Recipient must have set their username first

---

### 13. Build Warnings

**Warning:**
```
Some chunks are larger than 500 kB after minification
```

**Solution:**
This is normal for Web3 apps. The warning is safe to ignore.

To reduce bundle size (optional):
```typescript
// frontend/vite.config.ts
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000
  }
})
```

---

### 14. npm Audit Vulnerabilities

**Warning:**
```
6 vulnerabilities (4 moderate, 2 critical)
```

**Solution:**
These are in dev dependencies and don't affect production.

To fix (may break things):
```bash
npm audit fix
```

Or ignore for now - they're not critical for a hackathon project.

---

## Quick Diagnostic Commands

### Check if services are running
```bash
# PostgreSQL
pg_isready

# Backend
curl http://localhost:4000/health

# Frontend
curl http://localhost:5173
```

### Check logs
```bash
# Backend logs
cd backend && npm run dev

# Frontend logs
cd frontend && npm run dev

# PostgreSQL logs
sudo journalctl -u postgresql -n 50
```

### Reset everything
```bash
# Stop all processes
pkill -f "node"

# Clean install
cd frontend && rm -rf node_modules && npm install
cd backend && rm -rf node_modules && npm install

# Restart
cd backend && npm run dev
cd frontend && npm run dev
```

---

## Still Stuck?

1. **Read the docs**
   - [START_HERE.md](START_HERE.md)
   - [POSTGRES_SETUP.md](POSTGRES_SETUP.md)
   - [GETTING_STARTED.md](GETTING_STARTED.md)

2. **Check recent changes**
   - [WHATS_CHANGED.md](WHATS_CHANGED.md)
   - [CORS_FIX.md](CORS_FIX.md)

3. **Quick reference**
   - [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

4. **Create an issue**
   - Include error messages
   - Include what you tried
   - Include your OS and Node version

---

**Most issues are fixed by restarting services! 🔄**
