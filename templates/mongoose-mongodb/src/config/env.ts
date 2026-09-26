/**
 * 환경변수 설정 - Mongoose MongoDB Template
 * 표준 환경변수 설정 모듈 사용
 */

import { config } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { z } from 'zod';

/**
 * 1) dotenv 로드 순서
 *    - .env (공통)
 *    - .env.{NODE_ENV}.local (환경별 override, 있으면 덮어씀)
 */
config(); // .env
const nodeEnv = process.env.NODE_ENV || 'development';
const layerPath = resolve(process.cwd(), `.env.${nodeEnv}.local`);
if (existsSync(layerPath)) {
  config({ path: layerPath });
}

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
  JWT_REFRESH_SECRET: z.string().optional(),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
});

/**
 * MongoDB + Mongoose 설정 스키마
 */
const DatabaseConfigSchema = z.object({
  MONGODB_URL: z.string().url(),
  MONGO_HOST: z.string().optional(),
  MONGO_PORT: z.coerce.number().optional(),
  MONGO_DB: z.string().optional(),
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
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().positive().default(12),
});

/**
 * Rate Limiting 설정 스키마
 */
const RateLimitConfigSchema = z.object({
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
});

/**
 * 외부 서비스 설정 스키마 (선택사항)
 */
const ExternalServicesConfigSchema = z
  .object({
    REDIS_URL: z.string().optional(),
    API_SERVER_URL: z.string().optional(),
    SENTRY_DSN: z.string().optional(),
  })
  .optional();

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
    const externalServices = ExternalServicesConfigSchema.parse(process.env);

    return {
      server,
      jwt,
      database,
      logging,
      cors,
      security,
      rateLimit,
      externalServices,
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

// Backward compatibility exports (기존 코드와 호환성 유지)
export const NODE_ENV = env.server.NODE_ENV;
export const PORT = env.server.PORT;
export const API_PREFIX = env.server.API_PREFIX;
export const SECRET_KEY = env.security.SECRET_KEY;

// MongoDB - backward compatibility (MONGODB_URI -> MONGODB_URL)
export const MONGODB_URI = env.database.MONGODB_URL; // 기존 변수명 유지
export const MONGODB_URL = env.database.MONGODB_URL;
export const MONGO_HOST = env.database.MONGO_HOST;
export const MONGO_PORT = env.database.MONGO_PORT;
export const MONGO_DB = env.database.MONGO_DB;

// JWT
export const JWT_SECRET = env.jwt.JWT_SECRET;
export const JWT_EXPIRES_IN = env.jwt.JWT_EXPIRES_IN;
export const JWT_REFRESH_SECRET = env.jwt.JWT_REFRESH_SECRET;
export const JWT_REFRESH_EXPIRES_IN = env.jwt.JWT_REFRESH_EXPIRES_IN;

// Security
export const BCRYPT_SALT_ROUNDS = env.security.BCRYPT_SALT_ROUNDS;

// Logging
export const LOG_FORMAT = env.logging.LOG_FORMAT;
export const LOG_DIR = env.logging.LOG_DIR;
export const LOG_LEVEL = env.logging.LOG_LEVEL;

// CORS - backward compatibility (ORIGIN -> CORS_ORIGIN)
export const ORIGIN = env.cors.CORS_ORIGIN; // 기존 변수명 유지
export const CORS_ORIGIN = env.cors.CORS_ORIGIN;
export const CREDENTIALS = env.cors.CORS_CREDENTIALS; // 기존 변수명 유지
export const CORS_CREDENTIALS = env.cors.CORS_CREDENTIALS;

// External Services
export const SENTRY_DSN = env.externalServices?.SENTRY_DSN || '';
export const REDIS_URL = env.externalServices?.REDIS_URL || 'redis://localhost:6379';
export const API_SERVER_URL = env.externalServices?.API_SERVER_URL;

// Rate Limiting
export const RATE_LIMIT_WINDOW_MS = env.rateLimit.RATE_LIMIT_WINDOW_MS;
export const RATE_LIMIT_MAX_REQUESTS = env.rateLimit.RATE_LIMIT_MAX_REQUESTS;

// CORS Origins를 배열로도 제공
export const CORS_ORIGIN_LIST = env.cors.CORS_ORIGINS?.split(',')
  .map((s) => s.trim())
  .filter(Boolean) ?? [env.cors.CORS_ORIGIN];

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
