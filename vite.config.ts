// REPOSITORY SOURCE: diplomat-bit/ai-banking-swarm-roster | PATH: diplomat-bit-ai-banking-swarm-roster-20297ff/vite.config.ts
================================================================================

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/ai-executive-magazine-maker | ORIGINAL PATH: diplomat-bit-ai-executive-magazine-maker-45e4d2f/vite.config.ts
================================================================================

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/ai-news | ORIGINAL PATH: diplomat-bit-ai-news-cd09a75/vite.config.ts
================================================================================

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    base: '/ai-news/',   // ⬅️ REQUIRED FOR GITHUB PAGES

    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    plugins: [react()],

    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/ai-powe3red-chromos-file-manager- | ORIGINAL PATH: diplomat-bit-ai-powe3red-chromos-file-manager--4e3b7ea/vite.config.ts
================================================================================

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/aibanking.dev-demai-jocalll3 | ORIGINAL PATH: diplomat-bit-aibanking.dev-demai-jocalll3-f8b6983/vite.config.ts
================================================================================

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/aibanking.dev-jocall3 | ORIGINAL PATH: diplomat-bit-aibanking.dev-jocall3-91b6490/vite.config.ts
================================================================================

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/aibanking.dev-jocall3-new | ORIGINAL PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/vite.config.ts
================================================================================


import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const root = (process as any).cwd ? (process as any).cwd() : '.';

  return {
    base: './',

    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    plugins: [react()],

    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),

      // Payment & Banking Gateways
      'process.env.STRIPE_PUBLISHABLE_KEY': JSON.stringify(env.STRIPE_PUBLISHABLE_KEY),
      'process.env.STRIPE_SECRET_KEY': JSON.stringify(env.STRIPE_SECRET_KEY), 
      'process.env.PLAID_CLIENT_ID': JSON.stringify(env.PLAID_CLIENT_ID),
      'process.env.PLAID_SECRET': JSON.stringify(env.PLAID_SECRET),
      'process.env.PLAID_ENV': JSON.stringify(env.PLAID_ENV || 'sandbox'),

      // Database Defaults (Can be overridden in Settings View)
      'process.env.DB_HOST': JSON.stringify(env.DB_HOST || 'localhost'),
      'process.env.DB_PORT': JSON.stringify(env.DB_PORT || '5432'),
      'process.env.DB_USER': JSON.stringify(env.DB_USER || 'postgres'),
      'process.env.DB_PASSWORD': JSON.stringify(env.DB_PASSWORD || 'password'),
      'process.env.DB_NAME': JSON.stringify(env.DB_NAME || 'sovereign_bank'),
    },

    resolve: {
      alias: {
        '@': path.resolve(root, '.'),
      },
    },
  };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/aibankingmtls | ORIGINAL PATH: diplomat-bit-aibankingmtls-6a06a68/vite.config.ts
================================================================================

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/aibankingnew | ORIGINAL PATH: diplomat-bit-aibankingnew-a0c4868/vite.config.ts
================================================================================

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/vite.config.ts
================================================================================

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables based on mode (development/production)
  const env = loadEnv(mode, process.cwd(), '');
  const root = process.cwd();

  return {
    base: './',

    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    plugins: [react()],

    define: {
      // Client-safe public environment variables
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.STRIPE_PUBLISHABLE_KEY': JSON.stringify(env.STRIPE_PUBLISHABLE_KEY),
      'process.env.PLAID_CLIENT_ID': JSON.stringify(env.PLAID_CLIENT_ID),
      'process.env.PLAID_ENV': JSON.stringify(env.PLAID_ENV || 'sandbox'),
    },

    resolve: {
      alias: {
        '@': path.resolve(root, 'src'),
      },
    },

    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: path.resolve(root, 'index.html'),
        },
      },
    },
  };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/autoomousai | ORIGINAL PATH: diplomat-bit-autoomousai-f4d320c/vite.config.ts
