import { wrap } from '@mikro-orm/core';
import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { DI } from '@database';
import { HttpException } from '@exceptions/httpException';
import { User } from '@interfaces/users.interface';

@Service()
export class UserService {
  public async findAllUser(): Promise<User[]> {
    const users: User[] = await DI.userRepository.findAll();
    return users;
  }

  public async findUserById(userId: string): Promise<User> {
    const findUser: User = await DI.userRepository.findOne(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: User): Promise<User> {
    const findUser: User = await DI.userRepository.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = DI.userRepository.create({ ...userData, password: hashedPassword });

    await DI.em.persistAndFlush(createUserData);

    return createUserData;
  }

  public async updateUser(userId: string, userData: User): Promise<User> {
    if (userData.email) {
      const findUser: User = await DI.userRepository.findOne({ email: userData.email });
      if (findUser && findUser.id !== userId) throw new HttpException(409, `This email ${userData.email} already exists`);
    }

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10);
      userData = { ...userData, password: hashedPassword };
    }

    const updateUserById: User = await DI.userRepository.findOne(userId);
    wrap(updateUserById).assign(userData);
    if (!updateUserById) throw new HttpException(409, "User doesn't exist");

    return updateUserById;
  }

  public async deleteUser(userId: string): Promise<User> {
    const findUser = await DI.userRepository.findOne(userId);

    if (!findUser) throw new HttpException(409, "User doesn't exist");
    await DI.userRepository.removeAndFlush(findUser);

    return findUser;
  }
}
