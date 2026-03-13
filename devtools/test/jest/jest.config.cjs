const { pathsToModuleNameMapper } = require('ts-jest');
const { readFileSync } = require('fs');

// tsconfig.json 읽기
const tsconfig = JSON.parse(readFileSync('./tsconfig.json', 'utf8'));

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers: 1, // 안정성을 위해 단일 워커 사용
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  roots: ['<rootDir>/src'],

  // 상세 로그 설정 (Vitest와 유사한 출력)
  verbose: true,
  collectCoverage: false, // 기본값으로 coverage 끄기
  detectOpenHandles: true,
  passWithNoTests: true,

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
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/**/index.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/logs/', '/unit_disabled/'],

  // 타이밍 정보 추가 (Vitest와 유사한 성능 정보)
  fakeTimers: {
    enableGlobally: false,
  },
  slowTestThreshold: 5,
};
