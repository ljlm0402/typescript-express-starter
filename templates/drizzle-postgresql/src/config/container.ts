import 'reflect-metadata';
import { container } from 'tsyringe';

// Repository
import { UsersRepository } from '@repositories/user.repository';

// Service
import { AuthService } from '@services/auth.service';
import { UsersService } from '@services/users.service';

// Controller
import { AuthController } from '@controllers/auth.controller';
import { UsersController } from '@controllers/users.controller';

// Route
import { AuthRoute } from '@routes/auth.route';
import { UsersRoute } from '@routes/users.route';

let isContainerInitialized = false;

export function setupContainer() {
  if (isContainerInitialized) return;

  // Repository 등록
  container.registerSingleton(UsersRepository);

  // Service 등록
  container.registerSingleton(AuthService);
  container.registerSingleton(UsersService);

  // Controller 등록
  container.registerSingleton(AuthController);
  container.registerSingleton(UsersController);

  // Route 등록
  container.registerSingleton(AuthRoute);
  container.registerSingleton(UsersRoute);

  isContainerInitialized = true;
}
