import { Router } from 'express';
import { injectable, inject } from 'tsyringe';
import { AuthController } from '@controllers/auth.controller';
import { SignupSchema, LoginSchema } from '@dtos/auth.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

@injectable()
export class AuthRoute implements Routes {
  public router: Router = Router();
  public path = '/auth';

  constructor(@inject('AuthController') private authController: AuthController) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // POST /api/v1/auth/signup - 회원가입
    this.router.post(
      `${this.path}/signup`,
      ValidationMiddleware(SignupSchema),
      this.authController.signup,
    );

    // POST /api/v1/auth/login - 로그인
    this.router.post(
      `${this.path}/login`,
      ValidationMiddleware(LoginSchema),
      this.authController.login,
    );

    // POST /api/v1/auth/logout - 로그아웃
    this.router.post(`${this.path}/logout`, this.authController.logout);
  }
}