================================================================================

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/book-writer-think-As-for-everyone | ORIGINAL PATH: diplomat-bit-book-writer-think-As-for-everyone-3ab455c/vite.config.ts
================================================================================

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprises | ORIGINAL PATH: diplomat-bit-ci-connect-enterprises-4cf6219/vite.config.ts
================================================================================

import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Fix: __dirname is not available in ES modules environment. 
// We define it using path.dirname and fileURLToPath(import.meta.url).
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        // Fix: Use the polyfilled __dirname variable to resolve project root
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/vite.config.ts
================================================================================

import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Fix: __dirname is not available in ES modules environment. 
// We define it using path.dirname and fileURLToPath(import.meta.url).
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        // Fix: Use the polyfilled __dirname variable to resolve project root
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/vite.config.ts
================================================================================

import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Fix: __dirname is not available in ES modules environment. 
// We define it using path.dirname and fileURLToPath(import.meta.url).
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        // Fix: Use the polyfilled __dirname variable to resolve project root
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | ORIGINAL PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/vite.config.ts
================================================================================

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import fs from 'fs';

// Helper function to dynamically load feature flags or other advanced configurations
// In a large application, these might come from a CMS or a dedicated configuration service.
interface FeatureFlags {
  ANALYTICS_ENABLED: boolean;
  NEW_DASHBOARD_ENABLED: boolean;
  AI_ENHANCED_SEARCH: boolean;
  MAINTENANCE_MODE: boolean;
  GEMINI_MODEL_VERSION: string;
  GEMINI_API_ENDPOINT: string;
}

/**
 * Loads and processes feature flags based on the environment.
 * For production, these might be loaded from a more secure or dynamic source.
 */
export function loadFeatureFlags(mode: string, env: Record<string, string>): FeatureFlags {
  const isProduction = mode === 'production';
  return {
    ANALYTICS_ENABLED: isProduction && env.VITE_ANALYTICS_ID !== undefined,
    NEW_DASHBOARD_ENABLED: env.VITE_NEW_DASHBOARD_ENABLED === 'true',
    AI_ENHANCED_SEARCH: env.VITE_AI_ENHANCED_SEARCH === 'true',
    MAINTENANCE_MODE: env.VITE_MAINTENANCE_MODE === 'true',
    GEMINI_MODEL_VERSION: env.VITE_GEMINI_MODEL_VERSION || 'gemini-pro',
    GEMINI_API_ENDPOINT: env.VITE_GEMINI_API_ENDPOINT || 'https://generativelanguage.googleapis.com/',
  };
}

/**
 * Custom logger for build process, could be expanded for more detailed reporting.
 */
export function customLogger(message: string, type: 'info' | 'warn' | 'error' = 'info') {
  const timestamp = new Date().toISOString();
  let logMessage = `[${timestamp}] [ViteConfig] ${message}`;
  switch (type) {
    case 'info':
      console.log(`\x1b[36m${logMessage}\x1b[0m`); // Cyan
      break;
    case 'warn':
      console.warn(`\x1b[33m${logMessage}\x1b[0m`); // Yellow
      break;
    case 'error':
      console.error(`\x1b[31m${logMessage}\x1b[0m`); // Red
      break;
  }
}

/**
 * Resolves paths for aliases, ensuring a robust structure for large applications.
 * This can be expanded to include many more common paths.
 */
export const createPathAliases = (baseDir: string) => ({
  '@': path.resolve(baseDir, './src'),
  '@assets': path.resolve(baseDir, './src/assets'),
  '@components': path.resolve(baseDir, './src/components'),
  '@hooks': path.resolve(baseDir, './src/hooks'),
  '@layouts': path.resolve(baseDir, './src/layouts'),
  '@pages': path.resolve(baseDir, './src/pages'),
  '@services': path.resolve(baseDir, './src/services'),
  '@store': path.resolve(baseDir, './src/store'),
  '@styles': path.resolve(baseDir, './src/styles'),
  '@utils': path.resolve(baseDir, './src/utils'),
  '@config': path.resolve(baseDir, './src/config'),
  '@shared': path.resolve(baseDir, './src/shared'),
  '@api': path.resolve(baseDir, './src/api'),
  // For interaction with the server-side, potentially through API clients
  '@server-types': path.resolve(baseDir, './src/server-types'),
});

