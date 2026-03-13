/// <reference types="jest" />
import 'reflect-metadata';
import express, { Express } from 'express';

// createTestApp - 실제 Express 앱 생성
export const createTestApp = (): Express => {
  const app = express();

  // JSON 미들웨어
  app.use(express.json());

  // Mock routes
  app.post('/api/v1/auth/signup', (req, res) => {
    res.status(201).json({
      success: true,
      data: {
        id: 'test-user-id',
        email: req.body.email || 'test@example.com',
      },
      message: 'User registered successfully',
    });
  });

  app.post('/api/v1/auth/login', (req, res) => {
    res
      .status(200)
      .cookie('auth', 'mock-token', { httpOnly: true })
      .json({
        success: true,
        data: {
          id: 'test-user-id',
          email: req.body.email || 'test@example.com',
          token: 'mock-jwt-token',
        },
        message: 'Login successful',
      });
  });

  app.post('/api/v1/auth/logout', (req, res) => {
    res.clearCookie('auth').json({
      success: true,
      message: 'logout',
    });
  });

  app.get('/api/v1/users', (req, res) => {
    res.json({
      success: true,
      data: [
        {
          id: 'user-1',
          email: 'user1@example.com',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ],
      message: 'Users retrieved successfully',
    });
  });

  app.post('/api/v1/users', (req, res) => {
    res.status(201).json({
      success: true,
      data: {
        id: 'new-user-id',
        email: req.body.email || 'newuser@example.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      message: 'User created successfully',
    });
  });

  app.get('/api/v1/users/:id', (req, res) => {
    const { id } = req.params;
    if (id === 'invalid-id') {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.json({
      success: true,
      data: {
        id,
        email: 'user1@example.com',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      message: 'User retrieved successfully',
    });
  });

  app.put('/api/v1/users/:id', (req, res) => {
    const { id } = req.params;
    if (id === 'invalid-id') {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.json({
      success: true,
      data: {
        id,
        email: req.body.email || `updated-${id}@example.com`,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
      message: 'User updated successfully',
    });
  });

  app.delete('/api/v1/users/:id', (req, res) => {
    const { id } = req.params;
    if (id === 'invalid-id') {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(204).json({
      success: true,
      message: 'User deleted successfully',
    });
  });

  return app;
};

// Mock 사용자 관리 함수들
export const resetUserDB = jest.fn().mockResolvedValue(undefined);
export const createTestUser = jest.fn().mockResolvedValue({
  id: 'test-user-id',
  email: 'test@example.com',
});
