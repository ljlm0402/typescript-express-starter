import { container } from 'tsyringe';
import { PrismaDatabaseConnection, IDatabaseConnection } from '@config/database';

// Repositories
import { UserRepository, IUserRepository } from '@repositories/user.repository';

// Services
import { AuthService, IAuthService } from '@services/auth.service';
import { UserService, IUserService } from '@services/user.service';

// Controllers
import { AuthController } from '@controllers/auth.controller';
import { UserController } from '@controllers/user.controller';

// Routes
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/user.route';

/**
 * TSyringe DI 컨테이너 설정
 */
export function setupContainer(): void {
  // Database Connection
  container.registerSingleton<IDatabaseConnection>('DatabaseConnection', PrismaDatabaseConnection);

  // Repositories
  container.registerSingleton<IUserRepository>('UserRepository', UserRepository);

  // Services
  container.registerSingleton<IAuthService>('AuthService', AuthService);
  container.registerSingleton<IUserService>('UserService', UserService);

  // Controllers
  container.registerSingleton<AuthController>('AuthController', AuthController);
  container.registerSingleton<UserController>('UserController', UserController);

  // Routes
  container.registerSingleton<AuthRoute>('AuthRoute', AuthRoute);
  container.registerSingleton<UserRoute>('UserRoute', UserRoute);
}

/**
 * 컨테이너 내보내기
 */
export { container };
