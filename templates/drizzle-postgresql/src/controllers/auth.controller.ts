import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { AuthService } from '@services/auth.service';
import { NODE_ENV } from '@config/env';
import { AuthRequest } from '@middlewares/auth.middleware';

@injectable()
export class AuthController {
  constructor(@inject(AuthService) private readonly authService: AuthService) {}

  /**
   * 회원가입
   * POST /api/v1/auth/signup
   */
  public signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      const result = await this.authService.signup(userData);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 로그인
   * POST /api/v1/auth/login
   */
  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      const { response, token } = await this.authService.login(userData);

      // JWT를 HttpOnly 쿠키로 설정
      res.cookie('Authorization', token, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24시간
        path: '/',
      });

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 로그아웃
   * POST /api/v1/auth/logout
   */
  public logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // 쿠키 제거
      res.clearCookie('Authorization', {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      res.status(200).json({ message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}
