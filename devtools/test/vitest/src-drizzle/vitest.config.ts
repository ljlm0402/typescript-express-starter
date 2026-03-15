import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
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

    // 커버리지 설정
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/index.ts',
        'src/test/**',
        'src/config/migrate.ts',
        'drizzle/**/*',
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },

    // 환경변수 설정
    env: {
      NODE_ENV: 'test',
      LOG_LEVEL: 'error',
    },
  },

  // TypeScript 설정
  esbuild: {
    target: 'node18',
    keepNames: true,
  },
});
