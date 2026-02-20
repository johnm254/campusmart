const db = require('./db');

async function createResetTable() {
    try {
        console.log('Creating password_resets table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS password_resets (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                token VARCHAR(255) NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('password_resets table created successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error creating table:', error);
        process.exit(1);
    }
}

createResetTable();
