import 'reflect-metadata';
import '@config/env';
import { container } from 'tsyringe';
import App from '@/app';
import { UsersRepository } from '@repositories/users.repository';
import { AuthRoute } from '@routes/auth.route';
import { UsersRoute } from '@routes/users.route';
import { logger } from '@utils/logger';

// DI 등록
container.registerInstance(UsersRepository, new UsersRepository());

// 라우트 모듈을 필요에 따라 동적으로 배열화 가능
const routes = [container.resolve(UsersRoute), container.resolve(AuthRoute)];

// API prefix는 app.ts에서 기본값 세팅, 필요하면 인자로 전달
const appInstance = new App(routes);

// listen()이 서버 객체(http.Server)를 반환하도록 app.ts를 살짝 수정
const server = appInstance.listen(); // PORT를 쓰려면 이렇게 전달도 가능

// Graceful Shutdown: 운영환경에서 필수!
if (server && typeof server.close === 'function') {
  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
      logger.info(`Received ${signal}, closing server...`);
      server.close(() => {
        logger.info('HTTP server closed gracefully');
        // 필요하면 DB/Redis 등 외부 자원 해제 코드 추가
        process.exit(0);
      });
    });
  });
}

export default server;
