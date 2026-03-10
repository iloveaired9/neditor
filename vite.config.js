import { defineConfig } from 'vite';

export default defineConfig({
    // Project root directory
    root: './',
    // Base public path when served in production
    base: './',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        // Minify output
        minify: 'terser',
        sourcemap: true,
    },
    server: {
        port: 3000,
        open: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
});
