import request from 'supertest';
import { App } from '@/app';
import { UserController } from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import { UserModel } from '@models/users.model';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Users', () => {
  describe('[GET] /users', () => {
    it('response statusCode 200 / findAll', () => {
      const findUser: User[] = UserModel;

      const app = new App([UserController]);
      return request(app.getServer()).get('/users').expect(200, { data: findUser, message: 'findAll' });
    });
  });

  describe('[GET] /users/:id', () => {
    it('response statusCode 200 / findOne', () => {
      const userId = 1;
      const findUser: User = UserModel.find(user => user.id === userId);

      const app = new App([UserController]);
      return request(app.getServer()).get(`/users/${userId}`).expect(200, { data: findUser, message: 'findOne' });
    });
  });

  describe('[POST] /users', () => {
    it('response statusCode 201 / created', async () => {
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4',
      };

      const app = new App([UserController]);
      return request(app.getServer()).post('/users').send(userData).expect(201);
    });
  });

  describe('[PUT] /users/:id', () => {
    it('response statusCode 200 / updated', async () => {
      const userId = 1;
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4',
      };

      const app = new App([UserController]);
      return request(app.getServer()).put(`/users/${userId}`).send(userData).expect(200);
    });
  });

  describe('[DELETE] /users/:id', () => {
    it('response statusCode 200 / deleted', () => {
      const userId = 1;

      const app = new App([UserController]);
      return request(app.getServer()).delete(`/users/${userId}`).expect(200);
    });
  });
});
