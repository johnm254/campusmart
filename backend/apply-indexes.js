// Script to apply performance indexes to the database
const db = require('./db');
const fs = require('fs');
const path = require('path');

async function applyIndexes() {
    try {
        console.log('📊 Applying performance indexes...');
        
        const sqlFile = path.join(__dirname, 'performance-indexes.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');
        
        // Split by semicolon and execute each statement
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));
        
        for (const statement of statements) {
            try {
                await db.query(statement);
                // Extract index name from statement
                const match = statement.match(/idx_\w+/);
                if (match) {
                    console.log(`✅ Created index: ${match[0]}`);
                }
            } catch (err) {
                // Ignore "already exists" errors
                if (err.message.includes('already exists')) {
                    const match = statement.match(/idx_\w+/);
                    if (match) {
                        console.log(`⏭️  Index already exists: ${match[0]}`);
                    }
                } else {
                    console.error(`❌ Error: ${err.message}`);
                }
            }
        }
        
        console.log('\n✅ Performance indexes applied successfully!');
        console.log('🚀 Your database queries should now be much faster.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error applying indexes:', error.message);
        process.exit(1);
    }
}

applyIndexes();
