/**
 * ════════════════════════════════════════════════════════════
 *  CAMPUSMART - MySQL Database Initializer
 *  Run this ONCE on HostPinnacle to create all tables.
 *
 *  Usage:
 *    node init-database-mysql.js
 *
 *  Prerequisites:
 *    - .env file must be configured with MySQL credentials
 *    - DB_TYPE=mysql in .env
 * ════════════════════════════════════════════════════════════
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mysql = require('mysql2/promise');

const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 3306,
    multipleStatements: true,
};

async function init() {
    console.log('🚀 CampusMart MySQL Database Initializer');
    console.log(`📡 Connecting to ${config.host}:${config.port} as ${config.user}...`);

    let conn;
    try {
        conn = await mysql.createConnection(config);
        console.log('✅ Connected to MySQL database.\n');
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
        process.exit(1);
    }

    const queries = [
        // ── Users ──────────────────────────────────────────────────────────────
        `CREATE TABLE IF NOT EXISTS users (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(255),
            email VARCHAR(255) UNIQUE,
            password VARCHAR(255),
            whatsapp VARCHAR(20),
            avatar_url TEXT,
            is_admin BOOLEAN DEFAULT FALSE,
            is_banned BOOLEAN DEFAULT FALSE,
            is_verified BOOLEAN DEFAULT FALSE,
            verified_until DATETIME,
            boost_type VARCHAR(50),
            last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,

        // ── Products ───────────────────────────────────────────────────────────
        `CREATE TABLE IF NOT EXISTS products (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(100),
            price DECIMAL(10, 2),
            location VARCHAR(255),
            latitude DECIMAL(10, 8),
            longitude DECIMAL(11, 8),
            metadata JSON,
            contact_phone VARCHAR(20),
            security_features TEXT,
            image_url TEXT,
            images JSON,
            seller_id INTEGER,
            condition_text VARCHAR(50) DEFAULT 'second-hand',
            description TEXT,
            views INTEGER DEFAULT 0,
            is_approved BOOLEAN DEFAULT TRUE,
            is_featured BOOLEAN DEFAULT FALSE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
        )`,

        // ── Messages ───────────────────────────────────────────────────────────
        `CREATE TABLE IF NOT EXISTS messages (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            sender_id INTEGER,
            receiver_id INTEGER,
            product_id INTEGER,
            content TEXT NOT NULL,
            is_delivered BOOLEAN DEFAULT FALSE,
            is_read BOOLEAN DEFAULT FALSE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
        )`,

        // ── Wishlist ───────────────────────────────────────────────────────────
        `CREATE TABLE IF NOT EXISTS wishlist (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            user_id INTEGER,
            product_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_wishlist (user_id, product_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )`,

        // ── User Reviews ──────────────────────────────────────────────────────
        `CREATE TABLE IF NOT EXISTS user_reviews (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            reviewer_id INTEGER,
            reviewee_id INTEGER,
            rating INTEGER CHECK (rating >= 1 AND rating <= 5),
            comment TEXT,
            parent_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (parent_id) REFERENCES user_reviews(id) ON DELETE CASCADE
        )`,

        // ── Community Posts ───────────────────────────────────────────────────
        `CREATE TABLE IF NOT EXISTS community_posts (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            author_id INTEGER,
            content TEXT NOT NULL,
            type VARCHAR(50) DEFAULT 'general',
            image_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
        )`,

        // ── Post Likes ────────────────────────────────────────────────────────
        `CREATE TABLE IF NOT EXISTS post_likes (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            user_id INTEGER,
            post_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_like (user_id, post_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE
        )`,

        // ── Post Comments ─────────────────────────────────────────────────────
        `CREATE TABLE IF NOT EXISTS post_comments (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            user_id INTEGER,
            post_id INTEGER,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE
        )`,

        // ── Transactions ──────────────────────────────────────────────────────
        `CREATE TABLE IF NOT EXISTS transactions (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            user_id INTEGER,
            amount DECIMAL(10, 2) NOT NULL,
            type VARCHAR(100),
            status VARCHAR(50) DEFAULT 'pending',
            checkout_request_id VARCHAR(100),
            plan VARCHAR(50),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`,

        // ── Activity Logs ─────────────────────────────────────────────────────
        `CREATE TABLE IF NOT EXISTS activity_logs (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            user_id INTEGER,
            action VARCHAR(100) NOT NULL,
            metadata JSON,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        )`,

        // ── Password Resets ───────────────────────────────────────────────────
        `CREATE TABLE IF NOT EXISTS password_resets (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            token TEXT NOT NULL,
            expires_at DATETIME NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,

        // ── Site Settings ─────────────────────────────────────────────────────
        `CREATE TABLE IF NOT EXISTS site_settings (
            \`key\` VARCHAR(100) PRIMARY KEY,
            value TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`,

        // Seed default settings
        `INSERT IGNORE INTO site_settings (\`key\`, value)
         VALUES
           ('site_name', 'CampusMart'),
           ('maintenance_mode', 'false'),
           ('announcement', 'Welcome to CampusMart!')`,
    ];

    for (const sql of queries) {
        const preview = sql.trim().split('\n')[0].substring(0, 60);
        try {
            await conn.execute(sql);
            console.log(`  ✅ ${preview}...`);
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME' || err.code === 'ER_TABLE_EXISTS_ERROR') {
                console.log(`  ⚠️  Already exists (skipped): ${preview}...`);
            } else {
                console.error(`  ❌ Error: ${err.message}`);
                console.error(`     SQL: ${preview}`);
            }
        }
    }

    await conn.end();
    console.log('\n🎉 Database initialization complete!');
    console.log('   You can now start the backend: node index.js\n');
}

init().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
