/// <reference types="vitest" />
// Plugins
import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
// Utilities
import { defineConfig, loadEnv, version as viteVersion } from 'vite';
import { compression } from 'vite-plugin-compression2';
// versions
import vuetify from 'vite-plugin-vuetify';
import { version as vueVersion } from 'vue/package.json';
import { version as vuetifyVersion } from 'vuetify/package.json';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    base: env.VITE_APP_BASE_PATH || '/',
    plugins: [
      vue(),
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
      vuetify({
        autoImport: true,
        styles: { configFile: 'src/styles/variables.scss' },
      }),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
      }),
      compression(),
    ],
    define: {
      'process.env': env,
      'import.meta.versions': {
        vite: viteVersion,
        vue: vueVersion,
        vuetify: vuetifyVersion,
      },
    },
    test: {
      globals: true,
      environment: 'happy-dom',
    },
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./', import.meta.url)),
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@data': fileURLToPath(new URL('./src/data', import.meta.url)),
      },
      extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
    },
    server: {
      port: 4399,
      proxy: {
        '/api': {
          target: env.VITE_APP_BASE_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: { charset: false },
        css: { charset: false },
      },
    },
  };
});
