# 🚀 Push to GitHub Guide

## ⚠️ IMPORTANT: Security First!

Before pushing, we need to make sure your **secrets are NOT in the code**!

---

## Step 1: Check .gitignore (Already Done ✅)

Your `.gitignore` file already excludes sensitive files:
```
.env
.env.local
backend/.env
frontend/.env
```

This means your secrets won't be pushed to GitHub.

---

## Step 2: Remove Secrets from Any Committed Files

Let's make sure no secrets are in tracked files:

```bash
# Check if .env files are tracked
git status

# If you see .env files listed, remove them:
git rm --cached backend/.env
git rm --cached frontend/.env
git rm --cached .env
```

---

## Step 3: Initialize Git (if not done)

```bash
# Check if git is initialized
git status

# If not initialized, run:
git init
```

---

## Step 4: Create GitHub Repository

### Option A: Via GitHub Website

1. Go to https://github.com
2. Click **"+"** → **"New repository"**
3. Name: `avalanche-pay`
4. Description: `Instant global payments on Avalanche - Telegram Mini App`
5. **Keep it Public** (for hackathon)
6. **Don't** initialize with README (we have one)
7. Click **"Create repository"**

### Option B: Via GitHub CLI

```bash
gh repo create avalanche-pay --public --source=. --remote=origin
```

---

## Step 5: Add All Files

```bash
# Add all files
git add .

# Check what will be committed
git status

# Make sure .env files are NOT listed!
```

---

## Step 6: Commit

```bash
git commit -m "Initial commit: Avalanche Pay - Telegram Mini App for instant USDC payments"
```

---

## Step 7: Push to GitHub

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/avalanche-pay.git

# Push to GitHub
git push -u origin main
```

If you get an error about `master` vs `main`:
```bash
git branch -M main
git push -u origin main
```

---

## Step 8: Verify on GitHub

1. Go to your repository: `https://github.com/YOUR_USERNAME/avalanche-pay`
2. Check that files are there
3. **IMPORTANT:** Check that `.env` files are NOT visible!

---

## ✅ What Should Be on GitHub

Your repository should include:

### Code Files ✅
- `frontend/` folder
- `backend/` folder
- All `.ts`, `.tsx`, `.js` files
- `package.json` files
- Configuration files

### Documentation ✅
- `README.md`
- `HOW_IT_WORKS.md`
- `DEPLOYMENT.md`
- All other `.md` files

### Configuration Templates ✅
- `.env.example`
- `backend/.env.example`
- `frontend/.env.example`

### Build Files ✅
- `.gitignore`
- `tsconfig.json`
- `vite.config.ts`
- etc.

---

## ❌ What Should NOT Be on GitHub

### Secrets ❌
- `.env` files
- `backend/.env`
- `frontend/.env`
- Any file with API keys, tokens, passwords

### Dependencies ❌
- `node_modules/` folders
- `package-lock.json` (optional, but usually excluded)

### Build Output ❌
- `dist/` folders
- `build/` folders
- Compiled files

---

## 🔒 Security Checklist

Before pushing, verify:

- [ ] `.gitignore` includes `.env`
- [ ] No `.env` files in `git status`
- [ ] No API keys in code
- [ ] No passwords in code
- [ ] No private keys in code
- [ ] `.env.example` has placeholder values only

---

## 📝 Update README for GitHub

Add this to the top of your `README.md`:

```markdown
# 🚀 Avalanche Pay

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Avalanche](https://img.shields.io/badge/Avalanche-E84142?style=flat&logo=avalanche&logoColor=white)](https://www.avax.network/)
[![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=flat&logo=telegram&logoColor=white)](https://telegram.org/)

**Instant global payments on Avalanche - The fastest, cheapest Venmo killer**

Send USDC to anyone via Telegram username with sub-second settlement and near-zero fees.

🏆 **Built for Avalanche x402 Hack2Build 2025**

[Live Demo](https://your-app.vercel.app) | [Documentation](./HOW_IT_WORKS.md) | [Telegram Bot](https://t.me/AvalanchePayBot)
```

