#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { DEVTOOLS_VALUES, TEMPLATES_VALUES } from './common.js';
import { CONFIG } from './config.js';
import { getCompilerVariantFile, getTestingVariantFolder } from './devtool-variants.js';
import { TEMPLATE_DEVTOOLS_CONFIG } from '../devtools/config/template-mapping.js';

const CATEGORY_PATHS = {
  Linter: 'core',
  Compiler: 'build',
  Testing: 'test',
  'API development': 'api',
  Infrastructure: 'infrastructure',
  'Git Tools': 'core',
  Deployment: 'core',
};

const REQUIRED_TEMPLATE_FILES = [
  'package.json',
  'tsconfig.json',
  '.env.example',
  'src/app.ts',
  'src/server.ts',
];

const GENERATED_TEMPLATE_ENTRIES = ['node_modules', 'dist', 'coverage', 'logs', '.turbo'];

function exists(filePath) {
  return fs.existsSync(filePath);
}

function getDevtoolSource(tool, file, template) {
  const categoryPath = CATEGORY_PATHS[tool.category] || '';
  const toolRoot = path.join(CONFIG.paths.devtools, categoryPath, tool.value);

  if (tool.category === 'Compiler') {
    const variant = getCompilerVariantFile(tool.value, template);
    return variant ? path.join(toolRoot, variant) : path.join(toolRoot, file);
  }

  if (tool.category === 'Testing') {
    const variant = getTestingVariantFolder(tool.value, template);
    if (file === 'src/test' || file.startsWith('src/')) {
      return path.join(toolRoot, variant, 'test');
    }
    if (file.includes('.config.')) {
      return path.join(toolRoot, variant, file);
    }
  }

  return path.join(toolRoot, file);
}

export function collectAssetIssues() {
  const issues = [];
  const configuredTemplates = new Set(TEMPLATES_VALUES.map((template) => template.value));
  const availableTools = new Set(DEVTOOLS_VALUES.map((tool) => tool.value));

  for (const template of TEMPLATES_VALUES.filter((item) => item.active)) {
    const templateRoot = path.join(CONFIG.paths.templates, template.value);
    if (!exists(templateRoot)) {
      issues.push(`Active template directory is missing: ${template.value}`);
      continue;
    }

    for (const requiredFile of REQUIRED_TEMPLATE_FILES) {
      if (!exists(path.join(templateRoot, requiredFile))) {
        issues.push(`${template.value}: missing ${requiredFile}`);
      }
    }

    for (const generatedEntry of GENERATED_TEMPLATE_ENTRIES) {
      if (exists(path.join(templateRoot, generatedEntry))) {
        issues.push(`${template.value}: generated entry must be removed: ${generatedEntry}`);
      }
    }

    let packageJson;
    try {
      packageJson = JSON.parse(fs.readFileSync(path.join(templateRoot, 'package.json'), 'utf8'));
    } catch (error) {
      issues.push(`${template.value}: invalid package.json (${error.message})`);
    }

    const requiredNodeEngine = `>=${CONFIG.minNodeVersion}`;
    if (packageJson && packageJson.engines?.node !== requiredNodeEngine) {
      issues.push(
        `${template.value}: engines.node must match the CLI requirement (${requiredNodeEngine})`,
      );
    }

    for (const tool of DEVTOOLS_VALUES) {
      for (const file of tool.files) {
        const source = getDevtoolSource(tool, file, template.value);
        if (!exists(source)) {
          issues.push(`${template.value} + ${tool.value}: missing asset ${path.relative(CONFIG.paths.root, source)}`);
        }
      }
    }
  }

  for (const entry of fs.readdirSync(CONFIG.paths.templates, { withFileTypes: true })) {
    if (entry.isDirectory() && !configuredTemplates.has(entry.name)) {
      issues.push(`Template directory is not registered in TEMPLATES_VALUES: ${entry.name}`);
    }
  }

  for (const [templateName, config] of Object.entries(TEMPLATE_DEVTOOLS_CONFIG)) {
    for (const recommendation of Object.values(config.recommended || {})) {
      if (typeof recommendation === 'string' && !availableTools.has(recommendation)) {
        issues.push(`${templateName}: recommended devtool is unavailable: ${recommendation}`);
      }
    }
  }

  return issues;
}

export function validateAssets() {
  const issues = collectAssetIssues();
  if (issues.length > 0) {
    throw new Error(`Asset validation failed:\n- ${issues.join('\n- ')}`);
  }
  return true;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try {
    validateAssets();
    console.log('All template and devtool assets are valid.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
