const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║         CAMPUSMART - DATABASE CONNECTION FIXER                ║');
console.log('╚════════════════════════════════════════════════════════════════╝');
console.log('');

// Display configuration
console.log('📋 Current Configuration:');
console.log('   Host:', process.env.DB_HOST || 'NOT SET');
console.log('   Port:', process.env.DB_PORT || '5432');
console.log('   Database:', process.env.DB_NAME || 'NOT SET');
console.log('   User:', process.env.DB_USER || 'NOT SET');
console.log('   Password:', process.env.DB_PASS ? '***' + process.env.DB_PASS.slice(-3) : 'NOT SET');
console.log('');

// Test 1: Connect to PostgreSQL server (without specific database)
async function testPostgresConnection() {
    console.log('[Test 1/3] Testing PostgreSQL server connection...');
    const pool = new Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'postgres', // Connect to default postgres database
        port: process.env.DB_PORT || 5432,
    });

    try {
        const result = await pool.query('SELECT version()');
        console.log('✅ PostgreSQL server is accessible');
        console.log('   Version:', result.rows[0].version.split(',')[0]);
        await pool.end();
        return true;
    } catch (error) {
        console.log('❌ Cannot connect to PostgreSQL server');
        console.log('   Error:', error.message);
        console.log('');
        console.log('🔧 FIXES:');
        console.log('   1. Make sure PostgreSQL is running:');
        console.log('      net start postgresql-x64-18');
        console.log('   2. Check if password is correct in backend/.env');
        console.log('   3. Check if PostgreSQL is listening on port', process.env.DB_PORT || 5432);
        await pool.end();
        return false;
    }
}

// Test 2: Check if database exists
async function testDatabaseExists() {
    console.log('');
    console.log('[Test 2/3] Checking if database exists...');
    const pool = new Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'postgres',
        port: process.env.DB_PORT || 5432,
    });

    try {
        const result = await pool.query(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            [process.env.DB_NAME]
        );

        if (result.rows.length > 0) {
            console.log('✅ Database "' + process.env.DB_NAME + '" exists');
            await pool.end();
            return true;
        } else {
            console.log('❌ Database "' + process.env.DB_NAME + '" does NOT exist');
            console.log('');
            console.log('🔧 CREATING DATABASE...');
            
            try {
                await pool.query('CREATE DATABASE ' + process.env.DB_NAME);
                console.log('✅ Database "' + process.env.DB_NAME + '" created successfully!');
                await pool.end();
                return true;
            } catch (createError) {
                console.log('❌ Failed to create database:', createError.message);
                console.log('');
                console.log('🔧 MANUAL FIX:');
                console.log('   Open pgAdmin and create database manually:');
                console.log('   1. Right-click "Databases" → Create → Database');
                console.log('   2. Name: ' + process.env.DB_NAME);
                console.log('   3. Owner: ' + process.env.DB_USER);
                console.log('   4. Click Save');
                await pool.end();
                return false;
            }
        }
    } catch (error) {
        console.log('❌ Error checking database:', error.message);
        await pool.end();
        return false;
    }
}

// Test 3: Connect to the specific database
async function testDatabaseConnection() {
    console.log('');
    console.log('[Test 3/3] Testing connection to "' + process.env.DB_NAME + '"...');
    const pool = new Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 5432,
    });

    try {
        const result = await pool.query('SELECT NOW() as current_time, current_database() as db_name');
        console.log('✅ Successfully connected to database!');
        console.log('   Database:', result.rows[0].db_name);
        console.log('   Server Time:', result.rows[0].current_time);
        
        // Check if tables exist
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);
        
        console.log('');
        console.log('📊 Database Tables (' + tables.rows.length + ' found):');
        if (tables.rows.length > 0) {
            tables.rows.forEach(row => {
                console.log('   ✓', row.table_name);
            });
        } else {
            console.log('   ⚠️  No tables found (will be created when backend starts)');
        }
        
        await pool.end();
        return true;
    } catch (error) {
        console.log('❌ Cannot connect to database "' + process.env.DB_NAME + '"');
        console.log('   Error:', error.message);
        await pool.end();
        return false;
    }
}

// Run all tests
async function runAllTests() {
    const test1 = await testPostgresConnection();
    if (!test1) {
        console.log('');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('❌ FAILED: Cannot connect to PostgreSQL server');
        console.log('═══════════════════════════════════════════════════════════════');
        process.exit(1);
    }

    const test2 = await testDatabaseExists();
    if (!test2) {
        console.log('');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('❌ FAILED: Database does not exist and could not be created');
        console.log('═══════════════════════════════════════════════════════════════');
        process.exit(1);
    }

    const test3 = await testDatabaseConnection();
    
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    if (test3) {
        console.log('✅ SUCCESS: Database is ready!');
        console.log('');
        console.log('Next steps:');
        console.log('1. Start backend: cd backend && npm start');
        console.log('2. Start frontend: cd frontend && npm run dev');
        console.log('3. Open browser: http://localhost:5173');
    } else {
        console.log('❌ FAILED: Database connection issues');
    }
    console.log('═══════════════════════════════════════════════════════════════');
    
    process.exit(test3 ? 0 : 1);
}

runAllTests();
