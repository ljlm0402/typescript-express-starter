#!/usr/bin/env node

import { mkdtemp } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { execa } from 'execa';
import fs from 'fs-extra';

import { DEVTOOLS_VALUES } from '../bin/common.js';
import { getCompatibilityMatrix, getMatrixId } from '../bin/compatibility-matrix.js';
import { generateProject } from '../bin/starter.js';
import { mergePackageSpecs } from '../bin/validators.js';

const npmCli = process.env.npm_execpath;
const databaseUrl = 'postgresql://postgres:password@127.0.0.1:5432/drizzle_postgresql_dev';
const templateFlagIndex = process.argv.indexOf('--template');
const templateFilter = templateFlagIndex >= 0 ? process.argv[templateFlagIndex + 1] : null;
const matrix = getCompatibilityMatrix().filter(
  (combination) => !templateFilter || combination.template === templateFilter,
);

if (templateFilter && matrix.length === 0) {
  throw new Error(`Unknown or inactive template: ${templateFilter}`);
}

function runNpm(args, options = {}) {
  if (!npmCli) throw new Error('Run this script through npm: npm run test:matrix');
  return execa(process.execPath, [npmCli, ...args], options);
}

function createUnionPackage(templatePackage) {
  let dependencies = { ...templatePackage.dependencies };
  let devDependencies = { ...templatePackage.devDependencies };

  for (const tool of DEVTOOLS_VALUES.filter((item) =>
    ['Linter', 'Compiler', 'Testing', 'Infrastructure'].includes(item.category),
  )) {
    dependencies = mergePackageSpecs(dependencies, tool.pkgs || []);
    devDependencies = mergePackageSpecs(devDependencies, tool.devPkgs || []);
  }

  return {
    name: `matrix-runtime-${templatePackage.name}`,
    version: '1.0.0',
    private: true,
    engines: templatePackage.engines,
    dependencies,
    devDependencies,
  };
}

async function prepareSharedDependencies(matrixRoot, generatedProjects) {
  const sharedByTemplate = new Map();

  for (const { combination, projectDir } of generatedProjects) {
    if (sharedByTemplate.has(combination.template)) continue;

    const runtimeDir = path.join(matrixRoot, '_runtime', combination.template);
    const templatePackage = await fs.readJson(path.join(projectDir, 'package.json'));
    await fs.ensureDir(runtimeDir);
    await fs.writeJson(path.join(runtimeDir, 'package.json'), createUnionPackage(templatePackage), {
      spaces: 2,
    });

    console.log(`[install] ${combination.template}`);
    await runNpm(['install', '--no-audit', '--no-fund'], {
      cwd: runtimeDir,
      stdio: 'inherit',
    });
    sharedByTemplate.set(combination.template, path.join(runtimeDir, 'node_modules'));
  }

  for (const { combination, projectDir } of generatedProjects) {
    await fs.symlink(sharedByTemplate.get(combination.template), path.join(projectDir, 'node_modules'));
  }
}

async function startPostgres(drizzleProject) {
  const composeArgs = ['compose', '-p', 'tes-matrix', '-f', 'docker-compose.yml'];
  const composeEnv = {
    ...process.env,
    POSTGRES_DB: 'drizzle_postgresql_dev',
    POSTGRES_USER: 'postgres',
    POSTGRES_PASSWORD: 'password',
  };

  await execa('docker', [...composeArgs, 'up', '-d', 'postgres'], {
    cwd: drizzleProject,
    env: composeEnv,
    stdio: 'inherit',
  });

  for (let attempt = 0; attempt < 30; attempt += 1) {
    const result = await execa(
      'docker',
      [
        ...composeArgs,
        'exec',
        '-T',
        'postgres',
        'pg_isready',
        '-U',
        'postgres',
        '-d',
        'drizzle_postgresql_dev',
      ],
      { cwd: drizzleProject, env: composeEnv, reject: false },
    );
    if (result.exitCode === 0) break;
    if (attempt === 29) throw new Error('PostgreSQL did not become ready');
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  await execa(path.join(drizzleProject, 'node_modules', '.bin', 'drizzle-kit'), ['push', '--force'], {
    cwd: drizzleProject,
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'inherit',
  });

  return async () => {
    await execa('docker', [...composeArgs, 'down', '-v'], {
      cwd: drizzleProject,
      env: composeEnv,
      stdio: 'inherit',
      reject: false,
    });
  };
}

async function runCombination(combination, projectDir) {
  const id = getMatrixId(combination);
  const env = {
    ...process.env,
    NODE_ENV: 'test',
    LOG_LEVEL: 'error',
    DATABASE_URL: databaseUrl,
  };

  const commands = [
    ['check', ['run', 'check']],
    ['lint', ['run', 'lint']],
    ['build', ['run', 'build']],
    ['test', ['test']],
  ];

  for (const [phase, args] of commands) {
    process.stdout.write(`[${phase}] ${id}\n`);
    try {
      await runNpm(args, { cwd: projectDir, env, stdio: 'pipe' });
    } catch (error) {
      const output = [error.stdout, error.stderr].filter(Boolean).join('\n');
      throw new Error(`${phase} failed for ${id}${output ? `\n${output}` : ''}`, {
        cause: error,
      });
    }
  }

  try {
    await execa('docker', ['compose', '-f', 'docker-compose.yml', 'config', '-q'], {
      cwd: projectDir,
      env,
      stdio: 'pipe',
    });
  } catch (error) {
    const output = [error.stdout, error.stderr].filter(Boolean).join('\n');
    throw new Error(`docker config failed for ${id}${output ? `\n${output}` : ''}`, {
      cause: error,
    });
  }
}

async function main() {
  const matrixRoot = await mkdtemp(path.join(os.tmpdir(), 'tes-runtime-matrix-'));
  const generatedProjects = [];
  let stopPostgres = async () => {};

  try {
    console.log(`[matrix] generating ${matrix.length} combinations in ${matrixRoot}`);
    const originalLog = console.log;
    try {
      console.log = () => {};
      for (const combination of matrix) {
        const projectDir = path.join(matrixRoot, getMatrixId(combination));
        await generateProject({
          template: combination.template,
          destDir: projectDir,
          projectName: getMatrixId(combination),
          devtoolValues: combination.devtools,
          installDependencies: false,
          writeMetadata: false,
          quiet: true,
        });
        generatedProjects.push({ combination, projectDir });
      }
    } finally {
      console.log = originalLog;
    }

    await prepareSharedDependencies(matrixRoot, generatedProjects);
    const drizzleProject = generatedProjects.find(
      ({ combination }) => combination.template === 'drizzle-postgresql',
    )?.projectDir;
    if (drizzleProject) stopPostgres = await startPostgres(drizzleProject);

    for (const { combination, projectDir } of generatedProjects) {
      await runCombination(combination, projectDir);
    }

    console.log(`[matrix] all ${matrix.length} combinations passed`);
  } finally {
    await stopPostgres();
    if (!process.argv.includes('--keep')) await fs.remove(matrixRoot);
    else console.log(`[matrix] artifacts kept at ${matrixRoot}`);
  }
}

main().catch((error) => {
  console.error(error.shortMessage || error.message);
  if (error.stderr) console.error(error.stderr);
  process.exitCode = 1;
});
