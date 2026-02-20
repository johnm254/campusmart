const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function initDB() {
    // 1. Connect to 'postgres' database first to create the target database
    const initialClient = new Client({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT || 5432,
        database: 'postgres'
    });

    console.log(`Attempting connection to ${process.env.DB_HOST}:${process.env.DB_PORT || 5432} as user "${process.env.DB_USER}"...`);

    try {
        await initialClient.connect();

        // Check if database exists
        const res = await initialClient.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [process.env.DB_NAME]);

        if (res.rowCount === 0) {
            await initialClient.query(`CREATE DATABASE ${process.env.DB_NAME}`);
            console.log(`✅ Database "${process.env.DB_NAME}" created.`);
        } else {
            console.log(`ℹ️ Database "${process.env.DB_NAME}" already exists.`);
        }
    } catch (error) {
        console.error('❌ Error creating database:', error.message);
    } finally {
        await initialClient.end();
    }

    // 2. Connect to the actual database to create tables
    const client = new Client({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME
    });

    try {
        await client.connect();
        console.log('Connected to target database. Ensuring tables...');

        // Users Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                whatsapp VARCHAR(20),
                avatar_url TEXT,
                is_admin BOOLEAN DEFAULT FALSE,
                is_banned BOOLEAN DEFAULT FALSE,
                is_verified BOOLEAN DEFAULT FALSE,
                verified_until TIMESTAMP,
                boost_type VARCHAR(50) DEFAULT NULL,
                last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Products Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                category VARCHAR(100),
                price DECIMAL(10, 2),
                location VARCHAR(255),
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

        // Messages Table
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

        // Wishlist Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS wishlist (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, product_id)
            )
        `);

        // User Reviews Table
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

        // Community Posts Table
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

        // Post Likes Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS post_likes (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, post_id)
            )
        `);

        // Post Comments Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS post_comments (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Transactions Table
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

        // Activity Logs Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS activity_logs (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                action VARCHAR(100) NOT NULL,
                metadata JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Password Resets Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS password_resets (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                token TEXT NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Site Settings Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS site_settings (
                key VARCHAR(100) PRIMARY KEY,
                value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Seed initial site settings if not exist
        await client.query(`
            INSERT INTO site_settings (key, value) VALUES 
            ('site_name', 'CampusMart'),
            ('maintenance_mode', 'false'),
            ('announcement', 'Welcome to CampusMart – The #1 JKUAT Student Marketplace!')
            ON CONFLICT (key) DO NOTHING
        `);

        console.log('✅ All tables ensured and initial settings seeded.');
        console.log('\nSUCCESS: Database initialization complete!');
    } catch (error) {
        console.error('\n❌ ERROR initializing tables:', error.message);
    } finally {
        await client.end();
        process.exit();
    }
}

initDB();
