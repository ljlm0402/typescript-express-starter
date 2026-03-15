import { Router } from 'express';
import { injectable, inject } from 'tsyringe';
import { AuthController } from '@controllers/auth.controller';
import { SignupDto, LoginDto } from '@dtos/auth.dto';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

@injectable()
export class AuthRoute implements Routes {
  public router: Router = Router();
  public path = '/auth';

  constructor(@inject(AuthController) private authController: AuthController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/signup', ValidationMiddleware(SignupDto), this.authController.signup);
    this.router.post('/login', ValidationMiddleware(LoginDto), this.authController.login);
    this.router.post('/logout', AuthMiddleware, this.authController.logout);
  }
}
