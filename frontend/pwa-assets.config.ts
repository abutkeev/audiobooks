import { defineConfig, minimalPreset } from '@vite-pwa/assets-generator/config';

const { transparent, maskable, apple } = minimalPreset;
const background = '#42a5f5';

export default defineConfig({
  preset: {
    transparent,
    maskable: {
      ...maskable,
      resizeOptions: { background },
    },
    apple: {
      ...apple,
      resizeOptions: { background },
    },
  },
  images: ['public/logo.svg'],
});
