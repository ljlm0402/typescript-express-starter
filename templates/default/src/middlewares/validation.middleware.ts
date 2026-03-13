import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';
import { HttpException } from '@exceptions/http.exception';

export function ValidationMiddleware(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction) => {
    // Express 5.x에서 body parser 확인 - JSON 파싱 이후 null/undefined 체크
    if (req.body === null || req.body === undefined) {
      return next(new HttpException(400, 'Request body is required'));
    }

    // 빈 객체 또는 잘못된 JSON 형식 체크
    if (typeof req.body === 'object' && Object.keys(req.body).length === 0) {
      return next(new HttpException(400, 'Invalid JSON format or empty body'));
    }

    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues.map((e) => e.message).join(', ');
      return next(new HttpException(400, message));
    }
    req.body = result.data;
    next();
  };
}
