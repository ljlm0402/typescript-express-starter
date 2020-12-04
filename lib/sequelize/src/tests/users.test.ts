import request from 'supertest';
import App from '../app';
import { User } from '../interfaces/users.interface';
import DB from '../database';
import UserRoute from '../routes/users.route';
import { CreateUserDto } from '../dtos/users.dto';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Users', () => {
  describe('[GET] /users', () => {
    it('response statusCode 200 / findAll', async () => {
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);
      const allUser: User[] = await DB.Users.findAll();

      return request(app.getServer()).get(`${usersRoute.path}`).expect(200, { data: allUser, message: 'findAll' });
    });
  });

  describe('[GET] /users/:id', () => {
    it('response statusCode 200 / findOne', async () => {
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);
      const userId = 1;
      const findUser: User = await DB.Users.findByPk(userId);

      return request(app.getServer()).get(`${usersRoute.path}/${userId}`).expect(200, { data: findUser, message: 'findOne' });
    });
  });

  describe('[POST] /users', () => {
    it('response statusCode 201 / created', async () => {
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4!',
      };
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      return request(app.getServer()).post(`${usersRoute.path}`).send(userData).expect(201);
    });
  });

  describe('[PUT] /users/:id', () => {
    it('response statusCode 200 / updated', async () => {
      const userId = 1;
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: '1q2w3e4r!',
      };
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      return request(app.getServer()).put(`${usersRoute.path}/${userId}`).send(userData).expect(200);
    });
  });

  describe('[DELETE] /users/:id', () => {
    it('response statusCode 200 / deleted', async () => {
      const userId = 1;
      const deleteUser = await DB.Users.destroy({ where: { id: userId } });
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      return request(app.getServer()).delete(`${usersRoute.path}/${userId}`).expect(200, { data: deleteUser, message: 'deleted' });
    });
  });
});
