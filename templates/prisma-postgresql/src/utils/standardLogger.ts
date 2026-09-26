/**
 * 표준 로깅 인터페이스 및 유틸리티
 * 모든 템플릿에서 일관된 로깅 형식과 패턴을 위한 공통 정의
 */

import { logger as pinoLogger } from '@utils/logger';

/**
 * 로그 컨텍스트 정보
 */
export interface LogContext {
  /** 요청 ID (추적 용도) */
  requestId?: string;
  /** 사용자 ID */
  userId?: string;
  /** 세션 ID */
  sessionId?: string;
  /** 서비스/모듈 명 */
  module?: string;
  /** 메서드/함수 명 */
  method?: string;
  /** 실행 시간 (밀리초) */
  duration?: number;
  /** 추가 메타데이터 */
  metadata?: Record<string, any>;
}

/**
 * HTTP 요청 로그 컨텍스트
 */
export interface HttpLogContext extends LogContext {
  /** HTTP 메서드 */
  httpMethod?: string;
  /** 요청 URL */
  url?: string;
  /** HTTP 상태 코드 */
  statusCode?: number;
  /** 클라이언트 IP */
  clientIp?: string;
  /** User Agent */
  userAgent?: string;
  /** 요청 본문 크기 */
  requestSize?: number;
  /** 응답 본문 크기 */
  responseSize?: number;
}

/**
 * 데이터베이스 작업 로그 컨텍스트
 */
export interface DatabaseLogContext extends LogContext {
  /** 쿼리 타입 (SELECT, INSERT, UPDATE, DELETE) */
  queryType?: string;
  /** 테이블/컬렉션 명 */
  table?: string;
  /** 영향받은 레코드 수 */
  affectedRows?: number;
  /** 쿼리 실행 시간 */
  queryTime?: number;
  /** 트랜잭션 ID */
  transactionId?: string;
}

/**
 * 인증 관련 로그 컨텍스트
 */
export interface AuthLogContext extends LogContext {
  /** 인증 타입 (login, logout, token_verify) */
  authType?: string;
  /** 로그인 성공/실패 */
  success?: boolean;
  /** 실패 사유 */
  reason?: string;
  /** 클라이언트 정보 */
  clientInfo?: Record<string, any>;
}

/**
 * 로그 레벨별 사용 가이드라인
 */
export enum LogLevel {
  /** 디버깅 정보 (개발 전용) */
  DEBUG = 'debug',
  /** 일반 정보 (주요 비즈니스 로직 실행) */
  INFO = 'info',
  /** 경고 (복구 가능한 문제) */
  WARN = 'warn',
  /** 에러 (서비스 장애로 이어질 수 있는 문제) */
  ERROR = 'error',
  /** 치명적 오류 (서비스 중단) */
  FATAL = 'fatal',
}

/**
 * 표준화된 로그 메시지 포맷터
 */
export class StandardLogger {
  /**
   * HTTP 요청 시작 로그
   */
  static httpStart(context: HttpLogContext): void {
    pinoLogger.info(`HTTP ${context.httpMethod} ${context.url} started`, {
      type: 'HTTP_REQUEST_START',
      httpMethod: context.httpMethod,
      url: context.url,
      clientIp: context.clientIp,
      userAgent: context.userAgent,
      requestId: context.requestId,
      userId: context.userId,
    });
  }

  /**
   * HTTP 요청 완료 로그
   */
  static httpComplete(context: HttpLogContext): void {
    const level = context.statusCode && context.statusCode >= 400 ? 'warn' : 'info';
    pinoLogger[level](`HTTP ${context.httpMethod} ${context.url} completed`, {
      type: 'HTTP_REQUEST_COMPLETE',
      httpMethod: context.httpMethod,
      url: context.url,
      statusCode: context.statusCode,
      duration: context.duration,
      requestSize: context.requestSize,
      responseSize: context.responseSize,
      requestId: context.requestId,
      userId: context.userId,
    });
  }

  /**
   * 사용자 작업 로그
   */
  static userAction(action: string, context: LogContext): void {
    pinoLogger.info(`User action: ${action}`, {
      type: 'USER_ACTION',
      action,
      userId: context.userId,
      sessionId: context.sessionId,
      module: context.module,
      method: context.method,
      duration: context.duration,
      metadata: context.metadata,
    });
  }

