import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    root: './src',
    include: ['**/*.{test,spec}.ts'],
    exclude: ['**/unit_disabled/**', '**/node_modules/**', '**/dist/**', '**/logs/**'],
    setupFiles: ['./test/setup.ts'],
    testTimeout: 15000,
    hookTimeout: 30000,

    poolOptions: {
      threads: {
        singleThread: false,
        isolate: true,
      },
    },

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        'src/server.ts',
        'src/test/**',
        'src/**/index.ts',
      ],
      thresholds: {
        branches: 85,
        functions: 85,
        lines: 85,
        statements: 85,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@config': path.resolve(__dirname, './src/config'),
      '@controllers': path.resolve(__dirname, './src/controllers'),
      '@dtos': path.resolve(__dirname, './src/dtos'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@exceptions': path.resolve(__dirname, './src/exceptions'),
      '@interfaces': path.resolve(__dirname, './src/interfaces'),
      '@middlewares': path.resolve(__dirname, './src/middlewares'),
      '@repositories': path.resolve(__dirname, './src/repositories'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
});
