import chalk from 'chalk';
import editJsonFile from 'edit-json-file';
import fs from 'fs';
import path from 'path';

/**
 * 지원하는 패키지 매니저 목록
 * 사용자가 선택할 수 있는 npm, pnpm, yarn 옵션 제공
 * @type {Array<{label: string, value: string}>}
 */
export const PACKAGE_MANAGER = [
  { label: 'npm', value: 'npm' },
  { label: 'pnpm', value: 'pnpm' },
  { label: 'yarn', value: 'yarn' },
];

/**
 * 사용 가능한 TypeScript Express 프로젝트 템플릿 목록
 * 각 템플릿은 특정 ORM/ODM과 데이터베이스 조합을 제공
 * @type {Array<TemplateConfig>}
 * - name: 사용자 인터페이스에 표시되는 템플릿 이름
 * - value: 내부적으로 사용되는 고유 식별자 (폴더명과 일치)
 * - desc: 사용자에게 보여지는 템플릿 설명
 * - active: 템플릿 활성화 여부 (비활성 시 CLI에서 숨김)
 * - tags: 템플릿 특성을 나타내는 태그 배열 (검색, 필터링용)
 * - version: 템플릿 버전 (SemVer 형식)
 * - maintainer: 템플릿 유지보수 담당팀
 * - lastUpdated: 마지막 업데이트 날짜 (YYYY-MM-DD 형식)
 * - devtoolsCompatibility: DevTools와의 호환성 비율 또는 상태
 * - verificationStatus: 템플릿 검증 완료 상태 (complete|pending|failed)
 * - complexity: 사용 복잡도 수준 (beginner|intermediate|advanced)
 * - maturity: 템플릿 성숙도 (stable|beta|alpha|experimental)
 * - performanceRating: 성능 등급 (A|B|C|D)
 * - recommendedFor: 추천 사용 사례 목록
 * - learningCurve: 학습 난이도 (easy|moderate|steep)
 * - enterpriseReady: 엔터프라이즈 환경 준비 완료 여부
 */
