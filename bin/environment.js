import { randomBytes } from 'node:crypto';
import path from 'node:path';

import fs from 'fs-extra';

export async function ensureEnvironmentFile(projectDir) {
  const envPath = path.join(projectDir, '.env');
  const examplePath = path.join(projectDir, '.env.example');

  if ((await fs.pathExists(envPath)) || !(await fs.pathExists(examplePath))) {
    return false;
  }

  const example = await fs.readFile(examplePath, 'utf8');
  const environment = example.replace(
    /^(\s*)(SECRET_KEY|JWT_SECRET)\s*=.*$/gm,
    (_line, indentation, key) => `${indentation}${key}=${randomBytes(32).toString('hex')}`,
  );

  await fs.writeFile(envPath, environment, { flag: 'wx', mode: 0o600 });
  return true;
}
