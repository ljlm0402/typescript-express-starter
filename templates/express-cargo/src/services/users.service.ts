import { container } from 'tsyringe';
import { HttpException } from '@exceptions/http.exception';
import { User, type UserCreateData } from '@entities/user.entity';
import {
  UsersRepository,
  type SimpleQuery,
  type SimplePaginatedResult,
} from '@repositories/users.repository';
import type { IUsersRepository } from '@repositories/users.repository';

export class UsersService {
  private readonly usersRepository: IUsersRepository;

  constructor(usersRepository?: IUsersRepository) {
    if (usersRepository) {
      this.usersRepository = usersRepository;
    } else {
      this.usersRepository = container.resolve(UsersRepository);
    }
  }

  async getAllUsersPaginated(options: SimpleQuery): Promise<SimplePaginatedResult> {
    return this.usersRepository.findAllPaginated(options);
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new HttpException(404, 'User not found');
    return user;
  }

  async createUser(userData: UserCreateData): Promise<User> {
    // Entity에서 이메일 중복 검사를 위해 먼저 확인
    const exists = await this.usersRepository.findByEmail(userData.email);
    if (exists) throw new HttpException(409, 'Email already exists');

    // Entity 클래스의 팩토리 메서드로 생성 (모든 검증이 자동 처리됨)
    const user = await User.create(userData);
    await this.usersRepository.save(user);
    return user;
  }

  async updateUser(id: string, updateData: { email?: string; password?: string }): Promise<User> {
    const existingUser = await this.usersRepository.findById(id);
    if (!existingUser) throw new HttpException(404, 'User not found');

    // Entity의 도메인 메서드를 사용하여 업데이트
    await existingUser.updateProfile(updateData);

    const updated = await this.usersRepository.update(id, existingUser);
    if (!updated) throw new HttpException(404, 'User not found');
    return updated;
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = await this.usersRepository.delete(id);
    if (!deleted) throw new HttpException(404, 'User not found');
  }
}
