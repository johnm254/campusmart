require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
    const dbType = process.env.DB_TYPE || 'postgres';
    
    console.log('========================================');
    console.log('  DATABASE CONNECTION TEST');
    console.log('========================================');
    console.log('Database Type:', dbType.toUpperCase());
    console.log('Host:', process.env.DB_HOST);
    console.log('Database:', process.env.DB_NAME);
    console.log('User:', process.env.DB_USER);
    console.log('Port:', process.env.DB_PORT);
    console.log('========================================\n');

    if (dbType === 'mysql') {
        // Test MySQL connection
        let conn;
        try {
            console.log('Connecting to MySQL...');
            conn = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
                port: parseInt(process.env.DB_PORT) || 3306
            });

            console.log('✅ MySQL connection successful!\n');
            
            const [rows] = await conn.execute('SELECT NOW() as current_time');
            console.log('Current time from database:', rows[0].current_time);
            
            // Test if tables exist
            const [tables] = await conn.execute('SHOW TABLES');
            console.log('\nTables in database:', tables.length);
            if (tables.length > 0) {
                console.log('Sample tables:', tables.slice(0, 5).map(t => Object.values(t)[0]).join(', '));
            }
            
            await conn.end();
            console.log('\n✅ All tests passed!');
            process.exit(0);
        } catch (error) {
            console.error('\n❌ MySQL connection failed!');
            console.error('Error:', error.message);
            console.error('\nPlease check:');
            console.error('1. MySQL is running on HostPinnacle');
            console.error('2. Database credentials are correct');
            console.error('3. Database "ricoanco_campusmart" exists');
            console.error('4. User "ricoanco_campusmart" has access');
            
            if (conn) await conn.end();
            process.exit(1);
        }
    } else {
        // Test PostgreSQL connection
        const { Pool } = require('pg');
        const pool = new Pool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 5432,
        });

        try {
            console.log('Connecting to PostgreSQL...');
            const result = await pool.query('SELECT NOW()');
            console.log('\n✅ PostgreSQL connection successful!');
            console.log('Current time from database:', result.rows[0].now);
            
            await pool.end();
            process.exit(0);
        } catch (error) {
            console.error('\n❌ PostgreSQL connection failed!');
            console.error('Error:', error.message);
            console.error('\nPlease check:');
            console.error('1. PostgreSQL is running');
            console.error('2. Database credentials in .env are correct');
            console.error('3. Database exists');
            
            process.exit(1);
        }
    }
}

testConnection();
