import request from 'supertest';
import App from '@/app';
import { IndexController } from '@controllers/index.controller';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Index', () => {
  describe('[GET] /', () => {
    it('response statusCode 200', () => {
      const app = new App([IndexController]);

      return request(app.getServer()).get('/').expect(200);
    });
  });
});
