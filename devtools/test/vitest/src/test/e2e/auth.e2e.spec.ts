import request from 'supertest';
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { createTestApp, resetUserDB } from '@/test/setup';

describe('Auth API', () => {
  let server: any;
  const prefix = '/api/v1';

  beforeAll(() => {
    server = createTestApp(); // Use shared repository for testing
  });

  beforeEach(() => {
    resetUserDB(); // Reset repository before each test
  });

  const user = { email: 'authuser@example.com', password: 'authpassword123' };

  it('should successfully register a new user', async () => {
    const res = await request(server).post(`${prefix}/auth/signup`).send(user);
    expect(res.statusCode).toBe(201);
    expect(res.body.data.email).toBe(user.email);
  });

  it('should login a user and set a cookie', async () => {
    await request(server).post(`${prefix}/auth/signup`).send(user);
    const res = await request(server).post(`${prefix}/auth/login`).send(user);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe(user.email);
    expect(res.header['set-cookie']).toBeDefined();
  });

  it('should logout a user', async () => {
    await request(server).post(`${prefix}/auth/signup`).send(user);
    const loginRes = await request(server).post(`${prefix}/auth/login`).send(user);
    const cookie = loginRes.headers['set-cookie'];
    const logoutRes = await request(server).post(`${prefix}/auth/logout`).set('Cookie', cookie[0]);
    expect(logoutRes.statusCode).toBe(200);
    expect(logoutRes.body.message).toBe('logout');
  });
});
