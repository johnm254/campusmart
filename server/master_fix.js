const db = require('./db');

async function masterFix() {
    try {
        console.log('--- MASTER DATABASE FIX INITIATED ---');

        // 1. Fix Users Table (Add missing columns)
        console.log('Ensuring all columns exist in users table...');
        await db.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS verified_until TIMESTAMP;
        `);

        // 2. Ensure Admin User exists (for testing/access)
        // If there's an existing user you use, we can upgrade them.
        // Or just ensure the first user ever registered becomes admin if none exist?
        // Let's just set a specific email as admin if it exists.
        await db.query("UPDATE users SET is_admin = TRUE WHERE email = 'admin@campusmart.com'");

        // 3. Activity Logs Table
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

        // 4. Transactions Table
        console.log('Ensuring transactions table exists...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                amount DECIMAL(10, 2) NOT NULL,
                type VARCHAR(50), -- verification, boost, etc.
                status VARCHAR(20) DEFAULT 'completed',
                reference_id VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 5. Site Settings Table
        console.log('Ensuring site_settings table exists...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS site_settings (
                key VARCHAR(100) PRIMARY KEY,
                value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Seed default settings if empty
        const settingsCount = await db.query('SELECT COUNT(*) FROM site_settings');
        if (parseInt(settingsCount.rows[0].count) === 0) {
            await db.query(`
                INSERT INTO site_settings (key, value) VALUES 
                ('site_name', 'CampusMart'),
                ('maintenance_mode', 'false'),
                ('announcement', 'Welcome to the new CampusMart core!'),
                ('contact_email', 'support@campusmart.com')
                ON CONFLICT (key) DO NOTHING
            `);
        }

        // 6. Community Tables
        console.log('Ensuring community tables exist...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS community_posts (
                id SERIAL PRIMARY KEY,
                author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                type VARCHAR(50) DEFAULT 'discussion',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS post_likes (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, post_id)
            );
            CREATE TABLE IF NOT EXISTS post_comments (
                id SERIAL PRIMARY KEY,
                post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 7. Password Resets
        console.log('Ensuring password_resets table exists...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS password_resets (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                token VARCHAR(255) NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 8. Views and Approval column in products
        console.log('Ensuring products table has views and is_approved columns...');
        await db.query(`
            ALTER TABLE products 
            ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT TRUE; -- Default TRUE so existing products don't disappear
        `);

        console.log('--- MASTER FIX COMPLETED SUCCESSFULLY ---');
    } catch (err) {
        console.error('CRITICAL ERROR in Master Fix:', err.message);
    } finally {
        process.exit();
    }
}

masterFix();
