import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };
  const backendUrl = new URL(process.env.PROXY_TARGET || 'http://127.0.0.1:4000');
  const { RECAPTCHA_SITE_KEY, TELEGRAM_BOT_ID } = process.env;

  return {
    base: '',
    server: {
      proxy: {
        '/api/': {
          secure: false,
          target: backendUrl,
        },
        '/socket.io': {
          secure: false,
          target: backendUrl,
          ws: true,
        },
      },
    },
    define: {
      RECAPTCHA_SITE_KEY: JSON.stringify(RECAPTCHA_SITE_KEY),
      TELEGRAM_BOT_ID: JSON.stringify(TELEGRAM_BOT_ID),
    },
    plugins: [
      react(),
      tsconfigPaths(),
      VitePWA({
        manifest: {
          name: 'Audio books',
          short_name: 'Audio books',
          icons: [
            {
              src: 'pwa-64x64.png',
              sizes: '64x64',
              type: 'image/png',
            },
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'maskable-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,woff2}'],
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.pathname.startsWith('/api/') && !url.pathname.endsWith('.mp3'),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api',
              },
            },
            {
              urlPattern: ({ url }) => url.pathname.endsWith('.mp3'),
              handler: 'CacheFirst',
              options: {
                cacheName: 'mp3',
                cacheableResponse: { statuses: [200] },
                rangeRequests: true,
              },
            },
          ],
        },
      }),
    ],
  };
});
