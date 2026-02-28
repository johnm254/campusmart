const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║         CAMPUSMART - DATABASE INITIALIZATION                  ║');
console.log('╚════════════════════════════════════════════════════════════════╝');
console.log('');

// Database configuration
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
});

async function initializeDatabase() {
    try {
        console.log('📋 Configuration:');
        console.log('   Host:', process.env.DB_HOST);
        console.log('   Database:', process.env.DB_NAME);
        console.log('   User:', process.env.DB_USER);
        console.log('   Port:', process.env.DB_PORT || 5432);
        console.log('');

        console.log('🔌 Testing connection...');
        await pool.query('SELECT NOW()');
        console.log('✅ Database connection successful!');
        console.log('');

        console.log('📊 Creating tables...');
        
        // Users table
        await pool.query(`
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
        console.log('✓ Users table created');

        // Products table
        await pool.query(`
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
        console.log('✓ Products table created');

        // Messages table
        await pool.query(`
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
        console.log('✓ Messages table created');

        // Wishlist table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS wishlist (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, product_id)
            )
        `);
        console.log('✓ Wishlist table created');

        // User reviews table
        await pool.query(`
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
        console.log('✓ User reviews table created');

        // Community posts table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS community_posts (
                id SERIAL PRIMARY KEY,
                author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                type VARCHAR(50) DEFAULT 'general',
                image_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Community posts table created');

        // Post likes table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS post_likes (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, post_id)
            )
        `);
        console.log('✓ Post likes table created');

        // Post comments table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS post_comments (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Post comments table created');

        // Transactions table
        await pool.query(`
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
        console.log('✓ Transactions table created');

        // Activity logs table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS activity_logs (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                action VARCHAR(100) NOT NULL,
                metadata JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Activity logs table created');

        // Password resets table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS password_resets (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                token TEXT NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Password resets table created');

        // Site settings table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS site_settings (
                key VARCHAR(100) PRIMARY KEY,
                value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Site settings table created');

        // Insert default settings
        await pool.query(`
            INSERT INTO site_settings (key, value) 
            VALUES 
                ('site_name', 'CampusMart'),
                ('maintenance_mode', 'false'),
                ('announcement', 'Welcome to CampusMart!')
            ON CONFLICT (key) DO NOTHING
        `);
        console.log('✓ Default settings inserted');

        console.log('');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('✅ DATABASE INITIALIZATION COMPLETE!');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('');
        console.log('Your database is ready for production use.');
        console.log('You can now start the backend server: npm start');
        console.log('');

        await pool.end();
        process.exit(0);

    } catch (error) {
        console.error('');
        console.error('═══════════════════════════════════════════════════════════════');
        console.error('❌ DATABASE INITIALIZATION FAILED');
        console.error('═══════════════════════════════════════════════════════════════');
        console.error('');
        console.error('Error:', error.message);
        console.error('');
        console.error('Common issues:');
        console.error('1. Database credentials are incorrect');
        console.error('2. Database does not exist');
        console.error('3. User does not have sufficient privileges');
        console.error('4. PostgreSQL server is not running');
        console.error('');
        console.error('Please check your .env file and database configuration.');
        console.error('');

        await pool.end();
        process.exit(1);
    }
}

initializeDatabase();
