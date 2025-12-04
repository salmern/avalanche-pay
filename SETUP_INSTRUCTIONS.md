# 🚀 Avalanche Pay - Complete Setup Instructions

## 📋 Prerequisites

- Node.js 18+ installed
- Telegram account
- Supabase account (already configured ✅)
- WalletConnect Project ID
- Telegram Bot Token

## ⚡ Quick Setup (5 Steps)

### Step 1: Install Dependencies

```bash
# Root
npm install

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### Step 2: Setup Supabase Database

1. Go to: https://supabase.com/dashboard/project/wjiokcowakfsnwsohkrt/sql
2. Click **New Query**
3. Copy all SQL from `SUPABASE_SETUP.sql`
4. Paste and click **Run**
5. Verify tables created in **Table Editor**

### Step 3: Test Supabase Connection

```bash
cd backend
npm run test:supabase
```

You should see:
```
✅ Successfully connected to Supabase!
✅ Tables are set up correctly!
```

### Step 4: Configure Environment Variables

**backend/.env** (already configured ✅)
```bash
PORT=4000
TELEGRAM_BOT_TOKEN=your_bot_token_here
WEBAPP_URL=http://localhost:5173
SUPABASE_URL=https://wjiokcowakfsnwsohkrt.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**frontend/.env**
```bash
VITE_API_URL=http://localhost:4000
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Step 5: Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

## ✅ Verification

### Backend Running
You should see:
```
✅ Connected to Supabase database
📍 Supabase URL: https://wjiokcowakfsnwsohkrt.supabase.co
🚀 Avalanche Pay API running on port 4000
📱 Telegram bot active
```

### Frontend Running
Open: http://localhost:5173

## 🎯 What You Have

### Complete Features
- ✅ Username payments (@username)
- ✅ Multi-token support (USDC + AVAX)
- ✅ Activity feed with reactions
- ✅ Payment requests
- ✅ Split bill
- ✅ User profiles
- ✅ Search users
- ✅ Transaction history
- ✅ QR codes & payment links
- ✅ Telegram notifications
- ✅ Beautiful onboarding

## 🔧 Troubleshooting

### "relation 'users' does not exist"
→ Run the SQL from `SUPABASE_SETUP.sql` in Supabase SQL Editor

### "supabaseUrl is required"
→ Check your `backend/.env` file has SUPABASE_URL and SUPABASE_KEY

### Port already in use
```bash
lsof -ti:4000 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Frontend
```

## 📚 Documentation

- `README.md` - Main project documentation
- `SUPABASE_QUICKSTART.md` - Supabase setup details
- `SUPABASE_SETUP.sql` - Database schema
- `ARCHITECTURE.md` - Technical architecture

---

**Ready to launch!** 🚀
