import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import pino from 'pino';
import { LOG_DIR, LOG_LEVEL, NODE_ENV } from '@config/env';

const isProduction = NODE_ENV === 'production';
const logDir = join(process.cwd(), LOG_DIR || 'logs');

if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true });
}

const transport = pino.transport({
  targets: isProduction
    ? [
        {
          target: 'pino-roll',
          level: LOG_LEVEL || 'info',
          options: {
            file: join(logDir, 'app'),
            frequency: 'daily',
            size: '50m',
            extension: '.log',
            mkdir: true,
            limit: { count: 30 },
          },
        },
      ]
    : [
        {
          target: 'pino-pretty',
          level: LOG_LEVEL || 'info',
          options: { colorize: true, translateTime: 'SYS:standard', ignore: 'pid,hostname' },
        },
      ],
});

const baseLogger = pino(
  {
    level: LOG_LEVEL || 'info',
    base: undefined,
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: ['req.headers.authorization', 'password', 'token'],
  },
  transport,
);

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

function writeLog(level: LogLevel, first: unknown, second?: unknown, ...args: unknown[]): void {
  if (typeof first === 'string') {
    const context = second && typeof second === 'object' ? second : { detail: second };
    baseLogger[level](context, first, ...args);
    return;
  }

  baseLogger[level](first ?? {}, typeof second === 'string' ? second : undefined, ...args);
}

export const logger = {
  debug: (first: unknown, second?: unknown, ...args: unknown[]) =>
    writeLog('debug', first, second, ...args),
  info: (first: unknown, second?: unknown, ...args: unknown[]) =>
    writeLog('info', first, second, ...args),
  warn: (first: unknown, second?: unknown, ...args: unknown[]) =>
    writeLog('warn', first, second, ...args),
  error: (first: unknown, second?: unknown, ...args: unknown[]) =>
    writeLog('error', first, second, ...args),
  fatal: (first: unknown, second?: unknown, ...args: unknown[]) =>
    writeLog('fatal', first, second, ...args),
};

export const stream = { write: (message: string) => logger.info(message.trim()) };
