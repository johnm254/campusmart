const axios = require('axios');

// Helper to format date as YYYYMMDDHHMMSS (EAT timezone for Kenya)
const getTimestamp = () => {
    const date = new Date();
    const YYYY = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const DD = String(date.getDate()).padStart(2, '0');
    const HH = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${YYYY}${MM}${DD}${HH}${mm}${ss}`;
};

// ─── Get M-Pesa Access Token ────────────────────────────────────────────────
const getAccessToken = async (req, res, next) => {
    const consumer_key = process.env.MPESA_CONSUMER_KEY;
    const consumer_secret = process.env.MPESA_CONSUMER_SECRET;

    // 1. Check that credentials exist in .env
    if (!consumer_key || !consumer_secret) {
        console.error('[M-Pesa] Missing MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET in server/.env');
        return res.status(500).json({
            message: 'M-Pesa credentials are not configured on the server.',
            hint: 'Add MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET to server/.env'
        });
    }

    const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
    const encodedCredentials = Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64');

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Basic ${encodedCredentials}`,
                'Content-Type': 'application/json'
            },
            timeout: 15000 // 15 second timeout
        });

        if (!response.data || !response.data.access_token) {
            console.error('[M-Pesa] No access_token in Safaricom response:', response.data);
            return res.status(502).json({
                message: 'Safaricom returned an unexpected response. Please try again.',
                detail: response.data
            });
        }

        req.mpesaToken = response.data.access_token;
        console.log('[M-Pesa] Access token obtained successfully.');
        next();

    } catch (error) {
        // Distinguish specific errors for better debugging
        if (error.code === 'ECONNABORTED') {
            console.error('[M-Pesa] Token request timed out.');
            return res.status(504).json({ message: 'M-Pesa request timed out. Check your internet connection.' });
        }

        if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            console.error('[M-Pesa] Cannot reach Safaricom servers:', error.code);
            return res.status(503).json({ message: 'Cannot reach Safaricom servers. Check your internet connection.', code: error.code });
        }

        if (error.response) {
            const status = error.response.status;
            console.error(`[M-Pesa] Safaricom returned HTTP ${status} during token generation.`);

            if (status === 400 || status === 401) {
                return res.status(401).json({
                    message: 'M-Pesa credentials rejected by Safaricom (HTTP ' + status + ').',
                    hint: 'Your Consumer Key or Secret may have expired. Visit https://developer.safaricom.co.ke to get fresh sandbox credentials and update server/.env',
                    safaricomStatus: status
                });
            }

            return res.status(502).json({
                message: `Safaricom API error (HTTP ${status}). Please try again later.`,
                safaricomStatus: status
            });
        }

        console.error('[M-Pesa] Unexpected token error:', error.message);
        return res.status(500).json({ message: 'Unexpected error generating M-Pesa token.', detail: error.message });
    }
};

const db = require('./db');

// ─── Initiate STK Push ───────────────────────────────────────────────────────
const stkPush = async (req, res) => {
    try {
        const { amount, phone, accountReference, plan } = req.body;
        const userId = req.user.id; // From verifyToken middleware
        const token = req.mpesaToken; // Set by getAccessToken middleware

        if (!amount || !phone || !plan) {
            return res.status(400).json({ message: 'amount, phone and plan are required.' });
        }

        // M-Pesa credentials from environment variables
        const shortCode = process.env.MPESA_SHORTCODE || 174379;
        const passkey = process.env.MPESA_PASSKEY;

        const timestamp = getTimestamp();
        const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

        const url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

        const requestBody = {
            BusinessShortCode: shortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: Math.ceil(amount),
            PartyA: phone,
            PartyB: shortCode,
            PhoneNumber: phone,
            CallBackURL: `${process.env.APP_URL || 'https://campusmart.example.com'}/api/mpesa/callback`,
            AccountReference: accountReference || `Plan: ${plan}`,
            TransactionDesc: `CampusMart ${plan} Boost`
        };

        console.log('[M-Pesa] Sending STK Push to:', phone, 'Amount:', amount);

        const response = await axios.post(url, requestBody, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            timeout: 15000
        });

        const data = response.data;

        if (data.ResponseCode && data.ResponseCode === '0') {
            // Record PENDING transaction in DB
            await db.query(
                'INSERT INTO transactions (user_id, amount, type, status, checkout_request_id, plan) VALUES ($1, $2, $3, $4, $5, $6)',
                [userId, amount, `${plan}_boost`, 'pending', data.CheckoutRequestID, plan]
            );

            return res.status(200).json({
                message: 'STK Push sent!',
                checkoutRequestID: data.CheckoutRequestID
            });
        }

        return res.status(400).json({
            message: data.ResponseDescription || 'STK Push failed.'
        });

    } catch (error) {
        console.error('[M-Pesa] STK Push error:', error.message);
        return res.status(500).json({ message: 'Unexpected error during STK Push.' });
    }
};

// ─── Query Transaction Status ───────────────────────────────────────────────
const queryStatus = async (req, res) => {
    try {
        const { checkoutRequestId } = req.params;
        const result = await db.query(
            'SELECT * FROM transactions WHERE checkout_request_id = $1',
            [checkoutRequestId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const transaction = result.rows[0];
        res.json({
            status: transaction.status, // 'pending', 'completed', 'failed'
            plan: transaction.plan
        });
    } catch (error) {
        res.status(500).json({ message: 'Error checking status' });
    }
};

module.exports = { getAccessToken, stkPush, queryStatus };
