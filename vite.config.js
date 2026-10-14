import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    open: true,
    host: true   // same WiFi na phone par pan test thay
  }
});