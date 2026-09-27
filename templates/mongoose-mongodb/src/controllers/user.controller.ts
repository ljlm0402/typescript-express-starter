import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { UserService } from '@services/user.service';
import { logger } from '@utils/logger';

/**
 * User Controller
 */
@injectable()
export class UserController {
  constructor(@inject(UserService) private userService: UserService) {}

  /**
   * 모든 사용자 조회
   * GET /api/v1/users
   */
  getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info('Get all users request received');

      const users = await this.userService.getAllUsers();

      res.status(200).json({
        data: users,
        message: 'findAll',
      });

      logger.info('Get all users successful', { count: users.length });
    } catch (error) {
      logger.error('Get all users failed', { error });
      next(error);
    }
  };

  /**
   * 특정 사용자 조회
   * GET /api/v1/users/:id
   */
  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);

      logger.info('Get user by ID request received', { userId: id });

      const user = await this.userService.getUserById(id);

      res.status(200).json({
        data: user,
        message: 'findById',
      });

      logger.info('Get user by ID successful', { userId: id });
    } catch (error) {
      logger.error('Get user by ID failed', { error, userId: req.params.id });
      next(error);
    }
  };

  /**
   * 사용자 생성
   * POST /api/v1/users
   */
  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      logger.info('Create user request received', { email });

      const newUser = await this.userService.createUser({ email, password });

      res.status(201).json({
        data: newUser,
        message: 'create',
      });

      logger.info('Create user successful', { userId: newUser.id, email });
    } catch (error) {
      logger.error('Create user failed', { error, body: req.body });
      next(error);
    }
  };

  /**
   * 사용자 정보 수정
   * PUT /api/v1/users/:id
   */
  updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const { email, password } = req.body;

      logger.info('Update user request received', { userId: id });

      const updatedUser = await this.userService.updateUser(id, { email, password });

      res.status(200).json({
        data: updatedUser,
        message: 'update',
      });

      logger.info('Update user successful', { userId: id });
    } catch (error) {
      logger.error('Update user failed', { error, userId: req.params.id });
      next(error);
    }
  };

  /**
   * 사용자 삭제
   * DELETE /api/v1/users/:id
   */
  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);

      logger.info('Delete user request received', { userId: id });

      await this.userService.deleteUser(id);

      res.status(200).json({
        message: 'delete',
      });

      logger.info('Delete user successful', { userId: id });
    } catch (error) {
      logger.error('Delete user failed', { error, userId: req.params.id });
      next(error);
    }
  };
}
