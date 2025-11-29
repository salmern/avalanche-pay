# 🚀 Deployment Guide - Avalanche Pay

Complete step-by-step guide to deploy Avalanche Pay to production.

## Prerequisites Checklist

- [ ] GitHub account
- [ ] Vercel account (free tier works)
- [ ] Railway account (free tier works)
- [ ] Supabase account (free tier works)
- [ ] Telegram account
- [ ] WalletConnect Cloud account (free)
- [ ] Avalanche wallet with Fuji testnet AVAX

## Step 1: Setup Supabase Database (5 minutes)

### 1.1 Create Project
1. Go to https://supabase.com
2. Click "New Project"
3. Choose organization and region
4. Set database password (save it!)
5. Wait for project to initialize

### 1.2 Create Tables
1. Click "SQL Editor" in sidebar
2. Click "New Query"
3. Paste this SQL:

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

-- Indexes for performance
CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_transactions_from ON transactions(from_address);
CREATE INDEX idx_transactions_to ON transactions(to_address);
CREATE INDEX idx_transactions_timestamp ON transactions(timestamp DESC);
```

4. Click "Run"
5. Verify tables created in "Table Editor"

### 1.3 Get API Keys
1. Click "Settings" → "API"
2. Copy "Project URL" (starts with https://)
3. Copy "anon public" key
4. Save both for later

## Step 2: Create Telegram Bot (5 minutes)

### 2.1 Create Bot
1. Open Telegram
2. Search for [@BotFather](https://t.me/BotFather)
3. Send `/newbot`
4. Choose bot name: "Avalanche Pay"
5. Choose username: "AvalanchePayBot" (must end in 'bot')
6. Copy the bot token (looks like: 123456:ABC-DEF...)
7. **SAVE THIS TOKEN SECURELY**

### 2.2 Configure Bot
1. Send `/setdescription` to BotFather
2. Choose your bot
3. Set description:
```
⚡ Instant global payments on Avalanche

Send USDC to anyone via username
• <800ms settlement
• <$0.001 fees
• Powered by x402
```

4. Send `/setabouttext`
5. Set about text:
```
The fastest way to send money globally. Built on Avalanche.
```

6. Send `/setuserpic`
7. Upload a logo (optional)

### 2.3 Create Mini App (Important!)
1. Send `/newapp` to BotFather
2. Choose your bot
3. Set app title: "Avalanche Pay"
4. Set description: "Instant global payments"
5. Upload app icon (512x512 PNG)
6. Set Web App URL: `https://your-app.vercel.app` (we'll update this later)
7. Set short name: "avaxpay"

## Step 3: Get WalletConnect Project ID (2 minutes)

1. Go to https://cloud.walletconnect.com
2. Sign up / Log in
3. Click "Create New Project"
4. Name: "Avalanche Pay"
5. Copy the "Project ID"
6. Save for later

## Step 4: Deploy Backend to Railway (10 minutes)

### 4.1 Prepare Repository
```bash
# Push your code to GitHub first
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/avalanche-pay.git
git push -u origin main
```

### 4.2 Deploy to Railway
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Choose "Deploy from GitHub repo"
5. Select your repository
6. Railway will auto-detect Node.js

### 4.3 Configure Build
1. Click on your service
2. Go to "Settings"
3. Set "Root Directory": `backend`
4. Set "Build Command": `npm install && npm run build`
5. Set "Start Command": `npm start`

### 4.4 Add Environment Variables
1. Click "Variables" tab
2. Add these variables:

```
PORT=4000
TELEGRAM_BOT_TOKEN=<your_bot_token_from_step_2>
WEBAPP_URL=https://your-app.vercel.app
SUPABASE_URL=<your_supabase_url_from_step_1>
SUPABASE_KEY=<your_supabase_key_from_step_1>
```

