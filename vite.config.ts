// https://vitejs.dev/config/
import fs from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

import VueDevTools from 'vite-plugin-vue-devtools'
import Vue from '@vitejs/plugin-vue'
import Electron from 'vite-plugin-electron/simple'
import { notBundle } from 'vite-plugin-electron/plugin'

export default defineConfig(({ command }: { command: 'build' | 'serve' }) => {
    fs.rmSync('dist-electron', { recursive: true, force: true })
    const isServe = command === 'serve'
    const isBuild = command === 'build'
    const sourcemap = isServe || !!process.env.VSCODE_DEBUG

    return {
        build: { target: 'esnext', chunkSizeWarningLimit: 5000 },
        plugins: [
            VueDevTools(),
            Vue({
                template: {
                    compilerOptions: {
                        isCustomElement: (tag) => tag.startsWith('mdui-'),
                    },
                },
            }),
            Electron({
                main: {
                    entry: 'electron/main.ts',
                    onstart({ startup }) {
                        return startup()
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
        },
    }
})
