import { Router } from 'express';
import { bindingCargo } from 'express-cargo';
import { injectable, container } from 'tsyringe';
import { UsersController } from '@controllers/users.controller';
import { CreateUserDto, UpdateUserDto, ListUsersQueryDto, UserParamsDto } from '@dtos/users.dto';
import type { Routes } from '@interfaces/routes.interface';

@injectable()
export class UsersRoute implements Routes {
  public router: Router = Router();
  public path = '/users';
  private readonly userController: UsersController;

  constructor() {
    this.userController = container.resolve(UsersController);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', bindingCargo(ListUsersQueryDto), this.userController.getUsers);
    this.router.get('/:id', bindingCargo(UserParamsDto), this.userController.getUserById);
    this.router.post('/', bindingCargo(CreateUserDto), this.userController.createUser);
    this.router.put('/:id', bindingCargo(UpdateUserDto), this.userController.updateUser);
    this.router.delete('/:id', bindingCargo(UserParamsDto), this.userController.deleteUser);
  }
}
