import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

// a separate config keeps tests away from the build plugins (react, pwa)
export default defineConfig({
  plugins: [tsconfigPaths()],
  // build-time globals come from vite.config, which tests do not load: they only
  // need to exist, so the values are deliberately recognizable as test ones
  define: {
    RECAPTCHA_SITE_KEY: '"test-recaptcha-key"',
    TELEGRAM_BOT_ID: '"test-bot-id"',
    VERSION: '"test"',
    BUILD_DATE: '"1970-01-01T00:00:00.000Z"',
    MEDIA_CACHE_NAME: '"test-media-cache"',
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