---

## 🎯 Complete Git Commands

Here's the complete sequence:

```bash
# 1. Initialize git (if needed)
git init

# 2. Add all files
git add .

# 3. Check status (make sure no .env files!)
git status

# 4. Commit
git commit -m "Initial commit: Avalanche Pay - Telegram Mini App"

# 5. Create main branch
git branch -M main

# 6. Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/avalanche-pay.git

# 7. Push
git push -u origin main
```

---

## 🔄 Future Updates

After initial push, to update:

```bash
# 1. Add changes
git add .

# 2. Commit with message
git commit -m "Add feature: XYZ"

# 3. Push
git push
```

---

## 🌟 Make Repository Look Professional

### Add Topics/Tags

On GitHub repository page:
1. Click ⚙️ Settings
2. Add topics:
   - `avalanche`
   - `blockchain`
   - `telegram-bot`
   - `web3`
   - `cryptocurrency`
   - `payment`
   - `defi`
   - `hackathon`

### Add Description

```
⚡ Instant global payments on Avalanche. Send USDC by @username with <800ms settlement and <$0.001 fees. Built with x402 intents.
```

### Add Website

```
https://your-app.vercel.app
```

---

## 📊 Repository Structure

Your GitHub repo will look like:

```
avalanche-pay/
├── 📁 frontend/          # React Telegram Mini App
├── 📁 backend/           # Express API + Telegram Bot
├── 📄 README.md          # Main documentation
├── 📄 HOW_IT_WORKS.md    # System explanation
├── 📄 DEPLOYMENT.md      # Deployment guide
├── 📄 LICENSE            # MIT License
├── 📄 .gitignore         # Ignore sensitive files
├── 📄 package.json       # Root workspace
└── 📄 ... (other docs)
```

---

## 🎬 For Hackathon Submission

### Include in README:

1. **Demo Video Link**
2. **Live Demo URL**
3. **Telegram Bot Link**
4. **Architecture Diagram**
5. **Setup Instructions**
6. **Tech Stack**
7. **Team Info**

### Create a Good README

Your README should have:
- [ ] Project title and description
- [ ] Demo video/GIF
- [ ] Features list
- [ ] Tech stack
- [ ] Quick start guide
- [ ] Screenshots
- [ ] Architecture overview
- [ ] Deployment instructions
- [ ] License
- [ ] Contact info

---

## 🚨 Common Mistakes to Avoid

### ❌ Don't Push:
- `.env` files
- API keys
- Bot tokens
- Database passwords
- Private keys
- `node_modules/`

### ✅ Do Push:
- `.env.example` (with placeholders)
- All source code
- Documentation
- Configuration files
- Setup scripts

---

## 🔍 Verify After Push

1. **Check repository on GitHub**
2. **Clone to a new folder** to test:
   ```bash
   cd /tmp
   git clone https://github.com/YOUR_USERNAME/avalanche-pay.git
   cd avalanche-pay
   ```
3. **Verify no secrets** are in the code
4. **Test setup** from scratch

---

## 📞 Need Help?

If you get errors:

### "Permission denied"
```bash
# Use HTTPS instead of SSH
git remote set-url origin https://github.com/YOUR_USERNAME/avalanche-pay.git
```

### "Repository not found"
- Make sure repository exists on GitHub
- Check repository name matches
- Check you're logged in to GitHub

### "Failed to push"
```bash
# Pull first, then push
git pull origin main --rebase
git push
```

---

## ✅ Final Checklist

Before pushing:

- [ ] `.gitignore` is correct
- [ ] No `.env` files in git
- [ ] No secrets in code
- [ ] README is complete
- [ ] Documentation is ready
- [ ] Code is clean
- [ ] Everything builds successfully

After pushing:

- [ ] Repository is public
- [ ] All files are there
- [ ] No secrets visible
- [ ] README looks good
- [ ] Can clone and run

---

**Ready to push? Follow the steps above!** 🚀

**Your code will be safe and professional on GitHub!** ✨
