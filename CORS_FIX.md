# 🔧 CORS Error Fixed

## What Was the Problem?

You were getting CORS errors:
```
Access to XMLHttpRequest at 'http://localhost:4000/api/balance/...' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

## Why It Happened

- Frontend runs on port **5173** (Vite's default)
- Backend CORS was only allowing port **3000**
- Browser blocked the requests for security

## What I Fixed

Updated `backend/src/index.ts` to allow both ports:

```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',  // ← Added this
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'   // ← Added this
  ],
  credentials: true
}))
```

## How to Apply the Fix

### Option 1: Restart Backend (Recommended)

```bash
# Stop the backend (Ctrl+C)
cd backend
npm run dev
```

The backend will rebuild and apply the fix.

### Option 2: Change Frontend Port

If you prefer port 3000, update `frontend/vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,  // ← Change from default
    host: true
  }
})
```

Then restart frontend:
```bash
cd frontend
npm run dev
```

## Verify It Works

1. **Restart backend**: `cd backend && npm run dev`
2. **Keep frontend running** on port 5173
3. **Refresh browser**
4. **Check console** - No more CORS errors!

## What You Should See

✅ Backend console:
```
✅ Connected to PostgreSQL database
✅ Database tables initialized
🚀 Avalanche Pay API running on port 4000
📱 Telegram bot active
```

✅ Frontend console:
- No CORS errors
- API requests working
- Balance loading

## Still Getting Errors?

### 1. Make sure backend restarted
```bash
# Stop backend (Ctrl+C)
cd backend
npm run dev
```

### 2. Clear browser cache
- Press `Ctrl+Shift+R` (hard refresh)
- Or open DevTools → Network → Disable cache

### 3. Check backend is running
```bash
curl http://localhost:4000/health
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

## Production Note

For production deployment, update CORS to only allow your production domain:

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-app.vercel.app',
  credentials: true
}))
```

---

**CORS is now fixed! Restart the backend and you're good to go! 🎉**
