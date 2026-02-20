const http = require('http');

const testPaths = [
    '/api/user/1/rating',
    '/api/reviews/1'
];

async function test() {
    for (const path of testPaths) {
        await new Promise((resolve) => {
            http.get(`http://localhost:5000${path}`, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    console.log(`Checking ${path}: HTTP ${res.statusCode}`);
                    try {
                        console.log('Response:', JSON.parse(data));
                    } catch (e) {
                        console.log('Response (non-JSON):', data);
                    }
                    resolve();
                });
            }).on('error', err => {
                console.error(`Error checking ${path}:`, err.message);
                resolve();
            });
        });
    }
    process.exit();
}

test();
