# 🔒 Security Guide - Avalanche Pay

## Security Principles

1. **Never store private keys**
2. **All signing happens client-side**
3. **Validate all inputs**
4. **Use HTTPS only in production**
5. **Rate limit all endpoints**
6. **Audit all dependencies**

## Frontend Security

### Wallet Security
```typescript
// ✅ GOOD: Signing happens in wallet
const signature = await wallet.signMessage(message)

// ❌ BAD: Never do this
const privateKey = "0x..." // NEVER!
```

### Data Storage
```typescript
// ✅ GOOD: Store non-sensitive data only
localStorage.setItem('lastRecipient', username)

// ❌ BAD: Never store sensitive data
localStorage.setItem('privateKey', key) // NEVER!
localStorage.setItem('seedPhrase', phrase) // NEVER!
```

### Input Validation
```typescript
// ✅ GOOD: Validate and sanitize
const cleanUsername = username.replace(/[^a-zA-Z0-9_]/g, '')
if (amount <= 0 || amount > MAX_AMOUNT) throw new Error('Invalid amount')

// ❌ BAD: Trust user input
const query = `SELECT * FROM users WHERE username = '${username}'` // SQL injection!
```

## Backend Security

### Environment Variables
```bash
# ✅ GOOD: Use environment variables
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

# ❌ BAD: Hardcode secrets
const BOT_TOKEN = "123456:ABC-DEF..." // NEVER!
```

### API Security
```typescript
// ✅ GOOD: Validate and sanitize
app.post('/api/users/set-username', async (req, res) => {
  const { telegram_id, username, wallet_address } = req.body
  
  // Validate
  if (!telegram_id || !username || !wallet_address) {
    return res.status(400).json({ error: 'Missing fields' })
  }
  
  // Sanitize
  const cleanUsername = username.replace(/[^a-zA-Z0-9_]/g, '')
  
  // Use parameterized queries
  const { data, error } = await supabase
    .from('users')
    .upsert({ telegram_id, username: cleanUsername, wallet_address })
})
```

### Rate Limiting
```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

app.use('/api/', limiter)
```

## Database Security

### Supabase Row Level Security
```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users can only read their own data
CREATE POLICY "Users can read own data"
ON users FOR SELECT
USING (auth.uid() = id);

-- Users can only update their own data
CREATE POLICY "Users can update own data"
ON users FOR UPDATE
USING (auth.uid() = id);
```

### Secure Queries
```typescript
// ✅ GOOD: Use Supabase client (parameterized)
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('username', username)

// ❌ BAD: Raw SQL with string concatenation
const query = `SELECT * FROM users WHERE username = '${username}'`
```

## Smart Contract Security

### USDC Contract Interaction
```typescript
// ✅ GOOD: Use established libraries
import { parseUnits } from 'viem'
const amount = parseUnits('10', 6) // USDC has 6 decimals

// ✅ GOOD: Validate addresses
import { isAddress } from 'viem'
if (!isAddress(recipientAddress)) {
  throw new Error('Invalid address')
}

// ✅ GOOD: Set reasonable gas limits
const tx = await contract.transfer(to, amount, {
  gasLimit: 100000
})
```

## Telegram Bot Security

### Validate Telegram Data
```typescript
import crypto from 'crypto'

function validateTelegramWebAppData(initData: string): boolean {
  const urlParams = new URLSearchParams(initData)
  const hash = urlParams.get('hash')
  urlParams.delete('hash')
  
  const dataCheckString = Array.from(urlParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')
  
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(process.env.TELEGRAM_BOT_TOKEN!)
    .digest()
  
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex')
  
  return calculatedHash === hash
}
```

### Bot Command Validation
```typescript
bot.on('message', async (msg) => {
  // Validate user
  if (!msg.from?.id) return
  
  // Rate limit
  if (isRateLimited(msg.from.id)) {
    await bot.sendMessage(msg.chat.id, 'Too many requests. Please wait.')
    return
  }
  
  // Sanitize input
  const text = msg.text?.trim()
  if (!text) return
  
  // Process command
  // ...
})
```

## Production Checklist

### Before Mainnet Launch

- [ ] **Code Audit**
  - [ ] Professional security audit
  - [ ] Penetration testing
  - [ ] Dependency audit (`npm audit`)

- [ ] **Smart Contract Security**
  - [ ] Use audited contracts only
  - [ ] Test on testnet extensively
  - [ ] Set transaction limits
  - [ ] Implement emergency pause

- [ ] **API Security**
  - [ ] Enable rate limiting
  - [ ] Add authentication
  - [ ] Use API keys
  - [ ] Monitor for abuse

- [ ] **Database Security**
  - [ ] Enable RLS
  - [ ] Backup regularly
  - [ ] Encrypt sensitive data
  - [ ] Monitor access logs

- [ ] **Infrastructure Security**
  - [ ] Use HTTPS only
  - [ ] Enable CORS properly
  - [ ] Set security headers
  - [ ] Use secrets management

- [ ] **Monitoring**
  - [ ] Set up error tracking
  - [ ] Monitor transactions
  - [ ] Alert on anomalies
  - [ ] Log security events

## Common Vulnerabilities

### 1. Private Key Exposure
```typescript
// ❌ NEVER do this
const privateKey = process.env.PRIVATE_KEY
const wallet = new ethers.Wallet(privateKey)

// ✅ Use user's wallet instead
const signer = await provider.getSigner()
```

### 2. SQL Injection
```typescript
// ❌ Vulnerable
const query = `SELECT * FROM users WHERE id = ${userId}`

// ✅ Safe
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
```

### 3. XSS (Cross-Site Scripting)
```typescript
// ❌ Vulnerable
element.innerHTML = userInput

// ✅ Safe
element.textContent = userInput
```

### 4. CSRF (Cross-Site Request Forgery)
```typescript
// ✅ Use CSRF tokens
app.use(csrf())

// ✅ Validate origin
app.use((req, res, next) => {
  const origin = req.get('origin')
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  next()
})
```

## Incident Response Plan

### If Security Breach Detected

1. **Immediate Actions**
   - Pause all transactions
   - Disable affected endpoints
   - Notify users
   - Document everything

2. **Investigation**
   - Review logs
   - Identify vulnerability
   - Assess damage
   - Preserve evidence

3. **Remediation**
   - Fix vulnerability
   - Deploy patch
   - Test thoroughly
   - Resume operations

4. **Post-Mortem**
   - Write incident report
   - Update security measures
   - Train team
   - Improve monitoring

## Security Contacts

### Report Security Issues

**DO NOT** open public GitHub issues for security vulnerabilities.

Instead:
- Email: security@avalanche-pay.com
- Telegram: @AvalanchePaySecurity
- Bug Bounty: [Link to program]

### Bug Bounty Program

We reward security researchers who responsibly disclose vulnerabilities:

- **Critical**: $5,000 - $10,000
- **High**: $1,000 - $5,000
- **Medium**: $500 - $1,000
- **Low**: $100 - $500

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Ethereum Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Telegram Bot Security](https://core.telegram.org/bots/security)

---

**Security is everyone's responsibility. Stay vigilant! 🛡️**
