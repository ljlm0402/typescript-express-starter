import path from 'node:path';

export function shouldCopyTemplatePath(src, templateRoot = null) {
  const basename = path.basename(src);
  const candidatePath = templateRoot ? path.relative(templateRoot, src) : src;
  const normalized = candidatePath.split(path.sep);
  const ignoredSegments = new Set(['node_modules', 'dist', 'coverage', 'logs', '.turbo']);
  const isPrivateEnvironmentFile = basename === '.env' || /^\.env\..+\.local$/.test(basename);

  return (
    basename !== '.DS_Store' &&
    !isPrivateEnvironmentFile &&
    !normalized.some((segment) => ignoredSegments.has(segment))
  );
}
