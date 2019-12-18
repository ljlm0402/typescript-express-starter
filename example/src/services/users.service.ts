import { CreateUserDto } from '../dtos/users.dto';
import HttpException from '../exceptions/HttpException';
import { User, Users } from '../interfaces/users.interface';
import userModel from '../models/users.model';
import { isEmptyObject } from '../utils/util';

class UserService {
  public usersList = userModel;

  public findAllUser(): Users {
    return this.usersList;
  }

  public findUserById(userId: number): User {
    const findUser =  this.usersList.find(user => user.id === userId);
    if (findUser) return findUser;
    throw new HttpException(409, "You're not user");
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmptyObject(userData)) throw new HttpException(400, "You're not userData");
    const createUserData = { id: (this.usersList.length + 1), ...userData };
    return createUserData;
  }

  public async updateUser(userId: number, userData: User): Promise<Users> {
    if (isEmptyObject(userData)) throw new HttpException(400, "You're not userData");

    const findUser =  this.usersList.find(user => user.id === userId);
    if (!findUser) throw new HttpException(409, "You're not user");

    const updateUserData = this.usersList.map((user: User) => {
      if (user.id === findUser.id) {
        user = { id: findUser.id, ...userData };
      }
      return user;
    });

    return updateUserData;
  }

  public async deleteUserData(userId: number): Promise<Users> {
    const findUser =  this.usersList.find(user => user.id === userId);
    if (!findUser) throw new HttpException(409, "You're not user");

    const deleteUserData = this.usersList.filter(user => user.id !== findUser.id);
    return deleteUserData;
  }
}

export default UserService;
