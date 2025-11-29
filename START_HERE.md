# 🚀 START HERE - Avalanche Pay

**Welcome! Your project is ready to run. Follow these simple steps:**

## ✅ What's Already Done

- ✅ All code written (50+ files)
- ✅ All dependencies installed
- ✅ TypeScript errors fixed
- ✅ Build tested and working
- ✅ Environment files created
- ✅ 14 documentation files ready

## 🎯 Quick Start (5 minutes)

### Step 1: Get Your API Keys

You need 3 things:

#### A. WalletConnect Project ID (2 minutes)
1. Go to https://cloud.walletconnect.com
2. Sign up (free)
3. Click "Create New Project"
4. Name it "Avalanche Pay"
5. Copy the **Project ID**

#### B. Telegram Bot Token (2 minutes)
1. Open Telegram
2. Search for **@BotFather**
3. Send `/newbot`
4. Name: "Avalanche Pay Dev"
5. Username: "AvalanchePayDevBot"
6. Copy the **bot token**

#### C. PostgreSQL Database (2 minutes)

**Option 1: Quick Setup (Recommended)**
```bash
./setup-postgres.sh
```

**Option 2: Manual Setup**

Install PostgreSQL:
```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql
brew services start postgresql
```

Create database:
```bash
sudo -u postgres psql -c "CREATE DATABASE avalanche_pay;"
```

**That's it!** The backend will create tables automatically when it starts.

See [POSTGRES_SETUP.md](POSTGRES_SETUP.md) for detailed instructions.

### Step 2: Configure Environment

Edit `frontend/.env`:
```bash
VITE_API_URL=http://localhost:4000
VITE_WALLETCONNECT_PROJECT_ID=paste_your_project_id_here
```

Edit `backend/.env`:
```bash
PORT=4000
TELEGRAM_BOT_TOKEN=paste_your_bot_token_here
WEBAPP_URL=http://localhost:3000

# PostgreSQL (default values, change if needed)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=avalanche_pay
DB_USER=postgres
DB_PASSWORD=postgres
```

### Step 3: Start the App

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Avalanche Pay API running on port 4000
📱 Telegram bot active
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

### Step 4: Open the App

Open your browser to: **http://localhost:3000**

You should see the beautiful Avalanche Pay home screen! 🎉

## 🎮 Test It Out

### 1. Connect Your Wallet
- Click "Connect Wallet"
- Choose MetaMask or Core Wallet
- Switch to **Avalanche Fuji Testnet**
- Approve the connection

### 2. Set Your Username
- Click "Set My Username"
- Confirm the transaction
- You're now registered!

### 3. Get Test USDC
- Go to https://faucet.avax.network/
- Get free AVAX on Fuji testnet
- Swap for USDC on Trader Joe

### 4. Send Money
- Go to Send tab
- Enter a test username
- Enter amount
- Click Send
- Watch it complete in <1 second! ⚡

## 📚 Next Steps

### Learn More
- Read [README.md](README.md) for full overview
- Check [GETTING_STARTED.md](GETTING_STARTED.md) for detailed guide
- See [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system

### Deploy to Production
- Follow [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step deployment
- Deploy frontend to Vercel
- Deploy backend to Railway
- Update Telegram bot with production URL

### Prepare for Demo
- Read [DEMO_SCRIPT.md](DEMO_SCRIPT.md) for presentation guide
- Check [VIDEO_SCRIPT.md](VIDEO_SCRIPT.md) for video recording
- Use [HACKATHON_CHECKLIST.md](HACKATHON_CHECKLIST.md) before submitting

## 🆘 Troubleshooting

### Frontend won't start
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### Backend won't start
```bash
cd backend
rm -rf node_modules
npm install
npm run dev
```

### "Module not found" errors
```bash
# Install missing dependencies
npm install
```

### Wallet won't connect
- Make sure you're on **Fuji testnet**
- Check your WalletConnect Project ID
- Try a different wallet

### Database errors
- Check Supabase URL and key
- Make sure tables are created
- Verify project is running

## 📞 Need Help?

1. Check [QUICK_FIX.md](QUICK_FIX.md) for common issues
2. Read [GETTING_STARTED.md](GETTING_STARTED.md) for detailed setup
3. See [DOCS_INDEX.md](DOCS_INDEX.md) for all documentation
4. Create a GitHub issue if stuck

## 🎉 You're Ready!

Your Avalanche Pay app is now running locally. You can:

- ✅ Connect wallets
- ✅ Send money by username
- ✅ Receive payments
- ✅ View transaction history
- ✅ Generate QR codes
- ✅ Share payment links

## 🏆 Ready to Win the Hackathon?

1. ✅ Test everything thoroughly
2. ✅ Deploy to production
3. ✅ Record your demo video
4. ✅ Prepare your presentation
5. ✅ Submit and win! 🏆

---

**Built with ❤️ on Avalanche**

**Questions? Check the docs or create an issue!**
