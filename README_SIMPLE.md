# 🚀 Avalanche Pay - Simple Start

## Your Error: "Network Error"

**This means your backend is not running!**

---

## Fix in 3 Steps:

### 1. Start Backend

```bash
cd backend
npm run dev
```

Wait for this:
```
✅ Connected to PostgreSQL database
✅ Database tables initialized
🚀 Avalanche Pay API running on port 4000
📱 Telegram bot active
```

### 2. Refresh Browser

Press `Ctrl+Shift+R`

### 3. Done!

The error should be gone ✅

---

## If Backend Won't Start

### Error: PostgreSQL not running

```bash
# Start PostgreSQL
sudo systemctl start postgresql

# Create database
sudo -u postgres psql -c "CREATE DATABASE avalanche_pay;"

# Try again
cd backend
npm run dev
```

### Error: Database doesn't exist

```bash
sudo -u postgres psql -c "CREATE DATABASE avalanche_pay;"
cd backend
npm run dev
```

---

## Quick Diagnostic

Run this to check everything:

```bash
./check-services.sh
```

It will tell you exactly what's wrong and how to fix it.

---

## Complete Setup (If Starting Fresh)

### 1. Install PostgreSQL

```bash
# Ubuntu/Debian
sudo apt install postgresql

# macOS
brew install postgresql
brew services start postgresql
```

### 2. Create Database

```bash
sudo -u postgres psql -c "CREATE DATABASE avalanche_pay;"
```

### 3. Configure Backend

Edit `backend/.env`:
```bash
DB_PASSWORD=postgres
TELEGRAM_BOT_TOKEN=your_bot_token
```

### 4. Start Backend

```bash
cd backend
npm install  # If not done
npm run dev
```

### 5. Start Frontend

```bash
cd frontend
npm install  # If not done
npm run dev
```

### 6. Open Browser

http://localhost:5173

---

## Common Issues

| Error | Fix |
|-------|-----|
| Network Error | Start backend: `cd backend && npm run dev` |
| PostgreSQL error | Start PostgreSQL: `sudo systemctl start postgresql` |
| Database error | Create database: `sudo -u postgres psql -c "CREATE DATABASE avalanche_pay;"` |
| Port in use | Kill process: `lsof -ti:4000 \| xargs kill -9` |

---

## WalletConnect Warnings (Ignore)

These warnings are normal:
```
WebSocket connection to 'wss://relay.walletconnect.com/...' failed
```

Your wallet will still connect fine. Just ignore them.

---

## Need More Help?

1. **Quick fix**: Read [QUICK_DIAGNOSTIC.md](QUICK_DIAGNOSTIC.md)
2. **Detailed fix**: Read [FIX_NETWORK_ERRORS.md](FIX_NETWORK_ERRORS.md)
3. **Understand system**: Read [HOW_IT_WORKS.md](HOW_IT_WORKS.md)
4. **Visual guide**: Read [VISUAL_GUIDE.md](VISUAL_GUIDE.md)

---

**TL;DR: Start the backend! → `cd backend && npm run dev`** 🚀
