import { hash } from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DI } from '@/databases';
import { isEmpty } from '@utils/util';
import { User } from '@/entities';
import { wrap } from '@mikro-orm/core';

class UserService {
  public async findAllUser(): Promise<User[]> {
    const users: User[] = await DI.userRepository.findAll();
    return users;
  }

  public async findUserById(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

    const findUser: User = await DI.userRepository.findOne(userId);
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await DI.userRepository.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = DI.userRepository.create({ ...userData, password: hashedPassword });

    await DI.em.persistAndFlush(createUserData);

    return createUserData;
  }

  public async updateUser(userId: string, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    if (userData.email) {
      const findUser: User = await DI.userRepository.findOne({ email: userData.email });
      if (findUser && findUser.id != userId) throw new HttpException(409, `You're email ${userData.email} already exists`);
    }

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10);
      userData = { ...userData, password: hashedPassword };
    }

    const updateUserById: User = await DI.userRepository.findOne(userId);
    wrap(updateUserById).assign(userData);
    if (!updateUserById) throw new HttpException(409, "You're not user");

    return updateUserById;
  }

  public async deleteUser(userId: string): Promise<User> {
    const findUser = await DI.userRepository.findOne(userId);

    if (!findUser) throw new HttpException(409, "You're not user");
    await DI.userRepository.removeAndFlush(findUser);

    return findUser;
  }
}

export default UserService;
