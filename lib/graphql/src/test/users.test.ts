import request from 'supertest';
import { App } from '@app';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Users', () => {
});
