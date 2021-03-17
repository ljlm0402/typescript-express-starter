import bcrypt from 'bcrypt';
import { CreateUserDto } from '../dtos/users.dto';
import HttpException from '../exceptions/HttpException';
import { isEmpty } from '../utils/util';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

class UserService {
  public users = prisma.user;

  public async findAllUser(): Promise<User[]> {
    const users: Promise<User[]> = this.users.findMany();
    return users;
  }

  public async findUserById(userId: number): Promise<User> {
    const findUser: Promise<User> = this.users.findUnique({
      where: { id: Number(userId) },
    });

    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public async findUserByEmail(email: string): Promise<User> {
    const findUser: Promise<User> = this.users.findUnique({
      where: { email: email },
    });

    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findUnique({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: Promise<User> = this.users.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    return createUserData;
  }

  public async updateUser(userId: number, userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findUnique({
      where: { id: Number(userId) },
    });
    if (!findUser) throw new HttpException(409, "You're not user");

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const updateUserData = this.users.update({
      where: { id: Number(userId) },
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    return updateUserData;
  }

  public async deleteUser(userId: number): Promise<User> {
    const deleteUserData = this.users.delete({
      where: { id: Number(userId) },
    });
    return deleteUserData;
  }
}

export default UserService;