export default defineConfig(({ mode }) => {
    // Load environment variables for the current mode
    const env = loadEnv(mode, process.cwd(), 'VITE_'); // Prefix VITE_ for client-side env vars
    const rawEnv = loadEnv(mode, '.', ''); // Load all env vars without prefix for server-side use like API keys

    const isDevelopment = mode === 'development';
    const isProduction = mode === 'production';

    // Load dynamic feature flags
    const featureFlags = loadFeatureFlags(mode, env);
    customLogger(`Loading configuration in ${mode} mode.`);
    customLogger(`Feature Flags: ${JSON.stringify(featureFlags)}`);

    // Ensure critical API keys are present in production-like environments
    if (isProduction && !rawEnv.GEMINI_API_KEY) {
      customLogger('GEMINI_API_KEY is not defined in production mode. This may lead to runtime errors.', 'error');
    }
    if (isDevelopment && !rawEnv.GEMINI_API_KEY) {
      customLogger('GEMINI_API_KEY is not defined in development mode. Using a placeholder or mock might be required.', 'warn');
    }

    // Attempt to load HTTPS certificates for local development if available
    let httpsConfig = {};
    if (isDevelopment && env.VITE_DEV_SERVER_HTTPS === 'true') {
      const certPath = path.resolve(__dirname, './.certs/server.crt');
      const keyPath = path.resolve(__dirname, './.certs/server.key');
      if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
        httpsConfig = {
          https: {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath),
          },
        };
        customLogger('HTTPS enabled for development server.');
      } else {
        customLogger('HTTPS enabled, but .certs/server.crt or .certs/server.key not found. Running HTTP.', 'warn');
      }
    }


    return {
      // Configuration for the development server
      server: {
        port: parseInt(env.VITE_APP_PORT || '3000'), // Allow port to be configurable via env
        host: env.VITE_APP_HOST || '0.0.0.0', // Allow host to be configurable
        open: env.VITE_APP_OPEN_BROWSER === 'true', // Open browser automatically
        strictPort: true, // Exit if port is already in use
        hmr: {
          overlay: true, // Show HMR errors in browser
        },
        // Proxy API requests to a backend server for seamless development
        proxy: {
          '/api': {
            target: env.VITE_API_BASE_URL || 'http://localhost:8080', // Default backend API
            changeOrigin: true,
            secure: false, // Set to true if your backend uses HTTPS with valid certificates
            rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix when forwarding
          },
          // Potentially add another proxy for AI services if they are not directly exposed client-side
          '/gemini-proxy': {
            target: featureFlags.GEMINI_API_ENDPOINT,
            changeOrigin: true,
            secure: true,
            rewrite: (path) => path.replace(/^\/gemini-proxy/, ''),
          }
        },
        ...httpsConfig, // Apply HTTPS config if loaded
      },

      // Essential Vite plugins for a modern React application
      plugins: [
        react(),
        svgr({
          svgrOptions: {
            icon: true,
            // Further SVG optimization options can be added here
          },
        }),
        tsconfigPaths(), // Automatically uses paths from tsconfig.json
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
          manifest: {
            name: env.VITE_APP_NAME || 'Publisher Edition Application',
            short_name: env.VITE_APP_SHORT_NAME || 'PE App',
            description: env.VITE_APP_DESCRIPTION || 'A high-value, commercial-grade web application.',
            theme_color: env.VITE_APP_THEME_COLOR || '#ffffff',
            background_color: env.VITE_APP_BACKGROUND_COLOR || '#ffffff',
            display: 'standalone',
            icons: [
              {
                src: 'pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png',
              },
              {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png',
              },
              {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable',
              },
            ],
          },
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json}'],
            // Cache strategies for different asset types
            runtimeCaching: [
              {
                urlPattern: ({ url }) => url.origin === self.location.origin && url.pathname.includes('/api/'),
                handler: 'NetworkFirst',
                options: {
                  cacheName: 'api-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
                  },
                  cacheableResponse: {
                    statuses: [0, 200],
                  },
                },
              },
              {
                urlPattern: ({ url }) => url.origin === self.location.origin && /\.(png|jpe?g|gif|svg|webp|avif)$/.test(url.pathname),
                handler: 'CacheFirst',
                options: {
                  cacheName: 'image-cache',
                  expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                  },
                },
              },
            ],
          },
          devOptions: {
            enabled: isDevelopment, // Enable PWA in dev for testing
          },
        }),
        // Compression plugin for production builds
        isProduction && viteCompression({
          algorithm: 'gzip',
          ext: '.gz',
          threshold: 10240, // Only compress files larger than 10KB
          deleteOriginFile: false, // Keep original files
        }),
        isProduction && viteCompression({
          algorithm: 'brotliCompress',
          ext: '.br',
          threshold: 10240,
          deleteOriginFile: false,
        }),
        // Visualizer to analyze bundle size (useful for optimization)
        isProduction && visualizer({
          open: true, // Open the report in browser after build
          filename: 'bundle-analysis.html',
          gzipSize: true,
          brotliSize: true,
        }),
      ].filter(Boolean), // Filter out false values from conditional plugins

      // Define global constants available in the application code
      define: {
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.VITE_APP_ENV': JSON.stringify(mode), // Explicitly pass the mode
        'process.env.API_KEY': JSON.stringify(rawEnv.GEMINI_API_KEY || ''), // Primary AI API key
        'process.env.GEMINI_API_KEY': JSON.stringify(rawEnv.GEMINI_API_KEY || ''), // Redundant for clarity
        'process.env.VITE_AI_MODEL_VERSION': JSON.stringify(featureFlags.GEMINI_MODEL_VERSION),
        'process.env.VITE_AI_API_ENDPOINT': JSON.stringify(featureFlags.GEMINI_API_ENDPOINT),
        'process.env.VITE_ANALYTICS_ID': JSON.stringify(env.VITE_ANALYTICS_ID || null),
        'process.env.VITE_ENABLE_ANALYTICS': JSON.stringify(featureFlags.ANALYTICS_ENABLED),
        'process.env.VITE_ENABLE_NEW_DASHBOARD': JSON.stringify(featureFlags.NEW_DASHBOARD_ENABLED),
        'process.env.VITE_AI_ENHANCED_SEARCH': JSON.stringify(featureFlags.AI_ENHANCED_SEARCH),
        'process.env.VITE_MAINTENANCE_MODE': JSON.stringify(featureFlags.MAINTENANCE_MODE),
        'process.env.VITE_APP_VERSION': JSON.stringify(process.env.npm_package_version), // Inject app version from package.json
        'process.env.VITE_BUILD_DATE': JSON.stringify(new Date().toISOString()), // Inject build timestamp
      },

      // Module resolution configuration
      resolve: {
        alias: createPathAliases(__dirname), // Use the expanded alias helper
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'], // Ensure all common extensions are resolved
      },

      // Build specific optimizations for production
      build: {
        outDir: 'dist', // Output directory for the build
        assetsDir: 'static', // Directory for assets (images, fonts) relative to outDir
        sourcemap: isDevelopment || env.VITE_GENERATE_SOURCEMAP === 'true', // Control sourcemap generation
        minify: isProduction ? 'esbuild' : false, // Minify code in production using esbuild (faster)
        cssCodeSplit: true, // Enable CSS code splitting
        reportCompressedSize: true, // Report compressed size in build output
        // Advanced Rollup options for fine-grained control over bundling
        rollupOptions: {
          output: {
            // Manual chunking to split large dependencies into separate files
            manualChunks: (id) => {
              if (id.includes('node_modules')) {
                // Example: Group specific libraries together
                if (id.includes('@react-aria') || id.includes('@react-stately')) {
                  return 'vendor-react-aria';
                }
                if (id.includes('redux') || id.includes('react-redux')) {
                  return 'vendor-redux';
                }
                // Group all other node_modules into a single vendor chunk
                return 'vendor';
              }
            },
            // Customize asset file names to include hash for cache busting
            assetFileNames: (assetInfo) => {
              if (assetInfo.name && /\.(css)$/.test(assetInfo.name)) {
                return `static/css/[name].[hash][extname]`;
              }
              if (assetInfo.name && /\.(png|jpe?g|gif|svg|webp|avif)$/.test(assetInfo.name)) {
                return `static/img/[name].[hash][extname]`;
              }
              if (assetInfo.name && /\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
                return `static/fonts/[name].[hash][extname]`;
              }
              return `static/[name].[hash][extname]`;
            },
            // Customize entry chunk and chunk file names
            entryFileNames: 'static/js/[name].[hash].js',
            chunkFileNames: 'static/js/[name].[hash].js',
          },
        },
      },

      // Advanced CSS pre-processor options
      css: {
        devSourcemap: isDevelopment, // Enable CSS sourcemaps in development
        preprocessorOptions: {
          scss: {
            additionalData: `@import "@/styles/variables/_main.scss";`, // Globally inject SCSS variables
            // Further options for SCSS like includePaths
          },
        },
        // CSS Modules configuration for local scoping
        modules: {
          scopeBehaviour: 'local',
          generateScopedName: isDevelopment ? '[name]__[local]__[hash:base64:5]' : '[hash:base64:8]',
        },
      },
    };
});

