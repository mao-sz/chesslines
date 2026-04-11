/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import postcssCustomMedia from 'postcss-custom-media';
import postcssGlobalData from '@csstools/postcss-global-data';

// https://vite.dev/config/
export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    css: {
        postcss: {
            plugins: [
                postcssGlobalData({ files: ['./src/app/reset.css'] }),
                postcssCustomMedia(),
            ],
        },
    },
    test: {
        environment: 'jsdom',
        setupFiles: './src/testing/setup.ts',
        reporters: 'dot',
    },
});
