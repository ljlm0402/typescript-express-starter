<h1 align="center">
<br>
  <img src="https://github.com/ljlm0402/typescript-express-starter/raw/images/newLogo.png" alt="프로젝트 로고" />
  <br>
    <br>
  TypeScript Express Starter
  <br>
</h1>

<h4 align="center">🚀 TypeScript 기반 Express RESTful API 보일러플레이트</h4>

<p align ="center">
  <a href="https://nodei.co/npm/typescript-express-starter" target="_blank">
    <img src="https://nodei.co/npm/typescript-express-starter.png" alt="npm 정보" />
  </a>
</p>

<p align="center">
    <a href="http://npm.im/typescript-express-starter" target="_blank">
      <img src="https://img.shields.io/npm/v/typescript-express-starter.svg" alt="npm 버전" />
    </a>
    <a href="http://npm.im/typescript-express-starter" target="_blank">
      <img src="https://img.shields.io/github/v/release/ljlm0402/typescript-express-starter" alt="GitHub 릴리즈 버전" />
    </a>
    <a href="http://npm.im/typescript-express-starter" target="_blank">
      <img src="https://img.shields.io/npm/dm/typescript-express-starter.svg" alt="npm 다운로드 수" />
    </a>
    <a href="http://npm.im/typescript-express-starter" target="_blank">
      <img src="https://img.shields.io/npm/l/typescript-express-starter.svg" alt="라이선스" />
    </a>
</p>

<br />