================================================================================
// APPENDED FROM REPO: diplomat-bit/connect-api | ORIGINAL PATH: diplomat-bit-connect-api-352979a/vite.config.ts
================================================================================

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/diplomat-bit-book-icewall | ORIGINAL PATH: diplomat-bit-diplomat-bit-book-icewall-23638b5/vite.config.ts
================================================================================

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/vite.config.ts
================================================================================

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables based on mode (development/production)
  const env = loadEnv(mode, process.cwd(), '');
  const root = process.cwd();

  return {
    base: './',

    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    plugins: [react()],

    define: {
      // Client-safe public environment variables
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.STRIPE_PUBLISHABLE_KEY': JSON.stringify(env.STRIPE_PUBLISHABLE_KEY),
      'process.env.PLAID_CLIENT_ID': JSON.stringify(env.PLAID_CLIENT_ID),
      'process.env.PLAID_ENV': JSON.stringify(env.PLAID_ENV || 'sandbox'),
    },

    resolve: {
      alias: {
        '@': path.resolve(root, 'src'),
      },
    },

    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: path.resolve(root, 'index.html'),
        },
      },
    },
  };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/G20 | ORIGINAL PATH: diplomat-bit-G20-0199fa7/vite.config.ts
================================================================================

import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    headers: {
      // Standard headers for broader environment compatibility
      'Access-Control-Allow-Origin': '*',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})


