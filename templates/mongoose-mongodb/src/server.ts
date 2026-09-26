import 'reflect-metadata';
import '@config/env';
import { container } from 'tsyringe';
import App from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/user.route';
import { logger } from '@utils/logger';

/**
 * 서버 초기화 및 시작
 */
async function bootstrap(): Promise<void> {
  try {
    logger.info('🚀 Starting MongoDB Express Server...');

    // 라우트 등록
    const routes = [container.resolve(AuthRoute), container.resolve(UserRoute)];

    // Express 앱 생성
    const app = new App(routes);

    // 서버 시작
    const server = app.listen();

    // Graceful Shutdown 설정
    const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

    signals.forEach((signal) => {
      process.on(signal, async () => {
        logger.info(`📴 Received ${signal}, closing server gracefully...`);

        if (server && typeof server.close === 'function') {
          server.close(async () => {
            logger.info('📴 HTTP server closed');

            // 앱 정리 작업 (MongoDB 연결 해제 등)
            await app.shutdown();

            process.exit(0);
          });
        } else {
          // 앱 정리 작업
          await app.shutdown();
          process.exit(0);
        }
      });
    });

    // 예외 처리
    process.on('uncaughtException', (error) => {
      logger.error('❌ Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

    logger.info('✅ Server started successfully');
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// 서버 시작
bootstrap();
