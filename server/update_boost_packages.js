const db = require('./db');

async function updateBoostPackages() {
    try {
        console.log('🔄 Updating database for Boost Packages...');

        // 1. Add boost_type and verified_until to users
        await db.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS boost_type VARCHAR(50) DEFAULT NULL,
            ADD COLUMN IF NOT EXISTS verified_until TIMESTAMP DEFAULT NULL;
        `);
        console.log('✅ User table updated with boost_type and verified_until.');

        // 2. Add multiple images support to products
        // We'll use a TEXT column 'images' to store a JSON array of URLs
        await db.query(`
            ALTER TABLE products 
            ADD COLUMN IF NOT EXISTS images TEXT DEFAULT NULL;
        `);
        console.log('✅ Products table updated with images (multiple photos) support.');

        // 3. Ensure transactions table exists and can store type
        await db.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                amount DECIMAL(10, 2) NOT NULL,
                type VARCHAR(50) NOT NULL, -- 'starter_boost', 'power_boost'
                status VARCHAR(20) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Transactions table verified.');

        console.log('🚀 Boost package schema update complete!');
    } catch (err) {
        console.error('❌ Error updating boost schema:', err.message);
    } finally {
        process.exit();
    }
}

updateBoostPackages();
