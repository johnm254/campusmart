const db = require('./db');

async function updateReviewsTable() {
    try {
        console.log('Updating user_reviews table to support replies and helpfulness...');

        // 1. Add parent_id for replies
        await db.query(`
            ALTER TABLE user_reviews 
            ADD COLUMN IF NOT EXISTS parent_id INTEGER REFERENCES user_reviews(id) ON DELETE CASCADE;
        `);

        // 2. Add helpful_votes (JSON or separate table, let's use a simple count for now or just allow multiple comments)
        // Actually, let's remove the UNIQUE constraint to allow replies
        await db.query(`
            ALTER TABLE user_reviews 
            DROP CONSTRAINT IF EXISTS user_reviews_reviewer_id_reviewee_id_key;
        `);

        console.log('✅ user_reviews table updated successfully.');
    } catch (err) {
        console.error('❌ Error updating user_reviews table:', err.message);
    } finally {
        process.exit();
    }
}

updateReviewsTable();
