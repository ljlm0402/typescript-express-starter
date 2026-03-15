import request from 'supertest';
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { createTestApp, resetUserDB, getUniqueUser } from '@/test/setup';

describe('Auth API', () => {
  let server: any;
  const prefix = '/api/v1';

  beforeAll(() => {
    server = createTestApp(); // Use shared repository for testing
  });

  beforeEach(() => {
    resetUserDB(); // Reset repository before each test
  });

  it('should successfully register a new user', async () => {
    const user = getUniqueUser();
    const res = await request(server).post(`${prefix}/auth/signup`).send(user);
    expect(res.statusCode).toBe(201);
    expect(res.body.data.email).toBe(user.email);
  });

  it('should login a user and set a cookie', async () => {
    const user = getUniqueUser();
    await request(server).post(`${prefix}/auth/signup`).send(user);
    const res = await request(server).post(`${prefix}/auth/login`).send(user);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe(user.email);
    expect(res.header['set-cookie']).toBeDefined();
  });

  it('should logout a user', async () => {
    const user = getUniqueUser();
    await request(server).post(`${prefix}/auth/signup`).send(user);
    const loginRes = await request(server).post(`${prefix}/auth/login`).send(user);
    
    // JWT 토큰을 쿠키에서 추출
    const setCookieHeader = loginRes.headers['set-cookie'];
    let authToken = '';
    if (setCookieHeader) {
      const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
      cookies.forEach((cookie: string) => {
        if (cookie.startsWith('Authorization=')) {
          authToken = cookie.split('Authorization=')[1].split(';')[0];
        }
      });
    }
    
    const logoutRes = await request(server)
      .post(`${prefix}/auth/logout`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(logoutRes.statusCode).toBe(200);
    expect(logoutRes.body.message).toBe('logout');
  });
});
