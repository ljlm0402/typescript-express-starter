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
    setupFiles: ['src/test/setup.ts'],
    globalSetup: ['src/test/global-setup.ts'],
    globalTeardown: ['src/test/global-teardown.ts'],
    include: ['src/**/*.{test,spec}.ts', 'src/test/**/*.{test,spec}.ts'],
    exclude: [
      'node_modules',
      'dist',
      'coverage',
      'logs',
      'drizzle/**/*',
      'src/test/unit_disabled/**/*',
    ],
    testTimeout: 15000, // Vitest는 Jest보다 빠름
    hookTimeout: 30000, // DB 설정 시간 고려

    // Drizzle 특화 설정
    poolOptions: {
      threads: {
        singleThread: false, // Drizzle은 멀티스레드 지원 좋음
        isolate: true,
      },
    },

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/index.ts',
        'src/test/**',
        'src/config/migrate.ts',
        'drizzle/**/*',
      ],
      thresholds: {
        branches: 85,
        functions: 85,
        lines: 85,
        statements: 85,
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

export default config;
