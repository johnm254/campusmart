const Redis = require('ioredis');

/**
 * Redis Caching Utility for CampusMart
 * Provides high-performance caching with graceful fallback
 */

class CacheManager {
    constructor() {
        this.redis = null;
        this.isConnected = false;
        this.fallbackCache = new Map(); // In-memory fallback
        this.maxFallbackSize = 1000;
        
        this.initRedis();
    }

    /**
     * Initialize Redis connection with error handling
     */
    initRedis() {
        if (!process.env.REDIS_URL) {
            console.warn('⚠️  REDIS_URL not found, using in-memory fallback cache');
            return;
        }

        try {
            this.redis = new Redis(process.env.REDIS_URL, {
                retryDelayOnFailover: 100,
                maxRetriesPerRequest: 3,
                lazyConnect: true,
                keepAlive: 30000,
                connectTimeout: 10000,
                commandTimeout: 5000
            });

            this.redis.on('connect', () => {
                console.log('✅ Redis connected successfully');
                this.isConnected = true;
            });

            this.redis.on('error', (error) => {
                console.warn('⚠️  Redis connection error:', error.message);
                this.isConnected = false;
            });

            this.redis.on('close', () => {
                console.warn('⚠️  Redis connection closed, falling back to memory cache');
                this.isConnected = false;
            });

        } catch (error) {
            console.warn('⚠️  Redis initialization failed:', error.message);
        }
    }

    /**
     * Get or set cache value with automatic fallback
     * @param {string} key - Cache key
     * @param {Function} fetchFn - Function to fetch data if cache miss
     * @param {number} ttlSeconds - Time to live in seconds
     * @returns {Promise<any>} Cached or fetched data
     */
    async getOrSet(key, fetchFn, ttlSeconds = 300) {
        try {
            // Try Redis first
            if (this.isConnected && this.redis) {
                const cached = await this.redis.get(key);
                if (cached) {
                    console.log(`🎯 Cache HIT (Redis): ${key}`);
                    return JSON.parse(cached);
                }
            } else {
                // Fallback to memory cache
                const memCached = this.fallbackCache.get(key);
                if (memCached && Date.now() < memCached.expires) {
                    console.log(`🎯 Cache HIT (Memory): ${key}`);
                    return memCached.data;
                }
            }

            // Cache miss - fetch data
            console.log(`❌ Cache MISS: ${key} - Fetching...`);
            const data = await fetchFn();

            // Store in cache
            await this.set(key, data, ttlSeconds);
            
            return data;

        } catch (error) {
            console.error(`💥 Cache error for key ${key}:`, error.message);
            // Always fallback to fetching data
            return await fetchFn();
        }
    }

    /**
     * Set cache value
     * @param {string} key - Cache key
     * @param {any} data - Data to cache
     * @param {number} ttlSeconds - Time to live in seconds
     */
    async set(key, data, ttlSeconds = 300) {
        try {
            const serialized = JSON.stringify(data);

            if (this.isConnected && this.redis) {
                await this.redis.setex(key, ttlSeconds, serialized);
                console.log(`💾 Cached (Redis): ${key} (TTL: ${ttlSeconds}s)`);
            } else {
                // Fallback to memory cache
                this.cleanupFallbackCache();
                this.fallbackCache.set(key, {
                    data,
                    expires: Date.now() + (ttlSeconds * 1000)
                });
                console.log(`💾 Cached (Memory): ${key} (TTL: ${ttlSeconds}s)`);
            }
        } catch (error) {
            console.error(`💥 Cache set error for key ${key}:`, error.message);
        }
    }

    /**
     * Get cache value
     * @param {string} key - Cache key
     * @returns {Promise<any|null>} Cached data or null
     */
    async get(key) {
        try {
            if (this.isConnected && this.redis) {
                const cached = await this.redis.get(key);
                return cached ? JSON.parse(cached) : null;
            } else {
                const memCached = this.fallbackCache.get(key);
                if (memCached && Date.now() < memCached.expires) {
                    return memCached.data;
                }
                return null;
            }
        } catch (error) {
            console.error(`💥 Cache get error for key ${key}:`, error.message);
            return null;
        }
    }

