import { CreateUserDto } from '../dtos/users.dto';
import HttpException from '../exceptions/HttpException';
import { User, Users } from '../interfaces/users.interface';
import userModel from '../models/users.model';
import { isEmptyObject } from '../util/util';

class UserService {

    public findAllUser() {
        return userModel;
    }

    public findUserById(userId: number): User {
        const findUser = userModel.find(user => user.id === userId);
        if (!findUser) throw new HttpException(409, "You're not user");
        return findUser;
    }

    public async createUser(userData: CreateUserDto): Promise<User> {
        if (isEmptyObject(userData)) throw new HttpException(400, "You're not userData");
        const createUserData = {id: (userModel.length + 1), ...userData};
        return createUserData;
    }

    public async updateUser(userId: number, userData: User): Promise<User> {
        if (isEmptyObject(userData)) throw new HttpException(400, "You're not userData");
        const findUser = userModel.find((user: User) => user.id === userId);
        if (!findUser) throw new HttpException(409, "You're not user");
        const updateUserData = userModel.find((user: User) => {
            if (user.id === findUser.id) {
                user = {id: findUser.id, ...userData};
            }
            return user;
        });
        if (!updateUserData) throw new HttpException(409, "You're not user");
        return updateUserData;
    }

    public async deleteUserData(userId: number): Promise<Users> {
        const findUser = userModel.find(user => user.id === userId);
        if (!findUser) throw new HttpException(409, "You're not user");
        const deleteUserData = userModel.filter(user => user.id !== findUser.id);
        return deleteUserData;
    }
}

export default UserService;
