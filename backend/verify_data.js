const db = require('./db');

async function listData() {
    try {
        const users = await db.query('SELECT id, full_name, email FROM users LIMIT 10');
        console.log('--- USERS ---');
        console.table(users.rows);

        const products = await db.query('SELECT id, title, price, seller_id FROM products LIMIT 10');
        console.log('--- PRODUCTS ---');
        console.table(products.rows);
    } catch (err) {
        console.error('Error fetching data:', err);
    } finally {
        process.exit();
    }
}

listData();
