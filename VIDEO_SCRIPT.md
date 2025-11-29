# 🎥 Video Demo Script - Avalanche Pay

**Duration: 2 minutes**
**Format: Screen recording + voiceover**

## Pre-Recording Checklist

- [ ] Test transaction works perfectly
- [ ] Clear notification history
- [ ] Have test accounts ready with USDC
- [ ] Good lighting and audio
- [ ] Screen recording software ready
- [ ] Practice 3 times before recording

## Script

### [0:00 - 0:15] Hook & Problem (15 seconds)

**Visual**: Show traditional payment apps (Venmo, Wire Transfer screenshots)

**Voiceover**:
> "Sending money globally is broken. Venmo doesn't work internationally. Wire transfers take days and cost $30. Crypto is complicated with long addresses and high fees. There has to be a better way."

### [0:15 - 0:25] Solution Introduction (10 seconds)

**Visual**: Avalanche Pay logo animation, then Telegram app opening

**Voiceover**:
> "Meet Avalanche Pay - instant global payments inside Telegram. Send USDC to anyone via username in under a second for less than a penny. Let me show you."

### [0:25 - 0:35] Opening the App (10 seconds)

**Visual**: 
- Open Telegram
- Search for @AvalanchePayBot
- Send /start
- Click "Open Avalanche Pay"
- App loads with beautiful gradient

**Voiceover**:
> "I open Telegram, search for Avalanche Pay, and the app loads instantly. No download, no signup - just works."

### [0:35 - 0:50] Sending Money (15 seconds)

**Visual**:
- Show home screen with balance
- Tap Send button
- Enter @testuser
- Enter $25
- Show fee: $0.003
- Tap Send
- Wallet confirmation pops up
- Approve

**Voiceover**:
> "I want to send my friend $25. I tap Send, type their username - no long address - enter $25, and the fee is just three-tenths of a cent. I confirm in my wallet..."

### [0:50 - 1:05] Transaction Success (15 seconds)

**Visual**:
- Success screen appears
- Confetti animation plays
- Show metrics:
  - Speed: 650ms
  - Fee: $0.003
  - Network: Avalanche
- Click "View on Explorer"
- Snowtrace opens showing confirmed transaction

**Voiceover**:
> "And done! 650 milliseconds. The transaction is already confirmed on Avalanche. You can see it on the blockchain explorer. This is the power of Avalanche - sub-second finality with near-zero fees."

### [1:05 - 1:20] Recipient Experience (15 seconds)

**Visual**:
- Switch to second device
- Show Telegram notification arriving
- "You received $25 USDC from @sender!"
- Open app
- Balance updated
- Transaction appears in history

**Voiceover**:
> "My friend instantly gets a push notification in Telegram. They open the app and the money is already there. No waiting, no confusion, just instant value transfer."

### [1:20 - 1:35] Key Features (15 seconds)

**Visual**:
- Quick montage:
  - Transaction history screen
  - QR code receive screen
  - Payment link copy
  - Quick amount buttons ($5, $10, $25, $50)
  - Beautiful animations

**Voiceover**:
> "The app has everything you need: transaction history with explorer links, QR codes for easy receiving, shareable payment links, and a beautiful interface that makes crypto payments feel natural."

### [1:35 - 1:50] Technical Deep Dive (15 seconds)

**Visual**:
- Show code snippets (briefly):
  - x402 intent creation
  - WalletConnect integration
  - Telegram SDK
- Show architecture diagram
- Show deployment (Vercel + Railway)

**Voiceover**:
> "Under the hood, we're using x402 intents - that's ERC-7730 compatible intent-based transfers on Avalanche. This enables gasless transactions, optimal routing, and MEV protection. The app is production-ready, deployed on Vercel and Railway, with a Supabase database."

### [1:50 - 2:00] Closing & Call to Action (10 seconds)

**Visual**:
- Show app logo
- Show key metrics on screen:
  - <800ms settlement
  - <$0.001 fees
  - 900M+ potential users
  - $150B+ market
- End with "Built on Avalanche" logo

**Voiceover**:
> "This is how payments should work. Fast, cheap, and simple. Avalanche Pay - the global Venmo killer, built on Avalanche. Try it now at t.me/AvalanchePayBot."

## B-Roll Footage to Capture

### App Screens
1. Home screen with balance
2. Send flow (all steps)
3. Success screen with confetti
4. Receive screen with QR code
5. Transaction history
6. Wallet connection flow
7. Username setup

### Code Snippets
1. x402 intent creation (`frontend/src/lib/x402.ts`)
2. WalletConnect config (`frontend/src/lib/wallet.ts`)
3. Telegram integration (`frontend/src/lib/telegram.ts`)
4. Backend API (`backend/src/index.ts`)

### External
1. Snowtrace transaction confirmation
2. Telegram notification
3. Wallet confirmation dialog

## Recording Tips

### Video Quality
- **Resolution**: 1920x1080 minimum
- **Frame Rate**: 60fps for smooth animations
- **Format**: MP4 (H.264)
- **Bitrate**: 10-15 Mbps

