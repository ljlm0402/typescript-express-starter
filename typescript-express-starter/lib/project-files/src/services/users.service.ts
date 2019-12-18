import { CreateUserDto } from '../dtos/users.dto';
import HttpException from '../exceptions/HttpException';
import { User } from '../interfaces/users.interface';
import userModel from '../models/users.model';

class UserService {

  public findAllUser() {
    return userModel;
  }

  public findUserById(userId: number) {
    const findUser =  userModel.find(user => user.id === userId);
    if (findUser) { return findUser; }
    throw new HttpException(409, "You're not user");
  }

  public async createUser(userData: CreateUserDto) {
    if (Object.keys(userData).length === 0) { throw new HttpException(400, "You're not userData"); }
    const createUserData = { id: (userModel.length + 1), ...userData };
    return createUserData;
  }

  public async updateUser(userId: number, userData: User) {
    const findUser =  userModel.find(user => user.id === userId);
    if (!findUser) { throw new HttpException(409, "You're not user"); }
    if (Object.keys(userData).length === 0) { throw new HttpException(400, "You're not userData"); }

    const updateUserData = userModel.map((user) => {
      if (user.id === findUser.id) { user = { id: findUser.id, ...userData }; }
      return user;
    });

    return updateUserData;
  }

  public async deleteUserData(userId: number) {
    const findUser =  userModel.find(user => user.id === userId);
    if (!findUser) { throw new HttpException(409, "You're not user"); }

    const deleteUserData = userModel.filter(user => user.id !== findUser.id);
    return deleteUserData;
  }
}

export default UserService;
