const db = require('./db');

async function updatePremiumSchema() {
    try {
        // 1. Add is_verified and verified_until to users table
        await db.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS verified_until TIMESTAMP;
        `);
        console.log('Premium columns added to users table.');

        // 2. Add is_featured to products table for individual item boosts (optional expansion)
        await db.query(`
            ALTER TABLE products 
            ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
        `);
        console.log('Products table updated with boost capability.');

    } catch (err) {
        console.error('Error updating premium schema:', err.message);
    } finally {
        process.exit();
    }
}

updatePremiumSchema();
