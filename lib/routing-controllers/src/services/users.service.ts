import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/httpException';
import { User } from '@interfaces/users.interface';
import { UserModel } from '@models/users.model';

@Service()
export class UserService {
  public async findAllUser(): Promise<User[]> {
    const users: User[] = UserModel;
    return users;
  }

  public async findUserById(userId: number): Promise<User> {
    const findUser: User = UserModel.find(user => user.id === userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    const findUser: User = UserModel.find(user => user.email === userData.email);
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = { id: UserModel.length + 1, ...userData, password: hashedPassword };

    return createUserData;
  }

  public async updateUser(userId: number, userData: CreateUserDto): Promise<User[]> {
    const findUser: User = UserModel.find(user => user.id === userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const hashedPassword = await hash(userData.password, 10);
    const updateUserData: User[] = UserModel.map((user: User) => {
      if (user.id === findUser.id) user = { id: userId, ...userData, password: hashedPassword };
      return user;
    });

    return updateUserData;
  }

  public async deleteUser(userId: number): Promise<User[]> {
    const findUser: User = UserModel.find(user => user.id === userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const deleteUserData: User[] = UserModel.filter(user => user.id !== findUser.id);
    return deleteUserData;
  }
}
