./# 🚀 Getting Started with Avalanche Pay

**Complete guide to get Avalanche Pay running in 15 minutes**

## Prerequisites

Before you start, make sure you have:

- ✅ Node.js 18+ installed
- ✅ npm or yarn installed
- ✅ Git installed
- ✅ A code editor (VS Code recommended)
- ✅ A Telegram account
- ✅ An Avalanche wallet (Core or MetaMask)

## Quick Start (5 minutes)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd avalanche-pay
```

### 2. Run Setup Script

```bash
chmod +x setup.sh
./setup.sh
```

This will:
- Install all dependencies
- Create environment files
- Set up the project structure

### 3. Configure Environment Variables

Edit `frontend/.env`:
```bash
VITE_API_URL=http://localhost:4000
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

Edit `backend/.env`:
```bash
PORT=4000
TELEGRAM_BOT_TOKEN=your_bot_token_here
WEBAPP_URL=http://localhost:3000
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_key_here
```

### 4. Start Development Servers

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### 5. Open the App

Open your browser to: http://localhost:3000

## Detailed Setup

### Step 1: Get WalletConnect Project ID (2 minutes)

1. Go to https://cloud.walletconnect.com
2. Sign up or log in
3. Click "Create New Project"
4. Name it "Avalanche Pay"
5. Copy the Project ID
6. Paste it in `frontend/.env` as `VITE_WALLETCONNECT_PROJECT_ID`

### Step 2: Create Telegram Bot (5 minutes)

1. Open Telegram
2. Search for @BotFather
3. Send `/newbot`
4. Follow the prompts:
   - Bot name: "Avalanche Pay Dev"
   - Username: "AvalanchePayDevBot" (must end in 'bot')
5. Copy the bot token
6. Paste it in `backend/.env` as `TELEGRAM_BOT_TOKEN`

### Step 3: Setup Supabase Database (5 minutes)

1. Go to https://supabase.com
2. Create a new project
3. Wait for it to initialize
4. Go to SQL Editor
5. Create a new query
6. Paste this SQL:

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  wallet_address TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  amount TEXT NOT NULL,
  token TEXT DEFAULT 'USDC',
  tx_hash TEXT,
  status TEXT DEFAULT 'pending',
  fee TEXT DEFAULT '0',
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_transactions_from ON transactions(from_address);
CREATE INDEX idx_transactions_to ON transactions(to_address);
CREATE INDEX idx_transactions_timestamp ON transactions(timestamp DESC);
```

7. Run the query
8. Go to Settings → API
9. Copy the "Project URL" and "anon public" key
10. Paste them in `backend/.env`

### Step 4: Get Test USDC (5 minutes)

#### Option 1: Avalanche Faucet + DEX

1. Go to https://faucet.avax.network/
2. Select "Fuji Testnet"
3. Enter your wallet address
4. Request AVAX
5. Go to https://traderjoexyz.com/avalanche/trade
6. Switch to Fuji testnet
7. Swap AVAX for USDC

#### Option 2: Ask in Discord

Join the Avalanche Discord and ask for test USDC in the faucet channel.

## Testing Your Setup

### 1. Test Backend

```bash
curl http://localhost:4000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-01T12:00:00.000Z"
}
```

### 2. Test Frontend

1. Open http://localhost:3000
2. You should see the Avalanche Pay home screen
3. Click "Connect Wallet"
4. Choose your wallet
5. Approve the connection
6. You should see your balance

### 3. Test Complete Flow

1. Click "Set My Username"
2. Confirm the transaction
3. Go to Send tab
4. Enter a test username
5. Enter an amount
6. Click Send
7. Confirm in wallet
8. You should see the success screen!

## Common Issues

### Port Already in Use

If port 3000 or 4000 is already in use:

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 4000
lsof -ti:4000 | xargs kill -9
```

### Wallet Won't Connect

1. Make sure you're on Fuji testnet
2. Try a different wallet
3. Clear browser cache
4. Check WalletConnect project ID

### Database Connection Failed

1. Check Supabase URL and key
2. Make sure tables are created
3. Check Supabase project is running
4. Verify network connection

### Bot Not Responding

1. Check bot token is correct
2. Make sure backend is running
3. Check backend logs for errors
4. Try sending `/start` again

## Development Workflow

### Making Changes

