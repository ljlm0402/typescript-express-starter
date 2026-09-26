import type { Request, Response, RequestHandler } from 'express';
import { injectable, container } from 'tsyringe';
import { getCargo } from 'express-cargo';
import type { RequestWithUser } from '@interfaces/auth.interface';
import { asyncHandler } from '@utils/asyncHandler';
import { CreateUserDto, LoginUserDto } from '@dtos/users.dto';
import { AuthService } from '@services/auth.service';

@injectable()
export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = container.resolve(AuthService);
  }

  public signUp: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userData = getCargo<CreateUserDto>(req);
    const signUpUserData = await this.authService.signup(userData);

    res.status(201).json({ data: signUpUserData.toResponse(), message: 'signup' });
  });

  public logIn: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const loginData = getCargo<LoginUserDto>(req);
    const { cookie, user } = await this.authService.login(loginData);

    res.setHeader('Set-Cookie', [cookie]);
    res.status(200).json({ data: user.toResponse(), message: 'login' });
  });

  public logOut: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userReq = req as RequestWithUser;
    const user = userReq.user;
    await this.authService.logout(user);

    res.clearCookie('Authorization', {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      // secure: true, // 프로덕션에서 HTTPS일 때만
    });
    res.status(200).json({ message: 'logout' });
  });
}
