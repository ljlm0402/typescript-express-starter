import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ZodError } from 'zod';
import { NODE_ENV } from '@config/env';
import { HttpException } from '@exceptions/http.exception';
import { logger } from '@utils/logger';

type HttpExceptionWithData = HttpException & { data?: unknown };
type WithStack = { stack?: string };

interface ErrorDetails {
  code: number;
  message: string;
  data?: unknown;
  stack?: string;
}
interface ErrorResponseBody {
  success: false;
  error: ErrorDetails;
}

/** 타입가드들 */
const isZodError = (e: unknown): e is ZodError => {
  return e instanceof ZodError;
};

/** jsonwebtoken은 런타임에 따라 클래스 경계 이슈가 있을 수 있어 name 기반 가드 권장 */
const isTokenExpiredError = (e: unknown): e is TokenExpiredError => {
  return e instanceof Error && e.name === 'TokenExpiredError';
};
const isJsonWebTokenError = (e: unknown): e is JsonWebTokenError => {
  return e instanceof Error && e.name === 'JsonWebTokenError';
};

const toHttpException = (err: unknown): HttpException => {
  if (err instanceof HttpException) return err;

  if (isZodError(err)) {
    // 유효성 검사 오류를 HTTP 오류로 변환
    const validationErrors = err.issues.map((i) => ({
      path: i.path.join('.'),
      message: i.message,
    }));
    const validationMessage = `Validation failed: ${validationErrors[0]?.message || 'Unknown validation error'}`;
    return new HttpException(400, validationMessage);
  }

  if (isTokenExpiredError(err)) return new HttpException(401, 'Token expired');
  if (isJsonWebTokenError(err)) return new HttpException(401, 'Invalid token');

  const e = err as Error | undefined;
  return new HttpException(500, e?.message || 'Internal Server Error');
};

const extractStack = (err: unknown): string | undefined => {
  if (err && typeof err === 'object' && 'stack' in err) {
    const s = (err as WithStack).stack;
    return typeof s === 'string' ? s : undefined;
  }
  return undefined;
};

export const ErrorMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const httpErr = toHttpException(error);
  const status = httpErr.status || 500;
  const message = httpErr.message || 'Something went wrong';

  if (res.headersSent) return _next(httpErr);

  const stack = extractStack(httpErr);
  logger.error(
    `[${req.method}] ${req.originalUrl} | ${status} | ${message}${stack ? `\n${stack}` : ''}`,
  );

  const body: ErrorResponseBody = {
    success: false,
    error: { code: status, message },
  };

  const maybeData = (httpErr as HttpExceptionWithData).data;
  if (typeof maybeData !== 'undefined') body.error.data = maybeData;
  if (NODE_ENV === 'development' && stack) body.error.stack = stack;

  res.status(status).json(body);
};
