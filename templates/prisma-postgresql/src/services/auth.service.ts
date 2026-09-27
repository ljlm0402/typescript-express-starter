import { sign, verify, SignOptions } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';
import { JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } from '@config/env';
import { HttpException } from '@exceptions/http.exception';
import { IUser, IUserCreate, IUserResponse, sanitizeUser } from '@entities/user.entity';
import { IUserRepository } from '@repositories/user.repository';
import { hashPassword, comparePassword } from '@utils/hash';
import { logger } from '@utils/logger';

/**
 * JWT 페이로드 인터페이스
 */
export interface DataStoredInToken {
  id: string;
}

/**
 * 토큰 데이터 인터페이스
 */
export interface TokenData {
  token: string;
  expiresIn: string;
}

/**
 * 인증 서비스 인터페이스
 */
export interface IAuthService {
  signup(userData: IUserCreate): Promise<IUserResponse>;
  login(loginData: {
    email: string;
    password: string;
  }): Promise<{ cookie: string; user: IUserResponse }>;
  logout(): Promise<void>;
}

/**
 * 인증 서비스 구현
 */
@injectable()
export class AuthService implements IAuthService {
  constructor(@inject('UserRepository') private userRepository: IUserRepository) {}

  /**
   * JWT 토큰 생성
   */
  private createToken(user: IUser): TokenData {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const token = (sign as any)(dataStoredInToken, JWT_SECRET as string, { expiresIn: JWT_EXPIRES_IN || '24h' });

    return {
      token,
      expiresIn: JWT_EXPIRES_IN,
    };
  }

  /**
   * HTTP 쿠키 생성
   */
  private createCookie(tokenData: TokenData): string {
    const maxAge = this.parseExpiresIn(tokenData.expiresIn);
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${maxAge}; Path=/; SameSite=Lax;${
      NODE_ENV === 'production' ? ' Secure;' : ''
    }`;
  }

  /**
   * expiresIn 문자열을 초 단위로 변환
   */
  private parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return 3600; // 기본값 1시간

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 60 * 60 * 24;
      default:
        return 3600;
    }
  }

  /**
   * 회원가입
   */
  public async signup(userData: IUserCreate): Promise<IUserResponse> {
    try {
      logger.debug('AuthService: Starting signup process', { email: userData.email });

      // 이메일 중복 확인
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        logger.warn('AuthService: Email already exists', { email: userData.email });
        throw new HttpException(409, 'Email already exists');
      }

      // 비밀번호 해싱
      const hashedPassword = await hashPassword(userData.password);
      const newUserData = {
        ...userData,
        password: hashedPassword,
      };

      // 사용자 생성
      const user = await this.userRepository.create(newUserData);
      const sanitizedUser = sanitizeUser(user);

      logger.info('AuthService: User signup successful', { id: user.id, email: user.email });
      return sanitizedUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      logger.error('AuthService: Signup failed', { email: userData.email, error });
      throw new HttpException(500, 'Signup failed');
    }
  }

  /**
   * 로그인
   */
  public async login(loginData: { email: string; password: string }): Promise<{
    cookie: string;
    user: IUserResponse;
  }> {
    try {
      logger.debug('AuthService: Starting login process', { email: loginData.email });

      // 사용자 조회
      const user = await this.userRepository.findByEmail(loginData.email);
      if (!user) {
        logger.warn('AuthService: User not found for login', { email: loginData.email });
        throw new HttpException(401, 'Invalid email or password');
      }

      // 비밀번호 확인
      const isPasswordValid = await comparePassword(loginData.password, user.password);
      if (!isPasswordValid) {
        logger.warn('AuthService: Invalid password', { email: loginData.email });
        throw new HttpException(401, 'Invalid email or password');
      }

      // 토큰 생성
      const tokenData = this.createToken(user);
      const cookie = this.createCookie(tokenData);
      const sanitizedUser = sanitizeUser(user);

      logger.info('AuthService: User login successful', { id: user.id, email: user.email });
      return { cookie, user: sanitizedUser };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      logger.error('AuthService: Login failed', { email: loginData.email, error });
      throw new HttpException(500, 'Login failed');
    }
  }

  /**
   * 로그아웃
   */
  public async logout(): Promise<void> {
    logger.debug('AuthService: User logout');
    // 실제 애플리케이션에서는 토큰 블랙리스트 등의 처리를 할 수 있음
    // 현재는 클라이언트에서 쿠키 삭제로 처리
  }
}
