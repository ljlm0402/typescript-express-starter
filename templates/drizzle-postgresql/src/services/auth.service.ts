import jwt from 'jsonwebtoken';
import { UsersRepository } from '@repositories/users.repository';
import { Hash } from '@utils/hash';
import { JWT_SECRET } from '@config/env';
import { HttpException } from '@exceptions/http.exception';
import { SignupRequest, LoginRequest, AuthResponse } from '@dtos/auth.dto';
import { UserResponse } from '@interfaces/user.interface';
import { logger } from '@utils/logger';

export class AuthService {
  constructor(private usersRepository: UsersRepository) {}

  /**
   * 회원가입
   */
  async signup(userData: SignupRequest): Promise<AuthResponse> {
    // 이메일 중복 체크
    const existingUser = await this.usersRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new HttpException(400, 'Email already exists');
    }

    // 비밀번호 해싱
    const hashedPassword = await Hash.hashPassword(userData.password);

    // 사용자 생성
    const newUser = await this.usersRepository.save({
      ...userData,
      password: hashedPassword,
    });

    // 비밀번호 필드 제거
    const userResponse: UserResponse = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      isActive: newUser.isActive,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    return {
      data: userResponse,
      message: 'signup',
    };
  }

  /**
   * 로그인
   */
  async login(userData: LoginRequest): Promise<{ response: AuthResponse; token: string }> {
    // 사용자 조회
    const user = await this.usersRepository.findByEmail(userData.email);
    if (!user || !user.isActive) {
      throw new HttpException(401, 'Invalid credentials');
    }

    // 비밀번호 검증
    const isPasswordValid = await Hash.comparePassword(userData.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(401, 'Invalid credentials');
    }

    // JWT 토큰 생성
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET as string);

    // 비밀번호 필드 제거
    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      response: {
        data: userResponse,
        message: 'login',
      },
      token,
    };
  }

  /**
   * JWT 토큰 검증
   */
  verifyToken(token: string): jwt.JwtPayload | string {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      logger.error({ error }, 'JWT verification failed:');
      throw new HttpException(401, 'Invalid token');
    }
  }
}
