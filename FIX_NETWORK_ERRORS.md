# 🔧 Fix Network Errors

## Issues Found:

1. ❌ **Backend API blocked** - `ERR_BLOCKED_BY_CLIENT`
2. ⚠️ **WalletConnect WebSocket warnings** (not critical)

---

## Fix 1: Backend Not Responding

### Check if backend is running:

```bash
# In a terminal
cd backend
npm run dev
```

You should see:
```
✅ Connected to PostgreSQL database
✅ Database tables initialized
🚀 Avalanche Pay API running on port 4000
📱 Telegram bot active
```

### Test backend manually:

```bash
# In another terminal
curl http://localhost:4000/health
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

### If backend is NOT running:

1. **Check PostgreSQL is running:**
   ```bash
   pg_isready
   ```
   
   If not running:
   ```bash
   # Linux
   sudo systemctl start postgresql
   
   # macOS
   brew services start postgresql
   ```

2. **Check database exists:**
   ```bash
   psql -U postgres -l | grep avalanche_pay
   ```
   
   If not exists:
   ```bash
   sudo -u postgres psql -c "CREATE DATABASE avalanche_pay;"
   ```

3. **Check backend/.env:**
   ```bash
   cat backend/.env
   ```
   
   Should have:
   ```
   PORT=4000
   TELEGRAM_BOT_TOKEN=...
   WEBAPP_URL=http://localhost:3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=avalanche_pay
   DB_USER=postgres
   DB_PASSWORD=postgres
   ```

4. **Restart backend:**
   ```bash
   cd backend
   npm run dev
   ```

---

## Fix 2: Browser Blocking API Calls

### Issue: `ERR_BLOCKED_BY_CLIENT`

This usually means:
- Ad blocker is blocking the request
- Browser extension is interfering
- CORS issue

### Solutions:

#### A. Disable Ad Blocker
1. Click ad blocker icon in browser
2. Disable for localhost
3. Refresh page

#### B. Try Incognito/Private Mode
1. Open incognito window (Ctrl+Shift+N)
2. Go to http://localhost:5173
3. Test if it works

#### C. Check Browser Console
1. Open DevTools (F12)
2. Go to Network tab
3. Try to connect wallet
4. Look for failed requests
5. Check if they're red (blocked)

---

## Fix 3: WalletConnect WebSocket Warnings

These warnings are **not critical** but can be reduced:

### Option 1: Ignore them (recommended)
These are just WalletConnect trying different relay servers. The connection will work even with these warnings.

### Option 2: Update WalletConnect config

Edit `frontend/src/lib/wallet.ts`:

```typescript
export const web3Modal = createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#9333EA',
  },
  enableAnalytics: false,  // ← Add this
  enableOnramp: false,     // ← Add this
} as any)
```

---

## Complete Diagnostic Steps

### 1. Check Backend Status

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Test backend
curl http://localhost:4000/health
curl http://localhost:4000/api/users/123456789
```

### 2. Check Frontend Status

```bash
# Terminal 3: Start frontend
cd frontend
npm run dev
```

Open: http://localhost:5173

### 3. Check Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Clear console (trash icon)
4. Connect wallet
5. Look for errors

### 4. Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Connect wallet
4. Look for failed requests (red)
5. Click on failed request
6. Check "Response" tab for error details

---

## Common Error Messages & Fixes

### "Network Error"
**Cause:** Backend not running or wrong URL

**Fix:**
```bash
# Check backend is running
cd backend
npm run dev

# Check frontend .env
cat frontend/.env
# Should have: VITE_API_URL=http://localhost:4000
```

### "ERR_BLOCKED_BY_CLIENT"
**Cause:** Ad blocker or browser extension

**Fix:**
- Disable ad blocker for localhost
- Try incognito mode
- Disable browser extensions

### "CORS Error"
**Cause:** Backend CORS not configured for your port

**Fix:** Already fixed! Backend allows both 3000 and 5173.

If still having issues:
```bash
cd backend
npm run dev  # Restart to apply CORS fix
```

### "WebSocket connection failed"
**Cause:** WalletConnect relay server issues

**Fix:** These are warnings, not errors. Ignore them or:
- Check internet connection
- Try different network
- Wait a few seconds and retry

---

## Step-by-Step Troubleshooting

### Step 1: Verify Backend

```bash
cd backend
npm run dev
```

Wait for:
```
✅ Connected to PostgreSQL database
✅ Database tables initialized
🚀 Avalanche Pay API running on port 4000
```

### Step 2: Test Backend API

```bash
curl http://localhost:4000/health
```

Expected:
```json
{"status":"ok","timestamp":"2025-11-27T..."}
```

### Step 3: Verify Frontend

```bash
cd frontend
npm run dev
```

Should show:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### Step 4: Test in Browser

1. Open http://localhost:5173
2. Open DevTools (F12)
3. Go to Console tab
4. Should see no red errors
5. Try connecting wallet

### Step 5: Check Balance API

After connecting wallet, check console for:
```
GET http://localhost:4000/api/balance/0x...
```

Should return:
```json
{"usdc":"0.00","avax":"0.0000"}
```

---

## Quick Fix Commands

### Reset Everything:

```bash
# Stop all processes (Ctrl+C in each terminal)

# Restart PostgreSQL
sudo systemctl restart postgresql  # Linux
brew services restart postgresql   # macOS

# Restart backend
cd backend
npm run dev

# Restart frontend (new terminal)
cd frontend
npm run dev

# Hard refresh browser
# Press Ctrl+Shift+R
```

### Check All Services:

```bash
# PostgreSQL
pg_isready

# Backend
curl http://localhost:4000/health

# Frontend
curl http://localhost:5173
```

---

## Still Not Working?

### 1. Check Firewall

```bash
# Linux - Allow port 4000
sudo ufw allow 4000

# Check if port is in use
lsof -i :4000
```

### 2. Try Different Port

Edit `backend/.env`:
```bash
PORT=4001
```

Edit `frontend/.env`:
```bash
VITE_API_URL=http://localhost:4001
```

Restart both services.

### 3. Check Logs

**Backend logs:**
```bash
cd backend
npm run dev 2>&1 | tee backend.log
```

**Frontend logs:**
```bash
cd frontend
npm run dev 2>&1 | tee frontend.log
```

Check the log files for errors.

### 4. Nuclear Option - Clean Reinstall

```bash
# Stop everything
pkill -f node

# Clean backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Clean frontend
cd frontend
rm -rf node_modules package-lock.json
npm install

# Restart
cd backend && npm run dev
cd frontend && npm run dev
```

---

## Expected Console Output

### Backend Console (Good):
```
✅ Connected to PostgreSQL database
✅ Database tables initialized
🚀 Avalanche Pay API running on port 4000
📱 Telegram bot active
```

### Frontend Console (Good):
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### Browser Console (Good):
```
(No red errors)
Some WalletConnect warnings are OK
```

---

## Summary

1. ✅ **Start backend** - `cd backend && npm run dev`
2. ✅ **Start frontend** - `cd frontend && npm run dev`
3. ✅ **Disable ad blocker** for localhost
4. ✅ **Hard refresh browser** - Ctrl+Shift+R
5. ✅ **Ignore WalletConnect warnings** - They're not critical

---

**Most likely issue: Backend not running. Start it first!** 🚀
