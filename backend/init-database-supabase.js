const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

/**
 * SUPABASE DATABASE INITIALIZATION SCRIPT
 * This script connects to your Supabase PostgreSQL instance and creates all necessary tables.
 */

async function initializeSupabase() {
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║         CAMPUSMART - SUPABASE/POSTGRES INITIALIZATION         ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('');

    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        console.error('❌ ERROR: DATABASE_URL is missing in your .env file.');
        console.log('   Go to Supabase -> Settings -> Database -> Connection String (URI)');
        process.exit(1);
    }

    // Supabase requires SSL for external connections
    const pool = new Pool({
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('🔌 Connecting to Supabase...');
        const client = await pool.connect();
        console.log('✅ Connected successfully!');
        console.log('');

        console.log('📊 Creating Schema...');

        // 1. Users Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                full_name VARCHAR(255),
                email VARCHAR(255) UNIQUE,
                password VARCHAR(255),
                whatsapp VARCHAR(20),
                avatar_url TEXT,
                is_admin BOOLEAN DEFAULT FALSE,
                is_banned BOOLEAN DEFAULT FALSE,
                is_verified BOOLEAN DEFAULT FALSE,
                verified_until TIMESTAMP,
                boost_type VARCHAR(50),
                last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Users table ready');

        // 2. Products Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                category VARCHAR(100),
                price DECIMAL(10, 2),
                location VARCHAR(255),
                latitude DECIMAL(10, 8),
                longitude DECIMAL(11, 8),
                metadata JSONB,
                contact_phone VARCHAR(20),
                security_features TEXT,
                image_url TEXT,
                images JSONB,
                seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                condition_text VARCHAR(50) DEFAULT 'second-hand',
                description TEXT,
                views INTEGER DEFAULT 0,
                is_approved BOOLEAN DEFAULT TRUE,
                is_featured BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Products table ready');

        // 3. Messages Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
                content TEXT NOT NULL,
                is_delivered BOOLEAN DEFAULT FALSE,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Messages table ready');

        // 4. Wishlist Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS wishlist (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, product_id)
            )
        `);
        console.log('✓ Wishlist table ready');

        // 5. Reviews Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_reviews (
                id SERIAL PRIMARY KEY,
                reviewer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                reviewee_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                rating INTEGER CHECK (rating >= 1 AND rating <= 5),
                comment TEXT,
                parent_id INTEGER REFERENCES user_reviews(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ User reviews table ready');

        // 6. Community Posts
        await client.query(`
            CREATE TABLE IF NOT EXISTS community_posts (
                id SERIAL PRIMARY KEY,
                author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                type VARCHAR(50) DEFAULT 'general',
                image_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Community posts table ready');

        // 7. Post Likes/Comments
        await client.query(`
            CREATE TABLE IF NOT EXISTS post_likes (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, post_id)
            )
        `);
        await client.query(`
            CREATE TABLE IF NOT EXISTS post_comments (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Community interactions ready');

        // 8. Transactions
        await client.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                amount DECIMAL(10, 2) NOT NULL,
                type VARCHAR(100),
                status VARCHAR(50) DEFAULT 'pending',
                checkout_request_id VARCHAR(100),
                plan VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Transactions table ready');

        // 9. Logs & Settings
        await client.query(`
            CREATE TABLE IF NOT EXISTS activity_logs (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                action VARCHAR(100) NOT NULL,
                metadata JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await client.query(`
            CREATE TABLE IF NOT EXISTS password_resets (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                token TEXT NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await client.query(`
            CREATE TABLE IF NOT EXISTS site_settings (
                key VARCHAR(100) PRIMARY KEY,
                value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Initialize default settings if they don't exist
        await client.query(`
            INSERT INTO site_settings (key, value) 
            VALUES ('site_name', 'CampusMart'), ('maintenance_mode', 'false'), ('contact_email', 'campusmart.care@gmail.com'), ('announcement', 'Welcome to CampusMart!')
            ON CONFLICT (key) DO NOTHING
        `);

        console.log('✓ Settings initialized');
        console.log('');
        console.log('🎉 SUCCESS: Supabase is now ready for CampusMart!');

        client.release();
    } catch (err) {
        console.error('🔥 CRITICAL ERROR during initialization:', err.message);
        console.log(err.stack);
    } finally {
        await pool.end();
    }
}

initializeSupabase();
