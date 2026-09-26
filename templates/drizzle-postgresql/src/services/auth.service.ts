import { sign } from 'jsonwebtoken';
import { UsersRepository } from '@repositories/users.repository';
import { Hash } from '@utils/hash';
import { JWT_SECRET, NODE_ENV } from '@config/env';
import type { User } from '@config/schema';
import { HttpException } from '@exceptions/http.exception';
import type { SignupRequest, LoginRequest } from '@dtos/auth.dto';
import type { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { UserResponse } from '@interfaces/user.interface';
import { logger } from '@utils/logger';

export class AuthService {
  constructor(private usersRepository: UsersRepository) {}

  private toUserResponse(user: User): UserResponse {
    const { password: _password, ...userResponse } = user;
    return userResponse;
  }

  private createToken(user: User): TokenData {
    if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined');

    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const expiresIn = 60 * 60;
    const token = sign(dataStoredInToken, JWT_SECRET, { expiresIn });
    return { expiresIn, token };
  }

  private createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${
      tokenData.expiresIn
    }; Path=/; SameSite=Lax;${NODE_ENV === 'production' ? ' Secure;' : ''}`;
  }

  async signup(userData: SignupRequest): Promise<UserResponse> {
    const existingUser = await this.usersRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new HttpException(409, 'Email already exists');
    }

    const hashedPassword = await Hash.hashPassword(userData.password);
    const newUser = await this.usersRepository.save({
      ...userData,
      password: hashedPassword,
    });

    return this.toUserResponse(newUser);
  }

  async login(userData: LoginRequest): Promise<{ cookie: string; user: UserResponse }> {
    const user = await this.usersRepository.findByEmail(userData.email);
    if (!user || !user.isActive) {
      throw new HttpException(401, 'Invalid credentials');
    }

    const isPasswordValid = await Hash.comparePassword(userData.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(401, 'Invalid credentials');
    }

    const tokenData = this.createToken(user);
    const cookie = this.createCookie(tokenData);

    return { cookie, user: this.toUserResponse(user) };
  }

  async logout(user: UserResponse): Promise<void> {
    logger.info(`User with email ${user.email} logged out.`);
  }
}
