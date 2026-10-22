import type { Request, Response, NextFunction } from 'express';
import { verify, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { container } from 'tsyringe';
import { JWT_SECRET } from '@config/env';
import { HttpException } from '@exceptions/http.exception';
import type { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { UsersRepository } from '@repositories/users.repository';
import { logger } from '@utils/logger';

const getAuthorization = (req: RequestWithUser) => {
  const cookie = req.cookies?.['Authorization'];
  if (cookie) return cookie;

  const header = req.header('Authorization');
  if (header && header.startsWith('Bearer ')) {
    return header.replace('Bearer ', '').trim();
  }
  return null;
};

export const AuthMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const userReq = req as RequestWithUser;
    const token = getAuthorization(userReq);
    if (!token) {
      return next(new HttpException(401, 'Authentication token missing'));
    }

    let payload: DataStoredInToken;
    try {
      payload = verify(token, JWT_SECRET) as DataStoredInToken;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        return next(new HttpException(401, 'Authentication token expired'));
      }
      if (err instanceof JsonWebTokenError) {
        return next(new HttpException(401, 'Invalid authentication token'));
      }
      return next(new HttpException(401, 'Authentication failed'));
    }

    const userRepo = container.resolve(UsersRepository);
    const findUser = await userRepo.findById(payload.id);
    if (!findUser || !findUser.isActive) {
      return next(new HttpException(401, 'User not found or inactive'));
    }

    userReq.user = {
      id: findUser.id,
      email: findUser.email,
      firstName: findUser.firstName,
      lastName: findUser.lastName,
      isActive: findUser.isActive,
      createdAt: findUser.createdAt,
      updatedAt: findUser.updatedAt,
    };

    next();
  } catch (error) {
    if (error instanceof HttpException) return next(error);
    logger.error({ error }, 'Authentication error:');
    next(new HttpException(500, 'Authentication middleware error'));
  }
};
