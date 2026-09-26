/**
 * 로거 설정 - Mongoose MongoDB Template
 * 표준 로깅 설정을 사용합니다.
 */

import { 
  createStandardLogger, 
  createAccessLogger, 
  StandardLogConfig,
  LogLevels
} from '../../../shared-standards/standard-logging.config';
import { LOG_DIR, LOG_LEVEL, NODE_ENV } from '@config/env';

// 로그 설정
const logConfig: StandardLogConfig = {
  level: LOG_LEVEL || 'info',
  directory: LOG_DIR || 'logs',
  isDevelopment: NODE_ENV === 'development',
  isProduction: NODE_ENV === 'production',
};

// 메인 애플리케이션 로거
export const logger = createStandardLogger(logConfig);

// HTTP 액세스 로거
export const accessLogger = createAccessLogger(logConfig);

// 로그 레벨 상수 (하위 호환성)
export { LogLevels };

/**
 * 표준 로그 컨텍스트 인터페이스
 */
export interface LogContext {
  operation?: string;
  userId?: string;
  requestId?: string;
  email?: string;
  duration?: number;
  metadata?: Record<string, any>;
}

/**
 * 표준 로거 클래스 (기존 StandardLogger와 호환)
 */
export class StandardLogger {
  private logger = logger;

  info(message: string, context?: LogContext): void {
    this.logger.info({ ...context }, message);
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn({ ...context }, message);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.logger.error({ 
      ...context, 
      error: error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : undefined 
    }, message);
  }

  debug(message: string, context?: LogContext): void {
    this.logger.debug({ ...context }, message);
  }

  fatal(message: string, error?: Error, context?: LogContext): void {
    this.logger.fatal({ 
      ...context, 
      error: error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : undefined 
    }, message);
  }

  // 성능 로깅을 위한 헬퍼 메서드
  logOperation(operation: string, startTime: number, context?: Omit<LogContext, 'operation' | 'duration'>): void {
    const duration = Date.now() - startTime;
    this.info(`${operation} completed`, {
      operation,
      duration,
      ...context,
    });
  }

  // 에러 로깅을 위한 헬퍼 메서드
  logError(operation: string, error: Error, context?: Omit<LogContext, 'operation'>): void {
    this.error(`${operation} failed`, error, {
      operation,
      ...context,
    });
  }
}

// 기본 로거 인스턴스 (하위 호환성)
export const standardLogger = new StandardLogger();