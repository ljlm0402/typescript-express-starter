import 'reflect-metadata';
import { container } from 'tsyringe';

// Repositories
import { UserRepository, IUserRepository } from '@repositories/user.repository';

// Services
import { AuthService } from '@services/auth.service';
import { UserService } from '@services/user.service';

// Controllers
import { AuthController } from '@controllers/auth.controller';
import { UserController } from '@controllers/user.controller';

// Routes
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/user.route';

/**
 * DI Container 설정
 */
export function setupContainer(): void {
  // Repositories
  container.registerSingleton<IUserRepository>('UserRepository', UserRepository);

  // Services
  container.registerSingleton(AuthService);
  container.registerSingleton(UserService);

  // Controllers
  container.registerSingleton(AuthController);
  container.registerSingleton(UserController);

  // Routes
  container.registerSingleton(AuthRoute);
  container.registerSingleton(UserRoute);
}
