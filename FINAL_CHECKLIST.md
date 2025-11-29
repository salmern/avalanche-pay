# ✅ Final Checklist - Get Everything Working

## 🎯 Your Current Status

Based on your screenshots:
- ✅ Bot created (@AvalanchePayBot)
- ✅ Bot token obtained
- ✅ Frontend code ready
- ✅ Backend code ready
- ⚠️ Need to configure bot
- ⚠️ Need to start services

---

## 📋 Complete Setup Checklist

### Part 1: Database (2 minutes)

- [ ] PostgreSQL installed
- [ ] PostgreSQL running: `pg_isready`
- [ ] Database created: `sudo -u postgres psql -c "CREATE DATABASE avalanche_pay;"`

**Quick fix:**
```bash
sudo systemctl start postgresql
sudo -u postgres psql -c "CREATE DATABASE avalanche_pay;"
```

---

### Part 2: Bot Configuration (5 minutes)

In Telegram, message @BotFather:

- [ ] `/newapp` - Create Web App
  - Bot: @AvalanchePayBot
  - Title: Avalanche Pay
  - URL: http://localhost:5173
  - Short name: avaxpay

- [ ] `/setdescription` - Set description
  - Paste from BOT_QUICK_SETUP.md

- [ ] `/setcommands` - Set commands
  - Paste: `start - Open Avalanche Pay`

- [ ] `/setabouttext` - Set about
  - Paste: `Instant global payments on Avalanche`

**See: BOT_QUICK_SETUP.md for exact text to paste**

---

### Part 3: Environment Files (1 minute)

- [ ] `backend/.env` exists and has:
  ```bash
  PORT=4000
  TELEGRAM_BOT_TOKEN=8346751711:AAFZJjX0oT0cDfeUpYRPFNSI91UdDleZEBM
  WEBAPP_URL=http://localhost:5173
  DB_HOST=localhost
  DB_PORT=5432
  DB_NAME=avalanche_pay
  DB_USER=postgres
  DB_PASSWORD=postgres
  ```

- [ ] `frontend/.env` exists and has:
  ```bash
  VITE_API_URL=http://localhost:4000
  VITE_WALLETCONNECT_PROJECT_ID=8cc993e1b8cb1659f8067ad626162346
  ```

---

### Part 4: Start Services (2 minutes)

- [ ] **Terminal 1 - Backend:**
  ```bash
  cd backend
  npm run dev
  ```
  
  Wait for:
  ```
  ✅ Connected to PostgreSQL database
  ✅ Database tables initialized
  🚀 Avalanche Pay API running on port 4000
  📱 Telegram bot active
  ```

- [ ] **Terminal 2 - Frontend:**
  ```bash
  cd frontend
  npm run dev
  ```
  
  Wait for:
  ```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
  ```

---

### Part 5: Test Everything (5 minutes)

- [ ] **Test Backend:**
  ```bash
  curl http://localhost:4000/health
  ```
  Should return: `{"status":"ok",...}`

- [ ] **Test Frontend:**
  Open: http://localhost:5173
  Should see: Avalanche Pay home screen

- [ ] **Test Bot:**
  1. Open Telegram
  2. Search: @AvalanchePayBot
  3. Send: `/start`
  4. Should see: Welcome message + "Open Avalanche Pay" button

- [ ] **Test Mini App:**
  1. Click "Open Avalanche Pay" button
  2. App should open inside Telegram
  3. Should see: Home screen with "Connect Wallet"

- [ ] **Test Wallet:**
  1. Click "Connect Wallet"
  2. Choose wallet (MetaMask/Core)
  3. Switch to Avalanche Fuji testnet
  4. Approve connection
  5. Should see: Wallet address + balance

- [ ] **Test Username:**
  1. Make sure you have Telegram username (@yourname)
  2. Click "Set My Username"
  3. Confirm transaction
  4. Should see: "Username @yourname set successfully!"

---

## 🔍 Quick Diagnostic

Run this to check everything:

```bash
./check-services.sh
```

It will tell you what's working and what needs fixing.

---

## 📚 Documentation Reference

| Issue | Read This |
|-------|-----------|
| Bot setup | BOT_QUICK_SETUP.md |
| Detailed bot guide | TELEGRAM_BOT_SETUP.md |
| Network errors | README_SIMPLE.md |
| Complete system | HOW_IT_WORKS.md |
| Visual guide | VISUAL_GUIDE.md |
| Quick fixes | QUICK_DIAGNOSTIC.md |

---

## 🚨 Common Issues

### "Network Error" in browser

**Fix:** Backend not running
```bash
cd backend
npm run dev
```

### Bot doesn't respond

**Fix:** Check backend logs
```bash
cd backend
npm run dev
# Look for: "📱 Telegram bot active"
```

### "Open App" button doesn't work

**Fix:** Create Web App in BotFather
```
/newapp
```

### Can't connect wallet

**Fix:** Switch to Fuji testnet
- Network: Avalanche Fuji C-Chain
- RPC: https://api.avax-test.network/ext/bc/C/rpc
- Chain ID: 43113

### Username setting fails

**Fix:** Make sure you have Telegram username
1. Telegram Settings
2. Set username (@yourname)
3. Try again

---

## 🎯 Success Criteria

You're done when:

✅ Backend shows: "📱 Telegram bot active"
✅ Frontend loads at http://localhost:5173
✅ Bot responds to `/start`
✅ "Open App" button works
✅ Can connect wallet
✅ Can set username
✅ Can see balance

---

## 🚀 Next Steps After Setup

1. **Get test USDC:**
   - https://faucet.avax.network/ (get AVAX)
   - Swap for USDC on Trader Joe

2. **Test sending:**
   - Create second test account
   - Send money between accounts
   - Check notifications work

3. **Deploy to production:**
   - Deploy frontend to Vercel
   - Deploy backend to Railway
   - Update bot Web App URL
   - Test on mobile

---

## 📞 Need Help?

### Quick Fixes:
1. Run `./check-services.sh`
2. Read the error message
3. Apply the suggested fix
4. Run again

### Documentation:
- **Simple**: README_SIMPLE.md
- **Bot**: BOT_QUICK_SETUP.md
- **Complete**: HOW_IT_WORKS.md

### Still Stuck?
1. Check backend logs
2. Check frontend console (F12)
3. Check PostgreSQL is running
4. Restart everything

---

## 🎉 You're Almost There!

Just follow the checklist above and you'll have everything working in 15 minutes!

**Start with: BOT_QUICK_SETUP.md** 🚀
