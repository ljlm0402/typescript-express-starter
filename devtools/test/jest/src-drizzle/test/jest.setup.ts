// Jest 테스트 환경 설정
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.DATABASE_URL ??= 'postgresql://postgres:password@localhost:5432/drizzle_postgresql_dev';
process.env.SECRET_KEY = 'test-secret-key';
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.JWT_EXPIRES_IN = '1h';
process.env.LOG_FORMAT = 'dev';
process.env.LOG_DIR = 'logs';
process.env.LOG_LEVEL = 'error';
process.env.ORIGIN = '*';
process.env.CREDENTIALS = 'true';

// Global teardown for Jest
const originalExit = process.exit;
process.exit = ((code?: number) => {
  // 모든 타이머와 핸들 정리
  if (global.gc) {
    global.gc();
  }
  
  // 강제 종료
  originalExit(code);
}) as typeof process.exit;
