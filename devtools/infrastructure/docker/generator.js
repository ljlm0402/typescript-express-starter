/**
 * 동적 Docker 파일 생성 시스템
 * Phase 2 - Docker 통합 관리
 */

import fs from 'fs';
import path from 'path';
import {
  getDatabaseService,
  extractDatabaseType,
  generateDatabaseEnv,
} from './database-services.js';
import { getTemplateConfig } from '../../config/template-mapping.js';

// ORM별 특화 설정
const ORM_CONFIGURATIONS = {
  prisma: {
    setupCommands: ['RUN npx prisma generate'],
    buildSetup: ['RUN npx prisma generate'],
    prodSetup: [
      'COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma',
      'RUN npx prisma generate',
    ],
  },
  drizzle: {
    setupCommands: [
      'RUN npm run db:generate 2>/dev/null || echo "Drizzle schema will be generated at runtime"',
    ],
    buildSetup: ['RUN npm run db:generate 2>/dev/null || true'],
    prodSetup: ['COPY --from=builder --chown=nodejs:nodejs /app/drizzle ./drizzle'],
  },
  typeorm: {
    setupCommands: ['RUN npm run typeorm:cache:clear 2>/dev/null || true'],
    buildSetup: ['RUN npm run build:entities 2>/dev/null || true'],
    prodSetup: [],
  },
  'mikro-orm': {
    setupCommands: ['RUN npx mikro-orm cache:clear 2>/dev/null || true'],
    buildSetup: ['RUN npx mikro-orm cache:generate 2>/dev/null || true'],
    prodSetup: [],
  },
};

/**
 * 템플릿 파일에서 변수를 치환하는 함수
 * @param {string} template - 템플릿 문자열
 * @param {object} variables - 치환할 변수들
 * @returns {string} 치환된 문자열
 */
function interpolateTemplate(template, variables) {
  let result = template;

  // 간단한 변수 치환 ({{VARIABLE}} 형식)
  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, variables[key] || '');
  });

  // 조건부 블록 처리 ({{#if CONDITION}} ... {{/if}} 형식)
  Object.keys(variables).forEach((key) => {
    if (variables[key]) {
      // 조건이 true인 경우 - 블록 내용을 유지하고 조건 태그 제거
      const ifRegex = new RegExp(`{{#if ${key}}}([\\s\\S]*?){{/if}}`, 'g');
      result = result.replace(ifRegex, '$1');
    } else {
      // 조건이 false인 경우 - 블록 전체 제거
      const ifRegex = new RegExp(`{{#if ${key}}}[\\s\\S]*?{{/if}}`, 'g');
      result = result.replace(ifRegex, '');
    }
  });

  // 배열 및 객체 처리 ({{#each ARRAY}} ... {{/each}} 형식)
  Object.keys(variables).forEach((key) => {
    if (Array.isArray(variables[key])) {
      const eachRegex = new RegExp(`{{#each ${key}}}([\\s\\S]*?){{/each}}`, 'g');
      result = result.replace(eachRegex, (match, template) => {
        return variables[key]
          .map((item) => {
            if (typeof item === 'object') {
              let itemResult = template;
              Object.keys(item).forEach((itemKey) => {
                const itemRegex = new RegExp(`{{${itemKey}}}`, 'g');
                itemResult = itemResult.replace(itemRegex, item[itemKey]);
              });
              return itemResult;
            }
            return template.replace(/{{this}}/g, item);
          })
          .join('');
      });
    } else if (typeof variables[key] === 'object' && variables[key] !== null) {
      // 객체의 키-값 쌍 처리
      const eachRegex = new RegExp(`{{#each ${key}}}([\\s\\S]*?){{/each}}`, 'g');
      result = result.replace(eachRegex, (match, template) => {
        return Object.entries(variables[key])
          .map(([objKey, objValue]) => {
            let itemResult = template;
            itemResult = itemResult.replace(/{{@key}}/g, objKey);
            itemResult = itemResult.replace(/{{this}}/g, objValue);
            return itemResult;
          })
          .join('\n');
      });
    }
  });

  // 빈 줄 제거
  result = result.replace(/^\s*\n/gm, '');

  return result;
}

/**
 * 템플릿에 따른 Docker 설정을 생성하는 함수
 * @param {string} templateName - 템플릿 이름
 * @returns {object} Docker 설정
 */
function generateDockerConfig(templateName) {
  const dbType = extractDatabaseType(templateName);
  const databaseService = getDatabaseService(dbType);
  const templateConfig = getTemplateConfig(templateName);

  // ORM 이름 추출
  const ormName = templateName.split('-')[0];
  const ormConfig = ORM_CONFIGURATIONS[ormName] || {};

  // 기본 설정
  const config = {
    TEMPLATE_NAME: templateName,
    NODE_VERSION: '18',
    DEFAULT_PORT: '3000',
    CONTAINER_NAME: templateName.replace(/[^a-zA-Z0-9]/g, '-'),
    START_COMMAND: 'npm run dev',
    BUILD_COMMAND: 'npm run build',
    DATABASE_SERVICE: databaseService.service,

    // ORM 설정
    ORM_NAME: ormName.toUpperCase(),
    ORM_SETUP: ormConfig.setupCommands?.join('\n') || null,
    ORM_BUILD_SETUP: ormConfig.buildSetup?.join('\n') || null,
    ORM_PROD_SETUP: ormConfig.prodSetup?.join('\n') || null,

    // 패키지 매니저 확인
    PNPM_LOCK: false, // 실제로는 파일 존재 여부를 확인해야 함

    // 데이터베이스 설정
    DATABASE_CONFIG: databaseService,
    ADMIN_TOOL: databaseService.adminTool,

    // 환경변수
    ENVIRONMENT: generateDatabaseEnv(dbType, templateName),
  };

  return config;
}

