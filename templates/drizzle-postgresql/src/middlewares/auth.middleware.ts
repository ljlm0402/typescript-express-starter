import { Request, Response, NextFunction } from 'express';
import { verify, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { container } from 'tsyringe';
import { JWT_SECRET } from '@config/env';
import { HttpException } from '@exceptions/http.exception';
import { UsersRepository } from '@repositories/user.repository';
import { logger } from '@utils/logger';
// JWT Payload 타입 정의
interface JwtPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    isActive: boolean;
  };
}

const getAuthorization = (req: Request) => {
  const cookie = req.cookies?.['Authorization'];
  if (cookie) return cookie;

  const header = req.header('Authorization');
  if (header && header.startsWith('Bearer ')) {
    return header.replace('Bearer ', '').trim();
  }
  return null;
};

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getAuthorization(req);
    if (!token) {
      return next(new HttpException(401, 'Authentication token missing'));
    }

    let payload: JwtPayload;
    try {
      payload = verify(token, JWT_SECRET) as JwtPayload;
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

    // 사용자 정보를 요청 객체에 추가 (비밀번호 제외)
    (req as AuthRequest).user = {
      id: findUser.id,
      email: findUser.email,
      firstName: findUser.firstName,
      lastName: findUser.lastName,
      isActive: findUser.isActive,
    };

    next();
  } catch (error) {
    logger.error({ error }, 'Authentication error:');
    next(new HttpException(500, 'Authentication middleware error'));
  }
};
