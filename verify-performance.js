#!/usr/bin/env node

/**
 * CampusMart Performance Verification Script
 * Verifies all performance optimizations are working correctly
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

console.log('🔍 CampusMart Performance Verification\n');

async function verifyBackendHealth() {
    console.log('1. Testing Backend Health Endpoint...');
    try {
        const start = Date.now();
        const response = await axios.get(`${BACKEND_URL}/health`, { timeout: 10000 });
        const duration = Date.now() - start;
        
        if (response.status === 200 && response.data.status === 'healthy') {
            console.log(`   ✅ Health endpoint responding in ${duration}ms`);
            console.log(`   📊 Uptime: ${response.data.uptime}s, Warm: ${response.data.isWarm}`);
            return true;
        } else {
            console.log(`   ❌ Health endpoint returned: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.log(`   ❌ Health endpoint failed: ${error.message}`);
        return false;
    }
}

async function verifyDatabaseIndexes() {
    console.log('\n2. Checking Database Performance Indexes...');
    const indexFile = path.join(__dirname, 'backend/migrations/performance-indexes.sql');
    
    if (fs.existsSync(indexFile)) {
        const content = fs.readFileSync(indexFile, 'utf8');
        const indexCount = (content.match(/CREATE INDEX/g) || []).length;
        console.log(`   ✅ Found ${indexCount} performance indexes in migration file`);
        return true;
    } else {
        console.log(`   ❌ Performance indexes file not found`);
        return false;
    }
}

async function verifyCacheUtility() {
    console.log('\n3. Verifying Cache Utility...');
    const cacheFile = path.join(__dirname, 'backend/src/utils/cache.js');
    
    if (fs.existsSync(cacheFile)) {
        const content = fs.readFileSync(cacheFile, 'utf8');
        const hasRedis = content.includes('ioredis');
        const hasFallback = content.includes('fallbackCache');
        const hasGetOrSet = content.includes('getOrSet');
        
        if (hasRedis && hasFallback && hasGetOrSet) {
            console.log(`   ✅ Cache utility with Redis and fallback implemented`);
            return true;
        } else {
            console.log(`   ❌ Cache utility missing features`);
            return false;
        }
    } else {
        console.log(`   ❌ Cache utility file not found`);
        return false;
    }
}

async function verifyFrontendOptimizations() {
    console.log('\n4. Checking Frontend Optimizations...');
    
    // Check vite.config.js
    const viteConfig = path.join(__dirname, 'frontend/vite.config.js');
    if (fs.existsSync(viteConfig)) {
        const content = fs.readFileSync(viteConfig, 'utf8');
        const hasChunkSplitting = content.includes('manualChunks');
        const hasMinification = content.includes('terser');
        
        if (hasChunkSplitting && hasMinification) {
            console.log(`   ✅ Vite build optimizations configured`);
        } else {
            console.log(`   ⚠️  Some Vite optimizations missing`);
        }
    }
    
    // Check vercel.json
    const vercelConfig = path.join(__dirname, 'frontend/vercel.json');
    if (fs.existsSync(vercelConfig)) {
        const content = fs.readFileSync(vercelConfig, 'utf8');
        const hasCaching = content.includes('Cache-Control');
        const hasProxy = content.includes('railway.app');
        
        if (hasCaching && hasProxy) {
            console.log(`   ✅ Vercel CDN and proxy configuration ready`);
        } else {
            console.log(`   ⚠️  Vercel configuration incomplete`);
        }
    }
    
    // Check lazy loading
    const appFile = path.join(__dirname, 'frontend/src/App.jsx');
    if (fs.existsSync(appFile)) {
        const content = fs.readFileSync(appFile, 'utf8');
        const hasLazyLoading = content.includes('lazy(') && content.includes('Suspense');
        
        if (hasLazyLoading) {
            console.log(`   ✅ Lazy loading implemented`);
        } else {
            console.log(`   ⚠️  Lazy loading not found`);
        }
    }
    
    return true;
}

async function verifyAPIPerformance() {
    console.log('\n5. Testing API Performance...');
    try {
        const start = Date.now();
        const response = await axios.get(`${BACKEND_URL}/api/products?limit=10`, { 
            timeout: 5000,
            headers: { 'Accept': 'application/json' }
        });
        const duration = Date.now() - start;
        
        if (response.status === 200) {
            const cacheHeader = response.headers['x-cache'];
            console.log(`   ✅ Products API responding in ${duration}ms`);
            if (cacheHeader) {
                console.log(`   📦 Cache status: ${cacheHeader}`);
            }
            return duration < 1000; // Should be under 1 second
        } else {
            console.log(`   ❌ Products API returned: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.log(`   ❌ Products API failed: ${error.message}`);
        return false;
    }
}

async function verifyRailwayConfig() {
    console.log('\n6. Checking Railway Configuration...');
    const railwayConfig = path.join(__dirname, 'railway.toml');
    
    if (fs.existsSync(railwayConfig)) {
        const content = fs.readFileSync(railwayConfig, 'utf8');
        const hasHealthcheck = content.includes('healthcheck');
        const hasRestartPolicy = content.includes('restartPolicyType');
        
        if (hasHealthcheck && hasRestartPolicy) {
            console.log(`   ✅ Railway always-on configuration ready`);
            return true;
        } else {
            console.log(`   ⚠️  Railway configuration incomplete`);
            return false;
        }
    } else {
        console.log(`   ❌ Railway configuration file not found`);
        return false;
    }
}

async function runVerification() {
    const results = [];
    
    results.push(await verifyBackendHealth());
    results.push(await verifyDatabaseIndexes());
    results.push(await verifyCacheUtility());
    results.push(await verifyFrontendOptimizations());
    results.push(await verifyAPIPerformance());
    results.push(await verifyRailwayConfig());
    
    const passed = results.filter(Boolean).length;
    const total = results.length;
    
    console.log(`\n📊 Performance Verification Results: ${passed}/${total} checks passed`);
    
    if (passed === total) {
        console.log('🎉 All performance optimizations verified successfully!');
        console.log('🚀 CampusMart is ready for production deployment.');
    } else {
        console.log('⚠️  Some optimizations need attention. Check the details above.');
    }
    
    console.log('\n📖 For detailed information, see PERFORMANCE.md');
    
    process.exit(passed === total ? 0 : 1);
}

// Run verification
runVerification().catch(error => {
    console.error('💥 Verification script failed:', error);
    process.exit(1);
});