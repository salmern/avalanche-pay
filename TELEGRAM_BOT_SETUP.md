# 🤖 Telegram Bot Setup Guide

## Current Status

I can see you've created the bot! Now let's configure it properly.

---

## Step 1: Edit Bot Information

### 1. Edit About

Click **"Edit About"** and paste:

```
⚡ Instant global payments on Avalanche

Send USDC to anyone via username with sub-second settlement and near-zero fees.
```

### 2. Edit Description

Click **"Edit Description"** and paste:

```
🚀 Avalanche Pay - The fastest way to send money globally

✨ Features:
• Send money by @username (no addresses!)
• <800ms settlement time
• <$0.001 transaction fees
• Powered by Avalanche blockchain
• Built with x402 intent protocol

💰 How it works:
1. Connect your wallet
2. Set your username
3. Send USDC to @friends instantly

🔒 Secure & Decentralized:
• Your keys, your crypto
• Non-custodial wallet connection
• Open source code

Start sending money the fast way! 👇
```

### 3. Edit Commands

Click **"Edit Commands"** and paste:

```
start - Open Avalanche Pay and get started
help - Show help and features
send - Quick send money to a friend
balance - Check your balance
history - View transaction history
```

---

## Step 2: Create Web App

This is the most important part!

### In BotFather chat, send:

```
/newapp
```

### Then follow these steps:

1. **Choose your bot**: Select `@AvalanchePayBot`

2. **App title**: 
   ```
   Avalanche Pay
   ```

3. **App description**:
   ```
   Instant global payments on Avalanche. Send USDC by username.
   ```

4. **Photo**: Upload a 640x360 PNG image (app preview)
   - You can create one or skip for now

5. **Demo GIF**: Skip for now (optional)

6. **Web App URL**: 
   ```
   http://localhost:5173
   ```
   
   **Note:** For now use localhost. When you deploy to Vercel, come back and update this to your production URL.

7. **Short name**: 
   ```
   avaxpay
   ```
   
   This creates the link: `t.me/AvalanchePayBot/avaxpay`

8. **Done!** ✅

---

## Step 3: Update Backend Configuration

### Edit `backend/.env`:

```bash
PORT=4000
TELEGRAM_BOT_TOKEN=8346751711:AAFZJjX0oT0cDfeUpYRPFNSI91UdDleZEBM
WEBAPP_URL=http://localhost:5173

# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=avalanche_pay
DB_USER=postgres
DB_PASSWORD=postgres
```

**Note:** I can see your bot token in the screenshot. I've added it above.

---

## Step 4: Start Backend

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

---

## Step 5: Test Your Bot

### 1. Open Telegram

Search for: `@AvalanchePayBot`

### 2. Send `/start`

You should get a welcome message with a button:
```
🚀 Welcome to Avalanche Pay!

The fastest way to send money globally.

✨ Features:
• Send money by username
• <800ms settlement
• <$0.001 fees
• Powered by Avalanche

Open the app to get started! 👇

[🚀 Open Avalanche Pay]
```

### 3. Click "Open Avalanche Pay"

The Mini App should open inside Telegram!

---

## Step 6: Configure Bot Menu Button

In BotFather, send:

```
/setmenubutton
```

1. Choose your bot: `@AvalanchePayBot`
2. Button text: `Open App`
3. Web App URL: `http://localhost:5173`

Now users can click the menu button (☰) to open your app!

---

## Step 7: Set Bot Profile Picture (Optional)

### Create or find a logo (512x512 PNG)

In BotFather, send:
```
/setuserpic
```

Choose your bot and upload the image.

---

## Complete Bot Commands Reference

Here are all the commands you can set:

```
start - Open Avalanche Pay and get started
help - Show help and features
send - Quick send: /send @username amount
balance - Check your USDC balance
history - View recent transactions
receive - Get your payment QR code
settings - Manage your account
support - Get help and support
```

To set these, send `/setcommands` to BotFather and paste the above.

---

## Testing Checklist

