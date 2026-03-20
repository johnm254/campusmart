const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { queryLogger } = require('./src/middleware/queryLogger');

// FIX for 'self-signed certificate' error on some networks when connecting to Supabase
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/**
 * DATABASE ABSTRACTION LAYER
 * This module ensures compatibility between PostgreSQL (Development/Heroku/Railway)
 * and MySQL/MariaDB (commonly used on HostPinnacle/cPanel shared hosting).
 */

const dbType = process.env.DB_TYPE || 'postgres';
let pool;

if (dbType === 'mysql') {
    // MySQL implementation requires 'mysql2' package
    try {
        const mysql = require('mysql2/promise');
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        console.log('📦 Database: Initialized MySQL connection pool');
    } catch (err) {
        console.error('❌ MySQL Driver Error: Please run "npm install mysql2" to use MySQL.');
        process.exit(1);
    }
} else {
    // Default to PostgreSQL - Railway requires SSL configuration
    if (process.env.DATABASE_URL) {
        // Use DATABASE_URL with SSL configuration - Supabase (direct/pooler) & Railway require SSL
        const sslConfig = process.env.NODE_ENV === 'production' ||
            process.env.DATABASE_URL.includes('railway') ||
            process.env.DATABASE_URL.includes('supabase') ||
            process.env.DATABASE_URL.includes('pooler')
            ? { rejectUnauthorized: false }
            : false;

        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: sslConfig,
            connectionTimeoutMillis: 5000, // 5 seconds to give up if can't connect
            idleTimeoutMillis: 30000,
            max: 20, // Increased connection pool for better performance
            min: 2,  // Keep minimum connections alive
            acquireTimeoutMillis: 60000,
            createTimeoutMillis: 30000,
            destroyTimeoutMillis: 5000,
            reapIntervalMillis: 1000,
            createRetryIntervalMillis: 200
        });

        // Add error handling for pool events
        pool.on('error', (err) => {
            console.error('💥 Database pool error:', err);
            // Don't exit, just log the error
        });

        pool.on('connect', () => {
            console.log('✅ Database connection established');
        });

        pool.on('remove', () => {
            console.log('🔌 Database connection removed from pool');
        });
        console.log('📦 Database: Initialized PostgreSQL connection pool with SSL [v2.0-FIXED]');
    } else {
        // Local development without DATABASE_URL
        pool = new Pool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 5432,
        });
        console.log('📦 Database: Initialized PostgreSQL connection pool (local)');
    }
}

/**
 * Translates PostgreSQL-style queries ($1, $2) to MySQL style (?)
 * and handles common dialect differences.
 */
const translateQuery = (text) => {
    if (dbType === 'mysql') {
        // 1. Convert $1, $2, etc. to ?
        let mysqlText = text.replace(/\$\d+/g, '?');

        // 2. Data Type Mapping
        mysqlText = mysqlText.replace(/SERIAL PRIMARY KEY/gi, 'INT NOT NULL AUTO_INCREMENT PRIMARY KEY');
        mysqlText = mysqlText.replace(/JSONB/gi, 'JSON');
        mysqlText = mysqlText.replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP/gi, 'DATETIME DEFAULT CURRENT_TIMESTAMP');

        // 3. Handle Postgres-specific keywords
        mysqlText = mysqlText.replace(/NOW\(\)/gi, 'CURRENT_TIMESTAMP');
        mysqlText = mysqlText.replace(/ON CONFLICT \(.*\) DO NOTHING/gi, '');

        // 4. Handle "RETURNING" (MySQL doesn't support it - we strip it then handle in query function)
        mysqlText = mysqlText.replace(/ RETURNING \*/gi, '');
        mysqlText = mysqlText.replace(/ RETURNING id(, [a-z0-9_]+)*/gi, '');

        // 5. ILIKE to LIKE 
        mysqlText = mysqlText.replace(/ ILIKE /gi, ' LIKE ');

        // 6. Handle "IF NOT EXISTS" in ALTER TABLE (MySQL doesn't support it)
        mysqlText = mysqlText.replace(/ADD COLUMN IF NOT EXISTS/gi, 'ADD COLUMN');

        return mysqlText;
    }
    return text;
};

const query = async (text, params) => {
    const isReturning = / RETURNING /i.test(text);
    const translatedText = translateQuery(text, params);
    const startTime = Date.now();

    try {
        let result;
        
        if (dbType === 'mysql') {
            const [mysqlResult] = await pool.execute(translatedText, params);

            // For INSERT with RETURNING, MySQL needs a second query
            if (isReturning && text.trim().toUpperCase().startsWith('INSERT')) {
                // Better table name extraction
                const tableMatch = text.match(/INSERT INTO\s+([^\s\()]+)/i);
                if (tableMatch && mysqlResult.insertId) {
                    const tableName = tableMatch[1].replace(/["']/g, ''); // Clean quotes
                    const [rows] = await pool.execute(`SELECT * FROM ${tableName} WHERE id = ?`, [mysqlResult.insertId]);
                    result = { rows, count: rows.length };
                } else {
                    result = { rows: Array.isArray(mysqlResult) ? mysqlResult : [mysqlResult], count: mysqlResult.length || 1, insertId: mysqlResult.insertId };
                }
            } else {
                // Wrap standard result
                const rows = Array.isArray(mysqlResult) ? mysqlResult : [mysqlResult];
                result = { rows, count: rows.length, insertId: mysqlResult.insertId };
            }
        } else {
            result = await pool.query(translatedText, params);
        }

        // Log query performance
        const executionTime = Date.now() - startTime;
        queryLogger.logQuery(translatedText, params, executionTime);

        return result;
    } catch (err) {
        const executionTime = Date.now() - startTime;
        
        // Suppress "Column already exists" errors during MySQL init migrations
        if (dbType === 'mysql' && err.code === 'ER_DUP_FIELDNAME' && /ALTER TABLE/i.test(text)) {
            return { rows: [], count: 0, message: 'Column already exists (ignored)' };
        }

        // Handle connection errors gracefully
        if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.code === 'ETIMEDOUT') {
            console.error('🔌 Database connection error:', err.message);
            console.error('💡 Suggestion: Check DATABASE_URL and network connectivity');
        } else {
            // Log failed query
            queryLogger.logQuery(translatedText, params, executionTime);
            console.error('🔥 DB Query Error:', err.message);
            console.error('Statement:', translatedText);
        }
        
        throw err;
    }
};

module.exports = {
    query,
    pool,
    dbType,
    queryLogger
};
