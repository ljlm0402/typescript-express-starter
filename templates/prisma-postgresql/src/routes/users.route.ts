import { Router } from 'express';
import { injectable, inject } from 'tsyringe';
import { UsersController } from '@controllers/users.controller';
import { createUserSchema, updateUserSchema } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

@injectable()
export class UsersRoute implements Routes {
  public router: Router = Router();
  public path = '/users';

  constructor(@inject(UsersController) private userController: UsersController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.userController.getUsers);
    this.router.get(`${this.path}/:id`, this.userController.getUserById);
    this.router.post(this.path, ValidationMiddleware(createUserSchema), this.userController.createUser);
    this.router.put(`${this.path}/:id`, ValidationMiddleware(updateUserSchema), this.userController.updateUser);
    this.router.delete(`${this.path}/:id`, this.userController.deleteUser);
  }
}
