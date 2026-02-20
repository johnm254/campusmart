const http = require('http');

http.get('http://localhost:5000/api/products', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        try {
            const json = JSON.parse(data);
            console.log('Products found:', json.length);
            if (json.length > 0) {
                console.log('Sample product:', json[0].title);
            }
        } catch (e) {
            console.log('Error parsing JSON:', e.message);
            console.log('Raw data:', data);
        }
        process.exit();
    });
}).on('error', (err) => {
    console.error('Error reaching server:', err.message);
    process.exit(1);
});
