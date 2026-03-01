const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// FIX for 'self-signed certificate' error on some networks (Supabase)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Import the main application logic
require('./index.js');
