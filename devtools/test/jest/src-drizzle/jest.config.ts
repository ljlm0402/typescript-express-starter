import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { readFileSync } from 'fs';

// tsconfig.json 읽기
const tsconfig = JSON.parse(readFileSync('./tsconfig.json', 'utf8'));

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers: 1, // 안정성을 위해 단일 워커 사용
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  roots: ['<rootDir>/src'],

  // 상세 로그 설정 (Vitest와 유사한 출력)
  verbose: true,
  collectCoverage: false, // 기본값으로 coverage 끄기
  detectOpenHandles: true,
  forceExit: true, // 강제 종료로 핸들 문제 해결
  passWithNoTests: true,
  testTimeout: 15000, // 테스트 타임아웃 설정

  // 테스트 환경 변수 명시적 설정
  setupFiles: ['<rootDir>/src/test/jest.setup.ts'],

  transform: {
    '^.+\.tsx?$': [
      'ts-jest',
      {
        useESM: false,
      },
    ],
  },
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions?.paths || {}, {
    prefix: '<rootDir>/src/',
  }),
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
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/logs/', '/unit_disabled/'],

  // Watchman 비활성화 (macOS 호환성 개선)
  watchman: false,
  haste: {
    enableSymlinks: false,
  },

  // 타이밍 정보 추가 (Vitest와 유사한 성능 정보)
  fakeTimers: {
    enableGlobally: false,
  },
  slowTestThreshold: 5,

  // 드리즐 특화 커버리지 목표
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // 환경별 설정
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
  },
};

export default config;
