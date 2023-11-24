/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from '@vitejs/plugin-react-swc'
import { join, resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, join(__dirname)) }

  return {
    plugins: [react()],
    envDir: join(__dirname),
    envPrefix: ['API_', 'VITE_'],
    define: {
      'import.meta.env.APP_VERSION': `"${process.env.npm_package_version}"`,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      cache: { dir: './node_modules/.vitest' },
      include: ['./**/*.{test,spec}.{ts,tsx}'],
    },
    publicDir: resolve(__dirname, 'public'),
    root: resolve(__dirname, 'src'),
    build: {
      emptyOutDir: true,
      outDir: resolve(__dirname, 'dist'),
      rollupOptions: {
        input: {
          app: resolve(__dirname, 'src/index.html'),
        },
      },
    },
    resolve: {
      alias: [
        { find: '@', replacement: resolve(__dirname, 'src') },
        { find: '~', replacement: resolve(__dirname, 'public') },
      ],
    },
    base: process.env.VITE_BASE_URL,
    server: {
      port: 3000,
      base: '/',
      proxy: {},
      watch: {
        usePolling: true,
      },
    },
  }
})
