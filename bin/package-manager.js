import fs from 'fs';
import path from 'path';

export function detectPackageManager(projectPath = process.cwd()) {
  const lockfiles = [
    { file: 'pnpm-lock.yaml', manager: 'pnpm' },
    { file: 'yarn.lock', manager: 'yarn' },
    { file: 'package-lock.json', manager: 'npm' },
    { file: 'npm-shrinkwrap.json', manager: 'npm' },
  ];

  for (const { file, manager } of lockfiles) {
    if (fs.existsSync(path.join(projectPath, file))) {
      return manager;
    }
  }

  const packageJsonPath = path.join(projectPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const packageManager = String(packageJson.packageManager || '').split('@')[0];
      if (['npm', 'pnpm', 'yarn'].includes(packageManager)) {
        return packageManager;
      }
    } catch {
      // Fall back to npm when package.json cannot be read.
    }
  }

  return 'npm';
}

export function getInstallCommand(packageManager) {
  return packageManager === 'yarn' ? ['install', '--non-interactive'] : ['install'];
}

export function getRunCommand(packageManager, scriptName) {
  return packageManager === 'yarn' ? [scriptName] : ['run', scriptName];
}

export function getExecCommand(packageManager, binaryName, args = []) {
  if (packageManager === 'pnpm') return ['exec', binaryName, ...args];
  if (packageManager === 'yarn') return [binaryName, ...args];
  return ['exec', binaryName, ...args];
}

export function getAuditCommand(packageManager) {
  if (packageManager === 'pnpm') return ['audit', '--json'];
  if (packageManager === 'yarn') return ['npm', 'audit', '--json'];
  return ['audit', '--json'];
}

export function getOutdatedCommand(packageManager) {
  if (packageManager === 'pnpm') return ['outdated', '--format', 'json'];
  if (packageManager === 'yarn') return ['npm', 'outdated', '--json'];
  return ['outdated', '--json'];
}
