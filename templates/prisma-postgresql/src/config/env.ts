/**
 * 환경변수 설정 - Prisma PostgreSQL Template
 * 표준 환경변수 설정 모듈 사용
 */

import { z } from 'zod';
import { config } from 'dotenv';

// .env 파일 로드
config();

/**
 * 서버 설정 스키마
 */
const ServerConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().min(1).max(65535).default(3000),
  API_PREFIX: z.string().default('/api/v1'),
});

/**
 * JWT 설정 스키마
 */
const JWTConfigSchema = z.object({
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('24h'),
});

/**
 * PostgreSQL + Prisma 설정 스키마
 */
const DatabaseConfigSchema = z.object({
  DATABASE_URL: z.string().url(),
  DB_HOST: z.string().optional(),
  DB_PORT: z.coerce.number().optional(),
  DB_NAME: z.string().optional(),
  DB_USER: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
});

/**
 * 로깅 설정 스키마
 */
const LoggingConfigSchema = z.object({
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FORMAT: z.enum(['dev', 'combined', 'common']).default('dev'),
  LOG_DIR: z.string().default('logs'),
});

/**
 * CORS 설정 스키마
 */
const CORSConfigSchema = z.object({
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  CORS_CREDENTIALS: z.coerce.boolean().default(true),
  CORS_ORIGINS: z.string().optional(),
});

/**
 * 보안 설정 스키마
 */
const SecurityConfigSchema = z.object({
  SECRET_KEY: z.string().min(32, 'SECRET_KEY must be at least 32 characters'),
});

/**
 * Rate Limiting 설정 스키마
 */
const RateLimitConfigSchema = z.object({
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
});

/**
 * 환경변수 파싱 및 검증
 */
function parseEnvironmentConfig() {
  try {
    const server = ServerConfigSchema.parse(process.env);
    const jwt = JWTConfigSchema.parse(process.env);
    const database = DatabaseConfigSchema.parse(process.env);
    const logging = LoggingConfigSchema.parse(process.env);
    const cors = CORSConfigSchema.parse(process.env);
    const security = SecurityConfigSchema.parse(process.env);
    const rateLimit = RateLimitConfigSchema.parse(process.env);

    return {
      server,
      jwt,
      database,
      logging,
      cors,
      security,
      rateLimit,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment variable validation failed:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

/**
 * 표준 환경변수 설정 객체
 */
const env = parseEnvironmentConfig();

// 프로덕션 환경 검증
if (env.server.NODE_ENV === 'production') {
  if (env.cors.CORS_ORIGIN === '*') {
    console.warn('⚠️  Warning: CORS_ORIGIN should not be "*" in production');
  }

  if (env.jwt.JWT_SECRET.includes('your-super-secret')) {
    console.error('❌ Error: Default JWT_SECRET detected in production');
    process.exit(1);
  }
}

export const { NODE_ENV, PORT, API_PREFIX } = env.server;

export const { JWT_SECRET, JWT_EXPIRES_IN } = env.jwt;

export const { DATABASE_URL, DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = env.database;

export const { LOG_LEVEL, LOG_FORMAT, LOG_DIR } = env.logging;

export const { CORS_ORIGIN, CORS_CREDENTIALS, CORS_ORIGINS } = env.cors;

export const { SECRET_KEY } = env.security;

export const { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS } = env.rateLimit;

export { env };

/**
 * 환경변수 유틸리티 함수들
 */
export const EnvUtils = {
  isDevelopment: (): boolean => env.server.NODE_ENV === 'development',
  isProduction: (): boolean => env.server.NODE_ENV === 'production',
  isStaging: (): boolean => env.server.NODE_ENV === 'staging',
  getCORSOrigins: (): string[] => {
    if (env.cors.CORS_ORIGINS) {
      return env.cors.CORS_ORIGINS.split(',').map((origin) => origin.trim());
    }
    return [env.cors.CORS_ORIGIN];
  },
};
