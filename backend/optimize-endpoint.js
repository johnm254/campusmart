// Add this to your backend to create an optimization endpoint
const express = require('express');
const { query } = require('./db');

const router = express.Router();

router.post('/optimize-database', async (req, res) => {
    try {
        console.log('🚀 Starting database optimization...');
        
        const optimizations = [
            'CREATE INDEX IF NOT EXISTS idx_products_status ON products(status)',
            'CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)',
            'CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC)',
            'CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id)',
            'CREATE INDEX IF NOT EXISTS idx_products_price ON products(price)',
            'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
            'CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id)',
            'CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read)',
            'CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id)',
            'ANALYZE products',
            'ANALYZE users', 
            'ANALYZE messages'
        ];
        
        const results = [];
        
        for (const sql of optimizations) {
            try {
                await query(sql);
                results.push({ sql, status: 'success' });
                console.log(`✅ Applied: ${sql}`);
            } catch (error) {
                results.push({ sql, status: 'error', error: error.message });
                console.log(`❌ Failed: ${sql} - ${error.message}`);
            }
        }
        
        res.json({
            success: true,
            message: 'Database optimization completed',
            results
        });
        
    } catch (error) {
        console.error('Database optimization failed:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;