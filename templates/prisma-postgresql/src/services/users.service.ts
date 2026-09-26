import { hash } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';
import { HttpException } from '@exceptions/httpException';
import { User } from '@interfaces/users.interface';
import { UsersRepository } from '@repositories/users.repository';
import type { IUsersRepository } from '@repositories/users.repository';

@injectable()
export class UsersService {
  constructor(@inject(UsersRepository) private usersRepository: IUsersRepository) { }

  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new HttpException(404, 'User not found');
    return user;
  }

  async createUser(user: User): Promise<User> {
    const exists = await this.usersRepository.findByEmail(user.email);
    if (exists) throw new HttpException(409, 'Email already exists');

    const hashedPassword = await hash(user.password, 10);
    const created: User = { id: String(Date.now()), email: user.email, password: hashedPassword };
    await this.usersRepository.save(created);
    return created;
  }

  async updateUser(id: string, update: User): Promise<User> {
    const exists = await this.usersRepository.findById(id);
    if (!exists) throw new HttpException(404, 'User not found');


    if (typeof update.password === 'string' && update.password.length > 0) {
      update = { ...update, password: await hash(update.password, 10) };
    }

    const updated = await this.usersRepository.update(id, update);
    if (!updated) throw new HttpException(404, 'User not found');
    return updated;
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = await this.usersRepository.delete(id);
    if (!deleted) throw new HttpException(404, 'User not found');
  }
}
