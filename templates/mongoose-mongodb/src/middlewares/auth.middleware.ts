import type { Request, Response, NextFunction } from 'express';
import { verify, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { container } from 'tsyringe';
import { JWT_SECRET } from '@config/env';
import { HttpException } from '@exceptions/http.exception';
import { UserRepository, IUserRepository } from '@repositories/user.repository';
import { logger } from '@utils/logger';

/**
 * JWT 페이로드 인터페이스
 */
interface DataStoredInToken {
  id: string;
}

/**
 * 사용자 정보를 포함한 Request 인터페이스
 */
export interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
  };
}

/**
 * Authorization 토큰 추출
 */
const getAuthorization = (req: Request): string | null => {
  // 쿠키에서 토큰 확인
  const cookie = req.cookies?.['Authorization'];
  if (cookie) return cookie;

  // Authorization 헤더에서 Bearer 토큰 확인
  const header = req.header('Authorization');
  if (header && header.startsWith('Bearer ')) {
    return header.replace('Bearer ', '').trim();
  }

  return null;
};

/**
 * JWT 인증 미들웨어
 */
export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    logger.debug('Auth middleware started');

    const token = getAuthorization(req);
    if (!token) {
      logger.warn('Authentication token missing');
      return next(new HttpException(401, 'Authentication token missing'));
    }

    let payload: DataStoredInToken;
    try {
      payload = verify(token, JWT_SECRET as string) as DataStoredInToken;
      logger.debug('Token verified successfully', { userId: payload.id });
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        logger.warn('Authentication token expired');
        return next(new HttpException(401, 'Authentication token expired'));
      }
      if (err instanceof JsonWebTokenError) {
        logger.warn('Invalid authentication token');
        return next(new HttpException(401, 'Invalid authentication token'));
      }
      logger.error('Authentication failed', { error: err });
      return next(new HttpException(401, 'Authentication failed'));
    }

    // 사용자 조회
    const userRepository = container.resolve<IUserRepository>('UserRepository');
    const findUser = await userRepository.findById(payload.id);

    if (!findUser) {
      logger.warn('User not found with token', { userId: payload.id });
      return next(new HttpException(401, 'User not found with this token'));
    }

    // Request 객체에 사용자 정보 추가
    (req as RequestWithUser).user = {
      id: findUser._id.toString(),
      email: findUser.email,
    };

    logger.debug('User authenticated successfully', { userId: findUser._id });
    next();
  } catch (error) {
    logger.error('Authentication middleware error', { error });
    next(new HttpException(500, 'Authentication middleware error'));
  }
};
