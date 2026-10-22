/**
 * Validation utilities for user inputs and security
 */

import fs from 'fs';
import path from 'path';
import { CONFIG } from './config.js';
import { ValidationError } from './errors.js';

const TEMPLATE_FORBIDDEN_FILES = [
  'Dockerfile.dev',
  'Dockerfile.prod',
  'docker-compose.yml',
  'jest.config.js',
  'jest.config.cjs',
  'jest.config.ts',
  'vitest.config.js',
  'vitest.config.ts',
  '.swcrc',
  'tsup.config.js',
  'tsup.config.ts',
  'eslint.config.js',
  'eslint.config.cjs',
  'eslint.config.ts',
];

/**
 * Validate project name
 */
export function validateProjectName(name) {
  if (!name || typeof name !== 'string') {
    throw new ValidationError('Project name is required', 'projectName');
  }

  if (name.length > CONFIG.maxProjectNameLength) {
    throw new ValidationError(
      `Project name must be less than ${CONFIG.maxProjectNameLength} characters`,
      'projectName',
      'Use a shorter, descriptive name',
    );
  }

  if (!CONFIG.validation.projectName.test(name)) {
    throw new ValidationError(
      'Project name can only contain letters, numbers, hyphens, and underscores',
      'projectName',
      'Use alphanumeric characters with hyphens or underscores',
    );
  }

  // Check for reserved names
  const reservedNames = ['node_modules', 'package.json', 'src', 'dist', 'build'];
  if (reservedNames.includes(name.toLowerCase())) {
    throw new ValidationError(
      `"${name}" is a reserved name and cannot be used`,
      'projectName',
      'Choose a different project name',
    );
  }

  return name;
}

/**
 * Validate and resolve project path
 */
export function validateProjectPath(projectPath) {
  if (!projectPath || typeof projectPath !== 'string') {
    throw new ValidationError('Project path is required', 'projectPath');
  }

  const resolved = path.resolve(projectPath);
  const cwd = process.cwd();
  const relative = path.relative(cwd, resolved);

  // Prevent path traversal attacks
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new ValidationError(
      'Project path must be within current directory',
      'projectPath',
      'Use a relative path or absolute path within current directory',
    );
  }

  // Check for dangerous paths (시스템 루트 디렉토리만 제한)
  const dangerousPaths = ['/etc', '/usr', '/var', '/tmp'];
  if (dangerousPaths.some((dangerous) => resolved.startsWith(dangerous))) {
    throw new ValidationError(
      'Cannot create project in system directories',
      'projectPath',
      'Choose a safe location within your workspace',
    );
  }

  return resolved;
}

/**
 * Check if package specifier is explicit (URL, file, etc.)
 */
export function isExplicitSpecifier(spec) {
  const explicitPrefixes = ['http://', 'https://', 'git+', 'file:', 'link:', 'workspace:', 'npm:'];

  return explicitPrefixes.some((prefix) => spec.startsWith(prefix));
}

/**
 * Split package name and version from specifier
 */
export function splitNameAndVersion(spec) {
  if (isExplicitSpecifier(spec)) {
    return { name: spec, version: null };
  }

  if (spec.startsWith('@')) {
    // Scoped package: @scope/package@version
    const idx = spec.indexOf('@', 1);
    if (idx === -1) {
      return { name: spec, version: null };
    }
    return {
      name: spec.slice(0, idx),
      version: spec.slice(idx + 1),
    };
  } else {
    // Regular package: package@version
    const idx = spec.indexOf('@');
    if (idx === -1) {
      return { name: spec, version: null };
    }
    return {
      name: spec.slice(0, idx),
      version: spec.slice(idx + 1),
    };
  }
}

export function mergePackageSpecs(currentDependencies, specs) {
  const dependencies = { ...currentDependencies };

  for (const spec of specs) {
    const { name, version } = splitNameAndVersion(spec);
    dependencies[name] = version || 'latest';
  }

  return dependencies;
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input;
  }

  // Remove potentially dangerous characters
  return input.replace(/[<>:"|?*]/g, '').trim();
}

export function isVersionAtLeast(current, required) {
  const currentParts = String(current).split('.').map(Number);
  const requiredParts = String(required).split('.').map(Number);
  const length = Math.max(currentParts.length, requiredParts.length);

  for (let index = 0; index < length; index += 1) {
    const currentPart = currentParts[index] || 0;
    const requiredPart = requiredParts[index] || 0;
    if (currentPart > requiredPart) return true;
    if (currentPart < requiredPart) return false;
  }

  return true;
}

/**
 * Validate Node.js version
 */
export function validateNodeVersion(required = CONFIG.minNodeVersion) {
  const current = process.versions.node;

  if (!isVersionAtLeast(current, required)) {
    throw new ValidationError(
      `Node.js ${required}+ required. You have ${process.versions.node}`,
      'nodeVersion',
      `Please upgrade your Node.js to version ${required} or higher`,
    );
  }

  return current;
}

/**
 * Validate template integrity - ensure templates don't contain DevTools files
 */
export function validateTemplateIntegrity(templatePath) {
  const violations = [];

  for (const file of TEMPLATE_FORBIDDEN_FILES) {
    const filePath = path.join(templatePath, file);
    if (fs.existsSync(filePath)) {
      violations.push(file);
    }
  }

  if (violations.length > 0) {
    throw new ValidationError(
      `Template contains DevTools files that should be generated dynamically: ${violations.join(', ')}`,
      'templateIntegrity',
      'These files should be removed from templates as they are generated by DevTools system',
    );
  }

  return true;
}

/**
 * Clean template by removing DevTools files
 */
export function cleanTemplate(templatePath) {
  const removedFiles = [];

  for (const file of TEMPLATE_FORBIDDEN_FILES) {
    const filePath = path.join(templatePath, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      removedFiles.push(file);
    }
  }

  return removedFiles;
}

/**
 * Validate all templates in the templates directory
 */
export function validateAllTemplates() {
  const templatesDir = CONFIG.paths.templates;
  const results = {};

  if (!fs.existsSync(templatesDir)) {
    throw new ValidationError(
      'Templates directory not found',
      'templatesDirectory',
      'Ensure you are running this from the project root directory',
    );
  }

  const templateDirs = fs
    .readdirSync(templatesDir)
    .filter((dir) => fs.statSync(path.join(templatesDir, dir)).isDirectory());

  for (const templateDir of templateDirs) {
    const templatePath = path.join(templatesDir, templateDir);

    try {
      validateTemplateIntegrity(templatePath);
      results[templateDir] = { valid: true, violations: [] };
    } catch (error) {
      if (error instanceof ValidationError && error.field === 'templateIntegrity') {
        // Extract violations from error message
        const match = error.message.match(
          /DevTools files that should be generated dynamically: (.+)$/,
        );
        const violations = match ? match[1].split(', ') : [];
        results[templateDir] = { valid: false, violations };
      } else {
        throw error;
      }
    }
  }

  return results;
}
