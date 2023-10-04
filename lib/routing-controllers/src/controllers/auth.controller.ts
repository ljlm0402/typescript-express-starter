import { Response } from 'express';
import { Controller, Req, Body, Post, UseBefore, HttpCode, Res } from 'routing-controllers';
import { Container } from 'typedi';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthService } from '@services/auth.service';

@Controller()
export class AuthController {
  public auth = Container.get(AuthService);

  @Post('/signup')
  @UseBefore(ValidationMiddleware(CreateUserDto))
  @HttpCode(201)
  async signUp(@Body() userData: User) {
    const signUpUserData: User = await this.auth.signup(userData);
    return { data: signUpUserData, message: 'signup' };
  }

  @Post('/login')
  @UseBefore(ValidationMiddleware(CreateUserDto))
  async logIn(@Res() res: Response, @Body() userData: User) {
    const { cookie, findUser } = await this.auth.login(userData);

    res.setHeader('Set-Cookie', [cookie]);
    return { data: findUser, message: 'login' };
  }

  @Post('/logout')
  @UseBefore(AuthMiddleware)
  async logOut(@Req() req: RequestWithUser, @Res() res: Response) {
    const userData: User = req.user;
    const logOutUserData: User = await this.auth.logout(userData);

    res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
    return { data: logOutUserData, message: 'logout' };
  }
}
