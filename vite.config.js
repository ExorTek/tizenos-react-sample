import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    target: ['es2015', 'chrome56'],
    rolldownOptions: {
      output: {
        assetFileNames: 'assets/[name][extname]',
        chunkFileNames: 'assets/[name].js',
        entryFileNames: 'assets/[name].js',
      },
    },
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    reportCompressedSize: false,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});
