// https://vitejs.dev/config/
import fs from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

import VueDevTools from 'vite-plugin-vue-devtools';
import Vue from '@vitejs/plugin-vue';
import Electron from 'vite-plugin-electron/simple';
import { notBundle } from 'vite-plugin-electron/plugin';
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig(({ command }) => {
  fs.rmSync('dist-electron', { recursive: true, force: true })
  const isServe = command === 'serve'
  const isBuild = command === 'build'
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG

  return {
    build: { target: 'esnext', chunkSizeWarningLimit: 5000 },
    plugins: [
      VueDevTools(),
      VueRouter({ importMode: 'sync', dts: './src/typed-router.d.ts' }),
      Vue({ template: { transformAssetUrls } }),
      Vuetify({
        autoImport: true,
        styles: {
          configFile: 'src/styles/settings.scss',
        },
      }),
      Components({ dts: './src/components.d.ts', types: [] }),
      AutoImport({
        imports: [
          'vue',
          VueRouterAutoImports,
          {
            vuetify: [
              'useTheme',
              'useRtl',
              'useLocale',
              'useDisplay',
              'useLayout',
            ],
          },
        ],
        dts: 'src/auto-imports.d.ts',
        dirs: ['src/stores'],
      }),
      Electron({
        main: {
          entry: 'electron/main.ts',
          onstart({ startup }) {
              return startup();
          },
          vite: {
            build: {
              target: 'esnext',
              sourcemap,
              minify: isBuild,
              outDir: 'dist-electron',
              rollupOptions: {
                output: {
                  inlineDynamicImports: true,
                },
              },
            },
            plugins: [command === 'serve' && notBundle(/* NotBundleOptions */)],
          },
        },
        preload: {
          // Shortcut of `build.rollupOptions.input`.
          // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
          input: 'electron/preload.ts',
          vite: {
            build: {
              target: 'esnext',
              sourcemap: sourcemap ? 'inline' : undefined, // #332
              minify: isBuild,
              outDir: 'dist-electron',
            },
          },
        },
        // Polyfill the Electron and Node.js API for Renderer process.
        // If you want to use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
        // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
        // renderer: {},
      }),
    ],
    css: {
      devSourcemap: true,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    test: {
      globals: true,
      include: ['test/**/*.test.ts', 'src/**/__tests__/*'],
      environment: 'jsdom',
      setupFiles: ['./test/setup.ts'],
      server: { deps: { inline: ['vuetify'] } },
    },
  }
})
