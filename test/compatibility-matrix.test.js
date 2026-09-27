import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import fs from 'fs-extra';

import { DEVTOOLS_VALUES } from '../bin/common.js';
import { getCompatibilityMatrix, getMatrixId } from '../bin/compatibility-matrix.js';
import { generateProject } from '../bin/starter.js';
import { splitNameAndVersion } from '../bin/validators.js';

const OUTPUT_FILES = {
  biome: ['.biome.json', '.biomeignore'],
  eslint: ['.prettierrc', 'eslint.config.cjs'],
  oxlint: ['.oxlintrc.json', '.prettierrc'],
  tsup: ['tsup.config.ts'],
  swc: ['.swcrc'],
  jest: ['jest.config.ts', 'jest.unit.config.cjs', 'src/test'],
  vitest: ['vitest.config.ts', 'src/test'],
  docker: ['Dockerfile.dev', 'Dockerfile.prod', '.dockerignore', 'docker-compose.yml'],
};

test('generates every active template and devtool combination', async (t) => {
  const matrixRoot = await mkdtemp(path.join(os.tmpdir(), 'tes-matrix-'));
  const combinations = getCompatibilityMatrix();
  const originalLog = console.log;
  console.log = () => {};

  t.after(async () => {
    console.log = originalLog;
    await fs.remove(matrixRoot);
  });

  assert.equal(combinations.length, 36);

  for (const combination of combinations) {
    const id = getMatrixId(combination);
    const projectDir = path.join(matrixRoot, id);
    await generateProject({
      template: combination.template,
      destDir: projectDir,
      projectName: id,
      devtoolValues: combination.devtools,
      installDependencies: false,
      writeMetadata: false,
      quiet: true,
    });

    const packageJson = await fs.readJson(path.join(projectDir, 'package.json'));
    assert.equal(packageJson.name, id, `${id}: project name`);

    for (const value of combination.devtools) {
      const tool = DEVTOOLS_VALUES.find((candidate) => candidate.value === value);
      assert.ok(tool, `${id}: registered tool ${value}`);

      for (const file of OUTPUT_FILES[value]) {
        assert.equal(await fs.pathExists(path.join(projectDir, file)), true, `${id}: ${file}`);
      }

      for (const spec of [...tool.pkgs, ...tool.devPkgs]) {
        const { name } = splitNameAndVersion(spec);
        assert.ok(
          packageJson.dependencies?.[name] || packageJson.devDependencies?.[name],
          `${id}: dependency ${name}`,
        );
      }

      for (const scriptName of Object.keys(tool.scripts)) {
        assert.ok(packageJson.scripts?.[scriptName], `${id}: script ${scriptName}`);
      }
    }

    assert.equal(await fs.pathExists(path.join(projectDir, '.env')), true, `${id}: .env`);
    assert.equal(await fs.pathExists(path.join(projectDir, '.gitignore')), true, `${id}: .gitignore`);
    assert.match(
      await fs.readFile(path.join(projectDir, '.gitignore'), 'utf8'),
      /^\.env$/m,
      `${id}: .env ignored`,
    );
    assert.equal(
      await fs.pathExists(path.join(projectDir, '.env.development.local')),
      false,
      `${id}: private env file`,
    );

    const tsconfig = await fs.readJson(path.join(projectDir, 'tsconfig.json'));
    assert.equal(tsconfig.compilerOptions.types?.includes('jest') || false, combination.testing === 'jest');
    assert.equal(
      tsconfig.compilerOptions.types?.includes('vitest/globals') || false,
      combination.testing === 'vitest',
    );
    assert.ok(tsconfig.exclude?.includes('**/unit_disabled/**'), `${id}: disabled tests excluded`);

    assert.equal(await fs.pathExists(path.join(projectDir, 'tsup.config.ts')), combination.compiler === 'tsup');
    assert.equal(await fs.pathExists(path.join(projectDir, '.swcrc')), combination.compiler === 'swc');
    assert.equal(await fs.pathExists(path.join(projectDir, 'jest.config.ts')), combination.testing === 'jest');
    assert.equal(await fs.pathExists(path.join(projectDir, 'vitest.config.ts')), combination.testing === 'vitest');
  }
});
