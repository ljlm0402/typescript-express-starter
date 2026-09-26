import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { IAuthService } from '@services/auth.service';
import {
  SignupRequest,
  LoginRequest,
  SignupResponse,
  LoginResponse,
  LogoutResponse,
} from '@dtos/auth.dto';
import { logger } from '@utils/logger';

/**
 * 인증 컨트롤러
 */
@injectable()
export class AuthController {
  constructor(@inject('AuthService') private authService: IAuthService) {}

  /**
   * 회원가입
   * POST /api/v1/auth/signup
   */
  public signup = async (
    req: Request<{}, SignupResponse, SignupRequest>,
    res: Response<SignupResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      logger.debug('AuthController: Signup request', { email: req.body.email });

      const user = await this.authService.signup(req.body);

      const response: SignupResponse = {
        data: user,
        message: 'signup',
      };

      logger.info('AuthController: Signup successful', { userId: user.id });
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 로그인
   * POST /api/v1/auth/login
   */
  public login = async (
    req: Request<{}, LoginResponse, LoginRequest>,
    res: Response<LoginResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      logger.debug('AuthController: Login request', { email: req.body.email });

      const { cookie, user } = await this.authService.login(req.body);

      // HTTP-only 쿠키 설정
      res.setHeader('Set-Cookie', cookie);

      const response: LoginResponse = {
        data: user,
        message: 'login',
      };

      logger.info('AuthController: Login successful', { userId: user.id });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 로그아웃
   * POST /api/v1/auth/logout
   */
  public logout = async (
    req: Request,
    res: Response<LogoutResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      logger.debug('AuthController: Logout request');

      await this.authService.logout();

      // 쿠키 삭제
      res.setHeader('Set-Cookie', 'Authorization=; HttpOnly; Path=/; Max-Age=0');

      const response: LogoutResponse = {
        message: 'logout',
      };

      logger.info('AuthController: Logout successful');
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