3. Click "Deploy"
4. Wait for deployment (2-3 minutes)
5. Copy your Railway URL (looks like: https://avalanche-pay-production.up.railway.app)

## Step 5: Deploy Frontend to Vercel (10 minutes)

### 5.1 Deploy via Vercel CLI
```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

Follow prompts:
- Set up and deploy? Yes
- Which scope? Your account
- Link to existing project? No
- Project name? avalanche-pay
- Directory? ./
- Override settings? No

### 5.2 Add Environment Variables
```bash
vercel env add VITE_API_URL
# Enter: https://your-railway-url.railway.app

vercel env add VITE_WALLETCONNECT_PROJECT_ID
# Enter: your_walletconnect_project_id

# Redeploy with new env vars
vercel --prod
```

### 5.3 Get Your Vercel URL
Copy the deployment URL (looks like: https://avalanche-pay.vercel.app)

## Step 6: Update Telegram Bot with Final URL (2 minutes)

1. Go back to [@BotFather](https://t.me/BotFather)
2. Send `/myapps`
3. Choose your bot
4. Choose your app
5. Click "Edit Web App URL"
6. Enter your Vercel URL: `https://avalanche-pay.vercel.app`
7. Confirm

## Step 7: Update Backend Environment (2 minutes)

1. Go to Railway dashboard
2. Click your service
3. Go to "Variables"
4. Update `WEBAPP_URL` to your Vercel URL
5. Click "Redeploy"

## Step 8: Test Your Deployment (5 minutes)

### 8.1 Test Bot
1. Open Telegram
2. Search for your bot (@AvalanchePayBot)
3. Send `/start`
4. You should see welcome message with "Open Avalanche Pay" button

### 8.2 Test Mini App
1. Click "Open Avalanche Pay" button
2. App should load in Telegram
3. You should see the home screen

### 8.3 Test Wallet Connection
1. Click "Connect Wallet"
2. Choose your wallet (Core, MetaMask, etc.)
3. Approve connection
4. You should see your balance

### 8.4 Test Username Setup
1. Click "Set My Username"
2. Confirm transaction
3. You should see "Username set successfully!"

### 8.5 Test Send Money
1. Get a friend to set up their account
2. Go to Send tab
3. Enter their username: @friend
4. Enter amount: 5
5. Click Send
6. Confirm in wallet
7. Friend should get Telegram notification

## Step 9: Get Test USDC (5 minutes)

### Option 1: Avalanche Faucet + DEX
1. Go to https://faucet.avax.network/
2. Select "Fuji Testnet"
3. Enter your wallet address
4. Request AVAX
5. Go to https://traderjoexyz.com/avalanche/trade
6. Switch to Fuji testnet
7. Swap AVAX for USDC

### Option 2: Circle Faucet (if available)
1. Check Circle's developer docs for testnet faucet
2. Request USDC directly on Fuji

## Troubleshooting

### Backend not responding
```bash
# Check Railway logs
railway logs

# Common issues:
# - Wrong environment variables
# - Supabase connection failed
# - Telegram bot token invalid
```

### Frontend not loading
```bash
# Check Vercel logs
vercel logs

# Common issues:
# - Wrong API URL
# - WalletConnect project ID invalid
# - Build failed
```

### Wallet connection fails
- Ensure you're on Fuji testnet
- Try different wallet
- Check WalletConnect project ID
- Clear browser cache

### Transactions fail
- Check USDC balance
- Ensure sufficient AVAX for gas
- Verify recipient username exists
- Check Snowtrace for transaction details

## Production Checklist

Before going live on mainnet:

- [ ] Audit smart contracts
- [ ] Enable rate limiting on API
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure custom domain
- [ ] Enable HTTPS only
- [ ] Set up backup database
- [ ] Create incident response plan
- [ ] Test with real money (small amounts first)
- [ ] Get security audit
- [ ] Set up customer support

## Monitoring

### Railway Logs
```bash
railway logs --tail
```

### Vercel Logs
```bash
vercel logs --follow
```

### Supabase Logs
1. Go to Supabase dashboard
2. Click "Logs" in sidebar
3. Monitor API requests and errors

## Scaling

### When you need to scale:

1. **Database**: Upgrade Supabase plan
2. **Backend**: Railway auto-scales, or use multiple instances
3. **Frontend**: Vercel auto-scales globally
4. **Bot**: Use webhook instead of polling for better performance

## Cost Estimate

### Free Tier (Good for hackathon + early users)
- Vercel: Free (100GB bandwidth)
- Railway: $5/month (500 hours)
- Supabase: Free (500MB database, 2GB bandwidth)
- WalletConnect: Free
- **Total: ~$5/month**

### Production (1000+ users)
- Vercel Pro: $20/month
- Railway: $20/month
- Supabase Pro: $25/month
- **Total: ~$65/month**

## Support

If you run into issues:
1. Check logs first
2. Review environment variables
3. Test each component separately
4. Check GitHub issues
5. Ask in Avalanche Discord

---

**Deployment complete! 🎉**

Your Avalanche Pay app is now live and ready to win the hackathon!
