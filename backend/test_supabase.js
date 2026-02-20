const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function testSupabase() {
    console.log('--- SUPABASE CONNECTION TEST ---');
    console.log('Attempting to connect with:', process.env.DATABASE_URL ? 'DATABASE_URL' : 'Individual Params');

    const pool = process.env.DATABASE_URL
        ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
        : new Pool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 5432,
        });

    try {
        const start = Date.now();
        const res = await pool.query('SELECT NOW() as now, version() as ver');
        console.log('✅ CONNECTION SUCCESSFUL!');
        console.log('Server Time:', res.rows[0].now);
        console.log('PostgreSQL Version:', res.rows[0].ver);
        console.log('Latency:', Date.now() - start, 'ms');
    } catch (err) {
        console.error('❌ CONNECTION FAILED!');
        console.error('Error Detail:', err.message);
        if (err.message.includes('password authentication failed')) {
            console.log('\nHINT: Your database password in .env might be incorrect.');
        } else if (err.message.includes('ENOTFOUND') || err.message.includes('ETIMEDOUT')) {
            console.log('\nHINT: Could not reach the host. Check your DB_HOST or DATABASE_URL.');
        }
    } finally {
        await pool.end();
        process.exit();
    }
}

testSupabase();
