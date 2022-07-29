import request from 'supertest';
import App from '../app';
import { DI } from '../databases';
import { CreateUserDto } from '../dtos/users.dto';
import UsersRoute from '../routes/users.route';

const usersRoute = new UsersRoute();

const app = new App([usersRoute]);

let userId: string;

/**
 ** MikroORM Seeding
 ** https://mikro-orm.io/docs/seeding#use-in-tests
 */

beforeAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));

  await DI.orm.getSchemaGenerator().refreshDatabase();
});

afterAll(async () => {
  await DI.orm.close();
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Users', () => {
  describe('[GET] /users', () => {
    it('response fineAll Users', async () => {
      return request(app.getServer()).get(`${usersRoute.path}`).expect(200);
    });
  });

  describe('[POST] /users', () => {
    it('response Create User', async () => {
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4',
      };

      const { body } = await request(app.getServer()).post(`${usersRoute.path}`).send(userData).expect(201);
      userId = body.data.id;
    });
  });

  describe('[GET] /users/:id', () => {
    it('response findOne User', async () => {
      return await request(app.getServer()).get(`${usersRoute.path}/${userId}`).expect(200);
    });
  });

  describe('[PUT] /users/:id', () => {
    it('response Update User', async () => {
      const userData: CreateUserDto = {
        email: 'test1@email.com',
        password: 'q1w2e3r4',
      };

      return await request(app.getServer()).put(`${usersRoute.path}/${userId}`).send(userData).expect(200);
    });
  });

  describe('[DELETE] /users/:id', () => {
    it('response Delete User', async () => {
      return request(app.getServer()).delete(`${usersRoute.path}/${userId}`).expect(200);
    });
  });
});
