import express from 'express';
import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';

describe('Express App E2E', () => {
  let app: express.Express;

  beforeAll(async () => {
    // 최소한의 Express 앱 생성
    app = express();
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', message: 'Server is running' });
    });
  });

  it('should respond to health check', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toEqual({
      status: 'ok', 
      message: 'Server is running'
    });
  });
});