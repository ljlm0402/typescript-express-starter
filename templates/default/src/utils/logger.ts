import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import pino from 'pino';
import { LOG_DIR, LOG_LEVEL, NODE_ENV } from '@config/env';

// 로그 환경 설정
const isProd = NODE_ENV === 'production';
const logRoot = LOG_DIR || 'logs';
const logLevel = LOG_LEVEL || 'info';

// 현재 런타임 위치(프로젝트 실행 디렉토리)에 logs 폴더 생성
const projectRoot = process.cwd(); // 현재 프로세스 실행 디렉토리
const logDir = join(projectRoot, logRoot);

// 로그 디렉토리 생성 (에러 핸들링 포함)
if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true });
  // console.log(`[Logger Init] Created log directory: ${logDir}`);
} else {
  // console.log(`[Logger Init] Log directory already exists: ${logDir}`);
}

// 파일 로깅용 경로
const prodFile = join(logDir, 'app');
const devFile = join(logDir, 'app.dev');
const errorFile = join(logDir, 'error');

// Pino 인스턴스
const transport = pino.transport({
  targets: isProd
    ? [
        // prod: 일자/용량 기반 롤링 + 30일 보관 (전체 로그)
        {
          target: 'pino-roll',
          level: logLevel,
          options: {
            file: prodFile, // 최종 파일: app.2025-08-29.log 등
            frequency: 'daily', // 'daily' | 'hourly' | number(ms)
            size: '50m', // 용량 기준 분할
            dateFormat: 'yyyy-MM-dd',
            extension: '.log',
            mkdir: true,
            symlink: false, // 심볼릭 링크 비활성화로 충돌 방지
            limit: { count: 30 }, // 30개 보관
            // limit: { count: 30, removeOtherLogFiles: false }, // PM2/클러스터면 주의
          },
        },
        // prod: 에러 전용 파일 (보관 60일 등 별도 정책 가능)
        {
          target: 'pino-roll',
          level: 'error',
          options: {
            file: errorFile,
            frequency: 'daily',
            size: '50m',
            dateFormat: 'yyyy-MM-dd',
            extension: '.log',
            mkdir: true,
            symlink: false, // 심볼릭 링크 비활성화로 충돌 방지
            limit: { count: 60 },
          },
        },
      ]
    : [
        // dev: 예쁜 콘솔 출력
        {
          target: 'pino-pretty',
          level: logLevel,
          options: {
            colorize: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
        // dev: 파일도 같이 굴리고 싶다면(선택) — 필요 없으면 이 블록을 지워도 됨
        {
          target: 'pino-roll',
          level: logLevel,
          options: {
            file: devFile,
            frequency: 'daily',
            size: '20m',
            dateFormat: 'yyyy-MM-dd',
            extension: '.log',
            mkdir: true,
            symlink: true,
            limit: { count: 7 },
          },
        },
      ],
});

// ── Logger 인스턴스
export const logger = pino(
  {
    level: logLevel,
    base: undefined,
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
      paths: ['req.headers.authorization', 'password', 'token'],
      censor: '[REDACTED]',
    },
  },
  transport,
);

// morgan stream
export const stream = { write: (msg: string) => logger.info(msg.trim()) };
