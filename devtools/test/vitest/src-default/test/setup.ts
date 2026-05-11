import 'reflect-metadata';
import express, { Express } from 'express';

interface TestUser {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

let users: TestUser[] = [];
let userSequence = 0;

const createUser = (email: string): TestUser => {
  userSequence += 1;
  const now = new Date().toISOString();
  const user = {
    id: `user_00000000-0000-4000-8000-${String(userSequence).padStart(12, '0')}`,
    email: email.toLowerCase(),
    createdAt: now,
    updatedAt: now,
  };
  users.push(user);
  return user;
};

// createTestApp - 실제 Express 앱 생성
export const createTestApp = (): Express => {
  const app = express();

  // JSON 미들웨어
  app.use(express.json());

  // Mock routes
  app.post('/api/v1/auth/signup', (req, res) => {
    const user = createUser(req.body.email || 'test@example.com');
    res.status(201).json({
      data: user,
      message: 'signup',
    });
  });

  app.post('/api/v1/auth/login', (req, res) => {
    res
      .status(200)
      .cookie('Authorization', 'mock-token', { httpOnly: true })
      .json({
        data: {
          id: 'test-user-id',
          email: req.body.email || 'test@example.com',
        },
        message: 'login',
      });
  });

  app.post('/api/v1/auth/logout', (req, res) => {
    res.clearCookie('Authorization').json({
      message: 'logout',
    });
  });

  app.get('/api/v1/users', (req, res) => {
    res.json({
      data: users,
      message: 'Users retrieved successfully',
    });
  });

  app.post('/api/v1/users', (req, res) => {
    const user = createUser(req.body.email || 'newuser@example.com');
    res.status(201).json({
      data: user,
      message: 'User created successfully',
    });
  });

  app.get('/api/v1/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find((item) => item.id === id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.json({
      data: user,
      message: 'User retrieved successfully',
    });
  });

  app.put('/api/v1/users/:id', (req, res) => {
    const { id } = req.params;
    const userIndex = users.findIndex((item) => item.id === id);
    if (userIndex === -1) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    users[userIndex] = {
      ...users[userIndex],
      email: req.body.email || users[userIndex].email,
      updatedAt: new Date().toISOString(),
    };

    return res.json({
      data: users[userIndex],
      message: 'User updated successfully',
    });
  });

  app.delete('/api/v1/users/:id', (req, res) => {
    const { id } = req.params;
    const userIndex = users.findIndex((item) => item.id === id);
    if (userIndex === -1) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    users.splice(userIndex, 1);
    return res.status(204).send();
  });

  return app;
};

// Mock 사용자 관리 함수들 - Vitest용
export const resetUserDB = () => {
  users = [];
  userSequence = 0;
};
export const createTestUser = () => createUser('test@example.com');

export function getUniqueUser() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return {
    email: `test-${timestamp}-${random}@example.com`,
    password: 'password123',
  };
}
