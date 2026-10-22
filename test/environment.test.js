import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import fs from 'fs-extra';

import { ensureEnvironmentFile } from '../bin/environment.js';

test('creates .env from .env.example when .env is missing', async (t) => {
  const projectDir = await mkdtemp(path.join(os.tmpdir(), 'tes-env-'));
  t.after(() => fs.remove(projectDir));
  await fs.writeFile(path.join(projectDir, '.env.example'), 'PORT=3000\n');

  const created = await ensureEnvironmentFile(projectDir);

  assert.equal(created, true);
  assert.equal(await fs.readFile(path.join(projectDir, '.env'), 'utf8'), 'PORT=3000\n');
});

test('does not overwrite an existing .env', async (t) => {
  const projectDir = await mkdtemp(path.join(os.tmpdir(), 'tes-env-'));
  t.after(() => fs.remove(projectDir));
  await fs.writeFile(path.join(projectDir, '.env.example'), 'PORT=3000\n');
  await fs.writeFile(path.join(projectDir, '.env'), 'PORT=4000\n');

  const created = await ensureEnvironmentFile(projectDir);

  assert.equal(created, false);
  assert.equal(await fs.readFile(path.join(projectDir, '.env'), 'utf8'), 'PORT=4000\n');
});

test('replaces example secrets with independent random values', async (t) => {
  const projectDir = await mkdtemp(path.join(os.tmpdir(), 'tes-env-'));
  t.after(() => fs.remove(projectDir));
  const example = [
    'SECRET_KEY=your-secret-key # replace in production',
    'JWT_SECRET="your-secret-key"',
    'PORT=3000',
    '',
  ].join('\n');
  await fs.writeFile(path.join(projectDir, '.env.example'), example);

  await ensureEnvironmentFile(projectDir);

  const environment = await fs.readFile(path.join(projectDir, '.env'), 'utf8');
  const secretKey = environment.match(/^SECRET_KEY=([a-f0-9]{64})$/m)?.[1];
  const jwtSecret = environment.match(/^JWT_SECRET=([a-f0-9]{64})$/m)?.[1];
  assert.ok(secretKey);
  assert.ok(jwtSecret);
  assert.notEqual(secretKey, jwtSecret);
  assert.equal(environment.includes('your-secret-key'), false);
  assert.equal(await fs.readFile(path.join(projectDir, '.env.example'), 'utf8'), example);
});
