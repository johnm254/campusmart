require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: String(process.env.DB_PASS),
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 5432
});

async function runCheck() {
    console.log('\n========================================');
    console.log('  CAMPUSMART — SYSTEM HEALTH CHECK');
    console.log('========================================\n');

    // 1. Database connection
    try {
        await pool.query('SELECT 1');
        console.log('✅  Database:       CONNECTED');
    } catch (e) {
        console.error('❌  Database:       FAILED —', e.message);
        process.exit(1);
    }

    // 2. Tables check
    const REQUIRED_TABLES = [
        'users', 'products', 'wishlist', 'messages',
        'community_posts', 'post_likes', 'post_comments',
        'user_reviews', 'password_resets',
        'transactions', 'activity_logs', 'site_settings'
    ];
    const res = await pool.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
    );
    const existing = res.rows.map(r => r.table_name);
    console.log(`\n📋  Database Tables (${existing.length} found):`);
    for (const table of REQUIRED_TABLES) {
        if (existing.includes(table)) {
            console.log(`    ✅  ${table}`);
        } else {
            console.log(`    ❌  MISSING: ${table}`);
        }
    }

    // 3. Row counts per table
    console.log('\n📊  Row Counts:');
    for (const table of existing) {
        try {
            const r = await pool.query(`SELECT COUNT(*) FROM ${table}`);
            console.log(`    ${table.padEnd(25)} ${r.rows[0].count} rows`);
        } catch (e) {
            console.log(`    ${table.padEnd(25)} ERROR: ${e.message}`);
        }
    }

    // 4. Env vars check
    console.log('\n🔑  Environment Variables:');
    const envVars = ['PORT', 'DB_HOST', 'DB_USER', 'DB_NAME', 'DB_PORT', 'JWT_SECRET', 'FRONTEND_URL', 'EMAIL_USER', 'MPESA_CONSUMER_KEY'];
    for (const v of envVars) {
        const val = process.env[v];
        if (val && val.length > 0) {
            const display = v.includes('SECRET') || v.includes('KEY') || v.includes('PASS')
                ? '[HIDDEN]'
                : val;
            console.log(`    ✅  ${v.padEnd(25)} ${display}`);
        } else {
            console.log(`    ❌  ${v.padEnd(25)} NOT SET`);
        }
    }

    // 5. Admin user check
    try {
        const admins = await pool.query('SELECT full_name, email FROM users WHERE is_admin = true');
        console.log(`\n👑  Admin Users (${admins.rows.length}):`);
        admins.rows.forEach(a => console.log(`    • ${a.full_name} <${a.email}>`));
        if (admins.rows.length === 0) console.log('    ⚠️  No admin accounts found!');
    } catch (e) {
        console.log('    ⚠️  Could not fetch admins:', e.message);
    }

    // 6. Recent activity
    try {
        const logs = await pool.query('SELECT action, created_at FROM activity_logs ORDER BY created_at DESC LIMIT 3');
        console.log('\n🕐  Recent Activity:');
        logs.rows.forEach(l => console.log(`    • [${new Date(l.created_at).toLocaleString()}] ${l.action}`));
        if (logs.rows.length === 0) console.log('    No activity yet');
    } catch (e) {
        console.log('    ⚠️  No activity_logs table yet');
    }

    console.log('\n========================================');
    console.log('  CHECK COMPLETE');
    console.log('========================================\n');
    pool.end();
}

runCheck().catch(e => {
    console.error('Fatal error:', e);
    pool.end();
});
