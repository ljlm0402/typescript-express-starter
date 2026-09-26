import 'reflect-metadata';
import { container } from 'tsyringe';
import { setupContainer } from '@config/container';
import { logger } from '@utils/logger';
import App from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/user.route';

/**
 * 서버 시작점
 */
async function bootstrap(): Promise<any> {
  try {
    logger.info('Starting server...');

    // DI 컨테이너 설정
    setupContainer();

    // 라우트 배열 구성
    const routes = [
      container.resolve<AuthRoute>('AuthRoute'),
      container.resolve<UserRoute>('UserRoute'),
    ];

    // App 인스턴스 생성
    const appInstance = new App(routes);

    // 애플리케이션 초기화 (DB 연결 등)
    await appInstance.initialize();

    // 서버 시작
    const server = appInstance.listen();

    // Graceful Shutdown 처리
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          await appInstance.cleanup();
          logger.info('Application cleanup completed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during cleanup', { error });
          process.exit(1);
        }
      });

      // 강제 종료 타이머 (10초 후)
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    // 시그널 핸들러 등록
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

    // 예상치 못한 에러 처리
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception', { error });
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection', { reason, promise });
      process.exit(1);
    });

    logger.info('Server started successfully');
    return server;
  } catch (error) {
    console.error('Bootstrap error:', error);
    logger.error('Failed to start server', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : '',
      error: error
    });
    process.exit(1);
  }
}

// 서버 시작
bootstrap();
