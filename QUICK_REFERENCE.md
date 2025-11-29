# ⚡ Quick Reference - Avalanche Pay

## 🚀 Quick Start (5 minutes)

### 1. Setup PostgreSQL
```bash
./setup-postgres.sh
```

### 2. Get API Keys
- **WalletConnect**: https://cloud.walletconnect.com (2 min)
- **Telegram Bot**: Message @BotFather, send `/newbot` (2 min)

### 3. Configure
Edit `backend/.env`:
```bash
TELEGRAM_BOT_TOKEN=your_bot_token
DB_PASSWORD=postgres
```

Edit `frontend/.env`:
```bash
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

### 4. Start
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

### 5. Open
http://localhost:3000

---

## 📁 Project Structure

```
avalanche-pay/
├── frontend/          # React app (port 3000)
├── backend/           # Express API (port 4000)
├── START_HERE.md      # ← Read this first!
├── POSTGRES_SETUP.md  # Database setup
└── WHATS_CHANGED.md   # Recent changes
```

---

## 🔧 Common Commands

### Development
```bash
# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev

# Build everything
npm run build
```

### Database
```bash
# Setup PostgreSQL
./setup-postgres.sh

# Connect to database
psql -U postgres avalanche_pay

# View users
psql -U postgres avalanche_pay -c "SELECT * FROM users;"

# View transactions
psql -U postgres avalanche_pay -c "SELECT * FROM transactions;"
```

### Deployment
```bash
# Deploy frontend
cd frontend && vercel --prod

# Deploy backend
cd backend && railway up
```

---

## 🌐 Environment Variables

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:4000
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Backend (.env)
```bash
PORT=4000
TELEGRAM_BOT_TOKEN=your_bot_token
WEBAPP_URL=http://localhost:3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=avalanche_pay
DB_USER=postgres
DB_PASSWORD=postgres
```

---

## 🔗 Important Links

### Services
- **WalletConnect**: https://cloud.walletconnect.com
- **Telegram BotFather**: https://t.me/BotFather
- **Avalanche Faucet**: https://faucet.avax.network
- **Trader Joe DEX**: https://traderjoexyz.com

### Documentation
- **START_HERE.md** - Complete setup guide
- **POSTGRES_SETUP.md** - Database setup
- **DEPLOYMENT.md** - Production deployment
- **TESTING.md** - Testing guide
- **DEMO_SCRIPT.md** - Presentation guide

---

## 🐛 Troubleshooting

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

### Database connection failed
```bash
# Start PostgreSQL
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS

# Create database
sudo -u postgres psql -c "CREATE DATABASE avalanche_pay;"
```

### Wallet won't connect
- Switch to **Fuji testnet**
- Check WalletConnect Project ID
- Try different wallet

---

## 📊 Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- TailwindCSS
- Wagmi + Viem
- WalletConnect v2

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL
- Telegram Bot API
- Ethers.js v6

### Infrastructure
- Vercel (frontend)
- Railway (backend)
- PostgreSQL (database)
- Avalanche Fuji Testnet

---

## ✅ Features Checklist

- ✅ Telegram Mini App
- ✅ WalletConnect v2
- ✅ Username mapping
- ✅ Send by @username
- ✅ x402 intents
- ✅ <800ms settlement
- ✅ ~$0.003 fees
- ✅ Push notifications
- ✅ Transaction history
- ✅ QR codes
- ✅ Payment links

---

## 🎯 Quick Tests

### 1. Test Backend
```bash
curl http://localhost:4000/health
```

### 2. Test Database
```bash
psql -U postgres avalanche_pay -c "SELECT version();"
```

### 3. Test Frontend
Open http://localhost:3000 in browser

### 4. Test Complete Flow
1. Connect wallet
2. Set username
3. Send test transaction
4. Check history

---

## 📝 Quick Notes

### Default Ports
- Frontend: 3000
- Backend: 4000
- PostgreSQL: 5432

### Default Credentials
- DB User: postgres
- DB Password: postgres (change this!)
- DB Name: avalanche_pay

### Network
- Testnet: Avalanche Fuji (Chain ID: 43113)
- USDC: 0x5425890298aed601595a70AB815c96711a31Bc65

---

## 🚀 Deployment Checklist

- [ ] PostgreSQL database setup
- [ ] Environment variables configured
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway
- [ ] Telegram bot configured
- [ ] Test complete flow
- [ ] Record demo video

---

## 📞 Get Help

1. Check [START_HERE.md](START_HERE.md)
2. Read [POSTGRES_SETUP.md](POSTGRES_SETUP.md)
3. See [DOCS_INDEX.md](DOCS_INDEX.md)
4. Create GitHub issue

---

**Keep this handy! 📌**
