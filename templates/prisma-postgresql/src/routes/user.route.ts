import { Router } from 'express';
import { injectable, inject } from 'tsyringe';
import { UserController } from '@controllers/user.controller';
import { CreateUserSchema, UpdateUserSchema, UserParamsSchema } from '@dtos/user.dto';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

@injectable()
export class UserRoute implements Routes {
  public router: Router = Router();
  public path = '/users';

  constructor(@inject('UserController') private userController: UserController) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // GET /api/v1/users - 모든 사용자 조회 (인증 필요)
    this.router.get(`${this.path}`, AuthMiddleware, this.userController.getUsers as any);

    // GET /api/v1/users/:id - 특정 사용자 조회 (인증 필요)
    this.router.get(`${this.path}/:id`, AuthMiddleware, this.userController.getUserById as any);

    // POST /api/v1/users - 사용자 생성 (인증 필요)
    this.router.post(
      `${this.path}`,
      AuthMiddleware,
      ValidationMiddleware(CreateUserSchema),
      this.userController.createUser as any,
    );

    // PUT /api/v1/users/:id - 사용자 수정 (인증 필요)
    this.router.put(
      `${this.path}/:id`,
      AuthMiddleware,
      ValidationMiddleware(UpdateUserSchema),
      this.userController.updateUser as any,
    );

    // DELETE /api/v1/users/:id - 사용자 삭제 (인증 필요)
    this.router.delete(`${this.path}/:id`, AuthMiddleware, this.userController.deleteUser as any);
  }
}
