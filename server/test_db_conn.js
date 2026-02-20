const { Client } = require('pg');
require('dotenv').config({ path: './server/.env' });

const configs = [
    { user: 'admin', password: '911Hamisi' },
    { user: 'postgres', password: '911Hamisi' },
    { user: 'postgres', password: '' },
    { user: 'postgres', password: 'password' },
    { user: 'admin', password: 'password' }
];

async function testConnections() {
    for (const config of configs) {
        console.log(`Testing: user=${config.user}, password=${config.password ? '******' : 'EMPTY'}`);
        const client = new Client({
            host: 'localhost',
            port: 5432,
            user: config.user,
            password: config.password,
            database: 'postgres'
        });

        try {
            await client.connect();
            console.log(`SUCCESS with user=${config.user}`);
            await client.end();
            return config;
        } catch (err) {
            console.log(`FAILED: ${err.message}`);
        }
    }
    console.log('All attempts failed.');
}

testConnections();
