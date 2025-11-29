# 🔍 Quick Diagnostic

## Run This First!

```bash
./check-services.sh
```

This will check:
- ✅ PostgreSQL running?
- ✅ Database exists?
- ✅ Backend running?
- ✅ Frontend running?
- ✅ Environment files exist?

---

## Your Current Error

```
Failed to update balance: AxiosError
GET http://localhost:4000/api/balance/... net::ERR_BLOCKED_BY_CLIENT
```

### This means:

1. **Backend is not responding** OR
2. **Ad blocker is blocking the request** OR
3. **Backend is not running**

---

## Quick Fix (90% of cases)

### Step 1: Start Backend

```bash
cd backend
npm run dev
```

**Wait for:**
```
✅ Connected to PostgreSQL database
✅ Database tables initialized
🚀 Avalanche Pay API running on port 4000
📱 Telegram bot active
```

### Step 2: Test Backend

```bash
# In another terminal
curl http://localhost:4000/health
```

**Should return:**
```json
{"status":"ok","timestamp":"..."}
```

### Step 3: Refresh Browser

Press `Ctrl+Shift+R` (hard refresh)

---

## If Backend Won't Start

### Error: "Invalid supabaseUrl"
**Already fixed!** You're using PostgreSQL now.

### Error: "connect ECONNREFUSED"
**PostgreSQL not running**

```bash
# Start PostgreSQL
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS

# Create database
sudo -u postgres psql -c "CREATE DATABASE avalanche_pay;"

# Restart backend
cd backend
npm run dev
```

### Error: "database does not exist"
```bash
sudo -u postgres psql -c "CREATE DATABASE avalanche_pay;"
cd backend
npm run dev
```

### Error: "password authentication failed"
Edit `backend/.env`:
```bash
DB_PASSWORD=your_actual_postgres_password
```

---

## If Still Getting "ERR_BLOCKED_BY_CLIENT"

### 1. Disable Ad Blocker

1. Click ad blocker icon (uBlock, AdBlock, etc.)
2. Click "Disable on this site"
3. Refresh page

### 2. Try Incognito Mode

1. Open incognito window (Ctrl+Shift+N)
2. Go to http://localhost:5173
3. Test if it works

### 3. Check Browser Extensions

1. Disable all extensions
2. Refresh page
3. If it works, enable extensions one by one to find culprit

---

## WalletConnect Warnings (Ignore These)

```
WebSocket connection to 'wss://relay.walletconnect.com/...' failed
```

**These are normal!** WalletConnect tries multiple relay servers. Your wallet will still connect fine.

To hide these warnings:
1. Open DevTools (F12)
2. Click "Filter" icon
3. Uncheck "Warnings"

---

## Complete Checklist

Run through this list:

- [ ] PostgreSQL is running (`pg_isready`)
- [ ] Database exists (`psql -U postgres -l | grep avalanche_pay`)
- [ ] Backend is running (`curl http://localhost:4000/health`)
- [ ] Frontend is running (open http://localhost:5173)
- [ ] Ad blocker disabled for localhost
- [ ] Browser refreshed (Ctrl+Shift+R)

---

## Test Each Service

### Test PostgreSQL:
```bash
pg_isready
# Should say: accepting connections
```

### Test Database:
```bash
psql -U postgres avalanche_pay -c "SELECT version();"
# Should show PostgreSQL version
```

### Test Backend:
```bash
curl http://localhost:4000/health
# Should return: {"status":"ok",...}
```

### Test Frontend:
```bash
curl http://localhost:5173
# Should return HTML
```

---

## Most Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Backend not running | `cd backend && npm run dev` |
| PostgreSQL not running | `sudo systemctl start postgresql` |
| Database doesn't exist | `sudo -u postgres psql -c "CREATE DATABASE avalanche_pay;"` |
| Ad blocker blocking | Disable ad blocker for localhost |
| Wrong password | Update `DB_PASSWORD` in `backend/.env` |
| Port in use | Kill process: `lsof -ti:4000 \| xargs kill -9` |

---

## Nuclear Option (If Nothing Works)

```bash
# Stop everything
pkill -f node

# Restart PostgreSQL
sudo systemctl restart postgresql

# Clean backend
cd backend
rm -rf node_modules
npm install

# Clean frontend  
cd frontend
rm -rf node_modules
npm install

# Start backend
cd backend
npm run dev

# Start frontend (new terminal)
cd frontend
npm run dev

# Hard refresh browser
# Ctrl+Shift+R
```

---

## Get Help

If still stuck:

1. Run `./check-services.sh`
2. Copy the output
3. Check which service is failing
4. Read the fix message
5. Apply the fix
6. Run again

---

**99% of the time, the issue is: Backend not running!**

**Fix: `cd backend && npm run dev`** 🚀
