const db = require('./db');

async function spiceAdminSchema() {
    try {
        console.log('Spicing up Admin Schema...');

        // 1. Add is_banned to users
        await db.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;
        `);
        console.log('Verified [is_banned] column in users.');

        // 2. Seed initial settings
        const settings = [
            ['site_name', 'CampusMart'],
            ['maintenance_mode', 'false'],
            ['contact_email', 'support@campusmart.co.ke'],
            ['platform_fee', '0'],
            ['announcement', 'Welcome to the new CampusMart Admin Console!']
        ];

        for (const [key, value] of settings) {
            await db.query(`
                INSERT INTO site_settings (key, value)
                VALUES ($1, $2)
                ON CONFLICT (key) DO NOTHING
            `, [key, value]);
        }
        console.log('Seeded initial site settings.');

        console.log('Admin Spicing COMPLETED successfully.');

    } catch (err) {
        console.error('Error spicing admin schema:', err.message);
    } finally {
        process.exit();
    }
}

spiceAdminSchema();
