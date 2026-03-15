# Drizzle PostgreSQL Template

PostgreSQL과 Drizzle ORM을 사용하는 TypeScript Express 서버 템플릿입니다.

## 🚀 빠른 시작

### 1. 환경 설정

```bash
# 환경 변수 복사
cp .env.example .env

# 의존성 설치
pnpm install
```

### 2. PostgreSQL 시작 (Docker)

```bash
# PostgreSQL 컨테이너 시작
pnpm docker:dev

# 또는 PostgreSQL만 시작
docker-compose up pg -d
```

### 3. 데이터베이스 마이그레이션

```bash
# 마이그레이션 실행 (테이블 생성)
pnpm db:migrate

# 시드 데이터 추가 (선택적)
pnpm db:seed
```

### 4. 서버 시작

```bash
# 개발 모드
pnpm dev

# 프로덕션 빌드 및 실행
pnpm build
pnpm start
```

## 🔧 데이터베이스 설정

### UUID 지원

이 템플릿은 사용자 ID에 UUID를 사용합니다. PostgreSQL에서 UUID 생성을 위해 다음이 자동 설정됩니다:

- `pgcrypto` 확장 자동 활성화
- `gen_random_uuid()` 함수를 통한 UUID 자동 생성
- 초기화 스크립트를 통한 확장 설정 자동화

### 주요 마이그레이션

```sql
-- UUID 확장 활성화
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 사용자 테이블 (UUID 기본값 포함)
CREATE TABLE "users" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "email" varchar(255) NOT NULL,
    -- ... 기타 컬럼들
);
```

## 🛠️ 개발 도구

### 데이터베이스 관리

```bash
# Drizzle Studio (GUI 관리 도구)
pnpm db:studio    # http://localhost:4983

# 스키마 변경사항을 마이그레이션으로 생성
pnpm db:generate

# 데이터베이스 리셋 (개발용)
pnpm db:reset
```

### Docker 명령어

```bash
# 전체 개발 환경 시작
pnpm docker:dev

# 서비스 중지
pnpm docker:down

# 전체 리셋 (볼륨 포함)
pnpm docker:reset

# 프로덕션 이미지 빌드
pnpm docker:prod
```

## 📋 API 엔드포인트

### 인증 (Authentication)

- `POST /api/v1/auth/register` - 회원가입
- `POST /api/v1/auth/login` - 로그인
- `POST /api/v1/auth/logout` - 로그아웃

### 사용자 관리 (Users)

- `GET /api/v1/users` - 사용자 목록 조회
- `GET /api/v1/users/:id` - 특정 사용자 조회
- `PUT /api/v1/users/:id` - 사용자 정보 수정
- `DELETE /api/v1/users/:id` - 사용자 삭제

### 예시 요청

```bash
# 사용자 생성
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }'

# 사용자 목록 조회
curl http://localhost:3000/api/v1/users
```

## 🔒 환경 파일 구조

```
.env                     # 기본 개발 설정
.env.example            # 환경 변수 템플릿
.env.development.local  # 로컬 개발 전용
.env.production.local   # 프로덕션 전용
.env.test.local         # 테스트 전용
```

## 🚨 일반적인 문제 해결

### 1. UUID 생성 오류

```
Error: Failed query: insert into "users" ...
```

**해결책:**

```bash
# pgcrypto 확장 수동 활성화
docker-compose exec pg psql -U postgres -d drizzle_db -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"

# 마이그레이션 재실행
pnpm db:push
```

### 2. 데이터베이스 연결 실패

```
Error: Migration failed: error: { "code": "3D000" }
```

**해결책:**

```bash
# PostgreSQL 컨테이너 상태 확인
docker-compose ps

# 데이터베이스 재시작
pnpm docker:reset
```

### 3. 포트 충돌

**해결책:**
`.env` 파일에서 포트 변경:

```bash
PORT=3001    # 애플리케이션 포트
POSTGRES_PORT=5433  # PostgreSQL 포트
```

## 🏗️ 프로젝트 구조

```
src/
├── app.ts              # Express 앱 설정
├── server.ts           # 서버 시작점
├── config/
│   ├── database.ts     # DB 연결 설정
│   ├── schema.ts       # Drizzle 스키마 정의
│   └── migrate.ts      # 마이그레이션 스크립트
├── controllers/        # API 컨트롤러
├── services/          # 비즈니스 로직
├── repositories/      # 데이터 액세스 계층
├── middlewares/       # Express 미들웨어
├── routes/           # 라우트 정의
├── dtos/             # 데이터 전송 객체
└── utils/            # 유틸리티 함수
```

## 📚 기술 스택

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js 5.x
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL 16
- **Authentication**: JWT
- **Validation**: Zod
- **DI Container**: TSyringe
- **Logging**: Pino
- **Testing**: Jest
- **Build**: tsup
- **Development**: Nodemon

---

문제가 발생하면 [GitHub Issues](../../issues)에서 보고해 주세요! 🚀
