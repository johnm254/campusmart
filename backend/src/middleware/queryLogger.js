/**
 * Database Query Performance Logger
 * Logs slow queries and provides performance insights
 */

class QueryLogger {
    constructor(slowQueryThreshold = 500) {
        this.slowQueryThreshold = slowQueryThreshold; // milliseconds
        this.queryStats = {
            totalQueries: 0,
            slowQueries: 0,
            totalTime: 0,
            averageTime: 0
        };
    }

    /**
     * Log query execution time and detect slow queries
     * @param {string} query - SQL query string
     * @param {Array} params - Query parameters
     * @param {number} executionTime - Execution time in milliseconds
     */
    logQuery(query, params, executionTime) {
        this.queryStats.totalQueries++;
        this.queryStats.totalTime += executionTime;
        this.queryStats.averageTime = this.queryStats.totalTime / this.queryStats.totalQueries;

        if (executionTime > this.slowQueryThreshold) {
            this.queryStats.slowQueries++;
            
            console.warn(`🐌 SLOW QUERY (${executionTime}ms):`, {
                query: query.substring(0, 200) + (query.length > 200 ? '...' : ''),
                params: params ? params.slice(0, 5) : null,
                executionTime: `${executionTime}ms`,
                threshold: `${this.slowQueryThreshold}ms`
            });

            // Log optimization suggestions
            this.suggestOptimizations(query, executionTime);
        } else {
            console.log(`⚡ Query executed in ${executionTime}ms`);
        }
    }

    /**
     * Suggest optimizations for slow queries
     * @param {string} query - SQL query string
     * @param {number} executionTime - Execution time in milliseconds
     */
    suggestOptimizations(query, executionTime) {
        const suggestions = [];
        const queryLower = query.toLowerCase();

        // Check for SELECT * queries
        if (queryLower.includes('select *')) {
            suggestions.push('Consider selecting only needed columns instead of SELECT *');
        }

        // Check for missing WHERE clauses on large tables
        if (queryLower.includes('from products') && !queryLower.includes('where')) {
            suggestions.push('Add WHERE clause to filter products table');
        }

        // Check for missing LIMIT on potentially large result sets
        if (!queryLower.includes('limit') && (queryLower.includes('select') && !queryLower.includes('count'))) {
            suggestions.push('Consider adding LIMIT clause for pagination');
        }

        // Check for potential N+1 queries
        if (queryLower.includes('where id =') || queryLower.includes('where user_id =')) {
            suggestions.push('Check for N+1 query pattern - consider using JOINs or batch queries');
        }

        // Check for missing indexes on common WHERE clauses
        if (queryLower.includes('where status =')) {
            suggestions.push('Ensure index exists on status column');
        }
        if (queryLower.includes('where category =')) {
            suggestions.push('Ensure index exists on category column');
        }
        if (queryLower.includes('where created_at')) {
            suggestions.push('Ensure index exists on created_at column');
        }

        if (suggestions.length > 0) {
            console.warn('💡 Optimization suggestions:', suggestions);
        }
    }

    /**
     * Get current query statistics
     * @returns {Object} Query performance statistics
     */
    getStats() {
        return {
            ...this.queryStats,
            slowQueryPercentage: this.queryStats.totalQueries > 0 
                ? ((this.queryStats.slowQueries / this.queryStats.totalQueries) * 100).toFixed(2)
                : 0
        };
    }

    /**
     * Reset statistics
     */
    resetStats() {
        this.queryStats = {
            totalQueries: 0,
            slowQueries: 0,
            totalTime: 0,
            averageTime: 0
        };
    }

    /**
     * Express middleware to log API response times
     * @returns {Function} Express middleware
     */
    middleware() {
        return (req, res, next) => {
            const startTime = Date.now();
            
            // Override res.end to capture response time
            const originalEnd = res.end;
            res.end = function(...args) {
                const responseTime = Date.now() - startTime;
                
                // Log API response time
                if (responseTime > 1000) {
                    console.warn(`🐌 SLOW API (${responseTime}ms): ${req.method} ${req.originalUrl}`);
                } else {
                    console.log(`⚡ API (${responseTime}ms): ${req.method} ${req.originalUrl}`);
                }
                
                // Add response time header
                res.setHeader('X-Response-Time', `${responseTime}ms`);
                
                return originalEnd.apply(this, args);
            };
            
            next();
        };
    }
}

// Export singleton instance
const queryLogger = new QueryLogger();

module.exports = {
    queryLogger,
    QueryLogger
};