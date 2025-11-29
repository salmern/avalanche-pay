# 🧪 Testing Guide - Avalanche Pay

## Quick Test Checklist

### Pre-Launch Tests
- [ ] Wallet connection works
- [ ] Username setup works
- [ ] Balance displays correctly
- [ ] Send transaction completes
- [ ] Receive notification arrives
- [ ] Transaction history shows
- [ ] QR code generates
- [ ] Payment link works
- [ ] Bot commands respond
- [ ] All pages load correctly

## Local Testing

### 1. Setup Test Environment

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your test credentials

# Start backend
cd backend
npm run dev

# Start frontend (new terminal)
cd frontend
npm run dev
```

### 2. Test Wallet Connection

1. Open http://localhost:3000
2. Click "Connect Wallet"
3. Choose MetaMask/Core
4. Switch to Fuji testnet
5. Approve connection
6. Verify balance displays

### 3. Test Username Setup

1. Ensure you have Telegram username
2. Click "Set My Username"
3. Confirm transaction
4. Verify success message
5. Check Supabase database for entry

### 4. Test Send Flow

**Setup:**
- Create two test accounts
- Fund both with test USDC
- Set usernames for both

**Test:**
1. Account A: Go to Send
2. Enter Account B username
3. Enter amount: 5 USDC
4. Click Send
5. Confirm in wallet
6. Verify success screen shows
7. Check Account B receives notification
8. Verify Account B balance updated
9. Check transaction in history

### 5. Test Receive Flow

1. Go to Receive tab
2. Verify QR code displays
3. Copy wallet address
4. Copy payment link
5. Test share button (mobile)
6. Scan QR code from another device

### 6. Test Transaction History

1. Make 3-5 test transactions
2. Go to History tab
3. Verify all transactions show
4. Check sent/received indicators
5. Click explorer link
6. Verify opens Snowtrace

## Telegram Bot Testing

### 1. Test Bot Commands

```
/start
```
Expected: Welcome message with "Open App" button

```
send @testuser 25
```
Expected: Inline button to send $25

### 2. Test Mini App Launch

1. Click "Open Avalanche Pay" button
2. Verify app loads in Telegram
3. Check Telegram user data available
4. Test back button navigation

### 3. Test Notifications

1. Send money to test account
2. Verify notification arrives
3. Check notification format
4. Test notification click action

## API Testing

### Test Endpoints

```bash
# Health check
curl http://localhost:4000/health

# Get user
curl http://localhost:4000/api/users/123456789

# Get balance
curl http://localhost:4000/api/balance/0xYourAddress

# Get transactions
curl http://localhost:4000/api/transactions/0xYourAddress
```

## Performance Testing

### Transaction Speed Test

```javascript
// Run this in browser console
const startTime = Date.now()
// Execute transaction
// On success:
const endTime = Date.now()
console.log(`Transaction time: ${endTime - startTime}ms`)
// Target: <800ms
```

### Load Testing

```bash
# Install artillery
npm install -g artillery

# Create test file: load-test.yml
# Run load test
artillery run load-test.yml
```

## Security Testing

### 1. Check Environment Variables
- [ ] No private keys in code
- [ ] All secrets in .env
- [ ] .env in .gitignore
- [ ] Production uses different keys

### 2. Test Wallet Security
- [ ] Private keys never leave wallet
- [ ] Signing happens client-side
- [ ] No sensitive data in localStorage
- [ ] HTTPS only in production

### 3. Test API Security
- [ ] CORS configured correctly
- [ ] Rate limiting works
- [ ] Input validation works
- [ ] SQL injection prevented

## Edge Cases

### Test These Scenarios

1. **Insufficient Balance**
   - Try to send more than balance
   - Expected: Error message

2. **Invalid Username**
   - Send to non-existent user
   - Expected: "User not found"

3. **Network Failure**
   - Disconnect internet mid-transaction
   - Expected: Graceful error handling

4. **Wallet Disconnection**
   - Disconnect wallet during send
   - Expected: Prompt to reconnect

5. **Duplicate Username**
   - Try to set existing username
   - Expected: Error message

6. **Zero Amount**
   - Try to send $0
   - Expected: Validation error

7. **Very Large Amount**
   - Try to send $1,000,000
   - Expected: Works or shows limit

8. **Special Characters**
   - Username with special chars
   - Expected: Validation or sanitization

## Mobile Testing

### iOS Testing
1. Open Telegram on iPhone
2. Test all features
3. Check touch targets (min 44px)
4. Test landscape mode
5. Test on different screen sizes

### Android Testing
1. Open Telegram on Android
2. Test all features
3. Check back button behavior
4. Test on different devices
5. Test different Android versions

## Browser Testing

Test on:
- [ ] Chrome (desktop & mobile)
- [ ] Safari (desktop & mobile)
- [ ] Firefox
- [ ] Edge
- [ ] Telegram in-app browser

## Database Testing

### Check Supabase

```sql
-- Check users table
SELECT * FROM users LIMIT 10;

