import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  roots: ['<rootDir>/src'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.(test|spec).{ts,tsx}',
  ],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
        },
      },
    ],
  },
  moduleNameMapper: pathsToModuleNameMapper(
    {
      '@/*': ['*'],
      '@config/*': ['config/*'],
      '@controllers/*': ['controllers/*'],
      '@dtos/*': ['dtos/*'],
      '@entities/*': ['entities/*'],
      '@exceptions/*': ['exceptions/*'],
      '@interfaces/*': ['interfaces/*'],
      '@middlewares/*': ['middlewares/*'],
      '@repositories/*': ['repositories/*'],
      '@routes/*': ['routes/*'],
      '@services/*': ['services/*'],
      '@utils/*': ['utils/*'],
    },
    {
      prefix: '<rootDir>/src/',
    },
  ),
  // Drizzle 특화 설정
  globalSetup: '<rootDir>/src/test/global-setup.ts',
  globalTeardown: '<rootDir>/src/test/global-teardown.ts',
  testTimeout: 20000, // Drizzle은 Prisma보다 빠름
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/test/**/*',
    '!**/node_modules/**',
    '!drizzle/**/*',
    '!src/config/migrate.ts',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/logs/', '/drizzle/'],
  coverageThreshold: {
    global: {
      branches: 85, // Drizzle은 더 높은 커버리지 목표 가능
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  // 환경별 설정
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
  },
};

export default config;
