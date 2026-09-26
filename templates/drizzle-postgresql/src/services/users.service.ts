import { hash } from 'bcryptjs';
import { HttpException } from '@exceptions/http.exception';
import { User } from '@config/schema';
import type { CreateUserDto, UpdateUserDto, UsersQueryDto } from '@dtos/users.dto';
import type { UserResponse } from '@interfaces/user.interface';
import type { IUsersRepository } from '@repositories/users.repository';

export class UsersService {
  constructor(private usersRepository: IUsersRepository) {}

  private toUserResponse(user: User): UserResponse {
    const { password: _password, ...userResponse } = user;
    return userResponse;
  }

  async getAllUsers(): Promise<UserResponse[]> {
    const users = await this.usersRepository.findAll();
    return users.map((user) => this.toUserResponse(user));
  }

  async getAllUsersPaginated(options: UsersQueryDto) {
    const result = await this.usersRepository.findAllPaginated(options);

    return {
      ...result,
      users: result.users.map((user) => this.toUserResponse(user)),
    };
  }

  async getUserById(id: string): Promise<UserResponse> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new HttpException(404, 'User not found');
    return this.toUserResponse(user);
  }

  async createUser(user: CreateUserDto): Promise<UserResponse> {
    const normalizedEmail = user.email.toLowerCase();
    const exists = await this.usersRepository.findByEmail(normalizedEmail);
    if (exists) throw new HttpException(409, 'Email already exists');

    const hashedPassword = await hash(user.password, 10);
    const created = {
      email: normalizedEmail,
      password: hashedPassword,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      isActive: user.isActive ?? true,
    };
    const savedUser = await this.usersRepository.save(created);
    return this.toUserResponse(savedUser);
  }

  async updateUser(id: string, update: UpdateUserDto): Promise<UserResponse> {
    const exists = await this.usersRepository.findById(id);
    if (!exists) throw new HttpException(404, 'User not found');

    if (update.email && update.email !== exists.email) {
      const duplicateUser = await this.usersRepository.findByEmail(update.email);
      if (duplicateUser && duplicateUser.id !== exists.id) {
        throw new HttpException(409, 'Email already exists');
      }
    }

    if (typeof update.password === 'string' && update.password.length > 0) {
      update = { ...update, password: await hash(update.password, 10) };
    }

    const updated = await this.usersRepository.update(id, {
      email: update.email,
      password: update.password,
      firstName: update.firstName,
      lastName: update.lastName,
      isActive: update.isActive,
    });
    if (!updated) throw new HttpException(404, 'User not found');
    return this.toUserResponse(updated);
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = await this.usersRepository.delete(id);
    if (!deleted) throw new HttpException(404, 'User not found');
  }
}
