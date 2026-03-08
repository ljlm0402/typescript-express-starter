/**
 * 데이터베이스별 Docker 서비스 정의
 * Phase 2 - Docker 통합 관리
 */

export const DATABASE_SERVICES = {
  postgresql: {
    service: 'postgres',
    image: 'postgres:15-alpine',
    defaultPort: 5432,
    environment: {
      POSTGRES_DB: '${DB_NAME:-app_db}',
      POSTGRES_USER: '${DB_USER:-postgres}',
      POSTGRES_PASSWORD: '${DB_PASSWORD:-password}',
      POSTGRES_INITDB_ARGS: '--encoding=UTF-8',
    },
    volumes: ['postgres_data:/var/lib/postgresql/data'],
    healthCheck: {
      test: ['CMD-SHELL', 'pg_isready -U ${DB_USER:-postgres} -d ${DB_NAME:-app_db}'],
      interval: '10s',
      timeout: '5s',
      retries: 5,
    },
    adminTool: {
      service: 'pgadmin',
      image: 'dpage/pgadmin4:8',
      port: 5050,
      environment: {
        PGADMIN_DEFAULT_EMAIL: '${PGADMIN_EMAIL:-admin@example.com}',
        PGADMIN_DEFAULT_PASSWORD: '${PGADMIN_PASSWORD:-admin}',
        PGADMIN_CONFIG_SERVER_MODE: 'False',
      },
      volumes: ['pgadmin_data:/var/lib/pgadmin'],
      profiles: ['tools'],
    },
  },
  mongodb: {
    service: 'mongodb',
    image: 'mongo:7.0',
    defaultPort: 27017,
    environment: {
      MONGO_INITDB_ROOT_USERNAME: '${MONGO_ROOT_USER:-admin}',
      MONGO_INITDB_ROOT_PASSWORD: '${MONGO_ROOT_PASS:-password}',
      MONGO_INITDB_DATABASE: '${MONGO_DB:-app_db}',
    },
    volumes: ['mongodb_data:/data/db'],
    healthCheck: {
      test: ['CMD', 'mongosh', '--eval', 'db.adminCommand("ping")'],
      interval: '10s',
      timeout: '5s',
      retries: 5,
    },
    adminTool: {
      service: 'mongo-express',
      image: 'mongo-express:1.0.2',
      port: 8081,
      environment: {
        ME_CONFIG_MONGODB_ADMINUSERNAME: '${MONGO_ROOT_USER:-admin}',
        ME_CONFIG_MONGODB_ADMINPASSWORD: '${MONGO_ROOT_PASS:-password}',
        ME_CONFIG_MONGODB_URL:
          'mongodb://${MONGO_ROOT_USER:-admin}:${MONGO_ROOT_PASS:-password}@mongodb:27017/',
        ME_CONFIG_BASICAUTH: 'false',
      },
      profiles: ['tools'],
    },
  },
};

export const CACHE_SERVICES = {
  redis: {
    service: 'redis',
    image: 'redis:7-alpine',
    defaultPort: 6379,
    profiles: ['cache'],
    volumes: ['redis_data:/data'],
  },
};

/**
 * 데이터베이스 타입에 따른 서비스 설정을 가져오는 함수
 * @param {string} dbType - 데이터베이스 타입 (postgresql, mongodb)
 * @returns {object} 데이터베이스 서비스 설정
 */
export function getDatabaseService(dbType) {
  return DATABASE_SERVICES[dbType];
}

/**
 * 템플릿에서 사용하는 데이터베이스 타입을 추출하는 함수
 * @param {string} template - 템플릿 이름
 * @returns {string} 데이터베이스 타입
 */
export function extractDatabaseType(template) {
  if (template.includes('postgresql') || template.includes('postgres')) {
    return 'postgresql';
  }
  if (template.includes('mongodb') || template.includes('mongo')) {
    return 'mongodb';
  }
  return 'postgresql'; // 기본값
}

/**
 * 데이터베이스별 환경변수를 생성하는 함수
 * @param {string} dbType - 데이터베이스 타입
 * @param {string} templateName - 템플릿 이름
 * @returns {object} 환경변수 설정
 */
export function generateDatabaseEnv(dbType, templateName) {
  const baseEnv = {
    NODE_ENV: 'development',
    PORT: '3000',
    JWT_SECRET: 'your-super-secret-jwt-key-change-this-in-production',
    JWT_EXPIRES_IN: '24h',
    LOG_LEVEL: 'debug',
  };

  if (dbType === 'postgresql') {
    return {
      ...baseEnv,
      DATABASE_URL: `postgresql://postgres:password@postgres:5432/${templateName.replace('-', '_')}_dev`,
      DB_NAME: `${templateName.replace('-', '_')}_dev`,
      DB_USER: 'postgres',
      DB_PASSWORD: 'password',
      DB_PORT: '5432',
    };
  }

  if (dbType === 'mongodb') {
    return {
      ...baseEnv,
      MONGODB_URI: `mongodb://mongodb:27017/${templateName.replace('-', '_')}_dev`,
      MONGO_DB: `${templateName.replace('-', '_')}_dev`,
      MONGO_ROOT_USER: 'admin',
      MONGO_ROOT_PASS: 'password',
      MONGO_PORT: '27017',
    };
  }

  return baseEnv;
}