/**
 * Dockerfile.dev를 생성하는 함수
 * @param {string} templateName - 템플릿 이름
 * @param {string} outputPath - 출력 경로
 * @returns {string} 생성된 Dockerfile 내용
 */
export function generateDockerfileDev(templateName, outputPath = null) {
  const templatePath = path.join(
    process.cwd(),
    'devtools/infrastructure/docker/templates/Dockerfile.dev.template',
  );
  const template = fs.readFileSync(templatePath, 'utf8');
  const config = generateDockerConfig(templateName);

  const result = interpolateTemplate(template, config);

  if (outputPath) {
    fs.writeFileSync(outputPath, result);
  }

  return result;
}

/**
 * Dockerfile.prod를 생성하는 함수
 * @param {string} templateName - 템플릿 이름
 * @param {string} outputPath - 출력 경로
 * @returns {string} 생성된 Dockerfile 내용
 */
export function generateDockerfileProd(templateName, outputPath = null) {
  const templatePath = path.join(
    process.cwd(),
    'devtools/infrastructure/docker/templates/Dockerfile.prod.template',
  );
  const template = fs.readFileSync(templatePath, 'utf8');
  const config = generateDockerConfig(templateName);

  const result = interpolateTemplate(template, config);

  if (outputPath) {
    fs.writeFileSync(outputPath, result);
  }

  return result;
}

/**
 * docker-compose.yml을 생성하는 함수
 * @param {string} templateName - 템플릿 이름
 * @param {string} projectName - 프로젝트 이름
 * @param {string} outputPath - 출력 경로
 * @returns {string} 생성된 docker-compose.yml 내용
 */
export function generateDockerCompose(templateName, projectName = null, outputPath = null) {
  const templatePath = path.join(
    process.cwd(),
    'devtools/infrastructure/docker/templates/docker-compose.yml.template',
  );
  const template = fs.readFileSync(templatePath, 'utf8');
  const config = generateDockerConfig(templateName);

  if (projectName) {
    config.CONTAINER_NAME = projectName.replace(/[^a-zA-Z0-9]/g, '-');
  }

  const result = interpolateTemplate(template, config);

  if (outputPath) {
    fs.writeFileSync(outputPath, result);
  }

  return result;
}

/**
 * .dockerignore 파일을 생성하는 함수
 * @param {string} templateName - 템플릿 이름
 * @param {string} outputPath - 출력 경로
 * @returns {string} 생성된 .dockerignore 내용
 */
export function generateDockerignore(templateName, outputPath = null) {
  const baseIgnore = fs.readFileSync(
    path.join(process.cwd(), 'devtools/infrastructure/docker/base/.dockerignore'),
    'utf8',
  );

  // 템플릿별 추가 무시 항목
  const templateSpecific = {
    prisma: ['prisma/migrations/*.sql'],
    drizzle: ['drizzle/**/*.sql'],
    typeorm: ['src/migrations/*.ts'],
  };

  const ormName = templateName.split('-')[0];
  const additionalIgnores = templateSpecific[ormName] || [];

  const result = baseIgnore + '\n' + additionalIgnores.join('\n');

  if (outputPath) {
    fs.writeFileSync(outputPath, result);
  }

  return result;
}

/**
 * 환경변수 파일을 생성하는 함수
 * @param {string} templateName - 템플릿 이름
 * @param {string} outputPath - 출력 경로
 * @returns {string} 생성된 .env.example 내용
 */
export function generateEnvExample(templateName, outputPath = null) {
  const dbType = extractDatabaseType(templateName);
  const envVars = generateDatabaseEnv(dbType, templateName);

  let result = '# Generated Environment Variables\n';
  result += '# Copy this file to .env and update values as needed\n\n';

  Object.keys(envVars).forEach((key) => {
    result += `${key}=${envVars[key]}\n`;
  });

  // 추가 설정
  result += '\n# Docker Compose Settings\n';
  result += `COMPOSE_PROJECT_NAME=${templateName.replace('-', '_')}\n`;
  result += '\n# Optional Admin Tools\n';
  if (dbType === 'postgresql') {
    result += 'PGADMIN_EMAIL=admin@example.com\n';
    result += 'PGADMIN_PASSWORD=admin\n';
    result += 'PGADMIN_PORT=5050\n';
  } else if (dbType === 'mongodb') {
    result += 'MONGO_EXPRESS_PORT=8081\n';
  }
  result += 'REDIS_PORT=6379\n';

  if (outputPath) {
    fs.writeFileSync(outputPath, result);
  }

  return result;
}

/**
 * 모든 Docker 파일을 생성하는 통합 함수
 * @param {string} templateName - 템플릿 이름
 * @param {string} projectName - 프로젝트 이름
 * @param {string} targetDir - 대상 디렉토리
 * @returns {object} 생성된 파일들의 정보
 */
export function generateAllDockerFiles(templateName, projectName, targetDir) {
  const files = {};

  files.dockerfileDev = generateDockerfileDev(templateName, path.join(targetDir, 'Dockerfile.dev'));
  files.dockerfileProd = generateDockerfileProd(
    templateName,
    path.join(targetDir, 'Dockerfile.prod'),
  );
  files.dockerCompose = generateDockerCompose(
    templateName,
    projectName,
    path.join(targetDir, 'docker-compose.yml'),
  );
  files.dockerignore = generateDockerignore(templateName, path.join(targetDir, '.dockerignore'));
  files.envExample = generateEnvExample(templateName, path.join(targetDir, '.env.example'));

  return files;
}
