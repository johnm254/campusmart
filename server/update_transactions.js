const db = require('./db');

async function updateTransactionsTable() {
    try {
        console.log('🔄 updating transactions table for M-Pesa verification...');

        // Add checkout_request_id and plan columns
        await db.query(`
            ALTER TABLE transactions 
            ADD COLUMN IF NOT EXISTS checkout_request_id VARCHAR(100) DEFAULT NULL,
            ADD COLUMN IF NOT EXISTS plan VARCHAR(50) DEFAULT NULL;
        `);

        console.log('✅ Transactions table updated.');
    } catch (err) {
        console.error('❌ Error updating transactions:', err.message);
    } finally {
        process.exit();
    }
}

updateTransactionsTable();
