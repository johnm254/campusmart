const db = require('./db');

async function cleanupData() {
    try {
        console.log('🧹 Starting thorough data cleanup...');

        // 1. Delete all chat messages
        await db.query('DELETE FROM messages');
        console.log('✅ All chat messages deleted.');

        // 2. Delete all seller reviews (trader feedback)
        await db.query('DELETE FROM user_reviews');
        console.log('✅ All seller reviews deleted.');

        // 3. Delete all community post comments
        await db.query('DELETE FROM post_comments');
        console.log('✅ All community post comments deleted.');

        // 4. Delete all post likes
        await db.query('DELETE FROM post_likes');
        await db.query('UPDATE community_posts SET likes_count = 0, comments_count = 0');
        console.log('✅ All community likes and interaction counts reset.');

        // 5. Reset boost packages/verification for all users
        await db.query(`
            UPDATE users 
            SET is_verified = FALSE, 
                boost_type = NULL, 
                verified_until = NULL
        `);
        console.log('✅ Boost packages and verification removed from all users.');

        // 6. Clear transaction history
        await db.query('DELETE FROM transactions');
        console.log('✅ All transaction history cleared.');

        console.log('🚀 Thorough cleanup complete!');
    } catch (err) {
        console.error('❌ Error during cleanup:', err.message);
    } finally {
        process.exit();
    }
}

cleanupData();