### Audio Quality
- **Microphone**: Use good quality mic
- **Environment**: Quiet room, no echo
- **Volume**: Consistent levels
- **Format**: 48kHz, 16-bit

### Screen Recording
- **Tool**: OBS Studio or ScreenFlow
- **Cursor**: Show cursor, highlight clicks
- **Zoom**: Zoom in on important details
- **Transitions**: Smooth, not jarring

### Editing
- **Cuts**: Cut out any mistakes
- **Pace**: Keep it moving, no dead air
- **Music**: Subtle background music (optional)
- **Captions**: Add captions for accessibility

## Alternative Versions

### 30-Second Version (Social Media)

**[0:00 - 0:10] Problem + Solution**
> "Sending money globally sucks. Avalanche Pay fixes this. Send USDC to anyone via Telegram username in under a second for less than a penny."

**[0:10 - 0:25] Demo**
> "Watch: I type their username, enter $25, tap send, and done. 650 milliseconds. They get a notification and the money is there. This is the future of payments."

**[0:25 - 0:30] CTA**
> "Try it now at t.me/AvalanchePayBot. Built on Avalanche."

### 5-Minute Version (Technical Deep Dive)

Add these sections:
- **Architecture explanation** (1 min)
- **x402 intent protocol details** (1 min)
- **Security measures** (30 sec)
- **Scalability discussion** (30 sec)
- **Roadmap and vision** (1 min)

## YouTube Description Template

```
🚀 Avalanche Pay - Instant Global Payments

Send USDC to anyone via Telegram username in <1 second for <$0.001 fees.

✨ Features:
• Telegram Mini App (no download needed)
• Send to @username (no addresses)
• <800ms settlement
• ~$0.003 fees
• Instant notifications
• Beautiful UX

🛠 Tech Stack:
• Avalanche (blockchain)
• x402 Intents (ERC-7730)
• Telegram Mini App
• WalletConnect v2
• React + TypeScript
• Supabase

🔗 Links:
• Try it: https://t.me/AvalanchePayBot
• GitHub: [repo URL]
• Docs: [docs URL]
• Demo: [demo URL]

🏆 Built for Avalanche x402 Hack2Build 2025

#Avalanche #Web3 #Crypto #Payments #Telegram #x402

---

Timestamps:
0:00 - Problem
0:15 - Solution
0:25 - Demo
1:05 - Recipient Experience
1:20 - Features
1:35 - Technical Details
1:50 - Conclusion
```

## Social Media Posts

### Twitter/X
```
🚀 Just built Avalanche Pay - the global Venmo killer

Send USDC via Telegram username:
• <800ms settlement
• <$0.001 fees
• No addresses
• Instant notifications

Built with x402 intents on @avalancheavax

Try it: t.me/AvalanchePayBot

[Video]

#Avalanche #Web3 #Crypto
```

### LinkedIn
```
Excited to share Avalanche Pay - a Telegram Mini App that makes global payments instant and nearly free.

Key innovations:
✅ Username-based payments (no crypto addresses)
✅ Sub-second settlement using Avalanche
✅ x402 intent protocol (ERC-7730)
✅ <$0.003 transaction fees
✅ Native Telegram integration

This is what happens when you combine:
• Avalanche's speed and low fees
• Telegram's 900M+ users
• x402's intent-based architecture
• Modern UX design

The result? A payment app that actually works globally.

Built for the Avalanche x402 Hack2Build hackathon.

Try it: https://t.me/AvalanchePayBot

[Video]

#Blockchain #Fintech #Payments #Web3 #Avalanche
```

### Reddit (r/cryptocurrency, r/avalanche)
```
Title: I built a Telegram app that sends USDC globally in <1 second for <$0.001 fees

Body:
Hey everyone! I just finished building Avalanche Pay for the Avalanche hackathon and wanted to share.

**What it does:**
Send USDC to anyone via their Telegram username. No long addresses, no high fees, no waiting.

**Why it's cool:**
• Settles in <800ms (Avalanche speed)
• Costs ~$0.003 per transaction
• Works inside Telegram (900M+ users)
• Uses x402 intents (ERC-7730 standard)
• Production-ready code

**Try it:**
1. Open Telegram
2. Search @AvalanchePayBot
3. Send /start
4. Connect wallet
5. Send money to @username

[Video demo]

**Tech details:**
- React + TypeScript frontend
- Node.js backend
- Supabase database
- Deployed on Vercel + Railway
- Open source: [GitHub link]

Would love your feedback!
```

## Thumbnail Design

### Elements
- Avalanche logo
- Telegram logo
- Large text: "Send $25 in <1 second"
- Smaller text: "$0.003 fee"
- Phone mockup showing app
- Gradient background (purple to orange)

### Dimensions
- YouTube: 1280x720
- Twitter: 1200x675
- Instagram: 1080x1080

---

**Record, edit, and ship! 🎬**
