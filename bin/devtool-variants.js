import path from 'path';

const TEMPLATE_FAMILIES = {
  default: 'default',
  'express-cargo': 'default',
  'drizzle-postgresql': 'drizzle',
  'prisma-postgresql': 'prisma',
  'mongoose-mongodb': 'mongoose',
  'typegoose-mongodb': 'typegoose',
};

const TEST_VARIANTS = {
  jest: {
    default: 'src-default',
    drizzle: 'src-drizzle',
    prisma: null,
    mongoose: null,
    typegoose: null,
  },
  vitest: {
    default: 'src-default',
    drizzle: 'src-drizzle',
    prisma: null,
    mongoose: null,
    typegoose: null,
  },
};

const COMPILER_VARIANT_FILES = {
  tsup: {
    default: path.join('default', 'default.tsup.config.ts'),
    drizzle: path.join('orm-templates', 'drizzle.tsup.config.ts'),
    prisma: path.join('orm-templates', 'prisma.tsup.config.ts'),
    mongoose: path.join('orm-templates', 'mongoose.tsup.config.ts'),
    typegoose: path.join('orm-templates', 'mongoose.tsup.config.ts'),
  },
  swc: {
    default: path.join('default', 'default.swcrc'),
    drizzle: path.join('drizzle', 'drizzle.swcrc'),
    prisma: path.join('prisma', 'prisma.swcrc'),
    mongoose: path.join('overrides', 'mongoose.swcrc'),
    typegoose: path.join('overrides', 'mongoose.swcrc'),
  },
};

export function getTemplateFamily(template) {
  return TEMPLATE_FAMILIES[template] || 'default';
}

export function getTestingVariantFolder(toolValue, template) {
  const family = getTemplateFamily(template);
  const variant = TEST_VARIANTS[toolValue]?.[family];

  if (!variant) {
    throw new Error(`${toolValue} does not support the ${family} template family yet`);
  }

  return variant;
}

export function getCompilerVariantFile(toolValue, template) {
  const family = getTemplateFamily(template);
  return COMPILER_VARIANT_FILES[toolValue]?.[family] || COMPILER_VARIANT_FILES[toolValue]?.default;
}
