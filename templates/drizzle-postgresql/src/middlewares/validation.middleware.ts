import { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';
import { HttpException } from '@exceptions/http.exception';

export function ValidationMiddleware(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Express body parsing 체크 - JSON 파싱 이슈 대응
    if (req.body === undefined || req.body === null) {
      return next(new HttpException(400, 'Request body is required'));
    }

    // 빈 객체나 잘못된 JSON 형식 체크
    if (typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
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
