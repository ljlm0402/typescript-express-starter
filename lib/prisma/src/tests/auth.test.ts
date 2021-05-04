import bcrypt from 'bcrypt';
import request from 'supertest';
import { User } from '@prisma/client';
import App from '@/app';
import { CreateUserDto } from '@dtos/users.dto';
import AuthRoute from '@routes/auth.route';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Auth', () => {
  describe('[POST] /signup', () => {
    it('response should have the Create userData', async () => {
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4',
      };

      const authRoute = new AuthRoute();
      const users = authRoute.authController.authService.users;

      users.findUnique = jest.fn().mockReturnValue(null);
      users.create = jest.fn().mockReturnValue({
        id: 1,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });

      const app = new App([authRoute]);
      return request(app.getServer()).post(`${authRoute.path}signup`).send(userData).expect(201);
    });
  });

  describe('[POST] /login', () => {
    it('response should have the Set-Cookie header with the Authorization token', async () => {
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4',
      };

      const authRoute = new AuthRoute();
      const users = authRoute.authController.authService.users;

      users.findUnique = jest.fn().mockReturnValue({
        id: 1,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });

      const app = new App([authRoute]);
      return request(app.getServer())
        .post(`${authRoute.path}login`)
        .send(userData)
        .expect('Set-Cookie', /^Authorization=.+/);
    });
  });

  // describe('[POST] /logout', () => {
  //   it('logout Set-Cookie Authorization=; Max-age=0', async () => {
  //     const user: User = {
  //       id: 1,
  //       email: 'test@email.com',
  //       password: 'q1w2e3r4',
  //     };

  //     const authRoute = new AuthRoute();
  //     const users = authRoute.authController.authService.users;

  //     users.findFirst = jest.fn().mockReturnValue({
  //       ...user,
  //       password: await bcrypt.hash(user.password, 10),
  //     });

  //     const app = new App([authRoute]);
  //     return request(app.getServer())
  //       .post(`${authRoute.path}logout`)
  //       .expect('Set-Cookie', /^Authorization=\;/);
  //   });
  // });
});
