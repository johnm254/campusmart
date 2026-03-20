/**
 * Frontend API Response Caching Utility
 * Implements stale-while-revalidate pattern for better performance
 */

class APICache {
    constructor() {
        this.cache = new Map();
        this.maxSize = 100; // Maximum number of cached entries
        this.defaultTTL = 60000; // 60 seconds default TTL
    }

    /**
     * Generate cache key from URL and options
     */
    generateKey(url, options = {}) {
        const method = options.method || 'GET';
        const body = options.body ? JSON.stringify(options.body) : '';
        return `${method}:${url}:${body}`;
    }

    /**
     * Get cached response if available and not expired
     */
    get(key) {
        const entry = this.cache.get(key);
        if (!entry) return null;

        const now = Date.now();
        
        // Return cached data even if stale (stale-while-revalidate)
        if (entry.data) {
            entry.lastAccessed = now;
            return {
                data: entry.data,
                isStale: now > entry.expiresAt,
                cachedAt: entry.cachedAt
            };
        }

        return null;
    }

    /**
     * Set cache entry
     */
    set(key, data, ttl = this.defaultTTL) {
        // Clean up old entries if cache is full
        if (this.cache.size >= this.maxSize) {
            this.cleanup();
        }

        const now = Date.now();
        this.cache.set(key, {
            data,
            cachedAt: now,
            expiresAt: now + ttl,
            lastAccessed: now
        });
    }

    /**
     * Remove expired entries and least recently used entries
     */
    cleanup() {
        const now = Date.now();
        const entries = Array.from(this.cache.entries());
        
        // Remove expired entries first
        entries.forEach(([key, entry]) => {
            if (now > entry.expiresAt + (entry.expiresAt - entry.cachedAt)) {
                // Remove if expired beyond stale period
                this.cache.delete(key);
            }
        });

        // If still too many entries, remove least recently used
        if (this.cache.size >= this.maxSize) {
            const sortedEntries = Array.from(this.cache.entries())
                .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
            
            const toRemove = sortedEntries.slice(0, Math.floor(this.maxSize * 0.2));
            toRemove.forEach(([key]) => this.cache.delete(key));
        }
    }

    /**
     * Clear all cache entries
     */
    clear() {
        this.cache.clear();
    }

    /**
     * Get cache statistics
     */
    getStats() {
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            entries: Array.from(this.cache.keys())
        };
    }
}

// Create singleton instance
const apiCache = new APICache();

/**
 * Enhanced fetch with caching and stale-while-revalidate
 */
export const cachedFetch = async (url, options = {}, cacheOptions = {}) => {
    const {
        ttl = 60000, // 60 seconds default
        skipCache = false,
        forceRefresh = false
    } = cacheOptions;

    // Skip caching for non-GET requests or when explicitly disabled
    if (skipCache || (options.method && options.method !== 'GET')) {
        return fetch(url, options);
    }

    const cacheKey = apiCache.generateKey(url, options);
    
    // Check cache first
    if (!forceRefresh) {
        const cached = apiCache.get(cacheKey);
        if (cached) {
            // Return cached data immediately
            const response = new Response(JSON.stringify(cached.data), {
                status: 200,
                statusText: 'OK (Cached)',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Cache': cached.isStale ? 'STALE' : 'HIT',
                    'X-Cache-Date': new Date(cached.cachedAt).toISOString()
                }
            });

            // If stale, fetch fresh data in background
            if (cached.isStale) {
                fetch(url, options)
                    .then(res => res.json())
                    .then(data => {
                        apiCache.set(cacheKey, data, ttl);
                        console.log(`🔄 Background refresh completed for: ${url}`);
                    })
                    .catch(err => {
                        console.warn(`⚠️  Background refresh failed for: ${url}`, err);
                    });
            }

            return response;
        }
    }

    // Cache miss or force refresh - fetch from network
    try {
        const response = await fetch(url, options);
        
        if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
            const data = await response.json();
            
            // Cache successful JSON responses
            apiCache.set(cacheKey, data, ttl);
            
            // Return new response with cache headers
            return new Response(JSON.stringify(data), {
                status: response.status,
                statusText: response.statusText,
                headers: {
                    ...Object.fromEntries(response.headers.entries()),
                    'X-Cache': 'MISS'
                }
            });
        }

        return response;
    } catch (error) {
        // On network error, try to return stale cache if available
        const cached = apiCache.get(cacheKey);
        if (cached) {
            console.warn(`⚠️  Network error, serving stale cache for: ${url}`, error);
            return new Response(JSON.stringify(cached.data), {
                status: 200,
                statusText: 'OK (Stale Cache)',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Cache': 'STALE-ERROR',
                    'X-Cache-Date': new Date(cached.cachedAt).toISOString()
                }
            });
        }

        throw error;
    }
};

/**
 * Invalidate cache entries by pattern
 */
export const invalidateCache = (pattern) => {
    const keys = Array.from(apiCache.cache.keys());
    const regex = new RegExp(pattern);
    
    let invalidated = 0;
    keys.forEach(key => {
        if (regex.test(key)) {
            apiCache.cache.delete(key);
            invalidated++;
        }
    });

    console.log(`🗑️  Invalidated ${invalidated} cache entries matching: ${pattern}`);
    return invalidated;
};

/**
 * Preload data into cache
 */
export const preloadCache = async (url, options = {}, cacheOptions = {}) => {
    try {
        await cachedFetch(url, options, { ...cacheOptions, forceRefresh: true });
        console.log(`📦 Preloaded cache for: ${url}`);
    } catch (error) {
        console.warn(`⚠️  Failed to preload cache for: ${url}`, error);
    }
};

export { apiCache };
export default cachedFetch;