export const TEMPLATES_VALUES = [
  {
    name: 'Express TypeScript',
    value: 'default',
    desc: 'Basic Express + TypeScript starter',
    active: true,
    tags: ['express', 'typescript', 'starter', 'verified'],
    version: 'v2.0.0',
    maintainer: 'core',
    lastUpdated: '2026-02-23',
    devtoolsCompatibility: '100%',
    verificationStatus: 'complete',
    complexity: 'beginner',
    maturity: 'stable',
    performanceRating: 'A',
    recommendedFor: ['스타터', '프로토타입', '소규모 프로젝트'],
    learningCurve: 'easy',
    enterpriseReady: true,
  },
  {
    /** Drizzle ORM + PostgreSQL 템플릿 */
    name: 'Drizzle + PostgreSQL',
    value: 'drizzle-postgresql',
    desc: 'Modern SQL toolkit with type safety + full devtools',
    active: true,
    tags: ['orm', 'drizzle', 'postgresql', 'verified', 'enhanced'],
    version: 'v1.1.0',
    maintainer: 'core',
    lastUpdated: '2026-03-11',
    devtoolsCompatibility: '100%',
    verificationStatus: 'complete',
    complexity: 'intermediate',
    maturity: 'stable',
    performanceRating: 'A+',
    recommendedFor: ['중규모 프로젝트', '타입 안전성 중요', '성능 최적화', '코드 품질'],
    learningCurve: 'moderate',
    enterpriseReady: true,
  },
  {
    /** Prisma ORM + PostgreSQL 템플릿 */
    name: 'Prisma + PostgreSQL',
    value: 'prisma-postgresql',
    desc: 'Next-generation ORM for rapid development',
    active: false,
    tags: ['orm', 'prisma', 'postgresql', 'verified'],
    version: 'v7.4.1',
    maintainer: 'db-team',
    lastUpdated: '2026-02-23',
    devtoolsCompatibility: '100%',
    verificationStatus: 'complete',
    complexity: 'beginner',
    maturity: 'stable',
    performanceRating: 'A',
    recommendedFor: ['빠른 프로토타이핑', '대규모 프로젝트', '개발자 경험'],
    learningCurve: 'easy',
    enterpriseReady: true,
  },

  /**
   * ==== [개발 중인 템플릿들 - DevTools 호환성 테스트 대기 중] ====
   * 아래 템플릿들은 현재 개발 중이며 DevTools 호환성 테스트를 진행 중입니다.
   */
  {
    /** Mongoose ODM + MongoDB 템플릿 (개발 중) */
    name: 'Mongoose + MongoDB',
    value: 'mongoose-mongodb',
    desc: 'Traditional MongoDB ODM',
    active: false,
    tags: ['mongodb', 'odm', 'database', 'testing'],
    version: 'v7.x',
    maintainer: 'nosql-team',
    lastUpdated: '2026-02-23',
    devtoolsCompatibility: 'testing',
    verificationStatus: 'pending',
    complexity: 'intermediate',
    maturity: 'beta',
    performanceRating: 'B',
    recommendedFor: ['NoSQL 프로젝트', '문서 기반 데이터'],
    learningCurve: 'moderate',
    enterpriseReady: false,
  },
  {
    /** Typegoose ODM + MongoDB 템플릿 (개발 중) */
    name: 'Typegoose + MongoDB',
    value: 'typegoose-mongodb',
    desc: 'TypeScript-friendly MongoDB ODM',
    active: false,
    tags: ['mongodb', 'typegoose', 'odm', 'testing'],
    version: 'v11.x',
    maintainer: 'nosql-team',
    lastUpdated: '2026-02-23',
    devtoolsCompatibility: 'testing',
    verificationStatus: 'pending',
    complexity: 'intermediate',
    maturity: 'beta',
    performanceRating: 'B',
    recommendedFor: ['타입 안전한 NoSQL', '중규모 MongoDB 프로젝트'],
    learningCurve: 'moderate',
    enterpriseReady: false,
  },
  {
    /** TypeORM + PostgreSQL 템플릿 (개발 중) */
    name: 'TypeORM + PostgreSQL',
    value: 'typeorm-postgresql',
    desc: 'Decorator-based ORM',
    active: false,
    tags: ['orm', 'typeorm', 'postgresql', 'testing'],
    version: 'v0.3.x',
    maintainer: 'orm-team',
    lastUpdated: '2026-02-23',
    devtoolsCompatibility: 'testing',
    verificationStatus: 'pending',
    complexity: 'advanced',
    maturity: 'beta',
    performanceRating: 'B',
    recommendedFor: ['복잡한 데이터 모델', '엔터프라이즈 규모'],
    learningCurve: 'steep',
    enterpriseReady: false,
  },
  {
    /** MikroORM + PostgreSQL 템플릿 (개발 중) */
    name: 'MikroORM + PostgreSQL',
    value: 'mikro-orm-postgresql',
    desc: 'Data mapper pattern ORM',
    active: false,
    tags: ['orm', 'mikroorm', 'postgresql', 'testing'],
    version: 'v6.x',
    maintainer: 'orm-team',
    lastUpdated: '2026-02-23',
    devtoolsCompatibility: 'testing',
    verificationStatus: 'pending',
    complexity: 'advanced',
    maturity: 'beta',
    performanceRating: 'A',
    recommendedFor: ['고성능 요구사항', '복잡한 쿼리 최적화'],
    learningCurve: 'steep',
    enterpriseReady: false,
  },
  {
    /** Sequelize ORM + PostgreSQL 템플릿 (개발 중) */
    name: 'Sequelize + PostgreSQL',
    value: 'sequelize-postgresql',
    desc: 'Traditional SQL ORM',
    active: false,
    tags: ['orm', 'sequelize', 'postgresql', 'testing'],
    version: 'v6.x',
    maintainer: 'orm-team',
    lastUpdated: '2026-02-23',
    devtoolsCompatibility: 'testing',
    verificationStatus: 'pending',
    complexity: 'intermediate',
    maturity: 'beta',
    performanceRating: 'C',
    recommendedFor: ['기존 프로젝트 마이그레이션', 'SQL 친숙한 팀'],
    learningCurve: 'moderate',
    enterpriseReady: false,
  },
  {
    /** Knex.js Query Builder + PostgreSQL 템플릿 (개발 중) */
    name: 'Knex + PostgreSQL',
    value: 'knex-postgresql',
    desc: 'Flexible SQL query builder',
    active: false,
    tags: ['query-builder', 'knex', 'postgresql', 'testing'],
    version: 'v3.x',
    maintainer: 'db-team',
    lastUpdated: '2026-02-23',
    devtoolsCompatibility: 'testing',
    verificationStatus: 'pending',
    complexity: 'intermediate',
    maturity: 'beta',
    performanceRating: 'A',
    recommendedFor: ['SQL 직접 제어', '마이그레이션 중요'],
    learningCurve: 'moderate',
    enterpriseReady: false,
  },
  {
    /** node-postgres (pg) + PostgreSQL 템플릿 (개발 중) */
    name: 'Node-Postgres + PostgreSQL',
    value: 'node-postgres-postgresql',
    desc: 'Pure SQL with pg library',
    active: false,
    tags: ['postgresql', 'sql', 'raw', 'testing'],
    version: 'v8.x',
    maintainer: 'db-team',
    lastUpdated: '2026-02-23',
    devtoolsCompatibility: 'testing',
    verificationStatus: 'pending',
    complexity: 'advanced',
    maturity: 'beta',
    performanceRating: 'A',
    recommendedFor: ['최고 성능', 'SQL 전문가', '세밀한 제어'],
    learningCurve: 'steep',
    enterpriseReady: false,
  },
];

