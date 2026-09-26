import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { AuthService } from '@services/auth.service';
import { logger } from '@utils/logger';

/**
 * Auth Controller
 */
@injectable()
export class AuthController {
  constructor(@inject(AuthService) private authService: AuthService) {}

  /**
   * 회원가입
   * POST /api/v1/auth/signup
   */
  signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      logger.info('Signup request received', { email });

      const newUser = await this.authService.signup({ email, password });

      res.status(201).json({
        data: newUser,
        message: 'signup',
      });

      logger.info('Signup successful', { userId: newUser.id, email });
    } catch (error) {
      logger.error('Signup failed', { error, body: req.body });
      next(error);
    }
  };

  /**
   * 로그인
   * POST /api/v1/auth/login
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      logger.info('Login request received', { email });

      const { cookie, user, token } = await this.authService.login({ email, password });

      // HTTP-Only 쿠키 설정
      res.setHeader('Set-Cookie', [cookie]);

      res.status(200).json({
        data: user,
        message: 'login',
      });

      logger.info('Login successful', { userId: user.id, email });
    } catch (error) {
      logger.error('Login failed', { error, body: req.body });
      next(error);
    }
  };

  /**
   * 로그아웃
   * POST /api/v1/auth/logout
   */
  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id;

      logger.info('Logout request received', { userId });

      await this.authService.logout(userId);

      // 쿠키 삭제
      res.setHeader('Set-Cookie', ['Authorization=; HttpOnly; Max-Age=0; Path=/; SameSite=Lax;']);

      res.status(200).json({
        message: 'logout',
      });

      logger.info('Logout successful', { userId });
    } catch (error) {
      logger.error('Logout failed', { error });
      next(error);
    }
  };
}
