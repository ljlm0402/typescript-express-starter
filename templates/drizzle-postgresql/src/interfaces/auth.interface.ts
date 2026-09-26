import type { Request } from 'express';
import type { UserResponse } from '@interfaces/user.interface';

export interface DataStoredInToken {
  id: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: UserResponse;
}
