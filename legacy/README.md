# CampusMart - JKUAT Student Marketplace

A modern, handcrafted marketplace for JKUAT students with real email and WhatsApp authentication.

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install express nodemailer twilio cors dotenv
```

### 2. Configure Email (Gmail)

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" and "Windows Computer"
   - Copy the generated password

### 3. Configure WhatsApp (Twilio)

1. Sign up for Twilio: https://www.twilio.com/try-twilio
2. Get your Account SID and Auth Token from the dashboard
3. Enable WhatsApp Sandbox:
   - Go to Messaging → Try it out → Send a WhatsApp message
   - Follow instructions to connect your WhatsApp
4. Copy your WhatsApp number (usually +14155238886 for sandbox)

### 4. Create .env File

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_WHATSAPP_NUMBER=+14155238886
PORT=3000
```

### 5. Run the Server

```bash
node server.js
```

The app will be available at: http://localhost:3000

## 📧 Email Verification Flow

1. User signs up with email, name, WhatsApp, and password
2. System sends verification email to user's inbox
3. User clicks the link in email
4. Account is verified and ready to use

## 📱 WhatsApp Login Flow

1. User enters WhatsApp number
2. System sends 6-digit OTP via WhatsApp
3. User enters OTP code
4. User is logged in

## 🔒 Security Notes

- Never commit `.env` file to Git
- Use strong App Passwords
- OTPs expire after 5 minutes
- Verification links expire after 24 hours

## 🎨 Features

- JKUAT-themed design (Green & Red)
- Real email verification
- WhatsApp OTP authentication
- Product marketplace
- User dashboard
- Seller verification badges

## 📝 Testing

For testing WhatsApp in Twilio Sandbox:
1. Send "join <sandbox-keyword>" to the Twilio WhatsApp number
2. Your number is now connected to the sandbox
3. You'll receive OTPs on this number

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Email**: Nodemailer (Gmail)
- **WhatsApp**: Twilio API
- **Styling**: Custom CSS with JKUAT colors

## 📞 Support

For issues or questions, contact the development team.

---

Built with ❤️ for JKUAT students
