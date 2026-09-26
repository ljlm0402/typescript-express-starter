import type { Request, Response, NextFunction } from 'express';
import type { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { CargoValidationError } from 'express-cargo';
import { NODE_ENV } from '@config/env';
import { HttpException } from '@exceptions/http.exception';
import {
  type StandardErrorResponse,
  type ValidationErrorDetail,
  HTTP_ERROR_MESSAGES,
} from '@interfaces/error.interface';
import { logger } from '@utils/logger';

type HttpExceptionWithData = HttpException & { data?: unknown };
type WithStack = { stack?: string };

/** 타입가드들 */
const isCargoValidationError = (e: unknown): e is CargoValidationError => {
  return e instanceof CargoValidationError;
};

/** jsonwebtoken은 런타임에 따라 클래스 경계 이슈가 있을 수 있어 name 기반 가드 권장 */
const isTokenExpiredError = (e: unknown): e is TokenExpiredError => {
  return e instanceof Error && (e as { name?: string }).name === 'TokenExpiredError';
};
const isJsonWebTokenError = (e: unknown): e is JsonWebTokenError => {
  return e instanceof Error && (e as { name?: string }).name === 'JsonWebTokenError';
};

const toHttpException = (err: unknown): HttpException => {
  if (err instanceof HttpException) return err;

  if (isCargoValidationError(err)) {
    const details: ValidationErrorDetail[] = err.errors.map((fieldError) => ({
      field: String(fieldError.field),
      message: fieldError.message,
    }));
    return new HttpException(400, 'Validation failed', details);
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
  const message =
    httpErr.message ||
    HTTP_ERROR_MESSAGES[status as keyof typeof HTTP_ERROR_MESSAGES] ||
    'Something went wrong';

  if (res.headersSent) return _next(httpErr);

  const stack = extractStack(httpErr);
  logger.error(
    `[${req.method}] ${req.originalUrl} | ${status} | ${message}${stack ? `\n${stack}` : ''}`,
  );

  // 표준 에러 응답 형식
  const errorResponse: StandardErrorResponse = {
    success: false,
    error: {
      code: status,
      message,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    },
  };

  // 추가 세부 정보가 있으면 포함
  const maybeDetails = (httpErr as HttpExceptionWithData).data;
  if (typeof maybeDetails !== 'undefined') {
    errorResponse.error.details = maybeDetails;
  }

  // 개발 환경에서만 스택 트레이스 포함
  if (NODE_ENV === 'development' && stack) {
    errorResponse.error.details = {
      ...(errorResponse.error.details || {}),
      stack,
    };
  }

  res.status(status).json(errorResponse);
};
