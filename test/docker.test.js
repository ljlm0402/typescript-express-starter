import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import fs from 'fs-extra';

import { generateDockerFiles } from '../bin/db-map.js';

test('Docker assets resolve independently from the current working directory', async (t) => {
  const projectDir = await mkdtemp(path.join(os.tmpdir(), 'tes-docker-'));
  const unrelatedDir = await mkdtemp(path.join(os.tmpdir(), 'tes-cwd-'));
  const originalCwd = process.cwd();
  t.after(async () => {
    process.chdir(originalCwd);
    await Promise.all([fs.remove(projectDir), fs.remove(unrelatedDir)]);
  });

  process.chdir(unrelatedDir);
  await generateDockerFiles('default', projectDir);

  for (const file of ['Dockerfile.dev', 'Dockerfile.prod', '.dockerignore', 'docker-compose.yml']) {
    assert.equal(await fs.pathExists(path.join(projectDir, file)), true, `${file} was not generated`);
  }

  const compose = await fs.readFile(path.join(projectDir, 'docker-compose.yml'), 'utf8');
  assert.match(compose, /env_file:\s+- \.env/);
  assert.doesNotMatch(compose, /nginx\.conf|\.env\.development\.local/);
});
