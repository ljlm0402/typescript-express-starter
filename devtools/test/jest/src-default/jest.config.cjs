const { pathsToModuleNameMapper } = require('ts-jest');
const { readFileSync } = require('fs');

// tsconfig.json 읽기
const tsconfig = JSON.parse(readFileSync('./tsconfig.json', 'utf8'));

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers: 1, // 안정성을 위해 단일 워커 사용
  setupFilesAfterEnv: ['<rootDir>/src-default/test/setup.ts'],
  roots: ['<rootDir>/src-default'],

  // 상세 로그 설정 (Vitest와 유사한 출력)
  verbose: true,
  collectCoverage: false, // 기본값으로 coverage 끄기
  detectOpenHandles: true,
  forceExit: true, // 강제 종료로 핸들 문제 해결
  passWithNoTests: true,
  testTimeout: 15000, // 테스트 타임아웃 설정

  // 테스트 환경 변수 명시적 설정 (default 템플릿은 jest.setup.ts 없음)
  // setupFiles: ['<rootDir>/src-default/test/jest.setup.ts'],

  transform: {
    '^.+\.tsx?$': [
      'ts-jest',
      {
        useESM: false,
      },
    ],
  },
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions?.paths || {}, {
    prefix: '<rootDir>/src-default/',
  }),
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src-default/**/*.{ts,tsx}',
    '!src-default/**/*.d.ts',
    '!src-default/**/index.ts',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/logs/', '/unit_disabled/'],

  // 타이밍 정보 추가 (Vitest와 유사한 성능 정보)
  fakeTimers: {
    enableGlobally: false,
  },
  slowTestThreshold: 5,
};