  /**
   * 데이터베이스 작업 로그
   */
  static databaseOperation(operation: string, context: DatabaseLogContext): void {
    pinoLogger.info(`Database ${operation}`, {
      type: 'DATABASE_OPERATION',
      operation,
      queryType: context.queryType,
      table: context.table,
      affectedRows: context.affectedRows,
      queryTime: context.queryTime,
      transactionId: context.transactionId,
      module: context.module,
      method: context.method,
    });
  }

  /**
   * 인증 관련 로그
   */
  static authentication(context: AuthLogContext): void {
    const level = context.success ? 'info' : 'warn';
    pinoLogger[level](`Authentication ${context.authType}`, {
      type: 'AUTHENTICATION',
      authType: context.authType,
      success: context.success,
      reason: context.reason,
      userId: context.userId,
      clientInfo: context.clientInfo,
      duration: context.duration,
    });
  }

  /**
   * 비즈니스 로직 시작 로그
   */
  static businessStart(operation: string, context: LogContext): void {
    pinoLogger.debug(`Business operation started: ${operation}`, {
      type: 'BUSINESS_START',
      operation,
      module: context.module,
      method: context.method,
      userId: context.userId,
      requestId: context.requestId,
      metadata: context.metadata,
    });
  }

  /**
   * 비즈니스 로직 완료 로그
   */
  static businessComplete(operation: string, context: LogContext): void {
    pinoLogger.info(`Business operation completed: ${operation}`, {
      type: 'BUSINESS_COMPLETE',
      operation,
      module: context.module,
      method: context.method,
      duration: context.duration,
      userId: context.userId,
      requestId: context.requestId,
      metadata: context.metadata,
    });
  }

  /**
   * 에러 로그
   */
  static error(message: string, error: Error, context: LogContext): void {
    pinoLogger.error(message, {
      type: 'ERROR',
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      module: context.module,
      method: context.method,
      userId: context.userId,
      requestId: context.requestId,
      metadata: context.metadata,
    });
  }

  /**
   * 성능 메트릭 로그
   */
  static performance(metric: string, value: number, context: LogContext): void {
    pinoLogger.info(`Performance metric: ${metric}`, {
      type: 'PERFORMANCE_METRIC',
      metric,
      value,
      unit: 'ms',
      module: context.module,
      method: context.method,
      userId: context.userId,
      requestId: context.requestId,
    });
  }

  /**
   * 보안 관련 로그
   */
  static security(
    event: string,
    context: LogContext & { severity?: 'low' | 'medium' | 'high' },
  ): void {
    pinoLogger.warn(`Security event: ${event}`, {
      type: 'SECURITY_EVENT',
      event,
      severity: context.severity || 'medium',
      userId: context.userId,
      requestId: context.requestId,
      metadata: context.metadata,
    });
  }
}

/**
 * 성능 측정 데코레이터
 */
export function LogPerformance(operation?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const start = Date.now();
      const operationName = operation || `${target.constructor.name}.${propertyKey}`;

      try {
        StandardLogger.businessStart(operationName, {
          module: target.constructor.name,
          method: propertyKey,
        });

        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - start;

        StandardLogger.businessComplete(operationName, {
          module: target.constructor.name,
          method: propertyKey,
          duration,
        });

        StandardLogger.performance(operationName, duration, {
          module: target.constructor.name,
          method: propertyKey,
        });

        return result;
      } catch (error) {
        const duration = Date.now() - start;

        StandardLogger.error(`${operationName} failed`, error as Error, {
          module: target.constructor.name,
          method: propertyKey,
          duration,
        });

        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * 로깅 유틸리티 함수들
 */
export const LogUtils = {
  /**
   * 요청 ID 생성
   */
  generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * 로그 컨텍스트에서 민감한 정보 제거
   */
  sanitizeContext(context: LogContext): LogContext {
    const sanitized = { ...context };

    if (sanitized.metadata) {
      const { password, token, secret, ...safeMeta } = sanitized.metadata;
      sanitized.metadata = safeMeta;
    }

    return sanitized;
  },

  /**
   * 에러 객체를 로그 친화적 형식으로 변환
   */
  serializeError(error: Error): Record<string, any> {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...((error as any).code && { code: (error as any).code }),
    };
  },
};
