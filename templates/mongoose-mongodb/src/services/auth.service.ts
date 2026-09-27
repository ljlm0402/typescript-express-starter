import { sign, verify } from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';
import { JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } from '@config/env';
import { HttpException } from '@exceptions/http.exception';
import { IUser, IUserResponse } from '@entities/user.entity';
import { UserRepository, IUserRepository } from '@repositories/user.repository';
import { hashPassword, comparePassword } from '@utils/hash';
import { logger } from '@utils/logger';

/**
 * 토큰 데이터 인터페이스
 */
interface TokenData {
  token: string;
  expiresIn: number;
}

/**
 * JWT 페이로드 인터페이스
 */
interface DataStoredInToken {
  id: string;
}

/**
 * 로그인 응답 인터페이스
 */
interface LoginResponse {
  cookie: string;
  user: IUserResponse;
  token: string;
}

/**
 * Auth Service
 */
@injectable()
export class AuthService {
  constructor(@inject('UserRepository') private userRepository: IUserRepository) {}

  /**
   * JWT 토큰 생성
   */
  private createToken(user: IUser): TokenData {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const dataStoredInToken: DataStoredInToken = {
      id: user._id.toString(),
    };

    const expiresIn = this.parseExpiresIn(JWT_EXPIRES_IN);
    const token = sign(dataStoredInToken, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as SignOptions['expiresIn'],
    });

    return { token, expiresIn };
  }

  /**
   * 만료 시간 파싱 (문자열을 초 단위로 변환)
   */
  private parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([dhms])$/);
    if (!match) return 3600; // 기본값 1시간

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 'd':
        return value * 24 * 60 * 60; // 일
      case 'h':
        return value * 60 * 60; // 시간
      case 'm':
        return value * 60; // 분
      case 's':
        return value; // 초
      default:
        return 3600;
    }
  }

  /**
   * HTTP 쿠키 생성
   */
  private createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; Path=/; SameSite=Lax;${
      NODE_ENV === 'production' ? ' Secure;' : ''
    }`;
  }

  /**
   * 사용자 정보에서 비밀번호 제거
   */
  private sanitizeUser(user: IUser): IUserResponse {
    return user.toJSON<IUserResponse>();
  }

  /**
   * 회원가입
   */
  async signup(userData: { email: string; password: string }): Promise<IUserResponse> {
    try {
      logger.info('Starting user signup', { email: userData.email });

      // 이메일 중복 확인
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new HttpException(409, 'Email is already in use');
      }

      // 비밀번호 해싱
      const hashedPassword = await hashPassword(userData.password);

      // 사용자 생성
      const newUser = await this.userRepository.create({
        email: userData.email,
        password: hashedPassword,
      });

      logger.info('User signup successful', {
        userId: newUser._id,
        email: newUser.email,
      });

      return this.sanitizeUser(newUser);
    } catch (error) {
      logger.error('User signup failed', { error, email: userData.email });
      throw error;
    }
  }

  /**
   * 로그인
   */
  async login(loginData: { email: string; password: string }): Promise<LoginResponse> {
    try {
      logger.info('Starting user login', { email: loginData.email });

      // 비밀번호 포함하여 사용자 조회
      const user = await this.userRepository.findByEmailWithPassword(loginData.email);
      if (!user) {
        throw new HttpException(401, 'Invalid email or password');
      }

      // 비밀번호 검증
      const isPasswordValid = await comparePassword(loginData.password, user.password);
      if (!isPasswordValid) {
        throw new HttpException(401, 'Invalid email or password');
      }

      // JWT 토큰 및 쿠키 생성
      const tokenData = this.createToken(user);
      const cookie = this.createCookie(tokenData);
      const sanitizedUser = this.sanitizeUser(user);

      logger.info('User login successful', {
        userId: user._id,
        email: user.email,
      });

      return {
        cookie,
        user: sanitizedUser,
        token: tokenData.token,
      };
    } catch (error) {
      logger.error('User login failed', { error, email: loginData.email });
      throw error;
    }
  }

  /**
   * 로그아웃
   */
  async logout(userId: string): Promise<void> {
    try {
      logger.info('User logout', { userId });

      // 실제 서비스에서는 리프레시 토큰을 블랙리스트에 추가하거나
      // 세션을 무효화하는 로직을 여기에 구현할 수 있습니다.
      // 현재는 클라이언트에서 쿠키를 삭제하는 것으로 충분합니다.

      return;
    } catch (error) {
      logger.error('User logout failed', { error, userId });
      throw error;
    }
  }

  /**
   * JWT 토큰에서 사용자 ID 추출
   */
  async getUserFromToken(token: string): Promise<IUser | null> {
    try {
      if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }

      const decoded = verify(token, JWT_SECRET) as DataStoredInToken;
      const user = await this.userRepository.findById(decoded.id);

      return user;
    } catch (error) {
      logger.error('Failed to get user from token', { error });
      return null;
    }
  }
}
