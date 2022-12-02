import { defineConfig } from 'vite';
import path from 'path';

var pathSrc = path.resolve(__dirname, "./src");

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use 'sass:math';
          @use 'sass:list';
          @use 'sass:map';
          @use 'sass:string';
          @use 'sass:color';
        `,
      },
    },
  },
  resolve: {
    alias: {
      '@': pathSrc,
    },
  },
});
