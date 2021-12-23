import { hash } from 'bcrypt';
import { EntityRepository } from 'typeorm';
import { CreateUserDto } from '@dtos/users.dto';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';

@EntityRepository()
export default class UserRepository {
  public async userFindAll(): Promise<User[]> {
    const users: User[] = await UserEntity.find();

    return users;
  }

  public async userFindById(userId: number): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

    const user: User = await UserEntity.findOne({ where: { id: userId } });
    if (!user) throw new HttpException(409, "You're not user");

    return user;
  }

  public async userCreate(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await UserEntity.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await UserEntity.save({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async userUpdate(userId: number, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "You're not user");

    const hashedPassword = await hash(userData.password, 10);
    await UserEntity.update(userId, { ...userData, password: hashedPassword });

    const updateUser: User = await UserEntity.findOne({ where: { id: userId } });
    return updateUser;
  }

  public async userDelete(userId: number): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

    const findUser: User = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "You're not user");

    await UserEntity.delete({ id: userId });
    return findUser;
  }
}
