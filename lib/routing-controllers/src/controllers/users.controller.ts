import { Controller, Param, Body, Get, Post, Put, Delete, HttpCode, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Container } from 'typedi';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { UserService } from '@services/users.service';

@Controller()
export class UserController {
  public path = '/users'
  public user = Container.get(UserService);

  @Get('/users')
  @OpenAPI({ summary: 'Return a list of users' })
  async getUsers() {
    const findAllUsersData: User[] = await this.user.findAllUser();
    return { data: findAllUsersData, message: 'findAll' };
  }

  @Get('/users/:id')
  @OpenAPI({ summary: 'Return find a user' })
  async getUserById(@Param('id') userId: number) {
    const findOneUserData: User = await this.user.findUserById(userId);
    return { data: findOneUserData, message: 'findOne' };
  }

  @Post('/users')
  @HttpCode(201)
  @UseBefore(ValidationMiddleware(CreateUserDto))
  @OpenAPI({ summary: 'Create a new user' })
  async createUser(@Body() userData: User) {
    const createUserData: User = await this.user.createUser(userData);
    return { data: createUserData, message: 'created' };
  }

  @Put('/users/:id')
  @UseBefore(ValidationMiddleware(CreateUserDto, true))
  @OpenAPI({ summary: 'Update a user' })
  async updateUser(@Param('id') userId: number, @Body() userData: User) {
    const updateUserData: User[] = await this.user.updateUser(userId, userData);
    return { data: updateUserData, message: 'updated' };
  }

  @Delete('/users/:id')
  @OpenAPI({ summary: 'Delete a user' })
  async deleteUser(@Param('id') userId: number) {
    const deleteUserData: User[] = await this.user.deleteUser(userId);
    return { data: deleteUserData, message: 'deleted' };
  }
}
