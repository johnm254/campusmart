const { Client } = require('pg');
require('dotenv').config();

async function checkSchema() {
    const client = new Client({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    try {
        await client.connect();

        console.log('--- Messages Table ---');
        const res = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'messages'");
        console.log(res.rows);

        console.log('\n--- Admin Users ---');
        const res2 = await client.query("SELECT id, full_name, is_admin FROM users WHERE is_admin = true");
        console.log(res2.rows);

        await client.end();
    } catch (err) {
        console.error('Check failed:', err.message);
    }
}

checkSchema();
