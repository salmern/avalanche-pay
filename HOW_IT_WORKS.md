# 🎯 How Avalanche Pay Works

## Complete System Overview

Avalanche Pay is a Telegram Mini App that lets users send USDC to each other using just their Telegram username. Here's how everything works together:

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    USER'S PHONE                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │              TELEGRAM APP                           │ │
│  │  ┌──────────────────────────────────────────────┐  │ │
│  │  │     Avalanche Pay Mini App (React)           │  │ │
│  │  │  • Home screen with balance                  │  │ │
│  │  │  • Send money page                           │  │ │
│  │  │  • Receive with QR code                      │  │ │
│  │  │  • Transaction history                       │  │ │
│  │  └──────────────────────────────────────────────┘  │ │
│  │                      ↕                              │ │
│  │  ┌──────────────────────────────────────────────┐  │ │
│  │  │     Telegram Bot (@AvalanchePayBot)          │  │ │
│  │  │  • Sends notifications                       │  │ │
│  │  │  • Handles /start command                    │  │ │
│  │  │  • Quick send: "send @user 25"               │  │ │
│  │  └──────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────┘ │
│                      ↕                                   │
│  ┌────────────────────────────────────────────────────┐ │
│  │         USER'S WALLET (MetaMask/Core)              │ │
│  │  • Stores private keys                             │ │
│  │  • Signs transactions                              │ │
│  │  • Connected via WalletConnect                     │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                  YOUR SERVER                             │
│  ┌────────────────────────────────────────────────────┐ │
│  │         Backend API (Express + Node.js)            │ │
│  │  • User management endpoints                       │ │
│  │  • Transaction tracking                            │ │
│  │  • Telegram bot logic                              │ │
│  │  • Balance queries                                 │ │
│  └────────────────────────────────────────────────────┘ │
│                      ↕                                   │
│  ┌────────────────────────────────────────────────────┐ │
│  │         PostgreSQL Database                        │ │
│  │  • users table (telegram_id ↔ username ↔ wallet)  │ │
│  │  • transactions table (history)                    │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│              AVALANCHE BLOCKCHAIN                        │
│  • USDC smart contract                                  │
│  • User wallets (EOAs)                                  │
│  • Transaction settlement                               │
│  • Sub-second finality                                  │
└─────────────────────────────────────────────────────────┘
```

---

## 📱 Complete User Flow

### **Step 1: First Time Setup**

1. **User opens Telegram**
   - Searches for `@AvalanchePayBot`
   - Sends `/start`

2. **Bot responds with:**
   ```
   🚀 Welcome to Avalanche Pay!
   
   The fastest way to send money globally.
   
   ✨ Features:
   • Send money by username
   • <800ms settlement
   • <$0.001 fees
   • Powered by Avalanche
   
   Open the app to get started! 👇
   [Open Avalanche Pay Button]
   ```

3. **User clicks "Open Avalanche Pay"**
   - Telegram opens the Mini App (React app)
   - App loads inside Telegram (no external browser)
   - Shows home screen with $0 balance

4. **User clicks "Connect Wallet"**
   - WalletConnect modal opens
   - User chooses wallet (MetaMask, Core, etc.)
   - Wallet app opens
   - User approves connection
   - App now shows wallet address and balance

5. **User clicks "Set My Username"**
   - App reads Telegram username from Telegram SDK
   - Sends to backend: `POST /api/users/set-username`
   - Backend saves: `telegram_id ↔ @username ↔ wallet_address`
   - Database now has the mapping
   - User sees: "Username @yourname set successfully!"

**Now the user is ready to send and receive money!**

---

### **Step 2: Sending Money**

1. **User goes to Send tab**
   - Enters recipient: `@friend`
   - Enters amount: `25`
   - Sees fee: `~$0.003`

2. **User clicks "Send $25 USDC"**
   - Frontend calls: `GET /api/users/username/friend`
   - Backend looks up friend's wallet address
   - Frontend creates transaction:
     ```typescript
     writeContract({
       address: USDC_CONTRACT,
       functionName: 'transfer',
       args: [friendWalletAddress, amount]
     })
     ```

3. **Wallet opens for confirmation**
   - Shows: "Transfer 25 USDC to 0x123..."
   - User approves
   - Transaction submitted to Avalanche

4. **Transaction settles (<800ms)**
   - Avalanche confirms transaction
   - Frontend shows success screen with confetti! 🎉
   - Shows: Speed (650ms), Fee ($0.003)

5. **Backend sends notification**
   - Frontend calls: `POST /api/notify`
   - Backend uses Telegram Bot API:
     ```typescript
     bot.sendMessage(friendTelegramId, 
       "You received $25 USDC from @yourname!"
     )
     ```

6. **Friend gets push notification**
   - Telegram notification appears
   - Friend clicks it
   - Opens Avalanche Pay
   - Sees updated balance: $25

---

### **Step 3: Receiving Money**

1. **User goes to Receive tab**
   - Sees QR code with wallet address
   - Sees username: `@yourname`
   - Sees payment link: `t.me/AvalanchePayBot?start=pay_yourname`

2. **User shares QR code or link**
   - Friend scans QR code
   - OR clicks payment link
   - Opens Avalanche Pay
   - Pre-filled with recipient

3. **Friend sends money**
   - Follows send flow above
   - User gets notification
   - Balance updates automatically

---

### **Step 4: Viewing History**

1. **User goes to History tab**
   - Frontend calls: `GET /api/transactions/walletAddress`
   - Backend queries database
   - Returns all transactions (sent + received)

2. **User sees list of transactions**
   - Each shows: Sent/Received, Amount, Date
   - Click "View on Explorer" → Opens Snowtrace
   - Can verify transaction on blockchain

---

## 🤖 Telegram Bot Features

### **1. Welcome Message (/start)**

When user sends `/start`:

```typescript
bot.onText(/\/start/, async (msg) => {
  await bot.sendMessage(chatId, 
    `🚀 *Welcome to Avalanche Pay!*
    
    The fastest way to send money globally.
    
    ✨ Features:
    • Send money by username
    • <800ms settlement
    • <$0.001 fees
    • Powered by Avalanche
    
    Open the app to get started! 👇`,
    {
      reply_markup: {
        inline_keyboard: [[
          {
            text: '🚀 Open Avalanche Pay',
            web_app: { url: 'https://your-app.vercel.app' }
          }
        ]]
      }
    }
  )
})
```

### **2. Quick Send Command**

User can type in Telegram chat:
```
send @friend 25
```

Bot responds with inline button:
```
💸 Send $25 USDC to @friend?
[✅ Send $25 USDC Button]
```

Clicking button opens Mini App with pre-filled send form.

### **3. Push Notifications**

When someone sends you money:

```typescript
// Backend sends notification
await bot.sendMessage(recipientTelegramId, 
  `💰 You received $${amount} USDC from @${senderUsername}!
  
  Tap to view in Avalanche Pay 👇`,
  {
    reply_markup: {
      inline_keyboard: [[
        {
          text: '👀 View Transaction',
          web_app: { url: 'https://your-app.vercel.app' }
        }
      ]]
    }
  }
)
```

---

## 🔐 How Wallet Connection Works

### **WalletConnect v2 Flow**

1. **User clicks "Connect Wallet"**
   ```typescript
   web3Modal.open()
   ```

2. **WalletConnect modal shows**
   - QR code for desktop
   - Deep links for mobile
   - List of supported wallets

3. **User chooses wallet**
   - MetaMask, Core, Trust Wallet, etc.
   - Wallet app opens

4. **Wallet prompts for approval**
   - Shows: "Avalanche Pay wants to connect"
   - Shows: Permissions requested
   - User approves

5. **Connection established**
   - App receives wallet address
   - Can now read balance
   - Can request transaction signatures

6. **Signing transactions**
   ```typescript
   // App requests signature
   const hash = await writeContract({
     address: USDC_ADDRESS,
     functionName: 'transfer',
     args: [to, amount]
   })
   
   // Wallet prompts user
   // User approves
   // Transaction submitted
   ```

### **Disconnect Wallet**

1. **User clicks "Disconnect"**
   ```typescript
   disconnect()
   ```

2. **Connection closed**
   - Wallet address cleared
   - User can connect different wallet
   - Data in database remains (username mapping)

---

## 💾 Database Schema

### **Users Table**

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,    -- Telegram user ID
  username TEXT UNIQUE NOT NULL,          -- @username
  wallet_address TEXT NOT NULL,           -- 0x123...
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Example data:**
```
id | telegram_id | username    | wallet_address
1  | 123456789   | alice       | 0xabc...
2  | 987654321   | bob         | 0xdef...
```

### **Transactions Table**

```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  from_address TEXT NOT NULL,             -- Sender wallet
  to_address TEXT NOT NULL,               -- Recipient wallet
  amount TEXT NOT NULL,                   -- Amount in USDC
  token TEXT DEFAULT 'USDC',
  tx_hash TEXT,                           -- Blockchain tx hash
  status TEXT DEFAULT 'pending',          -- pending/completed/failed
  fee TEXT DEFAULT '0',
  timestamp TIMESTAMP DEFAULT NOW()
);
```

**Example data:**
```
id | from_address | to_address | amount | tx_hash    | status
1  | 0xabc...     | 0xdef...   | 25     | 0x789...   | completed
```

---

## 🔄 API Endpoints

### **User Management**

#### `POST /api/users/set-username`
```typescript
// Request
{
  telegram_id: 123456789,
  username: "alice",
  wallet_address: "0xabc..."
}

