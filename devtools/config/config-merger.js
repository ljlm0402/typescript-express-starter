/**
 * DevTools config merge helpers.
 *
 * The CLI mostly copies ready-made config files today, but this module is kept
 * import-safe for future generated configs.
 */

import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const TOOL_PATHS = {
  swc: 'build/swc',
  tsup: 'build/tsup',
  jest: 'test/jest',
  vitest: 'test/vitest',
};

const CONFIG_EXTENSIONS = {
  swc: 'swcrc',
  tsup: 'tsup.config.ts',
  jest: 'config.ts',
  vitest: 'config.ts',
};

const ORM_ALIASES = {
  'drizzle-postgresql': 'drizzle',
  'prisma-postgresql': 'prisma',
  'mongoose-mongodb': 'mongoose',
  'typegoose-mongodb': 'mongoose',
  'typeorm-postgresql': 'typeorm',
  'mikro-orm-postgresql': 'mikroorm',
};

function isPlainObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export function deepMerge(...sources) {
  const result = {};

  for (const source of sources) {
    if (!isPlainObject(source)) continue;

    for (const [key, value] of Object.entries(source)) {
      if (isPlainObject(result[key]) && isPlainObject(value)) {
        result[key] = deepMerge(result[key], value);
      } else if (Array.isArray(value)) {
        result[key] = [...value];
      } else {
        result[key] = value;
      }
    }
  }

  return result;
}

async function readConfig(configPath) {
  if (!fs.existsSync(configPath)) return {};

  const ext = path.extname(configPath);
  const content = fs.readFileSync(configPath, 'utf8');

  if (ext === '.json' || configPath.endsWith('.swcrc') || configPath.endsWith('.babelrc')) {
    return JSON.parse(content);
  }

  if (ext === '.js' || ext === '.mjs') {
    const module = await import(pathToFileURL(configPath).href);
    return module.default || module;
  }

  return { content };
}

function getToolPath(tool) {
  return TOOL_PATHS[tool];
}

function getConfigExtension(tool) {
  return CONFIG_EXTENSIONS[tool];
}

function getOrmName(template) {
  return ORM_ALIASES[template] || template.split('-')[0] || 'default';
}

function postProcessConfig(tool, template, config) {
  if (tool === 'swc') return postProcessSwcConfig(template, config);
  if (tool === 'tsup') return postProcessTsupConfig(template, config);
  if (tool === 'jest') return postProcessJestConfig(template, config);
  if (tool === 'vitest') return postProcessVitestConfig(template, config);
  return config;
}

function postProcessSwcConfig(template, config) {
  const next = deepMerge(config);

  if (template.includes('mongodb')) {
    next.jsc = next.jsc || {};
    next.jsc.loose = true;
  }

  if (template.includes('prisma')) {
    next.exclude = next.exclude || [];
    if (!next.exclude.includes('prisma/migrations/**/*')) {
      next.exclude.push('prisma/migrations/**/*');
    }
  }

  return next;
}

function postProcessTsupConfig(template, config) {
  const next = deepMerge(config);
  const ormName = getOrmName(template);
  const ormExternals = {
    prisma: ['@prisma/client'],
    drizzle: ['drizzle-orm', 'drizzle-kit'],
    typeorm: ['typeorm', 'reflect-metadata'],
    mikroorm: ['@mikro-orm/core', 'reflect-metadata'],
    mongoose: ['mongoose'],
  };

  if (ormExternals[ormName]) {
    next.external = [...new Set([...(next.external || []), ...ormExternals[ormName]])];
  }

  return next;
}

function postProcessJestConfig(template, config) {
  const next = deepMerge(config);
  const ormName = getOrmName(template);

  if (['typeorm', 'mikroorm'].includes(ormName)) {
    next.testTimeout = next.testTimeout || 30000;
  } else if (['drizzle', 'prisma'].includes(ormName)) {
    next.testTimeout = next.testTimeout || 20000;
  }

  return next;
}

function postProcessVitestConfig(template, config) {
  const next = deepMerge(config);

  if (getOrmName(template) === 'typeorm') {
    next.test = next.test || {};
    next.test.poolOptions = next.test.poolOptions || {};
    next.test.poolOptions.threads = { singleThread: true, isolate: true };
  }

  return next;
}

export async function mergeConfigs(tool, template) {
  const toolPath = getToolPath(tool);
  const extension = getConfigExtension(tool);

  if (!toolPath || !extension) {
    throw new Error(`Unsupported devtool config type: ${tool}`);
  }

  const devtoolsPath = path.join(process.cwd(), 'devtools');
  const ormName = getOrmName(template);
  const basePath = path.join(devtoolsPath, toolPath, 'base', `base.${extension}`);
  const templatePath = path.join(devtoolsPath, toolPath, template, `${template}.${extension}`);
  const ormPath = path.join(devtoolsPath, toolPath, 'orm-templates', `${ormName}.${extension}`);
  const overridePath = path.join(devtoolsPath, toolPath, 'overrides', `${ormName}.${extension}`);

  const mergedConfig = deepMerge(
    await readConfig(basePath),
    await readConfig(templatePath),
    await readConfig(ormPath),
    await readConfig(overridePath),
  );

  return postProcessConfig(tool, template, mergedConfig);
}

export function saveConfig(filePath, config, format = 'json') {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  if (format === 'json') {
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
    return;
  }

  if (format === 'js') {
    fs.writeFileSync(filePath, `export default ${JSON.stringify(config, null, 2)};`);
    return;
  }

  fs.writeFileSync(filePath, String(config));
}

export async function generateAllConfigs(tool, templates) {
  const configs = {};

  for (const template of templates) {
    configs[template] = await mergeConfigs(tool, template);
  }

  return configs;
}
