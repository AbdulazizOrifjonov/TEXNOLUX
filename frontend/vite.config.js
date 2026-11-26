import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let botPort = process.env.PORT || '5002';
try {
  const rootEnv = path.resolve(__dirname, '../.env');
  if (fs.existsSync(rootEnv)) {
    const match = fs.readFileSync(rootEnv, 'utf8').match(/^\s*PORT\s*=\s*(\d+)/m);
    if (match) botPort = match[1];
  }
} catch (_) {}

const botProxy = {
  '/bot-api': {
    target: `http://127.0.0.1:${botPort}`,
    changeOrigin: true
  }
};

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    allowedHosts: true,
    proxy: botProxy
  },
  preview: {
    port: 3000,
    allowedHosts: true,
    proxy: botProxy
  }
});
