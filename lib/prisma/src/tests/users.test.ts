import request from 'supertest';
import App from '../app';
import { PrismaClient, User } from '@prisma/client';
import UserRoute from '../routes/users.route';
import { CreateUserDto } from '../dtos/users.dto';
const prisma = new PrismaClient();

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Users', () => {
  describe('[GET] /users', () => {
    it('response statusCode 200 / findAll', async () => {
      const findUser: User[] = await prisma.user.findMany();
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      return request(app.getServer()).get(`${usersRoute.path}`).expect(200, { data: findUser, message: 'findAll' });
    });
  });

  describe('[GET] /users/:id', () => {
    it('response statusCode 200 / findOne', async () => {
      const userId = 1;
      const findUser: User = await prisma.user.findUnique({where: { id: Number(userId) }});
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      return request(app.getServer()).get(`${usersRoute.path}/${userId}`).expect(200, { data: findUser, message: 'findOne' });
    });
  });

  describe('[POST] /users', () => {
    it('response statusCode 201 / created', async () => {
      const userData: CreateUserDto = {
        email: 'lkm@gmail.com',
        password: 'q1w2e3r4',
      };
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      return request(app.getServer()).post(`${usersRoute.path}`).send(userData).expect(201);
    });
  });

  describe('[PUT] /users/:id', () => {
    it('response statusCode 200 / updated', async () => {
      const userToUpdate = await prisma.user.findUnique({where: { email: 'lkm@gmail.com'}} );
      const userId = userToUpdate.id;
      const userData: CreateUserDto = {
        email: 'lim@gmail.com',
        password: '1q2w3e4r',
      };
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      return request(app.getServer()).put(`${usersRoute.path}/${userId}`).send(userData).expect(200);
    });
  });

  describe('[DELETE] /users/:id', () => {
    it('response statusCode 200 / deleted', async () => {
      const deleteUser = await prisma.user.findUnique({ where: { email: 'lim@gmail.com' } });
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      return request(app.getServer()).delete(`${usersRoute.path}/${deleteUser.id}`).expect(200, { data: deleteUser, message: 'deleted' });
    });
  });
});
