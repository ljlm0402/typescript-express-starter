import { Router } from 'express';
import { injectable, inject } from 'tsyringe';
import { AuthController } from '@controllers/auth.controller';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { signupSchema, loginSchema } from '@dtos/auth.dto';

/**
 * Auth Route
 */
@injectable()
export class AuthRoute implements Routes {
  public router: Router = Router();
  public path = '/auth';

  constructor(@inject(AuthController) private authController: AuthController) {
    this.initializeRoutes();
  }

  /**
   * 라우트 초기화
   */
  private initializeRoutes(): void {
    // 회원가입
    this.router.post(
      `${this.path}/signup`,
      ValidationMiddleware(signupSchema),
      this.authController.signup,
    );

    // 로그인
    this.router.post(
      `${this.path}/login`,
      ValidationMiddleware(loginSchema),
      this.authController.login,
    );

    // 로그아웃 (인증 필요)
    this.router.post(`${this.path}/logout`, AuthMiddleware, this.authController.logout);
  }
}
