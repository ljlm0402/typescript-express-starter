import { defineConfig } from 'vitest/config';
import path from 'node:path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@controllers': path.resolve(__dirname, 'src/controllers'),
      '@dtos': path.resolve(__dirname, 'src/dtos'),
      '@entities': path.resolve(__dirname, 'src/entities'),
      '@exceptions': path.resolve(__dirname, 'src/exceptions'),
      '@interfaces': path.resolve(__dirname, 'src/interfaces'),
      '@middlewares': path.resolve(__dirname, 'src/middlewares'),
      '@repositories': path.resolve(__dirname, 'src/repositories'),
      '@routes': path.resolve(__dirname, 'src/routes'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,js}'],
    exclude: [
      'node_modules',
      'dist',
      'coverage',
      'logs',
      'drizzle/**/*',
      'src/test/unit_disabled/**/*',
    ],
    testTimeout: 15000,
    setupFiles: ['reflect-metadata'],
    env: {
      NODE_ENV: 'test',
      LOG_LEVEL: 'error',
    },
  },
  esbuild: {
    target: 'node22',
    keepNames: true,
  },
});