1. Edit files in `frontend/src/` or `backend/src/`
2. Changes auto-reload (hot module replacement)
3. Check browser console for errors
4. Check terminal for backend errors

### Adding Dependencies

Frontend:
```bash
cd frontend
npm install <package-name>
```

Backend:
```bash
cd backend
npm install <package-name>
```

### Running Tests

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

### Building for Production

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd backend
npm run build
```

## Project Structure

```
avalanche-pay/
├── frontend/          # React app
│   ├── src/
│   │   ├── pages/    # Main pages
│   │   ├── components/ # Reusable components
│   │   ├── lib/      # Utilities
│   │   └── store/    # State management
│   └── package.json
├── backend/          # Express API
│   ├── src/
│   │   └── index.ts  # Main server
│   └── package.json
└── package.json      # Root workspace
```

## Key Files to Know

### Frontend

- `src/App.tsx` - Main app component
- `src/pages/Home.tsx` - Home page
- `src/pages/Send.tsx` - Send money page
- `src/lib/wallet.ts` - Wallet configuration
- `src/lib/x402.ts` - Intent creation
- `src/lib/api.ts` - API client

### Backend

- `src/index.ts` - Express server + Telegram bot
  - User endpoints
  - Transaction endpoints
  - Bot handlers

## Environment Variables

### Frontend (.env)

```bash
# API endpoint
VITE_API_URL=http://localhost:4000

# WalletConnect project ID
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Backend (.env)

```bash
# Server port
PORT=4000

# Telegram bot token
TELEGRAM_BOT_TOKEN=your_bot_token

# Frontend URL
WEBAPP_URL=http://localhost:3000

# Supabase credentials
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

## Useful Commands

### Development

```bash
# Start everything
npm run dev

# Start frontend only
cd frontend && npm run dev

# Start backend only
cd backend && npm run dev
```

### Building

```bash
# Build everything
npm run build

# Build frontend only
cd frontend && npm run build

# Build backend only
cd backend && npm run build
```

### Deployment

```bash
# Deploy frontend to Vercel
cd frontend && vercel --prod

# Deploy backend to Railway
cd backend && railway up
```

## Next Steps

### 1. Customize the App

- Change colors in `frontend/tailwind.config.js`
- Update branding in `frontend/index.html`
- Modify features in `frontend/src/pages/`

### 2. Add Features

- Multi-token support
- Group payments
- Payment requests
- Recurring payments

### 3. Deploy to Production

Follow the guide in `DEPLOYMENT.md`

### 4. Test Thoroughly

Follow the guide in `TESTING.md`

## Getting Help

### Documentation

- `README.md` - Overview
- `DEPLOYMENT.md` - Deployment guide
- `TESTING.md` - Testing guide
- `SECURITY.md` - Security best practices
- `ARCHITECTURE.md` - System architecture

### Community

- Avalanche Discord
- GitHub Issues
- Telegram group

### Support

If you're stuck:
1. Check the documentation
2. Search GitHub issues
3. Ask in Discord
4. Create a new issue

## Tips for Success

### Development

1. **Use TypeScript**: Catch errors early
2. **Test Often**: Test after every change
3. **Read Logs**: Check console and terminal
4. **Use Git**: Commit often, branch for features
5. **Document**: Add comments for complex code

### Debugging

1. **Check Logs**: Browser console, terminal output
2. **Use Debugger**: Set breakpoints in VS Code
3. **Test Isolated**: Test components separately
4. **Read Errors**: Error messages are helpful
5. **Ask for Help**: Don't struggle alone

### Performance

1. **Optimize Images**: Use WebP, lazy loading
2. **Code Splitting**: Lazy load pages
3. **Cache Data**: Use localStorage, React Query
4. **Minimize Requests**: Batch API calls
5. **Monitor**: Use performance tools

## Congratulations! 🎉

You now have Avalanche Pay running locally!

### What You Can Do Now

- ✅ Connect your wallet
- ✅ Set your username
- ✅ Send test transactions
- ✅ Receive payments
- ✅ View transaction history
- ✅ Generate QR codes
- ✅ Share payment links

### Ready to Deploy?

Check out `DEPLOYMENT.md` for step-by-step deployment instructions.

### Want to Contribute?

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Happy coding! 🚀**

Need help? Check the docs or ask in Discord!
