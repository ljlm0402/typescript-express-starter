import 'reflect-metadata';
import { container } from 'tsyringe';
import App from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UsersRoute } from '@routes/users.route';
import { UsersRepository, IUsersRepository } from '@repositories/users.repository';

let sharedRepo: UsersRepository;

export function createTestApp({ mockRepo }: { mockRepo?: IUsersRepository } = {}) {
  // 항상 새로운 인스턴스를 주입하고 싶으면 reset logic 추가 필요
  if (!sharedRepo) {
    sharedRepo = new UsersRepository();
    container.registerInstance(UsersRepository, sharedRepo);
  }
  // mockRepo가 있으면 주입
  if (mockRepo) {
    container.registerInstance(UsersRepository, mockRepo as UsersRepository);
  }

  // 클래스 타입을 직접 주입
  const routes = [container.resolve(UsersRoute), container.resolve(AuthRoute)];
  const appInstance = new App(routes);
  return appInstance.getServer();
}

export function resetUserDB() {
  if (sharedRepo) {
    sharedRepo.reset();
  }
}
