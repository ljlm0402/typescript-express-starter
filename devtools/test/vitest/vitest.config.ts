import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    root: './src',
    include: ['**/*.{test,spec}.ts'],
    exclude: ['**/unit_disabled/**', '**/node_modules/**'],
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: ['node_modules/', 'dist/', '**/*.d.ts', 'src/server.ts'],
    },
    testTimeout: 10000,
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
