const db = require('./db');

async function enhanceAdminSchema() {
    try {
        console.log('Starting Admin Schema Enhancement...');

        // 1. Add is_approved to products (default true for existing)
        await db.query(`
            ALTER TABLE products 
            ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT TRUE;
        `);
        console.log('Verified [is_approved] column in products.');

        // 2. Create Transactions table to track revenue
        // Focus on verification payments for now
        await db.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                amount DECIMAL(10, 2) NOT NULL,
                type VARCHAR(50) DEFAULT 'verification',
                status VARCHAR(50) DEFAULT 'completed',
                mpesa_checkout_id VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Verified [transactions] table.');

        // 3. Create Site Settings table
        await db.query(`
            CREATE TABLE IF NOT EXISTS site_settings (
                key VARCHAR(100) PRIMARY KEY,
                value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Verified [site_settings] table.');

        // 4. Create User Activity Logs
        await db.query(`
            CREATE TABLE IF NOT EXISTS activity_logs (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                action VARCHAR(255),
                metadata JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Verified [activity_logs] table.');

        console.log('Admin Schema Enhancement COMPLETED successfully.');

    } catch (err) {
        console.error('Error enhancing admin schema:', err.message);
    } finally {
        process.exit();
    }
}

enhanceAdminSchema();