================================================================================
// APPENDED FROM REPO: diplomat-bit/gameover | ORIGINAL PATH: diplomat-bit-gameover-da1da3c/vite.config.ts
================================================================================

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/gatekeeper-bank-verification-ModernTreasury | ORIGINAL PATH: diplomat-bit-gatekeeper-bank-verification-ModernTreasury-c0701fa/vite.config.ts
================================================================================

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/Gmail-ai-loan-over-writer- | ORIGINAL PATH: diplomat-bit-Gmail-ai-loan-over-writer--b3dc614/vite.config.ts
================================================================================

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/illi | ORIGINAL PATH: diplomat-bit-illi-d81a5ee/vite.config.ts
================================================================================

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/vite.config.ts
================================================================================


import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const root = (process as any).cwd ? (process as any).cwd() : '.';

  return {
    base: './',

    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    plugins: [react()],

    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),

      // Payment & Banking Gateways
      'process.env.STRIPE_PUBLISHABLE_KEY': JSON.stringify(env.STRIPE_PUBLISHABLE_KEY),
      'process.env.STRIPE_SECRET_KEY': JSON.stringify(env.STRIPE_SECRET_KEY), 
      'process.env.PLAID_CLIENT_ID': JSON.stringify(env.PLAID_CLIENT_ID),
      'process.env.PLAID_SECRET': JSON.stringify(env.PLAID_SECRET),
      'process.env.PLAID_ENV': JSON.stringify(env.PLAID_ENV || 'sandbox'),

      // Database Defaults (Can be overridden in Settings View)
      'process.env.DB_HOST': JSON.stringify(env.DB_HOST || 'localhost'),
      'process.env.DB_PORT': JSON.stringify(env.DB_PORT || '5432'),
      'process.env.DB_USER': JSON.stringify(env.DB_USER || 'postgres'),
      'process.env.DB_PASSWORD': JSON.stringify(env.DB_PASSWORD || 'password'),
      'process.env.DB_NAME': JSON.stringify(env.DB_NAME || 'sovereign_bank'),
    },

    resolve: {
      alias: {
        '@': path.resolve(root, '.'),
      },
    },
  };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-custom-GitHub-repo-transformer-into-New-York-times-best-seller | ORIGINAL PATH: diplomat-bit-jocall3-custom-GitHub-repo-transformer-into-New-York-times-best-seller-5617407/vite.config.ts
