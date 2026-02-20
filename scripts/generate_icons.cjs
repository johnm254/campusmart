const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

async function generate() {
    try {
        console.log('Generating icons...');

        // Load the original logo
        const logoPath = path.join(__dirname, '../public/logo.png');
        if (!fs.existsSync(logoPath)) throw new Error('Logo not found at public/logo.png');

        const logo = await Jimp.read(logoPath);

        // ------------------------------------------------------------------
        // 1. Create 512x512 with white background (maskable safe zone)
        // Android safe zone is center 66%, so logo should fit within ~340px
        // ------------------------------------------------------------------
        const icon512 = new Jimp(512, 512, 0xffffffff); // White background

        // Scale logo to width/height of 360px (leaving sufficient padding)
        const scaleFactor = Math.min(360 / logo.getWidth(), 360 / logo.getHeight());
        const scaledLogo = logo.clone().scale(scaleFactor);

        // Center it
        const x = (512 - scaledLogo.getWidth()) / 2;
        const y = (512 - scaledLogo.getHeight()) / 2;

        icon512.composite(scaledLogo, x, y);

        // Save
        const out512 = path.join(__dirname, '../public/icon-512.png');
        await icon512.writeAsync(out512);
        console.log('✅ Generated public/icon-512.png (Square, Maskable)');

        // ------------------------------------------------------------------
        // 2. Create 192x192 version
        // ------------------------------------------------------------------
        const icon192 = icon512.clone().resize(192, 192);
        const out192 = path.join(__dirname, '../public/icon-192.png');
        await icon192.writeAsync(out192);
        console.log('✅ Generated public/icon-192.png (Square, Maskable)');

        // ------------------------------------------------------------------
        // 3. Create Apple Touch Icon (180x180) - usually same as square
        // ------------------------------------------------------------------
        const icon180 = icon512.clone().resize(180, 180);
        const out180 = path.join(__dirname, '../public/apple-touch-icon.png');
        await icon180.writeAsync(out180);
        console.log('✅ Generated public/apple-touch-icon.png');

        console.log('\nSuccess! Icons are perfectly centered and padded for Android/iOS.');
    } catch (error) {
        console.error('Error generation icons:', error);
        process.exit(1);
    }
}

generate();
