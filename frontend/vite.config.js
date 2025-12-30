import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // Optimize JSX runtime
      jsxRuntime: 'automatic'
    }),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
    //   manifest: {
    //     name: 'Avalanche Disaster Relief',
    //     short_name: 'Relief Network',
    //     description: 'Blockchain-powered disaster relief micro-funding network',
    //     theme_color: '#e84142',
    //     background_color: '#ffffff',
    //     display: 'standalone',
    //     scope: '/',
    //     start_url: '/',
    //     icons: [
    //       {
    //         src: 'pwa-192x192.png',
    //         sizes: '192x192',
    //         type: 'image/png'
    //       },
    //       {
    //         src: 'pwa-512x512.png',
    //         sizes: '512x512',
    //         type: 'image/png'
    //       },
    //       {
    //         src: 'pwa-512x512.png',
    //         sizes: '512x512',
    //         type: 'image/png',
    //         purpose: 'any maskable'
    //       }
    //     ]
    //   },
    //   workbox: {
    //     globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    //     maximumFileSizeToCacheInBytes: 5000000,
    //     runtimeCaching: [
    //       {
    //         urlPattern: /^https:\/\/api\.pinata\.cloud\/.*/i,
    //         handler: 'NetworkFirst',
    //         options: {
    //           cacheName: 'ipfs-cache',
    //           expiration: {
    //             maxEntries: 100,
    //             maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
    //           }
    //         }
    //       },
    //       {
    //         urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
    //         handler: 'CacheFirst',
    //         options: {
    //           cacheName: 'google-fonts-cache',
    //           expiration: {
    //             maxEntries: 10,
    //             maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
    //           }
    //         }
    //       },
    //       {
    //         urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
    //         handler: 'CacheFirst',
    //         options: {
    //           cacheName: 'images-cache',
    //           expiration: {
    //             maxEntries: 200,
    //             maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
    //           }
    //         }
    //       }
    //     ]
    //   }
    // }),
    // Bundle analyzer - only in development with ANALYZE=true
    process.env.ANALYZE && visualizer({
      filename: 'dist/bundle-analysis.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ].filter(Boolean),

  base: '/',
  
  server: {
    port: 3002,
    host: true,
    headers: {
      // Enhanced CSP for development with Web3 and Google Fonts support
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://fonts.googleapis.com https://www.googletagmanager.com chrome-extension: moz-extension:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com chrome-extension: moz-extension:; font-src 'self' https://fonts.gstatic.com chrome-extension: moz-extension:; img-src 'self' data: https: blob: chrome-extension: moz-extension:; media-src 'self' blob:; connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://api.pinata.cloud https://gateway.pinata.cloud https://api.avax-test.network https://api.avax.network https://testnet.snowtrace.io wss://api.avax-test.network ws://localhost:* http://localhost:* chrome-extension: moz-extension:; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-src 'self' chrome-extension: moz-extension:;"
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  
  build: {
    // Target modern browsers for better optimization
    target: 'es2020',
    // Optimize CSS
    cssCodeSplit: true,
    // Source maps for production debugging
    sourcemap: process.env.NODE_ENV === 'development',
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      output: {
        // Optimized chunking strategy
        manualChunks: (id) => {
          // Core React libraries
          // if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
          //   return 'react-vendor';
          // }
          
          // Web3 and blockchain libraries
          if (id.includes('node_modules/ethers') || id.includes('node_modules/@metamask')) {
            return 'web3-vendor';
          }
          
          // UI and animation libraries
          if (id.includes('node_modules/framer-motion') || 
              id.includes('node_modules/lucide-react') ||
              id.includes('node_modules/@headlessui')) {
            return 'ui-vendor';
          }
          
          // Chart and visualization libraries
          if (id.includes('node_modules/recharts') || 
              id.includes('node_modules/d3') ||
              id.includes('node_modules/@visx')) {
            return 'charts-vendor';
          }
          
          // Date and utility libraries
          if (id.includes('node_modules/date-fns') || 
              id.includes('node_modules/lodash') ||
              id.includes('node_modules/axios')) {
            return 'utils-vendor';
          }
          
          // Other large third-party modules
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        },
        
        // Optimize chunk naming
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId 
            ? chunkInfo.facadeModuleId.split('/').pop().replace('.jsx', '').replace('.js', '')
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        
        // Optimize asset naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `img/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    
    // Terser options for better minification
    minify: 'esbuild',
    terserOptions: {
      compress: {
        // Remove console logs in production
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
        // Optimize comparisons
        comparisons: false,
        // Inline simple functions
        inline: 2
      },
      mangle: {
        // Preserve class names for better debugging
        keep_classnames: process.env.NODE_ENV === 'development',
        // Preserve function names for better debugging  
        keep_fnames: process.env.NODE_ENV === 'development'
      },
      format: {
        // Remove comments in production
        comments: false
      }
    }
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'ethers', 
      'framer-motion',
      'lucide-react'
    ],
    exclude: ['@vite/client', '@vite/env']
  },
  
  // Enhanced resolve options
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@hooks': '/src/hooks',
      '@utils': '/src/utils',
      '@services': '/src/services',
      '@store': '/src/store',
      '@contracts': '/src/contracts'
    }
  },
  
  // CSS optimization
  css: {
    // Enable CSS modules
    modules: {
      localsConvention: 'camelCaseOnly'
    },
    // PostCSS configuration
    postcss: './postcss.config.js',
    // CSS preprocessing options
    preprocessorOptions: {
      scss: {
        // Add global SCSS variables if needed
        additionalData: `// Global SCSS variables can go here`
      }
    }
  },
  
  define: {
    global: 'globalThis',
    // Optimize environment variables
    __DEV__: process.env.NODE_ENV === 'development',
    __PROD__: process.env.NODE_ENV === 'production'
  },
  
  // Enable esbuild optimizations
  esbuild: {
    // Remove unused imports
    treeShaking: true
    // JSX is handled by the React plugin with automatic runtime
  }
})
