# 🚀 Quick Setup Guide - CampusMart Live Authentication

## Step 1: Install Dependencies (Already Running)
The dependencies are currently being installed. Wait for it to complete.

## Step 2: Get Your API Credentials

### A. Gmail Setup (for Email Verification)

1. **Go to your Gmail account** → Click your profile → "Manage your Google Account"

2. **Enable 2-Step Verification:**
   - Go to "Security" tab
   - Scroll to "2-Step Verification" → Turn it ON
   - Follow the prompts to set it up

3. **Create App Password:**
   - Still in Security → "2-Step Verification"
   - Scroll down to "App passwords"
   - Select app: "Mail"
   - Select device: "Windows Computer"
   - Click "Generate"
   - **Copy the 16-character password** (e.g., "abcd efgh ijkl mnop")

### B. Twilio Setup (for WhatsApp OTP)

1. **Sign up for Twilio:**
   - Go to: https://www.twilio.com/try-twilio
   - Create a free account
   - Verify your email and phone number

2. **Get Your Credentials:**
   - From the Twilio Console Dashboard, copy:
     - **Account SID** (starts with "AC...")
     - **Auth Token** (click to reveal)

3. **Enable WhatsApp Sandbox:**
   - In Twilio Console → Messaging → Try it out → Send a WhatsApp message
   - You'll see a number like **+1 415 523 8886**
   - Send "join [your-sandbox-keyword]" to that number from YOUR WhatsApp
   - You'll get a confirmation message

## Step 3: Create .env File

1. Copy the example file:
   ```
   cp .env.example .env
   ```

2. Open `.env` and fill in your credentials:

```env
# Your Gmail address
EMAIL_USER=your-email@gmail.com

# The 16-character App Password from Gmail (remove spaces)
EMAIL_PASSWORD=abcdefghijklmnop

# From Twilio Dashboard
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here

# Twilio WhatsApp number (from sandbox)
TWILIO_WHATSAPP_NUMBER=+14155238886

# Server port
PORT=3000
```

## Step 4: Start the Server

```bash
npm start
```

You should see:
```
🚀 CampusMart server running on http://localhost:3000
📧 Email service: Ready
📱 WhatsApp service: Ready
```

## Step 5: Test It Out!

1. Open browser: http://localhost:3000
2. Click "Login" → "Create an account"
3. Fill in your details with YOUR email and WhatsApp number
4. Check your email for verification link
5. Check your WhatsApp for OTP code

## 🔧 Troubleshooting

### Email not sending?
- Make sure you're using the App Password, not your regular Gmail password
- Check that 2-Step Verification is enabled
- Remove spaces from the App Password in .env

### WhatsApp not working?
- Make sure you sent "join [keyword]" to the Twilio WhatsApp number
- Check that your WhatsApp number is in international format (+254...)
- Verify Account SID and Auth Token are correct

### Server won't start?
- Make sure all dependencies installed: `npm install`
- Check that .env file exists and has all values
- Make sure port 3000 is not in use

## 📱 Testing WhatsApp

When testing, use YOUR actual WhatsApp number that you connected to Twilio sandbox. The OTP will be sent to that number.

## 🎉 You're Live!

Once everything is working:
- Users will receive REAL verification emails
- Users will receive REAL WhatsApp OTP codes
- The marketplace is fully functional!

---

Need help? Check the console logs for detailed error messages.
