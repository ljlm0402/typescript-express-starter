import { Router } from 'express';
import { injectable, container } from 'tsyringe';
import { UsersController } from '@controllers/users.controller';
import { createUserSchema, updateUserSchema } from '@dtos/users.dto';
import type { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

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
    this.router.get('/', this.userController.getUsers);
    this.router.get('/:id', this.userController.getUserById);
    this.router.post('/', ValidationMiddleware(createUserSchema), this.userController.createUser);
    this.router.put('/:id', ValidationMiddleware(updateUserSchema), this.userController.updateUser);
    this.router.delete('/:id', this.userController.deleteUser);
  }
}