// Response
{
  id: 1,
  telegram_id: 123456789,
  username: "alice",
  wallet_address: "0xabc...",
  created_at: "2025-11-27T..."
}
```

#### `GET /api/users/:telegram_id`
```typescript
// Request
GET /api/users/123456789

// Response
{
  id: 1,
  telegram_id: 123456789,
  username: "alice",
  wallet_address: "0xabc..."
}
```

#### `GET /api/users/username/:username`
```typescript
// Request
GET /api/users/username/alice

// Response
{
  id: 1,
  telegram_id: 123456789,
  username: "alice",
  wallet_address: "0xabc..."
}
```

### **Transactions**

#### `POST /api/transactions/create`
```typescript
// Request
{
  from_address: "0xabc...",
  to_address: "0xdef...",
  amount: "25",
  token: "USDC"
}

// Response
{
  transactionId: 1,
  intentData: { ... }
}
```

#### `GET /api/transactions/:wallet_address`
```typescript
// Request
GET /api/transactions/0xabc...

// Response
[
  {
    id: 1,
    from_address: "0xabc...",
    to_address: "0xdef...",
    amount: "25",
    tx_hash: "0x789...",
    status: "completed",
    timestamp: "2025-11-27T..."
  }
]
```

### **Balance**

#### `GET /api/balance/:wallet_address`
```typescript
// Request
GET /api/balance/0xabc...

