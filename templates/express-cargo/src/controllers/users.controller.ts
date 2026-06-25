import type { Request, Response, RequestHandler } from 'express';
import { injectable, container } from 'tsyringe';
import { getCargo } from 'express-cargo';
import { asyncHandler } from '@utils/asyncHandler';
import { CreateUserDto, UpdateUserDto, ListUsersQueryDto, UserParamsDto } from '@dtos/users.dto';
import { UsersService } from '@services/users.service';

@injectable()
export class UsersController {
  private readonly userService: UsersService;

  constructor() {
    this.userService = container.resolve(UsersService);
  }

  getUsers: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    // @Default 덕분에 page/limit은 항상 채워진 number → 분기 없이 페이지네이션
    const { page, limit, search } = getCargo<ListUsersQueryDto>(req);

    const result = await this.userService.getAllUsersPaginated({ page, limit, search });
    const userResponses = result.users.map((user) => user.toResponse());

    res.json({
      data: userResponses,
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
      message: 'findAll',
    });
  });

  getUserById: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = getCargo<UserParamsDto>(req);
    const user = await this.userService.getUserById(id);

    res.json({ data: user.toResponse(), message: 'findById' });
  });

  createUser: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userData = getCargo<CreateUserDto>(req);
    const user = await this.userService.createUser(userData);

    res.status(201).json({ data: user.toResponse(), message: 'create' });
  });

  updateUser: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id, email, password } = getCargo<UpdateUserDto>(req);
    const user = await this.userService.updateUser(id, { email, password });

    res.json({ data: user.toResponse(), message: 'update' });
  });

  deleteUser: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = getCargo<UserParamsDto>(req);
    await this.userService.deleteUser(id);

    // 204 No Content는 본문을 가질 수 없으므로 end()로 종료
    res.status(204).end();
  });
}