================================================================================

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-plaid-marqeta-modern-Treasury-aibanking.dev- | ORIGINAL PATH: diplomat-bit-jocall3-plaid-marqeta-modern-Treasury-aibanking.dev--44f28d7/vite.config.ts
================================================================================

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/vite.config.ts
================================================================================

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables based on mode (development/production)
  const env = loadEnv(mode, process.cwd(), '');
  const root = process.cwd();

  return {
    base: './',

    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    plugins: [react()],

    define: {
      // Client-safe public environment variables
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.STRIPE_PUBLISHABLE_KEY': JSON.stringify(env.STRIPE_PUBLISHABLE_KEY),
      'process.env.PLAID_CLIENT_ID': JSON.stringify(env.PLAID_CLIENT_ID),
      'process.env.PLAID_ENV': JSON.stringify(env.PLAID_ENV || 'sandbox'),
    },

    resolve: {
      alias: {
        '@': path.resolve(root, 'src'),
      },
    },

    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: path.resolve(root, 'index.html'),
        },
      },
    },
  };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/my-appaibanking | ORIGINAL PATH: diplomat-bit-my-appaibanking-43962ef/vite.config.ts
================================================================================


import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const root = (process as any).cwd ? (process as any).cwd() : '.';

  return {
    base: './',

    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    plugins: [react()],

    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),

      // Payment & Banking Gateways
      'process.env.STRIPE_PUBLISHABLE_KEY': JSON.stringify(env.STRIPE_PUBLISHABLE_KEY),
      'process.env.STRIPE_SECRET_KEY': JSON.stringify(env.STRIPE_SECRET_KEY), 
      'process.env.PLAID_CLIENT_ID': JSON.stringify(env.PLAID_CLIENT_ID),
      'process.env.PLAID_SECRET': JSON.stringify(env.PLAID_SECRET),
      'process.env.PLAID_ENV': JSON.stringify(env.PLAID_ENV || 'sandbox'),

      // Database Defaults (Can be overridden in Settings View)
      'process.env.DB_HOST': JSON.stringify(env.DB_HOST || 'localhost'),
      'process.env.DB_PORT': JSON.stringify(env.DB_PORT || '5432'),
      'process.env.DB_USER': JSON.stringify(env.DB_USER || 'postgres'),
      'process.env.DB_PASSWORD': JSON.stringify(env.DB_PASSWORD || 'password'),
      'process.env.DB_NAME': JSON.stringify(env.DB_NAME || 'sovereign_bank'),
    },

    resolve: {
      alias: {
        '@': path.resolve(root, '.'),
      },
    },
  };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/partnerportal-microsoft | ORIGINAL PATH: diplomat-bit-partnerportal-microsoft-81d9840/vite.config.ts
================================================================================

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/tts-ai-book-reader-it-can-read-entire-books | ORIGINAL PATH: diplomat-bit-tts-ai-book-reader-it-can-read-entire-books-128ebf1/vite.config.ts
================================================================================

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/usa | ORIGINAL PATH: diplomat-bit-usa-d72fd59/vite.config.ts
================================================================================

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
