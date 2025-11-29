# ⚡ Bot Quick Setup (5 Minutes)

## What You Need to Do in BotFather

### 1️⃣ Create Web App

In BotFather chat, type:
```
/newapp
```

Then answer:
- **Bot**: Choose `@AvalanchePayBot`
- **Title**: `Avalanche Pay`
- **Description**: `Instant global payments`
- **Photo**: Skip (or upload 640x360 image)
- **Web App URL**: `http://localhost:5173`
- **Short name**: `avaxpay`

✅ Done! You'll get a link like: `t.me/AvalanchePayBot/avaxpay`

---

### 2️⃣ Set Description

In BotFather, type:
```
/setdescription
```

Choose your bot, then paste:
```
⚡ Instant global payments on Avalanche

Send USDC to anyone via username with sub-second settlement and near-zero fees.

Features:
• Send by @username
• <800ms settlement
• <$0.001 fees
• Powered by Avalanche
```

---

### 3️⃣ Set Commands

In BotFather, type:
```
/setcommands
```

Choose your bot, then paste:
```
start - Open Avalanche Pay
help - Show help
send - Quick send money
```

---

### 4️⃣ Set About Text

In BotFather, type:
```
/setabouttext
```

Choose your bot, then paste:
```
Instant global payments on Avalanche. Send USDC by username.
```

---

## Test Your Bot

### 1. Start Backend

```bash
cd backend
npm run dev
```

Wait for:
```
📱 Telegram bot active
```

### 2. Test in Telegram

1. Search: `@AvalanchePayBot`
2. Send: `/start`
3. Click: "Open Avalanche Pay" button
4. App opens! ✅

---

## If Bot Doesn't Respond

### Check backend logs:

```bash
cd backend
npm run dev
```

Look for errors. Common issues:

**"Invalid token"**
- Check `backend/.env` has correct token
- Token should be: `8346751711:AAFZJjX0oT0cDfeUpYRPFNSI91UdDleZEBM`

**"Polling error"**
- Another instance might be running
- Kill it: `pkill -f node`
- Restart: `npm run dev`

---

## Quick Commands Reference

### In BotFather:

| Type This | To Do This |
|-----------|------------|
| `/newapp` | Create Web App |
| `/myapps` | See your apps |
| `/editapp` | Edit Web App URL |
| `/setdescription` | Set description |
| `/setabouttext` | Set about text |
| `/setcommands` | Set commands |
| `/setuserpic` | Set profile pic |

### In Your Bot:

| Type This | What Happens |
|-----------|--------------|
| `/start` | Opens welcome + app button |
| `/help` | Shows help (if you add it) |

---

## Your Bot Info

- **Name**: Avalanche Pay
- **Username**: @AvalanchePayBot
- **Token**: In your `backend/.env`
- **Web App**: http://localhost:5173

---

## When You Deploy to Vercel

### Update Web App URL:

1. In BotFather: `/editapp`
2. Choose bot → Choose app
3. Edit URL
4. New URL: `https://your-app.vercel.app`
5. Update `backend/.env`: `WEBAPP_URL=https://your-app.vercel.app`
6. Restart backend

---

## Checklist

- [ ] Created Web App with `/newapp`
- [ ] Set description with `/setdescription`
- [ ] Set commands with `/setcommands`
- [ ] Backend is running
- [ ] Bot responds to `/start`
- [ ] "Open App" button works
- [ ] App loads in Telegram

---

**That's it! Your bot is ready! 🎉**

**Next: Test by sending `/start` to @AvalanchePayBot**
