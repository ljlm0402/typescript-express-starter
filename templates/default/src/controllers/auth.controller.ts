import type { Request, Response, RequestHandler } from 'express';
import { injectable, inject } from 'tsyringe';
import { RequestWithUser } from '@interfaces/auth.interface';
import { type UserCreateData } from '@entities/user.entity';
import { asyncHandler } from '@utils/asyncHandler';
import { AuthService } from '@services/auth.service';

@injectable()
export class AuthController {
  constructor(@inject(AuthService) private readonly authService: AuthService) {}

  public signUp: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userData: UserCreateData = req.body;
    const signUpUserData = await this.authService.signup(userData);

    res.status(201).json({ data: signUpUserData.toResponse(), message: 'signup' });
  });

  public logIn: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const loginData: { email: string; password: string } = req.body;
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
