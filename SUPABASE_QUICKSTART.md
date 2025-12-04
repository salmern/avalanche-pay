# 🚀 Supabase Quick Setup for Avalanche Pay

## ✅ Your Supabase is Already Configured!

Your `.env` file already has:
- ✅ SUPABASE_URL
- ✅ SUPABASE_KEY

## 📝 Next Steps

### 1. Create Database Tables

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/wjiokcowakfsnwsohkrt
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire contents of `SUPABASE_SETUP.sql`
5. Click **Run** (or press Ctrl+Enter)
6. You should see: "Success. No rows returned"

### 2. Verify Tables Created

1. Go to **Table Editor** in the left sidebar
2. You should see 4 tables:
   - `users`
   - `transactions`
   - `payment_requests`
   - `reactions`

### 3. Start the Backend

```bash
cd backend
npm run dev
```

You should see:
```
✅ Connected to Supabase database
📍 Supabase URL: https://wjiokcowakfsnwsohkrt.supabase.co
🚀 Avalanche Pay API running on port 4000
📱 Telegram bot active
```

## 🔧 Troubleshooting

### Error: "relation 'users' does not exist"
- You need to run the SQL setup in Supabase SQL Editor
- Make sure you ran ALL the SQL from `SUPABASE_SETUP.sql`

### Error: "supabaseUrl is required"
- Check that your `.env` file has SUPABASE_URL and SUPABASE_KEY
- Make sure you're in the `backend` directory when running `npm run dev`

### Error: "Invalid API key"
- Your SUPABASE_KEY might be wrong
- Go to Supabase Dashboard → Settings → API
- Copy the "anon public" key (not the service_role key)

## 📊 Database Schema

### users
- `telegram_id` - Telegram user ID
- `username` - @username
- `wallet_address` - Avalanche wallet
- `bio` - User bio (optional)
- `avatar` - Avatar emoji (optional)
- `privacy` - public/friends/private

### transactions
- `from_address`, `to_address` - Wallet addresses
- `from_username`, `to_username` - Usernames
- `amount`, `token` - Amount and token type
- `note` - Payment note (optional)
- `privacy` - Transaction visibility

### payment_requests
- `from_username`, `to_username` - Request parties
- `amount`, `note` - Request details
- `status` - pending/paid/declined/cancelled

### reactions
- `transaction_id` - Reference to transaction
- `username` - Who reacted
- `emoji` - Reaction emoji

## 🎉 You're Ready!

Once tables are created, your backend will work perfectly with Supabase!

---

**Need help?** Check the Supabase docs: https://supabase.com/docs
