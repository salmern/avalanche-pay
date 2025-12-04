# 📱 Telegram Mini App Setup Guide

## 🎯 Quick Setup (5 Steps)

### Step 1: Create Mini App with BotFather

1. Open Telegram and search for **@BotFather**

2. Send command:
   ```
   /newapp
   ```

3. Select your bot: **Avalanche Pay Dev**

4. Follow the prompts:
   - **Title**: `Avalanche Pay`
   - **Description**: `Instant global payments on Avalanche`
   - **Photo**: Send `/empty` (skip for now)
   - **Short name**: `avalanchepay` (or `avalanchepay_dev` if taken)
   - **Web App URL**: `http://localhost:3001`

### Step 2: Add Menu Button

1. Send to @BotFather:
   ```
   /setmenubutton
   ```

2. Select your bot: **Avalanche Pay Dev**

3. Enter button text:
   ```
   Open Avalanche Pay
   ```

4. Enter Web App URL:
   ```
   http://localhost:3001
   ```

### Step 3: Test the Mini App

1. Go to your bot chat: **Avalanche Pay Dev**

2. You should see a **button at the bottom** (next to the message input)

3. Click the button or type `/start`

4. Click "Open Avalanche Pay" button

5. The app should open inside Telegram!

### Step 4: For Production (Later)

When you deploy to production:

1. Update Web App URL in BotFather:
   ```
   /myapps
   ```
   Select your app → Edit → Web App URL
   
2. Enter your production URL:
   ```
   https://your-app.vercel.app
   ```

3. Update `backend/.env`:
   ```
   WEBAPP_URL=https://your-app.vercel.app
   ```

## 🔧 Troubleshooting

### "Bot doesn't have a menu button"

Solution:
```
/setmenubutton
```
Select bot → Enter text → Enter URL

### "Web App doesn't open"

Check:
1. Frontend is running: http://localhost:3001
2. WEBAPP_URL in backend/.env is correct
3. Bot token is correct

### "Can't access localhost in Telegram"

For testing on mobile:
1. Use ngrok or similar tunnel:
   ```bash
   npx ngrok http 3001
   ```
2. Use the ngrok URL in BotFather
3. Update WEBAPP_URL in backend/.env

## 📱 Testing Checklist

- [ ] Bot responds to `/start`
- [ ] Menu button appears at bottom
- [ ] Clicking button opens app
- [ ] App loads inside Telegram
- [ ] Wallet connection works
- [ ] Username auto-detects from Telegram
- [ ] All features work

## 🎉 Success!

Once set up, users can:
1. Open your bot in Telegram
2. Click the menu button
3. Use the app inside Telegram
4. Get notifications
5. Use bot commands

---

**Your bot token is already configured!** ✅

Just follow Step 1-3 above to enable the Mini App.
