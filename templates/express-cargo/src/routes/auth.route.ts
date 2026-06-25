import { Router } from 'express';
import { bindingCargo } from 'express-cargo';
import { injectable, container } from 'tsyringe';
import { AuthController } from '@controllers/auth.controller';
import { CreateUserDto, LoginUserDto } from '@dtos/users.dto';
import type { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';

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
    this.router.post('/signup', bindingCargo(CreateUserDto), this.authController.signUp);
    this.router.post('/login', bindingCargo(LoginUserDto), this.authController.logIn);
    this.router.post('/logout', AuthMiddleware, this.authController.logOut);
  }
}
