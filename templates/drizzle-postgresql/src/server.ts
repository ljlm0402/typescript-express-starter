import 'reflect-metadata';
import '@config/env';
import { container } from 'tsyringe';
import { setupContainer } from '@config/container';
import App from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UsersRoute } from '@routes/users.route';
import { logger } from '@utils/logger';

setupContainer();

// 라우트 인스턴스 생성
const routes = [container.resolve(AuthRoute), container.resolve(UsersRoute)];

// 앱 인스턴스 생성
const appInstance = new App(routes);

// 서버 시작
const server = appInstance.listen();

// Graceful Shutdown
if (server && typeof server.close === 'function') {
  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => {
      logger.info(`Received ${signal}, closing server...`);
      server.close(() => {
        logger.info('HTTP server closed gracefully');
        process.exit(0);
      });
    });
  });
}

export default server;
