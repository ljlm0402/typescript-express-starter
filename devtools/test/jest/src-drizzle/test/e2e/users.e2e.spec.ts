import request from 'supertest';
import { createTestApp, resetUserDB, getUniqueUser } from '@/test/setup';

describe('Users API', () => {
  let server: any;
  const prefix = '/api/v1';

  beforeAll(() => {
    server = createTestApp(); // Initialize server with shared repository
  });

  beforeEach(() => {
    resetUserDB(); // Reset repository before each test
  });

  it('should create a new user', async () => {
    const user = getUniqueUser();
    const res = await request(server).post(`${prefix}/users`).send(user);
    expect(res.statusCode).toBe(201);
    expect(res.body.data.email).toBe(user.email);
  });

  it('should retrieve all users', async () => {
    const user = getUniqueUser();
    await request(server).post(`${prefix}/users`).send(user);
    const res = await request(server).get(`${prefix}/users`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].email).toBe(user.email);
  });

  it('should retrieve a user by id', async () => {
    const user = getUniqueUser();
    const createRes = await request(server).post(`${prefix}/users`).send(user);
    const id = createRes.body.data.id;

    const res = await request(server).get(`${prefix}/users/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe(user.email);
  });

  it('should update user information', async () => {
    const user = getUniqueUser();
    const createRes = await request(server).post(`${prefix}/users`).send(user);
    const id = createRes.body.data.id;

    const updateData = {
      email: user.email, // DTO에서 email 필드 필요
      password: 'newpassword123'
    };
    const res = await request(server).put(`${prefix}/users/${id}`).send(updateData);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(id);
  });

  it('should delete a user', async () => {
    const user = getUniqueUser();
    const createRes = await request(server).post(`${prefix}/users`).send(user);
    const id = createRes.body.data.id;

    const res = await request(server).delete(`${prefix}/users/${id}`);
    expect(res.statusCode).toBe(204);
  });

  it('should return 404 if user does not exist', async () => {
    const nonExistentId = '00000000-0000-4000-8000-000000000000'; // Valid UUID format but non-existent
    const res = await request(server).get(`${prefix}/users/${nonExistentId}`);
    expect(res.statusCode).toBe(404);
  });
});
