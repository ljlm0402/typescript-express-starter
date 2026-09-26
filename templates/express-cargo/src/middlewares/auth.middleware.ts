import type { Request, Response, NextFunction } from 'express';
import { verify, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { container } from 'tsyringe';
import { SECRET_KEY } from '@config/env';
import { HttpException } from '@exceptions/http.exception';
import type { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { UsersRepository } from '@repositories/users.repository';

const getAuthorization = (req: RequestWithUser) => {
  const cookie = req.cookies.Authorization;
  if (cookie) return cookie;

  const header = req.header('Authorization');
  if (header?.startsWith('Bearer ')) {
    return header.replace('Bearer ', '').trim();
  }
  return null;
};

export const AuthMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const userReq = req as RequestWithUser;
    const token = getAuthorization(userReq);
    if (!token) return next(new HttpException(401, 'Authentication token missing'));

    let payload: DataStoredInToken;
    try {
      payload = verify(token, SECRET_KEY as string) as DataStoredInToken;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        return next(new HttpException(401, 'Authentication token expired'));
      }
      if (err instanceof JsonWebTokenError) {
        return next(new HttpException(401, 'Invalid authentication token'));
      }
      return next(new HttpException(401, 'Authentication failed'));
    }

    // 타입 일치 유의 (number/string)
    const userRepo = container.resolve(UsersRepository);
    const findUser = await userRepo.findById(String(payload.id));
    if (!findUser) return next(new HttpException(401, 'User not found with this token'));

    (req as RequestWithUser).user = findUser;
    next();
  } catch {
    next(new HttpException(500, 'Authentication middleware error'));
  }
};
