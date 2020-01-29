import * as mongoose from 'mongoose';
import * as request from 'supertest';
import App from '../app';
import UsersRoute from '../routes/users.route';

afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Users', () => {
  describe('GET /users', () => {
    it('response All Users', () => {
      const usersRoute = new UsersRoute();
      usersRoute.usersController.userService.users.find = jest
      .fn()
      .mockReturnValue(Promise.resolve([{
        email: 'example@gmail.com',
        password: 'q1w2e3r4!',
      },
      ]));

      (mongoose as any).connect = jest.fn();
      const app = new App([usersRoute]);
      return request(app.getServer())
      .get(`${usersRoute.path}`)
      .expect(200);
    });
  });
});
