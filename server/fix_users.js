const db = require('./db');

async function fixUsersTable() {
    try {
        await db.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
        `);
        console.log('is_admin column added to users table.');

        // Let's make the search user an admin if they use the support email
        await db.query(`
            UPDATE users SET is_admin = true WHERE email = 'campusmart.care@gmail.com';
        `);
        console.log('Set campusmart.care@gmail.com as admin.');

    } catch (err) {
        console.error('Error fixing users table:', err.message);
    } finally {
        process.exit();
    }
}

fixUsersTable();
