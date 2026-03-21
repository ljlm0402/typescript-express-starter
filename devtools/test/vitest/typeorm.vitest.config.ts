import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['src/test/setup.ts'],
    globalSetup: ['src/test/global-setup.ts'],
    globalTeardown: ['src/test/global-teardown.ts'],
    include: ['src/**/*.{test,spec}.ts', 'src/test/**/*.{test,spec}.ts'],
    exclude: ['node_modules', 'dist', 'coverage', 'logs', 'src/migration/**/*'],
    testTimeout: 20000, // TypeORM reflection 대기 시간
    hookTimeout: 45000, // DB 연결 및 마이그레이션 시간

    // TypeORM 특화 설정
    poolOptions: {
      threads: {
        singleThread: true, // TypeORM은 메타데이터 충돌 방지
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
        'src/migration/**/*',
        'src/subscriber/**/*',
      ],
      thresholds: {
        branches: 80, // TypeORM은 복잡성으로 인해 약간 낮춤
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },

    // 환경변수 설정
    env: {
      NODE_ENV: 'test',
      LOG_LEVEL: 'error',
      TYPEORM_LOGGING: 'false',
    },
  },

  // TypeScript 설정 (Decorator 지원)
  esbuild: {
    target: 'node18',
    keepNames: true,
    experimentalDecorators: true,
  },
});

export default config;
