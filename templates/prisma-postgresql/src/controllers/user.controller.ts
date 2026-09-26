import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { IUserService } from '@services/user.service';
import {
  CreateUserRequest,
  UpdateUserRequest,
  UserParams,
  UsersResponse,
  SingleUserResponse,
} from '@dtos/user.dto';
import { RequestWithUser } from '@middlewares/auth.middleware';
import { logger } from '@utils/logger';

/**
 * 사용자 컨트롤러
 */
@injectable()
export class UserController {
  constructor(@inject('UserService') private userService: IUserService) {}

  /**
   * 모든 사용자 조회
   * GET /api/v1/users
   */
  public getUsers = async (
    req: RequestWithUser,
    res: Response<UsersResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      logger.debug('UserController: Get all users request');

      const users = await this.userService.findAllUsers();

      const response: UsersResponse = {
        data: users,
        count: users.length,
      };

      logger.debug('UserController: Get all users successful', { count: users.length });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 특정 사용자 조회
   * GET /api/v1/users/:id
   */
  public getUserById = async (
    req: Request<UserParams>,
    res: Response<SingleUserResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      logger.debug('UserController: Get user by id request', { id });

      const user = await this.userService.findUserById(id);

      const response: SingleUserResponse = {
        data: user,
      };

      logger.debug('UserController: Get user by id successful', { id });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 사용자 생성
   * POST /api/v1/users
   */
  public createUser = async (
    req: Request<{}, SingleUserResponse, CreateUserRequest>,
    res: Response<SingleUserResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      logger.debug('UserController: Create user request', { email: req.body.email });

      const user = await this.userService.createUser(req.body);

      const response: SingleUserResponse = {
        data: user,
      };

      logger.info('UserController: Create user successful', { id: user.id });
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 사용자 정보 수정
   * PUT /api/v1/users/:id
   */
  public updateUser = async (
    req: Request<UserParams, SingleUserResponse, UpdateUserRequest>,
    res: Response<SingleUserResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      logger.debug('UserController: Update user request', { id, updateData: req.body });

      const user = await this.userService.updateUser(id, req.body);

      const response: SingleUserResponse = {
        data: user,
      };

      logger.info('UserController: Update user successful', { id });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 사용자 삭제
   * DELETE /api/v1/users/:id
   */
  public deleteUser = async (
    req: Request<UserParams>,
    res: Response<{ message: string }>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      logger.debug('UserController: Delete user request', { id });

      await this.userService.deleteUser(id);

      logger.info('UserController: Delete user successful', { id });
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
