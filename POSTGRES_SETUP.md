# 🗄️ PostgreSQL Setup Guide

## Quick Setup (2 minutes)

### Option 1: Automatic Setup (Linux/macOS)

```bash
./setup-postgres.sh
```

This will:
- Check if PostgreSQL is installed
- Start PostgreSQL if needed
- Create the `avalanche_pay` database
- Show you the credentials

### Option 2: Manual Setup

#### 1. Install PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Arch Linux:**
```bash
sudo pacman -S postgresql
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

**Windows:**
Download from https://www.postgresql.org/download/windows/

#### 2. Start PostgreSQL

**Linux:**
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql  # Start on boot
```

**macOS:**
```bash
brew services start postgresql
```

#### 3. Create Database

**Linux:**
```bash
sudo -u postgres psql
```

**macOS/Windows:**
```bash
psql -U postgres
```

Then in the PostgreSQL prompt:
```sql
CREATE DATABASE avalanche_pay;
\q
```

#### 4. Update Environment Variables

Edit `backend/.env`:
```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=avalanche_pay
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```

**Note:** On Linux, the default postgres user might not have a password. You can set one:
```bash
sudo -u postgres psql
ALTER USER postgres PASSWORD 'your_new_password';
\q
```

#### 5. Test Connection

```bash
psql -U postgres -d avalanche_pay -c "SELECT version();"
```

You should see the PostgreSQL version.

## What Happens When You Start the Backend

The backend will automatically:
1. ✅ Connect to PostgreSQL
2. ✅ Create the `users` table
3. ✅ Create the `transactions` table
4. ✅ Create all necessary indexes
5. ✅ Start the API server

**No manual SQL needed!** The tables are created automatically.

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
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
  id SERIAL PRIMARY KEY,
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

## Troubleshooting

### "psql: command not found"
PostgreSQL is not installed. Follow the installation steps above.

### "could not connect to server"
PostgreSQL is not running. Start it:
```bash
# Linux
sudo systemctl start postgresql

# macOS
brew services start postgresql
```

### "password authentication failed"
Update the password in `backend/.env` or set a password:
```bash
sudo -u postgres psql
ALTER USER postgres PASSWORD 'newpassword';
```

### "database does not exist"
Create the database:
```bash
sudo -u postgres psql -c "CREATE DATABASE avalanche_pay;"
```

### "peer authentication failed"
Edit PostgreSQL config to use password authentication:
```bash
sudo nano /etc/postgresql/*/main/pg_hba.conf
```
Change `peer` to `md5` for local connections, then restart:
```bash
sudo systemctl restart postgresql
```

## Using Docker (Alternative)

If you prefer Docker:

```bash
# Start PostgreSQL in Docker
docker run -d \
  --name avalanche-pay-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=avalanche_pay \
  -p 5432:5432 \
  postgres:16

# Check if it's running
docker ps
```

Then use these credentials in `backend/.env`:
```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=avalanche_pay
DB_USER=postgres
DB_PASSWORD=postgres
```

## Verify Setup

Once PostgreSQL is running and configured:

```bash
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

## Database Management

### View all users
```bash
psql -U postgres -d avalanche_pay -c "SELECT * FROM users;"
```

### View all transactions
```bash
psql -U postgres -d avalanche_pay -c "SELECT * FROM transactions;"
```

### Reset database
```bash
psql -U postgres -d avalanche_pay -c "DROP TABLE users, transactions CASCADE;"
# Then restart the backend to recreate tables
```

### Backup database
```bash
pg_dump -U postgres avalanche_pay > backup.sql
```

### Restore database
```bash
psql -U postgres avalanche_pay < backup.sql
```

## Production Deployment

For production, use a managed PostgreSQL service:

- **Supabase** (free tier): https://supabase.com
- **Railway** (free tier): https://railway.app
- **Neon** (free tier): https://neon.tech
- **AWS RDS**: https://aws.amazon.com/rds/
- **DigitalOcean**: https://www.digitalocean.com/products/managed-databases

Update `backend/.env` with the production credentials.

---

**PostgreSQL is ready! 🎉**
