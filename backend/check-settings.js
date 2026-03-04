const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./db');

/**
 * Check and initialize site_settings table
 */
async function checkSettings() {
    console.log('🔍 Checking site_settings table...\n');

    try {
        // Check if table exists and has data
        const result = await db.query('SELECT * FROM site_settings');
        
        console.log('Current settings in database:');
        console.log('═══════════════════════════════════════');
        
        if (result.rows.length === 0) {
            console.log('⚠️  No settings found! Initializing defaults...\n');
            
            // Insert default settings
            await db.query(`
                INSERT INTO site_settings (key, value) VALUES 
                ('site_name', 'CampusMart'),
                ('maintenance_mode', 'false'),
                ('contact_email', 'campusmart.care@gmail.com'),
                ('announcement', 'Welcome to CampusMart!')
                ON CONFLICT (key) DO NOTHING
            `);
            
            console.log('✅ Default settings initialized!');
            
            // Fetch again to show
            const newResult = await db.query('SELECT * FROM site_settings');
            newResult.rows.forEach(row => {
                console.log(`  ${row.key}: ${row.value}`);
            });
        } else {
            result.rows.forEach(row => {
                console.log(`  ${row.key}: ${row.value}`);
            });
            console.log('\n✅ Settings table is populated');
        }
        
        console.log('\n═══════════════════════════════════════');
        console.log('✅ Check complete!\n');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

checkSettings();
