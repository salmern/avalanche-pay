# ⚡ GitHub Quick Start

## Push Your Code in 3 Steps

### Step 1: Run Setup Script

```bash
./git-setup.sh
```

This will:
- Initialize git
- Add all files
- Create initial commit
- Set main branch

---

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `avalanche-pay`
3. Description: `Instant global payments on Avalanche - Telegram Mini App`
4. **Public** (for hackathon)
5. **Don't** check "Initialize with README"
6. Click **"Create repository"**

---

### Step 3: Push to GitHub

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/avalanche-pay.git

# Push
git push -u origin main
```

---

## Done! 🎉

Your code is now on GitHub!

Visit: `https://github.com/YOUR_USERNAME/avalanche-pay`

---

## If You Get Errors

### "Permission denied"

You need to authenticate. Use one of these:

**Option 1: HTTPS with token**
```bash
# Create token at: https://github.com/settings/tokens
# Use token as password when pushing
```

**Option 2: SSH**
```bash
# Setup SSH key: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
git remote set-url origin git@github.com:YOUR_USERNAME/avalanche-pay.git
```

### "Repository not found"

Make sure you created the repository on GitHub first!

---

## Update Later

To push changes:

```bash
git add .
git commit -m "Your commit message"
git push
```

---

## Security Check ✅

Before pushing, verify:

```bash
# Check what will be pushed
git status

# Make sure no .env files!
git ls-files | grep .env
# Should return nothing
```

---

**Read PUSH_TO_GITHUB.md for detailed guide!** 📚
