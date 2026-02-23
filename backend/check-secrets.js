#!/usr/bin/env node

/**
 * Pre-commit security check
 * Scans staged files for potential secrets before committing
 */

const { execSync } = require('child_process');
const fs = require('fs');

const SENSITIVE_PATTERNS = [
    /password\s*=\s*['"][^'"]+['"]/gi,
    /api[_-]?key\s*=\s*['"][^'"]+['"]/gi,
    /secret\s*=\s*['"][^'"]+['"]/gi,
    /token\s*=\s*['"][^'"]+['"]/gi,
    /DB_PASS\s*=\s*[^\s]+/gi,
    /JWT_SECRET\s*=\s*[^\s]+/gi,
    /MPESA_[A-Z_]+\s*=\s*[^\s]+/gi,
    /EMAIL_PASS\s*=\s*[^\s]+/gi,
];

const ALLOWED_FILES = [
    '.env.example',
    '.env.template',
    'check-secrets.js',
    'SECURITY.md'
];

console.log('🔍 Checking for secrets in staged files...\n');

try {
    // Get list of staged files
    const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf-8' })
        .split('\n')
        .filter(Boolean);

    if (stagedFiles.length === 0) {
        console.log('✅ No staged files to check.');
        process.exit(0);
    }

    let foundSecrets = false;

    for (const file of stagedFiles) {
        // Skip if file doesn't exist (deleted files)
        if (!fs.existsSync(file)) continue;

        // Skip allowed files
        const fileName = file.split('/').pop();
        if (ALLOWED_FILES.includes(fileName)) continue;

        // Skip binary files and node_modules
        if (file.includes('node_modules') || 
            file.match(/\.(png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
            continue;
        }

        const content = fs.readFileSync(file, 'utf-8');

        // Check for .env file patterns
        if (file.endsWith('.env') && !file.endsWith('.env.example')) {
            console.log(`❌ ERROR: Attempting to commit .env file: ${file}`);
            foundSecrets = true;
            continue;
        }

        // Check for sensitive patterns
        for (const pattern of SENSITIVE_PATTERNS) {
            const matches = content.match(pattern);
            if (matches) {
                console.log(`⚠️  WARNING: Potential secret found in ${file}:`);
                matches.forEach(match => {
                    console.log(`   ${match.substring(0, 50)}...`);
                });
                foundSecrets = true;
            }
        }
    }

    if (foundSecrets) {
        console.log('\n❌ COMMIT BLOCKED: Potential secrets detected!');
        console.log('\nPlease:');
        console.log('1. Remove sensitive data from files');
        console.log('2. Use environment variables instead');
        console.log('3. Check .gitignore is working');
        console.log('\nSee SECURITY.md for guidelines.');
        process.exit(1);
    }

    console.log('✅ No secrets detected. Safe to commit!\n');
    process.exit(0);

} catch (error) {
    console.error('Error running security check:', error.message);
    process.exit(1);
}
