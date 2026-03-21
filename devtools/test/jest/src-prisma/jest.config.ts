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
  // Prisma 특화 설정
  globalSetup: '<rootDir>/src/test/global-setup.ts',
  globalTeardown: '<rootDir>/src/test/global-teardown.ts',
  testTimeout: 30000, // Prisma DB 연결 고려
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/test/**/*',
    '!**/node_modules/**',
    '!prisma/**/*',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/logs/', '/prisma/migrations/'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  // Prisma client mocking
  moduleNameMapper: {
    ...pathsToModuleNameMapper(
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
  },
};

export default config;
