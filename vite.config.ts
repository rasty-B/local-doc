import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.PORT || '3000'),
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.API_PORT || '8080'}`,
        changeOrigin: true,
      },
      '/ws': {
        target: `ws://localhost:${process.env.API_PORT || '8080'}`,
        ws: true,
      },
    },
  },
});