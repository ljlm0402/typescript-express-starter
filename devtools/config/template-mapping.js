/**
 * DevTools 템플릿별 설정 매핑 시스템
 * Phase 1 - 아키텍처 재설계
 */

export const TEMPLATE_DEVTOOLS_CONFIG = {
  default: {
    recommended: {
      linter: 'eslint',
      formatter: 'prettier',
      testing: 'vitest',
      alternatives: {
        linter: ['biome', 'oxlint'],
        testing: ['jest'],
      },
    },
    optimizations: {
      eslint: 'default',
      prettier: 'default',
      vitest: 'default',
    },
    supported: {
      linters: ['eslint', 'biome', 'oxlint'],
      formatters: ['prettier', 'biome'],
      testing: ['jest', 'vitest'],
      compilers: ['typescript', 'swc'],
    },
  },
  'prisma-postgresql': {
    recommended: {
      linter: 'biome',
      compiler: 'tsup',
      testing: 'jest',
    },
    optimizations: {
      tsup: 'prisma',
      jest: 'prisma',
    },
    infrastructure: {
      docker: 'postgres',
      database: 'postgresql',
    },
  },
  'drizzle-postgresql': {
    recommended: {
      linter: 'biome',
      compiler: 'swc',
      testing: 'vitest',
    },
    optimizations: {
      swc: 'drizzle',
      vitest: 'drizzle',
    },
    infrastructure: {
      docker: 'postgres',
      database: 'postgresql',
    },
  },
  'mikro-orm-postgresql': {
    recommended: {
      linter: 'eslint',
      compiler: 'tsup',
      testing: 'jest',
    },
    optimizations: {
      tsup: 'mikroorm',
      jest: 'mikroorm',
    },
    infrastructure: {
      docker: 'postgres',
      database: 'postgresql',
    },
  },
  'mongoose-mongodb': {
    recommended: {
      linter: 'eslint',
      compiler: 'swc',
      testing: 'jest',
    },
    optimizations: {
      swc: 'mongodb',
      jest: 'mongodb',
    },
    infrastructure: {
      docker: 'mongodb',
      database: 'mongodb',
    },
  },
  'typegoose-mongodb': {
    recommended: {
      linter: 'biome',
      compiler: 'swc',
      testing: 'vitest',
    },
    optimizations: {
      swc: 'typegoose',
      vitest: 'typegoose',
    },
    infrastructure: {
      docker: 'mongodb',
      database: 'mongodb',
    },
  },
  'typeorm-postgresql': {
    recommended: {
      linter: 'eslint',
      compiler: 'tsup',
      testing: 'jest',
    },
    optimizations: {
      tsup: 'typeorm',
      jest: 'typeorm',
    },
    infrastructure: {
      docker: 'postgres',
      database: 'postgresql',
    },
  },
  'sequelize-postgresql': {
    recommended: {
      linter: 'eslint',
      compiler: 'swc',
      testing: 'jest',
    },
    optimizations: {
      swc: 'sequelize',
      jest: 'sequelize',
    },
    infrastructure: {
      docker: 'postgres',
      database: 'postgresql',
    },
  },
  'knex-postgresql': {
    recommended: {
      linter: 'eslint',
      compiler: 'swc',
      testing: 'jest',
    },
    optimizations: {
      swc: 'knex',
      jest: 'knex',
    },
    infrastructure: {
      docker: 'postgres',
      database: 'postgresql',
    },
  },
  'node-postgres-postgresql': {
    recommended: {
      linter: 'eslint',
      compiler: 'swc',
      testing: 'jest',
    },
    optimizations: {
      swc: 'node-postgres',
      jest: 'node-postgres',
    },
    infrastructure: {
      docker: 'postgres',
      database: 'postgresql',
    },
  },
};

/**
 * 템플릿에 맞는 DevTools 설정을 가져오는 함수
 * @param {string} template - 템플릿 이름
 * @returns {object} 템플릿별 DevTools 설정
 */
export function getTemplateConfig(template) {
  return TEMPLATE_DEVTOOLS_CONFIG[template] || TEMPLATE_DEVTOOLS_CONFIG['default'];
}

/**
 * 템플릿에 권장되는 DevTools 목록을 가져오는 함수
 * @param {string} template - 템플릿 이름
 * @returns {object} 권장 DevTools 설정
 */
export function getRecommendedDevTools(template) {
  const config = getTemplateConfig(template);
  return config.recommended;
}

/**
 * 템플릿별 최적화 설정을 가져오는 함수
 * @param {string} template - 템플릿 이름
 * @returns {object} 최적화 설정
 */
export function getOptimizationConfig(template) {
  const config = getTemplateConfig(template);
  return config.optimizations || {};
}

/**
 * 템플릿별 인프라 설정을 가져오는 함수
 * @param {string} template - 템플릿 이름
 * @returns {object} 인프라 설정
 */
export function getInfrastructureConfig(template) {
  const config = getTemplateConfig(template);
  return config.infrastructure || {};
}
