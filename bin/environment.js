import path from 'node:path';

import fs from 'fs-extra';

export async function ensureEnvironmentFile(projectDir) {
  const envPath = path.join(projectDir, '.env');
  const examplePath = path.join(projectDir, '.env.example');

  if ((await fs.pathExists(envPath)) || !(await fs.pathExists(examplePath))) {
    return false;
  }

  await fs.copy(examplePath, envPath, { overwrite: false });
  return true;
}
