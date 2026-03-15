import request from 'supertest';
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
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

  const user = { email: 'user1@example.com', password: 'password123' };

  it('should create a new user', async () => {
    const res = await request(server).post(`${prefix}/users`).send(user);
    expect(res.statusCode).toBe(201);
    expect(res.body.data.email).toBe(user.email);
  });

  it('should retrieve all users', async () => {
    await request(server).post(`${prefix}/users`).send(user);
    const res = await request(server).get(`${prefix}/users`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].email).toBe('user1@example.com');
  });

  it('should retrieve a user by id', async () => {
    const createRes = await request(server).post(`${prefix}/users`).send(user);
    const id = createRes.body.data.id;

    const res = await request(server).get(`${prefix}/users/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe('user1@example.com');
  });

  it('should update user information', async () => {
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
    const createRes = await request(server).post(`${prefix}/users`).send(user);
    const id = createRes.body.data.id;

    const res = await request(server).delete(`${prefix}/users/${id}`);
    expect(res.statusCode).toBe(204);
  });

  it('should return 404 if user does not exist', async () => {
    const res = await request(server).get(`${prefix}/users/invalid-id`);
    expect(res.statusCode).toBe(404);
  });
});