- [ ] Bot responds to `/start`
- [ ] "Open Avalanche Pay" button appears
- [ ] Clicking button opens the app
- [ ] App loads inside Telegram
- [ ] Can connect wallet in the app
- [ ] Can set username
- [ ] Backend logs show bot is active

---

## Troubleshooting

### Bot doesn't respond to /start

**Check backend logs:**
```bash
cd backend
npm run dev
```

Look for:
```
📱 Telegram bot active
```

If you see errors, the bot token might be wrong.

### "Open Avalanche Pay" button doesn't work

**Check Web App URL:**
1. Make sure frontend is running: `cd frontend && npm run dev`
2. Make sure you set the Web App URL in BotFather
3. URL should be: `http://localhost:5173` (for local testing)

### App doesn't open in Telegram

**For local testing:**
- Telegram Web Apps don't work with localhost on mobile
- Use Telegram Desktop for testing
- Or deploy to Vercel and update the URL

---

## Production Deployment

When you deploy to Vercel:

### 1. Update Web App URL

In BotFather, send:
```
/editapp
```

Choose your bot → Choose your app → Edit URL

New URL:
```
https://your-app.vercel.app
```

### 2. Update Backend Environment

Edit `backend/.env`:
```bash
WEBAPP_URL=https://your-app.vercel.app
```

Restart backend:
```bash
cd backend
npm run dev
```

### 3. Test Again

Now the bot will work on mobile too!

---

## Bot Features Explained

### /start Command

Opens the app with a welcome message.

**Backend code** (already in `backend/src/index.ts`):
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
            web_app: { url: process.env.WEBAPP_URL! }
          }
        ]]
      }
    }
  )
})
```

### Quick Send Command (Future)

Users can type:
```
send @friend 25
```

Bot shows inline button to send $25 to @friend.

### Notifications

When someone sends you money, bot sends:
```
💰 You received $25 USDC from @alice!

[👀 View Transaction]
```

---

## Advanced: Bot Commands

You can add more commands to `backend/src/index.ts`:

### /help Command

```typescript
bot.onText(/\/help/, async (msg) => {
  await bot.sendMessage(msg.chat.id,
    `🆘 *Avalanche Pay Help*
    
    *Commands:*
    /start - Open the app
    /send @user amount - Quick send
    /balance - Check balance
    /history - View transactions
    
    *How to use:*
    1. Connect your wallet
    2. Set your username
    3. Send money to @friends
    
    *Support:*
    Need help? Contact @YourSupport`,
    { parse_mode: 'Markdown' }
  )
})
```

### /balance Command

```typescript
bot.onText(/\/balance/, async (msg) => {
  // Get user's wallet from database
  // Query balance
  // Send message with balance
})
```

---

## Quick Reference

### BotFather Commands

| Command | Purpose |
|---------|---------|
| `/newbot` | Create new bot |
| `/mybots` | List your bots |
| `/newapp` | Create Web App |
| `/myapps` | List your Web Apps |
| `/editapp` | Edit Web App |
| `/setcommands` | Set bot commands |
| `/setdescription` | Set description |
| `/setabouttext` | Set about text |
| `/setuserpic` | Set profile picture |
| `/setmenubutton` | Set menu button |

### Your Bot Info

- **Bot Name**: Avalanche Pay
- **Username**: @AvalanchePayBot
- **Token**: `8346751711:AAFZJjX0oT0cDfeUpYRPFNSI91UdDleZEBM`
- **Web App**: `http://localhost:5173` (update when deployed)

---

## Next Steps

1. ✅ **Complete bot setup** (follow steps above)
2. ✅ **Test with /start**
3. ✅ **Open the app**
4. ✅ **Connect wallet**
5. ✅ **Set username**
6. ✅ **Send test transaction**
7. ✅ **Deploy to production**

---

## Summary

Your bot is created! Now:

1. **Configure it** - Edit description, commands, create Web App
2. **Start backend** - `cd backend && npm run dev`
3. **Test it** - Send `/start` to your bot
4. **Use it** - Click "Open Avalanche Pay"

**The bot token is already in your backend/.env, so you're halfway there!** 🎉

---

**Need help? Check the backend logs for any errors!**