-- Check transactions table
SELECT * FROM transactions ORDER BY timestamp DESC LIMIT 10;

-- Check for duplicates
SELECT username, COUNT(*) FROM users GROUP BY username HAVING COUNT(*) > 1;

-- Check transaction stats
SELECT 
  COUNT(*) as total_transactions,
  SUM(CAST(amount AS DECIMAL)) as total_volume,
  AVG(CAST(fee AS DECIMAL)) as avg_fee
FROM transactions
WHERE status = 'completed';
```

## Deployment Testing

### After Deploying to Vercel

1. Test production URL
2. Check environment variables
3. Test wallet connection
4. Make real transaction
5. Check logs for errors
6. Test from different locations
7. Test on mobile devices

### After Deploying to Railway

1. Check backend health endpoint
2. Test API endpoints
3. Check bot responds
4. Monitor logs
5. Test database connection
6. Check memory usage

## Monitoring

### Setup Monitoring

```javascript
// Add to frontend
window.onerror = function(msg, url, line, col, error) {
  console.error('Error:', { msg, url, line, col, error })
  // Send to monitoring service
}

// Add to backend
app.use((err, req, res, next) => {
  console.error('API Error:', err)
  // Send to monitoring service
  res.status(500).json({ error: 'Internal server error' })
})
```

### Key Metrics to Monitor

- Transaction success rate
- Average transaction time
- API response times
- Error rates
- User signups
- Daily active users
- Transaction volume

## Troubleshooting Common Issues

### Wallet Won't Connect
```
Solution:
1. Check WalletConnect project ID
2. Verify network is Fuji
3. Clear browser cache
4. Try different wallet
```

### Transaction Fails
```
Solution:
1. Check USDC balance
2. Check AVAX for gas
3. Verify recipient exists
4. Check Snowtrace for details
```

### Bot Not Responding
```
Solution:
1. Check bot token
2. Verify Railway is running
3. Check backend logs
4. Test bot with /start
```

### Balance Not Updating
```
Solution:
1. Check RPC endpoint
2. Verify contract address
3. Check wallet address format
4. Refresh page
```

## Pre-Demo Checklist

24 Hours Before:
- [ ] Test complete flow 3 times
- [ ] Check all accounts have USDC
- [ ] Verify notifications work
- [ ] Test on actual devices
- [ ] Check internet connection
- [ ] Charge all devices
- [ ] Have backup plan ready

1 Hour Before:
- [ ] Test one more time
- [ ] Clear notification history
- [ ] Close unnecessary apps
- [ ] Check device battery
- [ ] Have backup device ready
- [ ] Review demo script

## Success Criteria

### Minimum Viable Demo
- ✅ Wallet connects
- ✅ Username sets
- ✅ Transaction completes
- ✅ Notification arrives
- ✅ Balance updates

### Perfect Demo
- ✅ All above +
- ✅ <800ms transaction time
- ✅ Beautiful animations
- ✅ No errors or warnings
- ✅ Smooth navigation
- ✅ Professional presentation

---

**Test thoroughly, demo confidently! 🚀**
