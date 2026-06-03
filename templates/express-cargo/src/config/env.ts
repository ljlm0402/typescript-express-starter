import { config } from 'dotenv';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

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
 * 2) 환경변수 검증 헬퍼
 *    - 의존성 없이 직접 파싱/검증하며, 실패 항목을 모았다가 한 번에 보고합니다.
 */
const errors: string[] = [];

function requireString(key: string): string {
  const value = process.env[key];
  if (!value) {
    errors.push(`${key} is required`);
    return '';
  }
  return value;
}

function optionalString(key: string): string | undefined {
  const value = process.env[key];
  return value && value.length > 0 ? value : undefined;
}

function stringWithDefault(key: string, defaultValue: string): string {
  const value = process.env[key];
  return value && value.length > 0 ? value : defaultValue;
}

function optionalPort(key: string): number | undefined {
  const raw = process.env[key];
  if (!raw) return undefined;
  const num = Number(raw);
  if (!Number.isInteger(num) || num <= 0) {
    errors.push(`${key} must be a positive integer`);
    return undefined;
  }
  return num;
}

function requireBoolean(key: string): boolean {
  const raw = process.env[key];
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  errors.push(`${key} must be 'true' or 'false'`);
  return false;
}

function parseNodeEnv(): 'development' | 'production' | 'test' {
  const raw = process.env.NODE_ENV || 'development';
  if (raw === 'development' || raw === 'production' || raw === 'test') {
    return raw;
  }
  errors.push(`NODE_ENV must be one of: development, production, test`);
  return 'development';
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function optionalUrl(key: string): string | undefined {
  const raw = process.env[key];
  if (!raw) return undefined;
  if (!isValidUrl(raw)) {
    errors.push(`${key} must be a valid URL`);
    return undefined;
  }
  return raw;
}

function urlWithDefault(key: string, defaultValue: string): string {
  const raw = process.env[key];
  if (!raw) return defaultValue;
  if (!isValidUrl(raw)) {
    errors.push(`${key} must be a valid URL`);
    return defaultValue;
  }
  return raw;
}

/**
 * 3) 검증 실행 (모듈 import 시점)
 *    - 필수/선택/기본값 정책은 필요에 맞게 수정 가능
 */
const parsedNodeEnv = parseNodeEnv();
const parsedPort = optionalPort('PORT'); // 기본값은 app.ts에서 3000 처리
const parsedSecretKey = requireString('SECRET_KEY');
const parsedLogFormat = optionalString('LOG_FORMAT'); // 기본값은 app.ts에서 'dev'
const parsedLogDir = requireString('LOG_DIR');
const parsedLogLevel = requireString('LOG_LEVEL');
const parsedOrigin = requireString('ORIGIN'); // 필요시 배열화 가능
const parsedCredentials = requireBoolean('CREDENTIALS'); // 'true'/'false' 문자열 → boolean
const parsedCorsOrigins = optionalString('CORS_ORIGINS'); // "http://a.com,http://b.com"
const parsedApiServerUrl = optionalUrl('API_SERVER_URL');
const parsedSentryDsn = stringWithDefault('SENTRY_DSN', '');
const parsedRedisUrl = urlWithDefault('REDIS_URL', 'redis://localhost:6379');

if (errors.length > 0) {
  console.error('\n❌ Invalid environment variables:\n');
  for (const message of errors) {
    console.error(`  - ${message}`);
  }
  process.exit(1);
}

/**
 * 4) 타입 안전한 상수 export
 *    - 다른 파일에서는 process.env 직접 쓰지 말고 여기서만 가져가세요.
 */
export const NODE_ENV = parsedNodeEnv;
export const PORT = parsedPort; // app.ts에서 PORT || 3000
export const SECRET_KEY = parsedSecretKey;

export const LOG_FORMAT = parsedLogFormat; // app.ts에서 LOG_FORMAT || 'dev'
export const LOG_DIR = parsedLogDir;
export const LOG_LEVEL = parsedLogLevel;

export const ORIGIN = parsedOrigin;
export const CREDENTIALS = parsedCredentials;

export const SENTRY_DSN = parsedSentryDsn;
export const REDIS_URL = parsedRedisUrl;
export const API_SERVER_URL = parsedApiServerUrl;

// CORS Origins를 배열로도 제공 (없으면 [])
export const CORS_ORIGIN_LIST =
  parsedCorsOrigins?.split(',')
    .map((s) => s.trim())
    .filter(Boolean) ?? [];