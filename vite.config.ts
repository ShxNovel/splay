/// <reference types="vitest/config" />
import { defineConfig } from 'vite';

export default defineConfig({
    test: {
        root: 'test',
        clearMocks: true,
        typecheck: {
            enabled: true,
        },
    },
    build: {
        lib: {
            entry: {
                splay: './src/index.ts',
                example: './src/example/index.ts',
            },
            formats: ['es', 'cjs'],
        },
    },
});
