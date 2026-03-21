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
 * 2) Zod 스키마 정의
 *    - 필수/선택/기본값 정책은 필요에 맞게 수정 가능
 */
const EnvSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().int().positive().optional(), // 기본값은 app.ts에서 3000 처리

    DATABASE_URL: z.string().url().min(1),

    SECRET_KEY: z.string().min(1),
    JWT_SECRET: z.string().min(1),
    JWT_EXPIRES_IN: z.string().default('24h'),

    LOG_FORMAT: z.string().min(1).optional(), // 기본값은 app.ts에서 'dev'
    LOG_DIR: z.string().min(1),
    LOG_LEVEL: z.string().min(1),

    ORIGIN: z.string().min(1), // 필요시 배열화 가능
    CREDENTIALS: z.coerce.boolean(), // 'true'/'false' 문자열 → boolean
    CORS_ORIGINS: z.string().optional(), // "http://a.com,http://b.com"

    API_SERVER_URL: z.string().url().optional(),

    SENTRY_DSN: z.string().default(''),
    REDIS_URL: z.string().url().default('redis://localhost:6379'),
  })
  .strip();

/**
 * 3) 검증(모듈 import 시점에 실행)
 */
const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('\n❌ Invalid environment variables:\n');
  console.error(parsed.error.format());
  process.exit(1);
}
const env = parsed.data;

// env 객체도 export (필요시 사용)
export { env };

/**
 * 4) 타입 안전한 상수 export
 *    - 다른 파일에서는 process.env 직접 쓰지 말고 여기서만 가져가세요.
 */
export const NODE_ENV = env.NODE_ENV;
export const PORT = env.PORT; // app.ts에서 PORT || 3000
export const DATABASE_URL = env.DATABASE_URL;
export const SECRET_KEY = env.SECRET_KEY;
export const JWT_SECRET = env.JWT_SECRET;
export const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN;

export const LOG_FORMAT = env.LOG_FORMAT; // app.ts에서 LOG_FORMAT || 'dev'
export const LOG_DIR = env.LOG_DIR;
export const LOG_LEVEL = env.LOG_LEVEL;

export const ORIGIN = env.ORIGIN;
export const CREDENTIALS = env.CREDENTIALS;

export const SENTRY_DSN = env.SENTRY_DSN;
export const REDIS_URL = env.REDIS_URL;
export const API_SERVER_URL = env.API_SERVER_URL;

// CORS Origins를 배열로도 제공 (없으면 [])
export const CORS_ORIGIN_LIST =
  env.CORS_ORIGINS?.split(',')
    .map((s: string) => s.trim())
    .filter(Boolean) ?? [];