    /**
     * Invalidate specific cache key
     * @param {string} key - Cache key to invalidate
     */
    async invalidate(key) {
        try {
            if (this.isConnected && this.redis) {
                await this.redis.del(key);
                console.log(`🗑️  Invalidated (Redis): ${key}`);
            } else {
                this.fallbackCache.delete(key);
                console.log(`🗑️  Invalidated (Memory): ${key}`);
            }
        } catch (error) {
            console.error(`💥 Cache invalidation error for key ${key}:`, error.message);
        }
    }

    /**
     * Invalidate cache keys matching pattern
     * @param {string} pattern - Pattern to match (e.g., "products:*")
     */
    async invalidatePattern(pattern) {
        try {
            if (this.isConnected && this.redis) {
                const keys = await this.redis.keys(pattern);
                if (keys.length > 0) {
                    await this.redis.del(...keys);
                    console.log(`🗑️  Invalidated ${keys.length} keys matching: ${pattern}`);
                }
            } else {
                // Memory cache pattern matching
                const regex = new RegExp(pattern.replace('*', '.*'));
                const keysToDelete = [];
                for (const key of this.fallbackCache.keys()) {
                    if (regex.test(key)) {
                        keysToDelete.push(key);
                    }
                }
                keysToDelete.forEach(key => this.fallbackCache.delete(key));
                console.log(`🗑️  Invalidated ${keysToDelete.length} memory keys matching: ${pattern}`);
            }
        } catch (error) {
            console.error(`💥 Cache pattern invalidation error for ${pattern}:`, error.message);
        }
    }

    /**
     * Clean up expired entries from fallback cache
     */
    cleanupFallbackCache() {
        if (this.fallbackCache.size > this.maxFallbackSize) {
            const now = Date.now();
            for (const [key, value] of this.fallbackCache.entries()) {
                if (now > value.expires) {
                    this.fallbackCache.delete(key);
                }
            }
        }
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache statistics
     */
    async getStats() {
        const stats = {
            type: this.isConnected ? 'redis' : 'memory',
            connected: this.isConnected,
            fallbackSize: this.fallbackCache.size
        };

        if (this.isConnected && this.redis) {
            try {
                const info = await this.redis.info('memory');
                stats.redisMemory = info;
            } catch (error) {
                stats.error = error.message;
            }
        }

        return stats;
    }

    /**
     * Create cache middleware for Express routes
     * @param {number} ttlSeconds - Cache TTL in seconds
     * @param {Function} keyGenerator - Function to generate cache key from req
     * @returns {Function} Express middleware
     */
    middleware(ttlSeconds = 300, keyGenerator = null) {
        return async (req, res, next) => {
            // Skip caching for non-GET requests
            if (req.method !== 'GET') {
                return next();
            }

            const cacheKey = keyGenerator ? keyGenerator(req) : `route:${req.originalUrl}`;
            
            try {
                const cached = await this.get(cacheKey);
                if (cached) {
                    res.setHeader('X-Cache', 'HIT');
                    res.setHeader('X-Cache-Key', cacheKey);
                    return res.json(cached);
                }

                // Cache miss - continue to route handler
                res.setHeader('X-Cache', 'MISS');
                res.setHeader('X-Cache-Key', cacheKey);

                // Override res.json to cache the response
                const originalJson = res.json;
                res.json = (data) => {
                    // Cache successful responses only
                    if (res.statusCode === 200) {
                        this.set(cacheKey, data, ttlSeconds).catch(console.error);
                    }
                    return originalJson.call(res, data);
                };

                next();
            } catch (error) {
                console.error('💥 Cache middleware error:', error.message);
                next();
            }
        };
    }
}

// Export singleton instance
const cache = new CacheManager();

module.exports = {
    cache,
    CacheManager
};