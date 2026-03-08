import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  outDir: 'dist',
  format: ['cjs'],
  target: 'node18',
  clean: true,
  sourcemap: true,
  minify: false,
  splitting: false,
  dts: false,
  bundle: true,
  treeshake: true,
  external: [
    'express',
    'cors',
    'helmet',
    'compression',
    'morgan',
    'dotenv',
    'bcryptjs',
    'jsonwebtoken',
    'hpp',
    'express-rate-limit',
    'cookie-parser',
    'reflect-metadata',
    'tsyringe',
    'pino',
    'pino-pretty',
    'pino-roll',
    'zod',
    'tslib',
  ],
  onSuccess: async () => {
    console.log('✅ TSup 빌드 완료');
  },
});
