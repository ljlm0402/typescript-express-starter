import bcrypt from 'bcrypt';
import request from 'supertest';
import { createConnection, getRepository } from 'typeorm';
import App from '@/app';
import { dbConnection } from '@databases';
import { CreateUserDto } from '@dtos/users.dto';
import UserRoute from '@routes/users.route';

beforeAll(async () => {
  await createConnection(dbConnection);
});

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Users', () => {
  describe('[GET] /users', () => {
    it('response findAll users', async () => {
      const usersRoute = new UserRoute();
      const users = usersRoute.usersController.userService.users;
      const userRepository = getRepository(users);

      userRepository.find = jest.fn().mockReturnValue([
        {
          id: 1,
          email: 'a@email.com',
          password: await bcrypt.hash('q1w2e3r4!', 10),
        },
        {
          id: 2,
          email: 'b@email.com',
          password: await bcrypt.hash('a1s2d3f4!', 10),
        },
        {
          id: 3,
          email: 'c@email.com',
          password: await bcrypt.hash('z1x2c3v4!', 10),
        },
      ]);

      const app = new App([usersRoute]);
      return request(app.getServer()).get(`${usersRoute.path}`).expect(200);
    });
  });

  describe('[GET] /users/:id', () => {
    it('response findOne user', async () => {
      const userId = 1;

      const usersRoute = new UserRoute();
      const users = usersRoute.usersController.userService.users;
      const userRepository = getRepository(users);

      userRepository.findOne = jest.fn().mockReturnValue({
        id: userId,
        email: 'a@email.com',
        password: await bcrypt.hash('q1w2e3r4!', 10),
      });

      const app = new App([usersRoute]);
      return request(app.getServer()).get(`${usersRoute.path}/${userId}`).expect(200);
    });
  });

  describe('[POST] /users', () => {
    it('response Create user', async () => {
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4!',
      };

      const usersRoute = new UserRoute();
      const users = usersRoute.usersController.userService.users;
      const userRepository = getRepository(users);

      userRepository.findOne = jest.fn().mockReturnValue(null);
      userRepository.save = jest.fn().mockReturnValue({
        id: 1,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });

      const app = new App([usersRoute]);
      return request(app.getServer()).post(`${usersRoute.path}`).send(userData).expect(201);
    });
  });

  describe('[PUT] /users/:id', () => {
    it('response Update user', async () => {
      const userId = 1;
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: '1q2w3e4r!',
      };

      const usersRoute = new UserRoute();
      const users = usersRoute.usersController.userService.users;
      const userRepository = getRepository(users);

      userRepository.findOne = jest.fn().mockReturnValue({
        id: userId,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });
      userRepository.update = jest.fn().mockReturnValue({
        generatedMaps: [],
        raw: [],
        affected: 1,
      });
      userRepository.findOne = jest.fn().mockReturnValue({
        id: userId,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });

      const app = new App([usersRoute]);
      return request(app.getServer()).put(`${usersRoute.path}/${userId}`).send(userData).expect(200);
    });
  });

  describe('[DELETE] /users/:id', () => {
    it('response Delete user', async () => {
      const userId = 1;

      const usersRoute = new UserRoute();
      const users = usersRoute.usersController.userService.users;
      const userRepository = getRepository(users);

      userRepository.findOne = jest.fn().mockReturnValue({
        id: userId,
        email: 'a@email.com',
        password: await bcrypt.hash('q1w2e3r4!', 10),
      });

      const app = new App([usersRoute]);
      return request(app.getServer()).delete(`${usersRoute.path}/${userId}`).expect(200);
    });
  });
});
