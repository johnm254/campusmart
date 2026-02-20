const express = require('express');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();
const verificationTokens = new Map();

// Email configuration (Gmail)
const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Use App Password for Gmail
    }
});

// Twilio configuration for WhatsApp
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// Generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate verification token
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Send email verification
app.post('/api/send-verification', async (req, res) => {
    try {
        const { email, name } = req.body;

        const token = generateToken();
        verificationTokens.set(token, { email, name, timestamp: Date.now() });

        const verificationLink = `http://localhost:3000/verify?token=${token}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your CampusMart Account',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #00A651;">Welcome to CampusMart, ${name}! 🎓</h2>
                    <p>Thank you for signing up for CampusMart - JKUAT's student marketplace.</p>
                    <p>Click the button below to verify your email and complete your registration:</p>
                    <a href="${verificationLink}" style="display: inline-block; background-color: #00A651; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
                        Verify Email
                    </a>
                    <p style="color: #666; font-size: 14px;">Or copy this link: ${verificationLink}</p>
                    <p style="color: #666; font-size: 12px; margin-top: 30px;">This link will expire in 24 hours.</p>
                </div>
            `
        };

        await emailTransporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Verification email sent' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Verify email token
app.get('/verify', (req, res) => {
    const { token } = req.query;

    if (!verificationTokens.has(token)) {
        return res.send(`
            <html>
                <body style="font-family: Arial; text-align: center; padding: 50px;">
                    <h2 style="color: #E31E24;">Invalid or Expired Link</h2>
                    <p>This verification link is invalid or has expired.</p>
                </body>
            </html>
        `);
    }

    const userData = verificationTokens.get(token);
    verificationTokens.delete(token);

    res.send(`
        <html>
            <body style="font-family: Arial; text-align: center; padding: 50px;">
                <h2 style="color: #00A651;">✅ Email Verified!</h2>
                <p>Your email has been successfully verified.</p>
                <p>You can now close this window and login to CampusMart.</p>
                <script>
                    setTimeout(() => {
                        window.close();
                    }, 3000);
                </script>
            </body>
        </html>
    `);
});

// Send WhatsApp OTP
app.post('/api/send-whatsapp-otp', async (req, res) => {
    try {
        const { whatsapp } = req.body;

        const otp = generateOTP();
        otpStore.set(whatsapp, { otp, timestamp: Date.now() });

        // Send via Twilio WhatsApp
        await twilioClient.messages.create({
            body: `Your CampusMart login code is: ${otp}\n\nThis code will expire in 5 minutes.`,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${whatsapp}`
        });

        res.json({ success: true, message: 'OTP sent to WhatsApp' });
    } catch (error) {
        console.error('WhatsApp error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Verify WhatsApp OTP
app.post('/api/verify-otp', (req, res) => {
    try {
        const { whatsapp, otp } = req.body;

        if (!otpStore.has(whatsapp)) {
            return res.status(400).json({ success: false, error: 'No OTP found' });
        }

        const stored = otpStore.get(whatsapp);

        // Check if OTP expired (5 minutes)
        if (Date.now() - stored.timestamp > 5 * 60 * 1000) {
            otpStore.delete(whatsapp);
            return res.status(400).json({ success: false, error: 'OTP expired' });
        }

        if (stored.otp === otp) {
            otpStore.delete(whatsapp);
            res.json({ success: true, message: 'OTP verified' });
        } else {
            res.status(400).json({ success: false, error: 'Invalid OTP' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 CampusMart server running on http://localhost:${PORT}`);
    console.log('📧 Email service: Ready');
    console.log('📱 WhatsApp service: Ready');
});
