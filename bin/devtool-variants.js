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
    // Keep Prisma on the generic test fixture until a complete src-prisma/test set exists.
    prisma: 'src-default',
    mongoose: 'src-default',
    typegoose: 'src-default',
  },
  vitest: {
    default: 'src-default',
    drizzle: 'src-drizzle',
    prisma: 'src-default',
    mongoose: 'src-default',
    typegoose: 'src-default',
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
  return TEST_VARIANTS[toolValue]?.[family] || TEST_VARIANTS[toolValue]?.default || 'src-default';
}

export function getCompilerVariantFile(toolValue, template) {
  const family = getTemplateFamily(template);
  return COMPILER_VARIANT_FILES[toolValue]?.[family] || COMPILER_VARIANT_FILES[toolValue]?.default;
}
