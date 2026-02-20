const db = require('./db');

async function updateSchema() {
    try {
        // Add views column to products if it doesn't exist
        await db.query(`
            ALTER TABLE products 
            ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
        `);
        console.log('Schema updated successfully: products.views column added/verified.');

        // Ensure wishlist table exists (just in case)
        await db.query(`
            CREATE TABLE IF NOT EXISTS wishlist (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, product_id)
            );
        `);
        console.log('Wishlist table verified.');

        // Ensure messages table exists
        await db.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
                content TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                is_delivered BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Messages table verified.');

    } catch (err) {
        console.error('Error updating schema:', err.message);
    } finally {
        process.exit();
    }
}

updateSchema();