- [🇰🇷 한국어](https://github.com/ljlm0402/typescript-express-starter/blob/master/README.kr.md)
- [🇺🇸 영어](https://github.com/ljlm0402/typescript-express-starter/blob/master/README.md)

<br />

## 📝 소개

**TypeScript Express Starter**는 원하는 스택 구성으로 TypeScript Express 프로젝트를 생성하는 대화형 CLI 도구입니다.

기본 Express, Drizzle + PostgreSQL, express-cargo 기반 데코레이터 검증 템플릿 중에서 선택할 수 있습니다. 사용할 개발 도구를 선택하면 워크플로우에 필요한 의존성, 스크립트, 설정 파일을 생성합니다.

- **대화형 설정**: 데이터베이스, ORM, 린터, 테스트 프레임워크 등을 선택
- **Docker 지원**: Docker 선택 시 개발·운영용 Dockerfile 제공
- **개발자 경험**: 핫 리로드 및 선택한 테스트·린팅 도구 설정 제공
- **템플릿 선택**: 기본 Express, Drizzle + PostgreSQL, express-cargo

## 💎 CLI 주요 기능

- 🎯 **대화형 설정** — 스마트 CLI로 프로젝트 구성을 안내

- 🚀 **빠른 시작/커스텀 모드** — 프리셋으로 빠르게 시작하거나 카테고리별로 직접 선택

- 🗄️ **PostgreSQL 연동** — Drizzle ORM 템플릿과 데이터베이스 관리 스크립트 제공

- 🛠️ **개발 도구** — ESLint, Biome, Oxlint, SWC, tsup, Jest, Vitest, Docker 중 선택

- 📱 **템플릿 선택** — 인증·사용자 관리 예제를 포함한 활성 템플릿 3종

- ⚡ **자동 구성** — 의존성, 스크립트, 설정이 자동으로 설정됨

- 🔧 **의존성 구성** — 선택한 도구의 의존성을 모아 한 번에 설치

- 📦 **패키지 매니저 지원** — npm, pnpm, yarn 모두 지원

- 🚀 **환경 설정** — `.env.example`을 기반으로 난수 인증 비밀키가 포함된 `.env` 생성

- 🎨 **커스터마이징 가능** — 자신만의 템플릿과 개발 도구 추가

## ⚡️ 빠른 시작

**실행 요구사항:** Node.js **22.12.0 이상**, npm **9.11.0 이상**이 필요합니다. CLI에서 pnpm 또는 Yarn을 선택하려면 해당 패키지 관리자를 별도로 설치하세요. Docker 구성을 실행하려면 Docker와 Compose가 필요합니다.

전역 설치 없이 CLI를 실행할 수도 있습니다:

```bash
npx typescript-express-starter
```

```bash
# 전역 설치
npm install -g typescript-express-starter

# 대화형 CLI 실행
typescript-express-starter

┌  📘 TypeScript Express Starter
│
◇  Choose setup mode:
│  ● 🚀 Quick start (recommended preset) (Automatically selects a sensible toolset)
│  ○ 🛠 Custom (step-by-step) (Pick tools category by category)
│
◇  Which package manager do you want to use?
│  ● npm
│  ○ pnpm
│  ○ yarn
│
◇  Choose a template:
│  ● Express TypeScript (Basic Express + TypeScript starter · beginner · stable)
│  ○ Drizzle PostgreSQL (Modern SQL toolkit with type safety + full devtools · intermediate · stable)
│  ○ Express + express-cargo (Declarative validation & binding with decorators · intermediate · stable)
│
◇  Enter your project name:
│  your-project-name
│
◇  Choose quick profile:
│  ○ Minimal (Template only (no additional devtools))
│  ● Recommended (Balanced default toolchain)
│  ○ Full (One tool from each category)
│
◇  Preset ───────────────────────────────────────────────────────────────╮
│                                                                        │
│  Quick profile selected: recommended (eslint, tsup, vitest, docker)    │
│                                                                        │
├────────────────────────────────────────────────────────────────────────╯
│
◇  Configuration summary ────────────────────────────────────────────────╮
│                                                                        │
│  Setup mode     : quick                                                │
│  Package manager: npm                                                  │
│  Template       : Express TypeScript                                   │
│  Project name   : your-project-name                                    │
│  Devtools       : ESLint + Prettier, tsup, Vitest, Docker              │
│                                                                        │
├────────────────────────────────────────────────────────────────────────╯
│
◆  Proceed with project generation?
│  ● Yes / ○ No
│
✔ Dependencies installed!
│
└ 🎉 Project setup complete!

# 프로젝트로 이동
cd your-project-name

# 개발 서버 시작
npm run dev
```

**생성된 프로젝트 기능:**

- 🌐 Express 서버: `http://localhost:3000/`
- 🔄 nodemon을 통한 핫 리로드

### 환경 설정 및 실행

CLI는 `.env.example`을 기반으로 `.env`를 생성하고, `SECRET_KEY`와 `JWT_SECRET` 항목이 있으면 난수 값을 설정합니다. 기존 `.env`는 유지합니다. 비밀키는 최소 32자여야 하며 알려진 예시 값을 포함할 수 없습니다. 배포 전 생성된 설정을 환경에 맞게 확인하세요.

Drizzle은 `DATABASE_URL` 설정, PostgreSQL 준비 및 `npm run db:migrate` 실행 후 API를 사용하세요. `default`와 `express-cargo`는 별도 데이터베이스가 필요하지 않습니다. pnpm 또는 Yarn을 선택했다면 `pnpm dev` 또는 `yarn dev`로 실행할 수 있습니다.

인증·사용자 API 경로는 `/api/v1/auth`, `/api/v1/users`이며 루트 URL은 랜딩 페이지가 아닙니다.

## 📂 프로젝트 구조

```bash
your-project/
├── src/
│   ├── config/           # 환경 변수, 설정 파일
│   ├── controllers/      # 요청 처리 및 응답 반환
│   ├── dtos/             # 요청/응답 데이터 구조 정의
│   ├── entities/         # 도메인 엔티티 정의
│   ├── exceptions/       # 커스텀 예외 클래스
│   ├── interfaces/       # 타입/인터페이스 정의
│   ├── middlewares/      # 미들웨어 (로그, 인증, 에러 처리 등)
│   ├── repositories/     # 데이터 접근 로직 (인메모리 또는 DB)
│   ├── routes/           # 라우팅 정의
│   ├── services/         # 비즈니스 로직
│   ├── utils/            # 유틸리티 함수
│   ├── app.ts            # Express 앱 초기화
│   └── server.ts         # 서버 실행 엔트리 포인트
├── .env                  # 자동 생성된 로컬 환경 설정
├── .env.example          # 환경 변수 예시
├── .gitignore            # 비밀키·생성 파일 Git 제외 설정
├── .project-meta.json    # 선택한 템플릿·도구·패키지 관리자 정보
├── nodemon.json           # Nodemon 환경 변수
├── package.json           # 프로젝트 의존성 및 스크립트
└── tsconfig.json          # TypeScript 환경 변수

```

컴파일러·테스트·Docker 설정 파일은 선택한 도구에 따라 추가됩니다. 환경별 `.env.{NODE_ENV}.local` 파일은 선택 사항이며 자동 생성되지 않습니다. CLI 업데이트는 새로 생성하는 프로젝트에 적용되며 기존 프로젝트는 별도로 관리해야 합니다.

## 🛠 사용 가능한 개발 도구

프로젝트 설정 중 다음 카테고리에서 선택할 수 있습니다:

| 카테고리     | 사용 가능한 도구            | 설명                                 |
| ------------ | --------------------------- | ------------------------------------ |
| **린터**     | `biome`, `eslint`, `oxlint` | 코드 포맷팅 및 린팅 (Biome은 올인원) |
| **번들러**   | `swc`, `tsup`               | 빠른 TypeScript 컴파일 및 번들링     |
| **테스트**   | `jest`, `vitest`            | 단위 및 통합 테스트 프레임워크       |
| **컨테이너** | `docker`                    | Dockerfile 및 Docker Compose 구성        |

### 나중에 추가될 예정 (현재 개발 중):

| 카테고리     | 사용 가능한 도구 | 설명                           |
| ------------ | ---------------- | ------------------------------ |
| **프로세스** | `pm2`            | 프로덕션 프로세스 관리         |
| **CI/CD**    | `github`         | GitHub Actions 워크플로우      |
| **Git 훅**   | `husky`          | 품질 관리를 위한 Pre-commit 훅 |
| **API 문서** | `swagger`        | OpenAPI/Swagger 문서           |

**스마트 선택**: 추천 프로필은 템플릿별 도구 구성을 사용합니다. CLI는 해당 컴파일러·테스트 설정을 복사하고 필수 파일이 누락되면 오류를 표시합니다.

## 🧩 사용 가능한 템플릿

CLI에서 선택할 수 있으며 npm 패키지에 포함되는 템플릿입니다:

### ✅ **사용 가능한 템플릿**

| 템플릿 | 설명 | 저장소 |
| --- | --- | --- |
| `default` | Express + TypeScript 및 Zod 요청 검증 | 인메모리 |
| `drizzle-postgresql` | Drizzle ORM과 PostgreSQL 연동 | PostgreSQL |
| `express-cargo` | 데코레이터 기반 DTO 검증 및 요청 바인딩 | 인메모리 |

인메모리 템플릿의 사용자 데이터는 프로세스를 재시작하면 초기화됩니다. DTO와 바인딩 예제는 [express-cargo 가이드](templates/express-cargo/README.md)를 참고하세요.

### 🔧 **향상된 개발 도구 지원**

활성 템플릿은 다음 도구의 설정을 제공합니다:

#### 린터

- ✅ **Biome** - 현대적 통합 도구 (린터 + 포맷터)
- ✅ **ESLint + Prettier** - 전통적이고 안정적인 조합
- ✅ **Oxlint** - Rust 기반 고성능 린터

#### 컴파일러

- ✅ **tsup** - esbuild 기반 번들러
- ✅ **SWC** - Rust 기반 네이티브 성능 컴파일러

#### 테스트 러너

- ✅ **Jest** - 완전한 E2E 지원을 가진 성숙한 테스트 프레임워크
- ✅ **Vitest** - 현대적 Vite 기반 테스트 러너

> 🎯 생성 테스트는 활성 템플릿·린터·컴파일러·테스트 러너·Docker의 36개 조합을 대상으로 합니다. 실제 실행 호환성은 별도의 `npm run test:matrix` 명령으로 확인할 수 있습니다.

### 🚧 **개발 예정**

아래 항목은 CLI에서 선택할 수 없습니다. Prisma와 Mongoose 구현은 저장소에 있지만 검증 대기 상태이며 npm 패키지에서는 제외됩니다.

#### **ORM/데이터베이스 연동**

| 템플릿          | 설명                                              | 우선순위 |
| --------------- | ------------------------------------------------- | -------- |
| `prisma-postgresql`        | 타입 안전 데이터베이스 클라이언트, 자동 타입 생성 | 🔥 다음  |
| `mongoose-mongodb`      | Node.js용 우아한 MongoDB ODM                      | 🔥 다음  |
| `typeorm`       | 데코레이터 기반 Active Record ORM                 | 🚧 예정  |
| `sequelize`     | 성숙한 Promise 기반 SQL ORM                       | 🚧 예정  |
| `mikro-orm`     | TypeScript용 Data Mapper ORM 패턴                 | 🚧 예정  |
| `typegoose`     | TypeScript 친화적 Mongoose 대안                   | 🚧 예정  |
| `node-postgres` | 고성능 PostgreSQL 원시 드라이버                   | 🚧 예정  |
| `knex`          | 유연한 SQL 쿼리 빌더 및 마이그레이션              | 🚧 예정  |

#### **아키텍처/컨트롤러 스타일**

| 템플릿    | 설명                                  | 우선순위   |
| --------- | ------------------------------------- | ---------- |
| `graphql` | Apollo Server 기반 GraphQL API 스키마 | 🚧 검토 중 |

## 🤔 이 CLI를 사용하는 이유?

### vs. 수동 설정

| 측면          | 수동 설정              | TypeScript Express Starter CLI |
| ------------- | ---------------------- | ------------------------------ |
| **시간**      | 🔴 수 시간의 구성 작업 | ✅ 대화형 설정 안내           |
| **구성**      | 🔴 수동 의존성 관리    | ✅ 자동 해결, 호환 버전        |
| **모범 사례** | 🔴 연구 필요           | ✅ 사전 구성된 업계 표준       |
| **일관성**    | 🔴 개발자마다 다름     | ✅ 표준화된 프로젝트 구조      |
| **업데이트**  | 🔴 수동 유지보수       | ✅ 새 프로젝트에 최신 템플릿 적용 |

### vs. 다른 생성기

| 기능                  | TypeScript Express Starter | 다른 생성기  |
| --------------------- | -------------------------- | ------------ |
| **데이터베이스 선택** | ✅ PostgreSQL 및 추가 연동 계획     | 제한된 옵션  |
| **도구 선택**         | ✅ 믹스 앤 매치 개발 도구  | 고정된 스택  |
| **TypeScript 우선**   | ✅ TypeScript를 위해 제작  | 주로 JS 우선 |
| **프로덕션 준비**     | ✅ Docker 구성 선택 가능        | 기본 설정    |

## ⭐️ 응원해주신 분들

[![Stargazers repo roster for @ljlm0402/typescript-express-starter](https://reporoster.com/stars/ljlm0402/typescript-express-starter)](https://github.com/ljlm0402/typescript-express-starter/stargazers)

## 🍴 참고하시는 분들

[![Forkers repo roster for @ljlm0402/typescript-express-starter](https://reporoster.com/forks/ljlm0402/typescript-express-starter)](https://github.com/ljlm0402/typescript-express-starter/network/members)

## 🤝 도움주신 분들

[![Contributors repo roster for @ljlm0402/typescript-express-starter](https://contributors-img.web.app/image?repo=ljlm0402/typescript-express-starter)](https://github.com/ljlm0402/typescript-express-starter/graphs/contributors)

## 💳 라이선스

[MIT](LICENSE)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/ljlm0402">AGUMON</a> 🦖
</p>
