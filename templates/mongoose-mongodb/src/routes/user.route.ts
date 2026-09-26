import { Router } from 'express';
import { injectable, inject } from 'tsyringe';
import { UserController } from '@controllers/user.controller';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { createUserSchema, updateUserSchema } from '@dtos/user.dto';

/**
 * User Route
 */
@injectable()
export class UserRoute implements Routes {
  public router: Router = Router();
  public path = '/users';

  constructor(@inject(UserController) private userController: UserController) {
    this.initializeRoutes();
  }

  /**
   * 라우트 초기화
   */
  private initializeRoutes(): void {
    // 모든 사용자 조회
    this.router.get(`${this.path}`, this.userController.getUsers);

    // 특정 사용자 조회
    this.router.get(`${this.path}/:id`, this.userController.getUserById);

    // 사용자 생성
    this.router.post(
      `${this.path}`,
      ValidationMiddleware(createUserSchema),
      this.userController.createUser,
    );

    // 사용자 정보 수정
    this.router.put(
      `${this.path}/:id`,
      ValidationMiddleware(updateUserSchema),
      this.userController.updateUser,
    );

    // 사용자 삭제
    this.router.delete(`${this.path}/:id`, this.userController.deleteUser);
  }
}
