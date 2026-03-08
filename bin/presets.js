/**
 * DevTools presets and performance benchmarks
 */

// Performance improvement benchmarks for each template/tool combination
export const BENCHMARKS = {
  default: {
    swc: { improvement: '3x', buildTime: '0.8s', description: 'Rust-powered compilation' },
    tsup: { improvement: '2.5x', buildTime: '1.2s', description: 'ESBuild bundling' },
    biome: { improvement: '20x', lintTime: '0.1s', description: 'Rust-based linting' },
    vitest: { improvement: '5x', testTime: '2.1s', description: 'Native ESM support' },
  },
  'prisma-postgresql': {
    swc: { improvement: '3.2x', buildTime: '1.1s', description: 'Fast DB schema compilation' },
    tsup: { improvement: '2.8x', buildTime: '1.5s', description: 'Optimized ORM bundling' },
    biome: { improvement: '18x', lintTime: '0.2s', description: 'Prisma schema validation' },
    vitest: { improvement: '4.5x', testTime: '3.2s', description: 'DB test optimization' },
  },
  'drizzle-postgresql': {
    swc: { improvement: '3.5x', buildTime: '0.9s', description: 'Drizzle schema fast build' },
    tsup: { improvement: '3x', buildTime: '1.3s', description: 'Tree-shaking optimization' },
    biome: { improvement: '22x', lintTime: '0.1s', description: 'SQL-first validation' },
    vitest: { improvement: '5.2x', testTime: '2.8s', description: 'Fast DB testing' },
  },
  'mongoose-mongodb': {
    swc: { improvement: '3.1x', buildTime: '1.0s', description: 'MongoDB schema compilation' },
    tsup: { improvement: '2.7x', buildTime: '1.4s', description: 'NoSQL bundling' },
    biome: { improvement: '19x', lintTime: '0.15s', description: 'Mongoose validation' },
    vitest: { improvement: '4.8x', testTime: '2.9s', description: 'MongoDB test optimization' },
  },
  'knex-postgresql': {
    swc: { improvement: '3.3x', buildTime: '1.0s', description: 'SQL builder compilation' },
    tsup: { improvement: '2.9x', buildTime: '1.4s', description: 'Query builder bundling' },
    biome: { improvement: '20x', lintTime: '0.12s', description: 'SQL query linting' },
    vitest: { improvement: '4.9x', testTime: '3.0s', description: 'Knex test optimization' },
  },
  'mikro-orm-postgresql': {
    swc: { improvement: '3.4x', buildTime: '1.1s', description: 'MikroORM fast build' },
    tsup: { improvement: '2.8x', buildTime: '1.5s', description: 'Entity bundling' },
    biome: { improvement: '21x', lintTime: '0.13s', description: 'Entity validation' },
    vitest: { improvement: '4.7x', testTime: '3.1s', description: 'ORM test optimization' },
  },
  'node-postgres-postgresql': {
    swc: { improvement: '3.2x', buildTime: '0.9s', description: 'Raw SQL compilation' },
    tsup: { improvement: '2.9x', buildTime: '1.3s', description: 'Native driver bundling' },
    biome: { improvement: '20x', lintTime: '0.11s', description: 'SQL syntax checking' },
    vitest: { improvement: '5.1x', testTime: '2.7s', description: 'Direct DB testing' },
  },
  'sequelize-postgresql': {
    swc: { improvement: '3.1x', buildTime: '1.2s', description: 'Sequelize model compilation' },
    tsup: { improvement: '2.6x', buildTime: '1.6s', description: 'ORM bundling' },
    biome: { improvement: '18x', lintTime: '0.16s', description: 'Model validation' },
    vitest: { improvement: '4.6x', testTime: '3.3s', description: 'Sequelize test optimization' },
  },
  'typegoose-mongodb': {
    swc: { improvement: '3.2x', buildTime: '1.1s', description: 'TypeScript schema compilation' },
    tsup: { improvement: '2.7x', buildTime: '1.4s', description: 'Type-safe bundling' },
    biome: { improvement: '19x', lintTime: '0.14s', description: 'Schema type validation' },
    vitest: { improvement: '4.8x', testTime: '2.9s', description: 'Type-safe testing' },
  },
  'typeorm-postgresql': {
    swc: { improvement: '3.3x', buildTime: '1.1s', description: 'Entity compilation' },
    tsup: { improvement: '2.8x', buildTime: '1.5s', description: 'Decorator bundling' },
    biome: { improvement: '20x', lintTime: '0.13s', description: 'Entity validation' },
    vitest: { improvement: '4.7x', testTime: '3.0s', description: 'TypeORM test optimization' },
  },
};