/**
 * 사용 가능한 개발 도구 (DevTools) 목록
 * 각 도구는 특정 카테고리에 속하며 템플릿과 조합하여 사용됨
 * @type {Array<DevtoolConfig>}
 * - name: 사용자 인터페이스에 표시되는 도구 이름
 * - value: 내부적으로 사용되는 고유 식별자 (폴더명과 일치)
 * - category: 도구 카테고리 (Linter, Compiler, Testing 등)
 * - files: 템플릿에 복사될 설정 파일 목록
 * - pkgs: 일반 npm 의존성 패키지 목록
 * - devPkgs: 개발용(devDependencies) npm 패키지 목록
 * - scripts: package.json scripts에 추가될 명령어 매핑
 * - desc: 도구 설명
 * - postInstall: 패키지 설치 후 실행되는 후처리 함수 (선택적)
 */
export const DEVTOOLS_VALUES = [
  /** == [Linter 카테고리] == */
  {
    /** Biome - All-in-one 포맷터 겸 린터 */
    name: 'Biome',
    value: 'biome',
    category: 'Linter',
    files: ['.biome.json', '.biomeignore'],
    pkgs: [],
    devPkgs: ['@biomejs/biome@2.4.6'],
    scripts: {
      lint: 'biome lint .',
      check: 'biome check .',
      format: 'biome format . --write',
    },
    desc: 'All-in-one formatter and linter',
  },
  {
    /** ESLint + Prettier 조합 린터 */
    name: 'ESLint & Prettier',
    value: 'eslint',
    category: 'Linter',
    files: ['.prettierrc', 'eslint.config.cjs'],
    pkgs: [],
    devPkgs: [
      'eslint@^9.33.0',
      'eslint-config-prettier@^10.1.1',
      'globals@^15.10.0',
      'prettier@3.6.2',
      'typescript-eslint@8.57.0',
    ],
    scripts: {
      lint: 'eslint --ext .ts src/',
      'lint:fix': 'npm run lint -- --fix',
      format: 'prettier --check .',
      'format:fix': 'prettier --write .',
    },
    desc: 'Separate formatter and linter setup',
  },
  {
    /** Oxlint - Rust 기반 고성능 린터 */
    name: 'Oxlint',
    value: 'oxlint',
    category: 'Linter',
    files: ['.oxlintrc.json', '.prettierrc'],
    pkgs: [],
    devPkgs: ['oxlint@^1.14.0', '@oxlint/migrate@^1.14.0', 'prettier@3.6.2'],
    scripts: {
      lint: 'oxlint .',
      'lint:fix': 'oxlint . --fix',
      format: 'prettier --check .',
      'format:fix': 'prettier --write .',
    },
    desc: 'Ultra-fast Rust linter for JS/TS',
  },

  /** == [Compiler 카테고리] == */
  {
    /** tsup - esbuild 기반 빠른 번들러 */
    name: 'tsup',
    value: 'tsup',
    category: 'Compiler',
    files: ['tsup.config.ts'],
    pkgs: [],
    devPkgs: ['tsup@8.5.0'],
    scripts: {
      'start:tsup': 'node -r tsconfig-paths/register dist/server.js',
      'build:tsup': 'tsup --config tsup.config.ts',
    },
    desc: 'Fast bundler for TypeScript',
    postInstall: (destDir) => {
      // tsup 선택 시 메인 build 명령어를 tsup으로 변경
      const pkgPath = path.join(destDir, 'package.json');
      const file = editJsonFile(pkgPath, { autosave: true });

      // 기존 tsc 명령어를 보존하고 새로운 메인 build로 설정
      const currentBuild = file.get('scripts.build') || 'tsc && tsc-alias';
      file.set('scripts.build', 'tsup --config tsup.config.ts');
      file.set('scripts.build:tsc', currentBuild);
      file.set('scripts.build:watch', 'tsup --watch');

      file.save();
      console.log(chalk.gray('    ❖ Main build command set to: tsup'));
      console.log(chalk.gray('    ❖ TypeScript fallback available: pnpm build:tsc'));
    },
  },
  {
    /** SWC - Rust 기반 TypeScript 컴파일러 */
    name: 'SWC',
    value: 'swc',
    category: 'Compiler',
    files: ['.swcrc'],
    pkgs: [],
    devPkgs: ['@swc/cli@0.8.0', '@swc/core@1.9.3'],
    scripts: {
      'start:swc': 'node dist/server.js',
      'build:swc': 'swc src -d dist --strip-leading-paths --copy-files --delete-dir-on-start',
    },
    desc: 'Rust-based TypeScript compiler',
    postInstall: (destDir) => {
      // SWC 선택 시 메인 build 명령어를 SWC로 변경
      const pkgPath = path.join(destDir, 'package.json');
      const file = editJsonFile(pkgPath, { autosave: true });

      // 기존 tsc 명령어를 보존하고 새로운 메인 build로 설정
      const currentBuild = file.get('scripts.build') || 'tsc && tsc-alias';
      file.set(
        'scripts.build',
        'swc src -d dist --strip-leading-paths --copy-files --delete-dir-on-start',
      );
      file.set('scripts.build:tsc', currentBuild);
      file.set('scripts.build:watch', 'swc src -d dist --watch');

      file.save();
      console.log(chalk.gray('    ❖ Main build command set to: SWC'));
      console.log(chalk.gray('    ❖ TypeScript fallback available: pnpm build:tsc'));
    },
  },

  /** == [Testing 카테고리] == */
  {
    /** Jest - 업계 표준 테스트 프레임워크 */
    name: 'Jest',
    value: 'jest',
    category: 'Testing',
    files: ['jest.config.cjs', 'jest.config.ts', 'jest.unit.config.cjs', 'src/test'],
    pkgs: [],
    devPkgs: [
      '@types/supertest@6.0.3',
      'supertest@7.1.4',
      '@types/jest@30.0.0',
      'jest@30.0.5',
      'ts-jest@29.4.1',
      'ts-node@10.9.2',
    ],
    scripts: {
      test: 'jest --config jest.config.cjs --verbose --runInBand --no-coverage',
      'test:e2e': 'jest --config jest.config.cjs --testPathPatterns=e2e --verbose --runInBand',
      'test:unit': 'jest --config jest.config.cjs --testPathPatterns=unit --verbose --runInBand',
    },
    postInstall: (projectPath) => {
      // Jest types를 tsconfig.json에 추가
      const tsconfigPath = path.join(projectPath, 'tsconfig.json');

      if (fs.existsSync(tsconfigPath)) {
        const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
        if (!tsconfig.compilerOptions.types) {
          tsconfig.compilerOptions.types = ['node'];
        }
        if (!tsconfig.compilerOptions.types.includes('jest')) {
          tsconfig.compilerOptions.types.push('jest');
        }
        if (!tsconfig.exclude) {
          tsconfig.exclude = [];
        }
        if (!tsconfig.exclude.includes('**/unit_disabled/**')) {
          tsconfig.exclude.push('**/unit_disabled/**');
        }
        fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2), 'utf8');
        console.log('✅ Jest types and exclude patterns added to tsconfig.json');
      }
    },
    desc: 'Industry-standard test runner for Node.js',
  },
  {
    /** Vitest - Vite 기반 현대적 테스트 러너 */
    name: 'Vitest',
    value: 'vitest',
    category: 'Testing',
    files: ['vitest.config.ts', 'src/test'],
    pkgs: [],
    devPkgs: [
      '@types/supertest@6.0.3',
      'supertest@7.1.4',
      'vite-tsconfig-paths@5.1.4',
      'vitest@3.2.4',
    ],
    scripts: {
      test: 'vitest',
      'test:unit': 'vitest src/test/unit',
      'test:e2e': 'vitest src/test/e2e',
      'test:ci': 'vitest run --coverage',
      'test:ci:unit': 'vitest run src/test/unit --coverage',
      'test:ci:e2e': 'vitest run src/test/e2e --coverage',
    },
    desc: 'Fast Vite-powered unit/e2e test framework',
  },

  // == [API development] == //
  // {
  //   name: 'Swagger',
  //   value: 'swagger',
  //   category: 'API development',
  //   files: ['swagger.yaml'],
  //   pkgs: ['swagger-jsdoc@^6.2.8', 'swagger-ui-express@^5.0.1'],
  //   devPkgs: ['@types/swagger-jsdoc@^6.0.4', '@types/swagger-ui-express@^4.1.8'],
  //   scripts: {},
  //   desc: 'Simplify your API development with our open-source and professional tools',
  // },

  // == [Infrastructure] == //
  {
    name: 'Docker',
    value: 'docker',
    category: 'Infrastructure',
    files: [], // generateDockerFiles() 함수로 동적 처리
    pkgs: [],
    devPkgs: [],
    scripts: {
      'docker:dev': 'docker-compose -f docker-compose.yml up --build',
      'docker:down': 'docker-compose down',
      'docker:reset': 'docker-compose down -v && docker-compose up --build',
      'docker:prod': 'docker build -f Dockerfile.prod -t ${npm_package_name}:latest .',
    },
    desc: 'Containerized development and production environment',
    postInstall: null, // Docker 설정은 starter.js에서 별도 처리
  },

  // == [Git Tools] == //
  // {
  //   name: 'Husky',
  //   value: 'husky',
  //   category: 'Git Tools',
  //   files: ['.husky'],
  //   pkgs: [],
  //   devPkgs: ['husky'],
  //   scripts: { prepare: 'husky install' },
  //   requires: [],
  //   desc: 'Git hooks for automation',
  // },

  // == [Deployment] == //
  // {
  //   name: 'PM2',
  //   value: 'pm2',
  //   category: 'Deployment',
  //   files: ['ecosystem.config.js'],
  //   pkgs: ['pm2'],
  //   devPkgs: [],
  //   scripts: {
  //     'deploy:prod': 'pm2 start ecosystem.config.js --only prod',
  //     'deploy:dev': 'pm2 start ecosystem.config.js --only dev',
  //   },
  //   desc: 'Process manager for Node.js',
  // },

  // == [CI/CD] == //
  // {
  //   name: 'GitHub Actions',
  //   value: 'github',
  //   category: 'CI/CD',
  //   files: ['.github/workflows/ci.yml'],
  //   pkgs: [],
  //   devPkgs: [],
  //   scripts: {},
  //   desc: 'CI/CD workflow automation',
  // },
];
