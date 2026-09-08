import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDev = mode === 'development';
  return {
    // Use '/' during dev, '/new_prevahnews/' in production
    base: isDev ? '/' : '/new_prevahnews/',
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'https://pravahnews.com',
          changeOrigin: true,
        },
        '/public': {
          target: 'https://pravahnews.com',
          changeOrigin: true,
        },
        '/translate-api': {
          target: 'https://translate.googleapis.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/translate-api/, '')
        },
        '/translate-api-fallback': {
          target: 'https://clients5.google.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/translate-api-fallback/, '')
        }
      }
    },
    // Disable LightningCSS minification which chokes on @keyframes
    build: {
      cssMinify: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('axios')) {
                return 'vendor-axios';
              }
              return 'vendor-other';
            }
          }
        }
      }
    }
  };
});
