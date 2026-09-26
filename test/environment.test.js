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
