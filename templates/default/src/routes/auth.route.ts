import { Router } from 'express';
import { injectable, container } from 'tsyringe';
import { AuthController } from '@controllers/auth.controller';
import { createUserSchema } from '@dtos/users.dto';
import type { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

@injectable()
export class AuthRoute implements Routes {
  public router: Router = Router();
  public path = '/auth';
  private readonly authController: AuthController;

  constructor() {
    this.authController = container.resolve(AuthController);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/signup', ValidationMiddleware(createUserSchema), this.authController.signUp);
    this.router.post('/login', ValidationMiddleware(createUserSchema), this.authController.logIn);
    this.router.post('/logout', AuthMiddleware, this.authController.logOut);
  }
}
