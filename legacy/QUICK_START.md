# 📋 Quick Reference - API Setup

## 🔑 What You Need

### 1. Gmail App Password
**Where:** Google Account → Security → 2-Step Verification → App passwords
**Format:** 16 characters (e.g., `abcdefghijklmnop`)
**Note:** Remove spaces when pasting into .env

### 2. Twilio Credentials
**Where:** https://console.twilio.com/
**You need:**
- Account SID (starts with `AC...`)
- Auth Token (click eye icon to reveal)
- WhatsApp Number (from sandbox, usually `+14155238886`)

### 3. Connect Your WhatsApp
**Send this message to Twilio's WhatsApp number:**
```
join [your-sandbox-keyword]
```
**Example:** If your keyword is "happy-tiger", send:
```
join happy-tiger
```

---

## ⚡ Quick Start Commands

```bash
# 1. Fill in .env file with your credentials
notepad .env

# 2. Start the server
npm start

# 3. Open in browser
http://localhost:3000
```

---

## 🧪 Testing Checklist

- [ ] Filled in all .env variables
- [ ] Sent "join" message to Twilio WhatsApp
- [ ] Server started without errors
- [ ] Can access http://localhost:3000
- [ ] Signup sends email to your inbox
- [ ] Login sends OTP to your WhatsApp

---

## 📞 Support Links

- **Gmail App Passwords:** https://myaccount.google.com/apppasswords
- **Twilio Console:** https://console.twilio.com/
- **Twilio WhatsApp Sandbox:** https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn

---

## 🎯 Current Status

✅ Dependencies installed
✅ Server files created
✅ .env template ready
⏳ **Next:** Fill in your API credentials in `.env`
