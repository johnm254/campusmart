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
        console.log('Connecting to PostgreSQL...');

        // Check if database exists
        const res = await initialClient.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [process.env.DB_NAME]);

        if (res.rowCount === 0) {
            // Databases cannot be created inside transactions or with parameters in some PG drivers
            await initialClient.query(`CREATE DATABASE ${process.env.DB_NAME}`);
            console.log(`Database "${process.env.DB_NAME}" created.`);
        } else {
            console.log(`Database "${process.env.DB_NAME}" already exists.`);
        }
    } catch (error) {
        console.error('Error creating database:', error.message);
    } finally {
        await initialClient.end();
    }

    // 2. Connect to the new database to create tables
    const client = new Client({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME
    });

    try {
        await client.connect();

        // Create Users Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                whatsapp VARCHAR(20),
                avatar_url TEXT,
                last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Users table ensured.');

        // Create Products Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                category VARCHAR(100),
                price DECIMAL(10, 2),
                location VARCHAR(255),
                image_url TEXT,
                seller_id INTEGER REFERENCES users(id),
                condition_text VARCHAR(50) DEFAULT 'second-hand',
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Products table ensured.');

        // Create Messages Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
                content TEXT NOT NULL,
                is_delivered BOOLEAN DEFAULT false,
                is_read BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Messages table ensured.');

        // Create Wishlist Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS wishlist (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, product_id)
            )
        `);
        console.log('Wishlist table ensured.');

        console.log('\nSUCCESS: Your PostgreSQL database is ready!');
    } catch (error) {
        console.error('\nERROR initializing tables:', error.message);
    } finally {
        await client.end();
        process.exit();
    }
}

initDB();