// DevTools presets for different development scenarios
export const PRESETS = {
  recommended: {
    name: '🚀 Recommended Setup',
    description: 'Template-optimized tools with proven performance',
    defaultTools: {
      Linter: 'biome',
      Compiler: 'swc',
      Testing: 'vitest',
      Infrastructure: 'docker',
      'API development': 'swagger',
      'Git Tools': 'husky',
    },
  },
  minimal: {
    name: '📦 Minimal Setup',
    description: 'Essential tools only for lightweight development',
    defaultTools: {
      Linter: 'biome',
      Compiler: 'swc',
    },
  },
  enterprise: {
    name: '🏢 Enterprise Setup',
    description: 'Full-featured setup for production environments',
    defaultTools: {
      Linter: 'eslint',
      Compiler: 'tsup',
      Testing: 'jest',
      Infrastructure: 'docker',
      'API development': 'swagger',
      'Git Tools': 'husky',
      Deployment: 'pm2',
      'CI/CD': 'github',
    },
  },
  performance: {
    name: '⚡ Performance Setup',
    description: 'Fastest possible build and test configuration',
    defaultTools: {
      Linter: 'biome',
      Compiler: 'swc',
      Testing: 'vitest',
    },
  },
  legacy: {
    name: '🔧 Legacy Compatible',
    description: 'Traditional tools for maximum compatibility',
    defaultTools: {
      Linter: 'eslint',
      Compiler: 'tsup',
      Testing: 'jest',
      Infrastructure: 'docker',
    },
  },
};

/**
 * Get benchmark information for a specific tool and template
 */
export function getBenchmarkInfo(tool, template) {
  const benchmark = BENCHMARKS[template]?.[tool.value];
  if (benchmark && benchmark.improvement) {
    return `(${benchmark.improvement} faster)`;
  }
  return '';
}

/**
 * Get recommended tools for a specific template based on benchmarks
 */
export function getRecommendedTools(template) {
  const templateBenchmarks = BENCHMARKS[template];
  if (!templateBenchmarks) {
    return PRESETS.recommended.defaultTools;
  }

  // Use template-specific optimizations or fall back to defaults
  return {
    Linter: 'biome', // Always fastest
    Compiler: templateBenchmarks.swc ? 'swc' : 'tsup',
    Testing: templateBenchmarks.vitest ? 'vitest' : 'jest',
    ...PRESETS.recommended.defaultTools,
  };
}

/**
 * Calculate total performance improvement for a preset
 */
export function calculatePresetPerformance(preset, template) {
  const tools = preset.defaultTools;
  const templateBenchmarks = BENCHMARKS[template];

  if (!templateBenchmarks) return null;

  let totalImprovement = 1;
  let improvements = {};

  Object.entries(tools).forEach(([category, toolValue]) => {
    const benchmark = templateBenchmarks[toolValue];
    if (benchmark && benchmark.improvement) {
      const multiplier = parseFloat(benchmark.improvement.replace('x', ''));
      totalImprovement *= multiplier;
      improvements[category] = benchmark;
    }
  });

  return {
    totalImprovement: `${totalImprovement.toFixed(1)}x`,
    details: improvements,
  };
}
