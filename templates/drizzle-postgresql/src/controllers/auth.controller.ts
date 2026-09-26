import type { Request, Response, RequestHandler } from 'express';
import { injectable, container } from 'tsyringe';
import type { RequestWithUser } from '@interfaces/auth.interface';
import type { LoginRequest, SignupRequest } from '@dtos/auth.dto';
import { asyncHandler } from '@utils/asyncHandler';
import { AuthService } from '@services/auth.service';

@injectable()
export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = container.resolve(AuthService);
  }

  public signUp: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userData: SignupRequest = req.body;
    const signUpUserData = await this.authService.signup(userData);

    res.status(201).json({ data: signUpUserData, message: 'signup' });
  });

  public logIn: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const loginData: LoginRequest = req.body;
    const { cookie, user } = await this.authService.login(loginData);

    res.setHeader('Set-Cookie', [cookie]);
    res.status(200).json({ data: user, message: 'login' });
  });

  public logOut: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userReq = req as RequestWithUser;
    await this.authService.logout(userReq.user);

    res.clearCookie('Authorization', {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
    });
    res.status(200).json({ message: 'logout' });
  });
}
