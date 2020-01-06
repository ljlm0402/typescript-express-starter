import * as request from 'supertest';
import App from '../app';
import UserRoute from '../routes/users.route';

afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Users', () => {
  describe('GET /users', () => {
    it('response statusCode 200', () => {
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      return request(app.getServer())
      .get(`${usersRoute.path}`)
      .expect(200);
    });
  });

  describe('GET /users/:id', () => {
    it('response statusCode 200', () => {
      const userId = 1;
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      return request(app.getServer())
      .get(`${usersRoute.path}/${userId}`)
      .expect({ data: { id: userId, name: 'lim' }, message: 'findOne' });
    });
  });

  describe('POST /users', () => {
    it('response statusCode 201', () => {
      const userData = { name: 'Robert' };
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      return request(app.getServer())
      .post(`${usersRoute.path}`)
      .send(userData)
      .expect(201);
    });
  });

  describe('PUT /users/:id', () => {
    it('response statusCode 200', () => {
      const userId = 1;
      const userData = { name: 'Robert' };
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      return request(app.getServer())
      .put(`${usersRoute.path}/${userId}`)
      .send(userData)
      .expect(200);
    });
  });

  describe('DELETE /users/:id', () => {
    it('response statusCode 200', () => {
      const userId = 1;
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);
      
      return request(app.getServer())
      .delete(`${usersRoute.path}/${userId}`)
      .expect(200);
    });
  });
});