// Response
{
  usdc: "100.50",
  avax: "2.5"
}
```

### **Notifications**

#### `POST /api/notify`
```typescript
// Request
{
  telegram_id: 123456789,
  message: "You received $25 USDC from @alice!"
}

// Response
{
  success: true
}
```

---

## ⚡ x402 Intent System

### **What are x402 Intents?**

Instead of directly executing transactions, users sign "intents" that describe what they want to do. A solver network then executes these intents optimally.

### **Intent Structure (ERC-7730)**

```typescript
interface Intent {
  from: string        // Sender address
  to: string          // Recipient address
  token: string       // USDC contract address
  amount: string      // Amount to send
  chainId: number     // 43113 (Fuji)
  deadline: number    // Expiry timestamp
  nonce: string       // Unique ID
}
```

### **How it works:**

1. **User wants to send $25**
   ```typescript
   const intent = createIntent(
     senderAddress,
     recipientAddress,
     "25",
     USDC_ADDRESS,
     43113
   )
   ```

2. **User signs intent**
   ```typescript
   const signature = await wallet.signMessage(
     encodeIntent(intent)
   )
   ```

3. **Intent submitted to solver**
   ```typescript
   const result = await executeIntent(intent, signature)
   ```

4. **Solver executes transfer**
   - Validates intent + signature
   - Executes USDC transfer
   - Returns transaction hash
   - All in <800ms!

### **Benefits:**

- ✅ **Gasless** - Solver pays gas
- ✅ **Fast** - Optimized execution
- ✅ **Cheap** - Batched transactions
- ✅ **MEV Protection** - No front-running
- ✅ **Cross-chain ready** - Future expansion

---

## 🎯 Complete Example: Alice sends $25 to Bob

### **1. Setup (One-time)**

**Alice:**
1. Opens @AvalanchePayBot
2. Clicks "Open Avalanche Pay"
3. Connects MetaMask wallet (0xabc...)
4. Sets username: @alice
5. Database: `telegram_id: 111 ↔ @alice ↔ 0xabc...`

**Bob:**
1. Opens @AvalanchePayBot
2. Connects Core wallet (0xdef...)
3. Sets username: @bob
4. Database: `telegram_id: 222 ↔ @bob ↔ 0xdef...`

### **2. Alice sends money**

1. **Alice opens Send tab**
   - Types: `@bob`
   - Types: `25`
   - Clicks "Send $25 USDC"

2. **Frontend looks up Bob**
   ```typescript
   GET /api/users/username/bob
   // Returns: { wallet_address: "0xdef..." }
   ```

3. **Frontend creates transaction**
   ```typescript
   writeContract({
     address: USDC_ADDRESS,
     functionName: 'transfer',
     args: ["0xdef...", parseUnits("25", 6)]
   })
   ```

4. **MetaMask prompts Alice**
   - Shows: "Transfer 25 USDC"
   - Alice approves

5. **Transaction submitted**
   - Sent to Avalanche network
   - Confirmed in 650ms
   - Returns tx hash: `0x789...`

6. **Frontend shows success**
   - Confetti animation! 🎉
   - Shows speed: 650ms
   - Shows fee: $0.003

7. **Backend notifies Bob**
   ```typescript
   POST /api/notify
   {
     telegram_id: 222,
     message: "You received $25 USDC from @alice!"
   }
   ```

8. **Bob gets notification**
   - Telegram push notification
   - "💰 You received $25 USDC from @alice!"
   - Clicks notification
   - Opens Avalanche Pay
   - Sees balance: $25

### **3. Verification**

**Alice checks history:**
- Sees: "Sent $25 to @bob"
- Clicks "View on Explorer"
- Opens Snowtrace
- Sees confirmed transaction

**Bob checks history:**
- Sees: "Received $25 from @alice"
- Balance updated: $25

**Database:**
```sql
SELECT * FROM transactions;
-- Shows: from=0xabc, to=0xdef, amount=25, status=completed
```

**Blockchain:**
```
Transaction 0x789...
From: 0xabc...
To: 0xdef...
Value: 25 USDC
Status: Success ✅
```

---

## 🔧 Troubleshooting Common Issues

### **"Set username not working"**

**Problem:** User doesn't have Telegram username

**Solution:**
1. Open Telegram settings
2. Go to "Username"
3. Set a username (e.g., @alice)
4. Return to Avalanche Pay
5. Click "Set My Username" again

### **"Wallet won't connect"**

**Problem:** Wrong network

**Solution:**
1. Open wallet
2. Switch to "Avalanche Fuji C-Chain"
3. Network details:
   - RPC: https://api.avax-test.network/ext/bc/C/rpc
   - Chain ID: 43113
   - Symbol: AVAX

### **"Balance shows $0"**

**Problem:** No USDC in wallet

**Solution:**
1. Get test AVAX: https://faucet.avax.network
2. Swap for USDC on Trader Joe
3. Refresh Avalanche Pay

### **"Transaction failed"**

**Problem:** Insufficient gas or USDC

**Solution:**
1. Check AVAX balance (need ~0.001 for gas)
2. Check USDC balance
3. Try again

---

## 📚 Key Files to Understand

### **Frontend**

- `src/pages/Home.tsx` - Main screen, wallet connection, username setup
- `src/pages/Send.tsx` - Send money flow
- `src/lib/wallet.ts` - WalletConnect configuration
- `src/lib/x402.ts` - Intent creation
- `src/lib/telegram.ts` - Telegram SDK integration
- `src/lib/api.ts` - Backend API client

### **Backend**

- `src/index.ts` - Express server + Telegram bot
- `src/db.ts` - PostgreSQL connection + table creation

---

**Now you understand how everything works together! 🎉**
