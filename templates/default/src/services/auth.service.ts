import { sign } from 'jsonwebtoken';
import { container } from 'tsyringe';
import { NODE_ENV, SECRET_KEY } from '@config/env';
import { HttpException } from '@exceptions/http.exception';
import type { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User, type UserCreateData } from '@entities/user.entity';
import { UsersRepository } from '@repositories/users.repository';
import type { IUsersRepository } from '@repositories/users.repository';
import { logger } from '@utils/logger';

export class AuthService {
  private readonly usersRepository: IUsersRepository;

  constructor(usersRepository?: IUsersRepository) {
    if (usersRepository) {
      this.usersRepository = usersRepository;
    } else {
      this.usersRepository = container.resolve(UsersRepository);
    }
  }

  private createToken(user: User): TokenData {
    if (!SECRET_KEY) throw new Error('SECRET_KEY is not defined');

    if (user.id === undefined) {
      throw new Error('User id is undefined');
    }

    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const expiresIn = 60 * 60; // 1h
    const token = sign(dataStoredInToken, SECRET_KEY as string, { expiresIn });
    return { expiresIn, token };
  }

  private createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${
      tokenData.expiresIn
    }; Path=/; SameSite=Lax;${NODE_ENV === 'production' ? ' Secure;' : ''}`;
  }

  public async signup(userData: UserCreateData): Promise<User> {
    const findUser = await this.usersRepository.findByEmail(userData.email);
    if (findUser) throw new HttpException(409, `Email is already in use`);

    // Entity 클래스의 팩토리 메서드로 생성 (모든 검증이 자동 처리됨)
    const newUser = await User.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  public async login(loginData: {
    email: string;
    password: string;
  }): Promise<{ cookie: string; user: User }> {
    const findUser = await this.usersRepository.findByEmail(loginData.email);
    if (!findUser) throw new HttpException(401, `Invalid email or password.`);

    // Entity의 도메인 메서드로 패스워드 검증
    const isPasswordMatching = await findUser.verifyPassword(loginData.password);
    if (!isPasswordMatching) throw new HttpException(401, 'Password is incorrect');

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, user: findUser };
  }

  public async logout(user: User): Promise<void> {
    // 로그아웃은 실제 서비스에서는 서버에서 세션/리프레시토큰을 블랙리스트 처리 등 구현 가능
    // 여기서는 클라이언트의 쿠키를 삭제하면 충분
    logger.info(`User with email ${user.email} logged out.`);

    return;
  }
}
