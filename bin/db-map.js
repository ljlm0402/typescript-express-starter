import fs from 'fs-extra';
import path from 'path';

export const TEMPLATE_DB = {
  default: null,
  'drizzle-postgresql': 'postgres',
  'prisma-postgresql': 'postgres',
  'mongoose-mongodb': 'mongodb',
  graphql: 'postgres',
  knex: 'mysql',
  mikroorm: 'postgres',
  mongoose: 'mongodb',
  'node-postgres': 'postgres',
  prisma: 'mysql',
  sequelize: 'mysql',
  typegoose: 'mongodb',
  typeorm: 'postgres',
};

const DB_SERVICES = {
  postgres: `
  pg:
    container_name: pg
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: \${POSTGRES_DB}
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: always
    networks:
      - backend
  `,
  mysql: `
  mysql:
    container_name: mysql
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: \${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: \${MYSQL_DATABASE}
      MYSQL_USER: \${MYSQL_USER}
      MYSQL_PASSWORD: \${MYSQL_PASSWORD}
    volumes:
      - mysqldata:/var/lib/mysql
    restart: always
    networks:
      - backend
  `,
  mongodb: `
  mongo:
    container_name: mongo
    image: mongo:7
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: \${MONGO_ROOT_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: \${MONGO_ROOT_PASSWORD}
      MONGO_INITDB_DATABASE: \${MONGO_DATABASE}
    volumes:
      - mongodata:/data/db
    restart: always
    networks:
      - backend
  `,
};

// DB별 서비스명 맵핑
const DB_SERVICE_NAMES = {
  postgres: 'pg',
  mysql: 'mysql',
  mongodb: 'mongo',
};

// 서비스 생성 헬퍼 함수
const generateServices = (dbSnippet = '', dbType = null) => {
  // depends_on 조건부 생성
  const dependsOn =
    dbType && DB_SERVICE_NAMES[dbType]
      ? `    depends_on:
      - ${DB_SERVICE_NAMES[dbType]}`
      : '';

  // 볼륨 설정 동적 생성
  const volumes = dbType ? generateVolumes(dbType) : '';

  return `version: '3.9'

services:
  proxy:
    container_name: proxy
    image: nginx:alpine
    ports:
      - '80:80'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - server
    restart: unless-stopped
    networks:
      - backend

  server:
    container_name: server
    build:
      context: ./
      dockerfile: Dockerfile.dev
    ports:
      - '3000:3000'
    volumes:
      - ./:/app:cached
      - /app/node_modules
    env_file:
      - .env.development.local
${dependsOn}
    restart: unless-stopped
    networks:
      - backend

${dbSnippet.trim()}

networks:
  backend:
    driver: bridge
${volumes}`;
};

// 볼륨 생성 헬퍼 함수
function generateVolumes(dbType) {
  const volumeMap = {
    postgres: `
volumes:
  pgdata:
    driver: local`,
    mysql: `
volumes:
  mysqldata:
    driver: local`,
    mongodb: `
volumes:
  mongodata:
    driver: local`,
  };

  return volumeMap[dbType] || '';
}

// 파일 기반 Docker 설정 생성 (권장)
export async function generateDockerFiles(template, destDir) {
  const dbType = validateDbTemplate(template);

  try {
    // 공통 Dockerfile들 복사
    const dockerCommonPath = path.resolve(process.cwd(), 'devtools/infrastructure/docker/common');
    const dockerfiles = ['Dockerfile.dev', 'Dockerfile.prod', '.dockerignore'];

    for (const file of dockerfiles) {
      const srcPath = path.join(dockerCommonPath, file);
      const destPath = path.join(destDir, file);

      if (await fs.pathExists(srcPath)) {
        await fs.copy(srcPath, destPath);
        console.log(`  ⎯ ${file} copied from common template`);
      }
    }

    // DB별 docker-compose.yml 복사
    if (dbType) {
      const dbComposePath = path.resolve(
        process.cwd(),
        `devtools/infrastructure/docker/database/${dbType}.compose.yml`,
      );
      const composeDestPath = path.join(destDir, 'docker-compose.yml');

      if (await fs.pathExists(dbComposePath)) {
        await fs.copy(dbComposePath, composeDestPath);
        console.log(`  ⎯ docker-compose.yml copied for ${dbType} database`);
      } else {
        // 파일이 없으면 동적 생성 fallback
        console.log(`  ⚠️ ${dbType}.compose.yml not found, using dynamic generation`);
        const dynamicCompose = generateDockerCompose(template);
        await fs.writeFile(composeDestPath, dynamicCompose, 'utf8');
        console.log(`  ⎯ docker-compose.yml generated dynamically for ${dbType}`);
      }
    } else {
      // 데이터베이스 없는 경우 기본 compose 생성
      const basicCompose = generateServices();
      const composeDestPath = path.join(destDir, 'docker-compose.yml');
      await fs.writeFile(composeDestPath, basicCompose, 'utf8');
      console.log(`  ⎯ basic docker-compose.yml generated (no database)`);
    }

    return dbType;
  } catch (error) {
    console.error(`Docker setup error: ${error.message}`);
    throw error;
  }
}

// 설정 검증 함수
export function validateDbTemplate(template) {
  if (!template || !TEMPLATE_DB.hasOwnProperty(template)) {
    throw new Error(
      `Invalid template: ${template}. Available templates: ${Object.keys(TEMPLATE_DB).join(', ')}`,
    );
  }
  return TEMPLATE_DB[template];
}

// 완전한 docker-compose 생성 함수
export function generateDockerCompose(template) {
  const dbType = validateDbTemplate(template);
  if (!dbType) {
    return generateServices();
  }

  const dbSnippet = DB_SERVICES[dbType];
  if (!dbSnippet) {
    throw new Error(`Database service configuration not found for: ${dbType}`);
  }

  return generateServices(dbSnippet, dbType);
}
