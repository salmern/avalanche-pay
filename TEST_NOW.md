# 🧪 Test Your Avalanche Pay Now!

## ✅ What's Running

- **Backend**: http://localhost:4000 ✅
- **Frontend**: http://localhost:3001 ✅
- **Database**: Supabase ✅

## 🎯 Quick Tests (5 minutes)

### Test 1: Backend Health
```bash
curl http://localhost:4000/health
```
Expected: `{"status":"ok","timestamp":"..."}`

### Test 2: Frontend Loads
Open in browser: http://localhost:3001/

You should see:
- Purple/orange gradient background
- "Welcome to Avalanche Pay" heading
- "Get Started" button

### Test 3: Onboarding Flow
1. Click "Get Started"
2. Click "Connect Wallet"
3. Choose MetaMask or Core wallet
4. Approve connection
5. Click "Set Username"
6. See success screen!

### Test 4: Check Database
1. Go to: https://supabase.com/dashboard/project/wjiokcowakfsnwsohkrt/editor
2. Click "users" table
3. You should see your username and wallet address!

### Test 5: Navigate Pages
Click through all the tabs at the bottom:
- Home
- Feed
- Send
- History
- Profile

All pages should load without errors!

### Test 6: Profile Page
1. Click "Profile" tab
2. Click "Edit" button
3. Add a bio
4. Change privacy settings
5. Click "Save Changes"
6. Check Supabase - your bio should be saved!

### Test 7: Search Users
1. Click "Search Users" button on home
2. Type your username
3. You should see yourself in results!

## 🎨 What to Look For

### Good Signs ✅
- No console errors (press F12 → Console)
- Smooth animations
- Pages load quickly
- Wallet connects successfully
- Data saves to Supabase

### Issues to Watch ❌
- Console errors (red text in F12 console)
- Blank pages
- "Cannot connect to API" errors
- Wallet connection fails

## 🐛 If Something Breaks

### Frontend Issues
```bash
# Check frontend logs
# Look at the terminal running frontend
# Should see Vite output
```

### Backend Issues
```bash
# Check backend logs
# Look at the terminal running backend
# Should see "✅ Connected to Supabase"
```

### Database Issues
```bash
cd backend
npm run test:supabase
```

## 🚀 Advanced Testing (With Wallet)

### Test Send Money (Requires USDC on Fuji)
1. Get test AVAX: https://faucet.avax.network/
2. Swap for USDC on Trader Joe
3. Go to Send tab
4. Enter @username
5. Enter amount
6. Add note with emoji
7. Click Send
8. Approve in wallet
9. See confetti! 🎉

### Test Request Money
1. Go to Request tab
2. Click "Create"
3. Enter @username
4. Enter amount
5. Add note
6. Send request
7. Check "Sent" tab - should see your request!

### Test Split Bill
1. Go to Split Bill
2. Enter total amount
3. Add participants (search for users)
4. Click "Split Evenly"
5. Send requests
6. See success screen!

## 📊 Success Criteria

You've successfully tested if:
- ✅ All pages load
- ✅ Wallet connects
- ✅ Username saves to database
- ✅ No console errors
- ✅ Navigation works
- ✅ Forms submit successfully

## 🎉 Next Steps

1. **Get Real Telegram Bot** (optional but recommended)
   - Message @BotFather
   - Create bot
   - Update backend/.env

2. **Get WalletConnect Project ID**
   - Go to https://cloud.walletconnect.com
   - Create project
   - Update frontend/.env

3. **Get Test USDC**
   - Faucet: https://faucet.avax.network/
   - Swap on Trader Joe

4. **Test Real Transactions**
   - Send money to yourself
   - Create payment requests
   - Split bills with friends

---

**Happy Testing!** 🚀

Found a bug? Check the console (F12) for error messages.
