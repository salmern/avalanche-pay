# 🔧 Fix "Please set a Telegram username first" Error

## The Problem

You're seeing this error:
```
Please set a Telegram username first
(@username in Telegram settings)
```

This means you don't have a Telegram username yet.

---

## The Solution (2 minutes)

### Step 1: Set Your Telegram Username

#### On Mobile (Telegram App):

1. **Open Telegram**
2. **Tap the menu** (☰ three lines, usually bottom right)
3. **Tap "Settings"**
4. **Tap your name** at the top
5. **Tap "Username"**
6. **Enter a username** (e.g., `alice`, `bob123`, `yourname`)
   - Must be 5-32 characters
   - Can use a-z, 0-9, and underscores
   - Must be unique (not taken by someone else)
7. **Tap the checkmark** ✓ to save

#### On Desktop (Telegram Desktop):

1. **Open Telegram Desktop**
2. **Click the menu** (☰ three lines, top left)
3. **Click "Settings"**
4. **Click "Edit Profile"**
5. **Find "Username" field**
6. **Enter a username** (e.g., `alice`, `bob123`, `yourname`)
7. **Click "Save"**

#### On Web (Telegram Web):

1. **Go to** https://web.telegram.org
2. **Click the menu** (☰ three lines)
3. **Click "Settings"**
4. **Click your name**
5. **Click "Username"**
6. **Enter a username**
7. **Save**

---

### Step 2: Verify Your Username

After setting your username, you should see it displayed as:
```
@yourname
```

For example:
- `@alice`
- `@bob123`
- `@john_doe`

---

### Step 3: Try Again in Avalanche Pay

1. **Refresh the app** (Ctrl+Shift+R)
2. **Click "Set My Username"** again
3. **It should now work!** ✅

The button should now show:
```
Set My Username (@yourname)
```

---

## Why This Is Required

Avalanche Pay uses your Telegram username to:
- Let people send you money by typing `@yourname`
- Link your Telegram account to your wallet
- Send you notifications when you receive money

Without a username, people would need to know your wallet address (0x123...) which is hard to remember!

---

## Username Requirements

✅ **Good usernames:**
- `alice`
- `bob123`
- `john_doe`
- `crypto_user`
- `avax_fan`

❌ **Not allowed:**
- Less than 5 characters
- Special characters (except underscore)
- Spaces
- Already taken by someone else

---

## Troubleshooting

### "Username is already taken"

Try a different username:
- Add numbers: `alice123`
- Add underscore: `alice_crypto`
- Be creative: `alice_avax_pay`

### "Username is too short"

Must be at least 5 characters:
- ❌ `bob` (too short)
- ✅ `bob123` (good)

### "Can't find username setting"

**Mobile:**
Settings → Tap your name → Username

**Desktop:**
Settings → Edit Profile → Username

---

## After Setting Username

Once you have a username:

1. ✅ **Refresh Avalanche Pay**
2. ✅ **Click "Set My Username (@yourname)"**
3. ✅ **Confirm the transaction**
4. ✅ **Done!**

Now people can send you money by typing `@yourname` instead of your long wallet address!

---

## Visual Guide

### What You'll See:

**Before (No Username):**
```
┌─────────────────────────────────┐
│ ⚠️ Please set a Telegram        │
│    username first               │
│    (@username in Telegram       │
│    settings)                    │
└─────────────────────────────────┘
```

**After (Username Set):**
```
┌─────────────────────────────────┐
│ [Set My Username (@alice)]      │
└─────────────────────────────────┘
```

**After Clicking:**
```
┌─────────────────────────────────┐
│ ✅ Username @alice set          │
│    successfully!                │
└─────────────────────────────────┘
```

---

## Quick Steps Summary

1. Open Telegram Settings
2. Set a username (e.g., @alice)
3. Save it
4. Refresh Avalanche Pay
5. Click "Set My Username"
6. Done! ✅

---

## Still Having Issues?

### Error: "Failed to set username"

**Check:**
1. Backend is running: `cd backend && npm run dev`
2. PostgreSQL is running: `pg_isready`
3. Database exists: `psql -U postgres -l | grep avalanche_pay`

**Fix:**
```bash
# Start PostgreSQL
sudo systemctl start postgresql

# Create database
sudo -u postgres psql -c "CREATE DATABASE avalanche_pay;"

# Restart backend
cd backend
npm run dev
```

### Error: "Connect wallet first"

You need to connect your wallet before setting username:
1. Click "Connect Wallet"
2. Choose wallet (MetaMask/Core)
3. Approve connection
4. Then click "Set My Username"

---

## Example Flow

### Alice's Setup:

1. **Alice opens Telegram Settings**
2. **Sets username: `alice`**
3. **Now she's @alice**
4. **Opens Avalanche Pay**
5. **Connects wallet**
6. **Clicks "Set My Username (@alice)"**
7. **Confirms transaction**
8. **Done!**

Now Bob can send Alice money by typing `@alice` instead of her wallet address!

---

**TL;DR: Go to Telegram Settings → Set a username → Try again!** 🚀
