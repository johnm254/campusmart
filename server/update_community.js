const db = require('./db');

async function updateCommunitySchema() {
    try {
        // 1. Create community_posts table
        await db.query(`
            CREATE TABLE IF NOT EXISTS community_posts (
                id SERIAL PRIMARY KEY,
                author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                type VARCHAR(50) DEFAULT 'discussion', -- discussion, announcement, events
                likes_count INTEGER DEFAULT 0,
                comments_count INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('community_posts table verified.');

        // 2. Create post_likes table to track who liked what
        await db.query(`
            CREATE TABLE IF NOT EXISTS post_likes (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, post_id)
            );
        `);
        console.log('post_likes table verified.');

        // 3. Create post_comments table (for later expansion)
        await db.query(`
            CREATE TABLE IF NOT EXISTS post_comments (
                id SERIAL PRIMARY KEY,
                post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('post_comments table verified.');

    } catch (err) {
        console.error('Error updating community schema:', err.message);
    } finally {
        process.exit();
    }
}

updateCommunitySchema();
