import request from 'supertest';
import { App } from '@/app';
import { CreateUserDto } from '@dtos/users.dto';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Auth', () => {
});
