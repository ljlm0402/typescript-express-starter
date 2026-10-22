import 'reflect-metadata';
import { container } from 'tsyringe';
import App from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UsersRoute } from '@routes/users.route';
import { UsersRepository, IUsersRepository } from '@repositories/users.repository';
import { AuthService } from '@services/auth.service';
import { UsersService } from '@services/users.service';

let sharedRepo: UsersRepository;

export function createTestApp({ mockRepo }: { mockRepo?: IUsersRepository } = {}) {
  if (!sharedRepo) {
    sharedRepo = new UsersRepository();
  }

  const repository = (mockRepo ?? sharedRepo) as UsersRepository;
  container.registerInstance(UsersRepository, repository);
  container.registerInstance(UsersService, new UsersService(repository));
  container.registerInstance(AuthService, new AuthService(repository));

  const routes = [container.resolve(UsersRoute), container.resolve(AuthRoute)];
  const appInstance = new App(routes);
  return appInstance.getServer();
}

export async function resetUserDB() {
  if (sharedRepo) {
    await sharedRepo.reset();
  }
}

export function getUniqueUser() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return {
    email: `test-${timestamp}-${random}@example.com`,
    password: 'password123',
  };
}
