import request from 'supertest';
import { App } from '@/app';
import { User } from '@interfaces/users.interface';
import { UserModel } from '@models/users.model';
import { UserRoute } from '@routes/users.route';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('TEST Users API', () => {
  const route = new UserRoute();
  const app = new App([route]);

  describe('[GET] /users', () => {
    it('response statusCode 200 /findAll', () => {
      const findUser: User[] = UserModel;

      return request(app.getServer()).get(`${route.path}`).expect(200, { data: findUser, message: 'findAll' });
    });
  });

  describe('[GET] /users/:id', () => {
    it('response statusCode 200 /findOne', () => {
      const userId = 1;
      const findUser: User = UserModel.find(user => user.id === userId);

      return request(app.getServer()).get(`${route.path}/${userId}`).expect(200, { data: findUser, message: 'findOne' });
    });
  });

  describe('[POST] /users', () => {
    it('response statusCode 201 /created', async () => {
      const userData: User = {
        email: 'example@email.com',
        password: 'password123456789',
      };

      return request(app.getServer()).post(`${route.path}`).send(userData).expect(201);
    });
  });

  describe('[PUT] /users/:id', () => {
    it('response statusCode 200 /updated', async () => {
      const userId = 1;
      const userData: User = {
        password: 'password123456789',
      };

      return request(app.getServer()).put(`${route.path}/${userId}`).send(userData).expect(200);
    });
  });

  describe('[DELETE] /users/:id', () => {
    it('response statusCode 200 /deleted', () => {
      const userId = 1;
      const deleteUser: User[] = UserModel.filter(user => user.id !== userId);

      return request(app.getServer()).delete(`${route.path}/${userId}`).expect(200, { data: deleteUser, message: 'deleted' });
    });
  });
});
