import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    
    // Build optimizations
    build: {
        // Enable Terser for aggressive minification
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true, // Remove console.log in production
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.debug']
            }
        },
        
        // Disable source maps for production (smaller bundle)
        sourcemap: false,
        
        // Chunk size warning limit
        chunkSizeWarningLimit: 500,
        
        // Manual chunk splitting for better caching
        rollupOptions: {
            output: {
                manualChunks: {
                    // Vendor chunk - third-party libraries
                    vendor: [
                        'react', 
                        'react-dom', 
                        'react-router-dom'
                    ],
                    
                    // UI chunk - UI components and styling
                    ui: [
                        'lucide-react',
                        'react-image-crop'
                    ],
                    
                    // Utils chunk - utility libraries
                    utils: [
                        'axios',
                        'date-fns'
                    ]
                },
                
                // Optimize chunk naming for better caching
                chunkFileNames: (chunkInfo) => {
                    const facadeModuleId = chunkInfo.facadeModuleId ? 
                        chunkInfo.facadeModuleId.split('/').pop().replace('.jsx', '').replace('.js', '') : 
                        'chunk';
                    return `js/${facadeModuleId}-[hash].js`;
                },
                
                entryFileNames: 'js/[name]-[hash].js',
                assetFileNames: (assetInfo) => {
                    const info = assetInfo.name.split('.');
                    const ext = info[info.length - 1];
                    if (/\.(css)$/.test(assetInfo.name)) {
                        return `css/[name]-[hash].${ext}`;
                    }
                    if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
                        return `images/[name]-[hash].${ext}`;
                    }
                    return `assets/[name]-[hash].${ext}`;
                }
            }
        },
        
        // Target modern browsers for smaller bundle
        target: 'es2020'
    },
    
    // Development server configuration
    server: {
        host: 'localhost',
        port: 5173,
        hmr: {
            host: 'localhost',
            port: 5173,
        },
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            }
        }
    },
    
    // Optimize dependencies
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react-router-dom',
            'axios',
            'lucide-react'
        ]
    },
    
    // Enable CSS code splitting
    css: {
        devSourcemap: false
    }
})
