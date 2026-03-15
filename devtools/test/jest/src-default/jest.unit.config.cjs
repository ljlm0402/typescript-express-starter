const baseConfig = require('./jest.config.cjs');

module.exports = {
  ...baseConfig,
  // setup 파일 제거 - unit 테스트는 순수하게 실행
  setupFilesAfterEnv: [],
  // unit 테스트만 실행
  testMatch: ['<rootDir>/src/test/unit/**/*.spec.ts'],
};
