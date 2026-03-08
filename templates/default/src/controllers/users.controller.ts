import type { Request, Response, RequestHandler } from 'express';
import { injectable, inject } from 'tsyringe';
import { type UserCreateData } from '@entities/user.entity';
import { asyncHandler } from '@utils/asyncHandler';
import { UsersService } from '@services/users.service';

@injectable()
export class UsersController {
  constructor(@inject(UsersService) private readonly userService: UsersService) {}

  getUsers: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    // 페이지네이션 파라미터가 있으면 페이지네이션, 없으면 전체 목록
    if (req.query.page || req.query.limit) {
      const result = await this.userService.getAllUsersPaginated({ page, limit, search });
      const userResponses = result.users.map(user => user.toResponse());

      res.json({
        data: userResponses,
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        message: 'findAll',
      });
    } else {
      const users = await this.userService.getAllUsers();
      const userResponses = users.map(user => user.toResponse());

      res.json({ data: userResponses, message: 'findAll' });
    }
  });

  getUserById: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const user = await this.userService.getUserById(userId);

    res.json({ data: user.toResponse(), message: 'findById' });
  });

  createUser: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userData: UserCreateData = req.body;
    const user = await this.userService.createUser(userData);

    res.status(201).json({ data: user.toResponse(), message: 'create' });
  });

  updateUser: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updateData: { email?: string; password?: string } = req.body;
    const user = await this.userService.updateUser(userId, updateData);

    res.json({ data: user.toResponse(), message: 'update' });
  });

  deleteUser: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await this.userService.deleteUser(userId);

    res.status(204).json({ message: 'delete' });
  });
}
