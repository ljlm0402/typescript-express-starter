import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import test from 'node:test';

import fs from 'fs-extra';

const execFileAsync = promisify(execFile);
const projectRoot = path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)));
const configUrl = pathToFileURL(path.join(projectRoot, 'bin/config.js')).href;

test('resolves package assets independently from the current working directory', async (t) => {
  const unrelatedDirectory = await mkdtemp(path.join(os.tmpdir(), 'tes-cwd-'));
  t.after(() => fs.remove(unrelatedDirectory));
  const script = `
    import { CONFIG } from ${JSON.stringify(configUrl)};
    console.log(JSON.stringify(CONFIG.paths));
  `;

  const { stdout } = await execFileAsync(process.execPath, ['--input-type=module', '--eval', script], {
    cwd: unrelatedDirectory,
  });
  const paths = JSON.parse(stdout.trim());

  assert.equal(paths.root, projectRoot);
  assert.equal(await fs.pathExists(paths.packageJson), true);
  assert.equal(await fs.pathExists(paths.templates), true);
  assert.equal(await fs.pathExists(paths.devtools), true);
});
