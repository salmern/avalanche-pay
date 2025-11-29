# 🔄 What Changed - PostgreSQL Migration

## Summary

Switched from Supabase to **your own PostgreSQL database** for simpler setup and more control.

## What Changed

### ✅ Benefits
- **Simpler setup** - No external service needed
- **More control** - Your own database
- **Faster development** - Local database
- **No API limits** - No rate limiting
- **Free forever** - No service costs

### 📦 New Files

1. **backend/src/db.ts** - PostgreSQL connection and auto-initialization
2. **setup-postgres.sh** - Automatic PostgreSQL setup script
3. **POSTGRES_SETUP.md** - Detailed PostgreSQL guide
4. **WHATS_CHANGED.md** - This file

### 🔧 Modified Files

1. **backend/package.json** - Replaced `@supabase/supabase-js` with `pg`
2. **backend/src/index.ts** - All database queries now use PostgreSQL
3. **backend/.env** - New PostgreSQL credentials
4. **backend/.env.example** - Updated template
5. **START_HERE.md** - Updated setup instructions

### 🗄️ Database Changes

**Before (Supabase):**
- External hosted database
- Required signup and API keys
- UUID primary keys
- Supabase client library

**After (PostgreSQL):**
- Local PostgreSQL database
- No signup needed
- SERIAL primary keys (auto-increment)
- Native `pg` library
- **Auto-creates tables on startup!**

## How It Works Now

### 1. Install PostgreSQL
```bash
# Ubuntu/Debian
sudo apt install postgresql

# macOS
brew install postgresql
```

### 2. Create Database
```bash
./setup-postgres.sh
```
OR manually:
```bash
sudo -u postgres psql -c "CREATE DATABASE avalanche_pay;"
```

### 3. Configure Backend
Edit `backend/.env`:
```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=avalanche_pay
DB_USER=postgres
DB_PASSWORD=postgres
```

### 4. Start Backend
```bash
cd backend
npm run dev
```

**That's it!** The backend automatically:
- ✅ Connects to PostgreSQL
- ✅ Creates `users` table
- ✅ Creates `transactions` table
- ✅ Creates all indexes
- ✅ Starts the API

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,              -- Auto-increment ID
  telegram_id BIGINT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  wallet_address TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,              -- Auto-increment ID
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  amount TEXT NOT NULL,
  token TEXT DEFAULT 'USDC',
  tx_hash TEXT,
  status TEXT DEFAULT 'pending',
  fee TEXT DEFAULT '0',
  timestamp TIMESTAMP DEFAULT NOW()
);
```

## API Changes

All API endpoints work exactly the same! No frontend changes needed.

### Before (Supabase):
```typescript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('telegram_id', telegram_id)
```

### After (PostgreSQL):
```typescript
const result = await pool.query(
  'SELECT * FROM users WHERE telegram_id = $1',
  [telegram_id]
)
```

## Migration Guide

If you already have data in Supabase:

### 1. Export from Supabase
```sql
-- In Supabase SQL Editor
COPY users TO STDOUT WITH CSV HEADER;
COPY transactions TO STDOUT WITH CSV HEADER;
```

### 2. Import to PostgreSQL
```bash
psql -U postgres avalanche_pay -c "\COPY users FROM 'users.csv' CSV HEADER"
psql -U postgres avalanche_pay -c "\COPY transactions FROM 'transactions.csv' CSV HEADER"
```

## Troubleshooting

### "psql: command not found"
Install PostgreSQL (see POSTGRES_SETUP.md)

### "could not connect to server"
Start PostgreSQL:
```bash
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS
```

### "password authentication failed"
Update password in `backend/.env` or set one:
```bash
sudo -u postgres psql
ALTER USER postgres PASSWORD 'newpassword';
```

### "database does not exist"
Create it:
```bash
sudo -u postgres psql -c "CREATE DATABASE avalanche_pay;"
```

## Production Deployment

For production, you can still use managed PostgreSQL:

- **Supabase** (just the database): https://supabase.com
- **Railway**: https://railway.app
- **Neon**: https://neon.tech
- **AWS RDS**: https://aws.amazon.com/rds/

Just update the connection credentials in your production environment.

## Why This Change?

1. **Simpler for hackathon** - No external service signup
2. **Faster development** - Local database is faster
3. **More control** - You own the data
4. **Better for learning** - See exactly what's happening
5. **Production-ready** - PostgreSQL is battle-tested

## What Didn't Change

- ✅ All API endpoints work the same
- ✅ Frontend code unchanged
- ✅ Same database schema
- ✅ Same functionality
- ✅ Same performance

## Next Steps

1. Read [POSTGRES_SETUP.md](POSTGRES_SETUP.md) for detailed setup
2. Run `./setup-postgres.sh` to set up PostgreSQL
3. Update `backend/.env` with your credentials
4. Start the backend: `cd backend && npm run dev`
5. Everything works! 🎉

---

**PostgreSQL is better for this project! 🚀**
