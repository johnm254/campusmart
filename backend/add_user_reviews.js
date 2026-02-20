const db = require('./db');

async function addReviewsTable() {
    try {
        console.log('Adding user_reviews table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS user_reviews (
                id SERIAL PRIMARY KEY,
                reviewer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                reviewee_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                rating INTEGER CHECK (rating >= 1 AND rating <= 5),
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(reviewer_id, reviewee_id)
            );
        `);
        console.log('✅ user_reviews table created successfully.');
    } catch (err) {
        console.error('❌ Error creating user_reviews table:', err.message);
    } finally {
        process.exit();
    }
}

addReviewsTable();
