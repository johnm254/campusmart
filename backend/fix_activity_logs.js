const db = require('./db');

async function fixActivityLogs() {
    try {
        console.log('Ensuring activity_logs table exists...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS activity_logs (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                action VARCHAR(255) NOT NULL,
                metadata JSONB DEFAULT '{}',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('activity_logs table checked/created.');

        // Check for premium columns just in case
        await db.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS verified_until TIMESTAMP;
        `);
        console.log('Users table premium columns checked.');

    } catch (err) {
        console.error('Error in fixActivityLogs:', err.message);
    } finally {
        process.exit();
    }
}

fixActivityLogs();
