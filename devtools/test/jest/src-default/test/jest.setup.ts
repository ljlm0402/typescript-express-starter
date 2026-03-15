// Jest 테스트 환경 설정
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error'; // 테스트 중 로그 최소화

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