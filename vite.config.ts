// https://vitejs.dev/config/
import fs from 'node:fs'
import { defineConfig } from 'vite'

import { fileURLToPath, URL } from 'url'
import tsconfigPaths from 'vite-tsconfig-paths'
import VueDevTools from 'vite-plugin-vue-devtools'
import Vue from '@vitejs/plugin-vue'
import Electron from 'vite-plugin-electron/simple'
import { notBundle } from 'vite-plugin-electron/plugin'

export default defineConfig(({ command }: { command: 'build' | 'serve' }) => {
    fs.rmSync('dist-electron', { recursive: true, force: true })
    const isServe = command === 'serve'
    const isBuild = command === 'build'

    return {
        build: { target: 'esnext', chunkSizeWarningLimit: 5000 },
        plugins: [
            tsconfigPaths(),
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
                    entry: 'src/electron/main.ts',
                    onstart({ startup }) {
                        startup()
                    },
                    vite: {
                        build: {
                            target: 'esnext',
                            sourcemap: isServe,
                            minify: isBuild,
                            outDir: 'dist-electron',
                            rollupOptions: {
                                output: {
                                    inlineDynamicImports: true,
                                },
                            },
                        },
                        plugins: [isServe && notBundle()],
                        resolve: {
                            alias: {
                                '@': fileURLToPath(new URL('./src', import.meta.url)),
                            },
                        },
                    },
                },
                preload: {
                    input: 'src/electron/preload.ts',
                    vite: {
                        build: {
                            target: 'esnext',
                            sourcemap: isServe ? 'inline' : undefined, // #332
                            minify: isBuild,
                            outDir: 'dist-electron',
                        },
                        plugins: [isServe && notBundle()],
                        resolve: {
                            alias: {
                                '@': fileURLToPath(new URL('./src', import.meta.url)),
                            },
                        },
                    },
                },
            }),
        ],
        css: {
            devSourcemap: true,
        },
        base: '.',
        resolve: {
            alias: [{ find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) }],
        },
        test: {
            globals: true,
            include: ['test/**/*.test.ts', 'src/**/__tests__/*'],
            environment: 'jsdom',
            setupFiles: ['./test/setup.ts'],
        },
    }
})
