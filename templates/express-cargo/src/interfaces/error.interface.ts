/**
 * 표준 에러 응답 인터페이스
 * 모든 템플릿에서 동일한 에러 응답 형식을 위한 공통 인터페이스
 */

export interface StandardErrorResponse {
  success: false;
  error: {
    code: number;
    message: string;
    details?: unknown;
    timestamp: string;
    path: string;
  };
}

/**
 * HTTP 상태 코드별 에러 메시지 매핑
 */
export const HTTP_ERROR_MESSAGES = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  500: 'Internal Server Error',
  503: 'Service Unavailable',
} as const;

/**
 * 에러 타입 분류
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  CONFLICT = 'CONFLICT_ERROR',
  DATABASE = 'DATABASE_ERROR',
  INTERNAL = 'INTERNAL_ERROR',
}

/**
 * 검증 에러 세부 정보
 */
export interface ValidationErrorDetail {
  field: string;
  message: string;
  value?: unknown;
}
