# Express + express-cargo Template

[express-cargo](https://github.com/Beyond-Imagination/express-cargo)로 요청 바인딩과 검증을 처리하는 TypeScript Express 서버 템플릿입니다.

`default` 템플릿과 구조는 같지만, 요청 검증을 스키마(zod)가 아니라 **데코레이터가 붙은 DTO 클래스**로 선언합니다. body·query·params를 하나의 DTO로 받아오고, 타입 변환과 기본값까지 바인딩 계층에서 끝냅니다.

## 🚀 빠른 시작

```bash
# 환경 변수 복사
cp .env.example .env

# 의존성 설치
pnpm install

# 개발 모드 (nodemon + tsx)
pnpm dev

# 프로덕션 빌드 및 실행
pnpm build
pnpm start
```

서버는 기본적으로 `http://localhost:3000`에서 뜨고, API는 `/api/v1` 프리픽스를 사용합니다.

| 스크립트     | 설명                                   |
| ------------ | -------------------------------------- |
| `pnpm dev`   | 개발 서버 (파일 변경 시 자동 재시작)   |
| `pnpm build` | `tsc && tsc-alias`로 `dist/` 생성      |
| `pnpm start` | 빌드 결과물 실행 (`NODE_ENV=production`) |
| `pnpm check` | 타입 검사만 수행 (`tsc --noEmit`)      |

> 데이터는 메모리에 저장됩니다. DB 없이 바로 실행해 보고, 필요할 때 `repositories/`만 교체하면 됩니다.

## 📦 express-cargo 사용법

### 1. 라우트에서 바인딩하고, 컨트롤러에서 꺼내 쓰기

`bindingCargo(Dto)`를 미들웨어로 걸면 요청을 DTO로 바인딩·검증하고, 컨트롤러에서는 `getCargo<Dto>(req)`로 검증이 끝난 값을 가져옵니다.

```ts
// routes/users.route.ts
this.router.get('/', bindingCargo(ListUsersQueryDto), this.userController.getUsers);
this.router.put('/:id', bindingCargo(UpdateUserDto), this.userController.updateUser);

// controllers/users.controller.ts
const { page, limit, search } = getCargo<ListUsersQueryDto>(req);
```

검증에 실패하면 `getCargo`가 `CargoValidationError`를 던지고, `error.middleware`가 이를 400 응답으로 변환합니다. 컨트롤러에는 검증 코드가 남지 않습니다.

### 2. 한 DTO로 여러 소스 바인딩

`PUT /users/:id`는 경로의 `:id`와 본문을 함께 씁니다. 두 소스를 하나의 DTO로 받습니다.

```ts
export class UpdateUserDto {
  @Params('id')
  @Regexp(USER_ID_PATTERN, 'Invalid user id format')
  id!: string;

  @Body()
  @Optional()
  @Email('Invalid email format')
  @Transform((email?: string) => email?.toLowerCase().trim())
  email?: string;
}
```

### 3. 쿼리 자동 변환 + 기본값

쿼리 스트링은 항상 문자열이지만, `@Query()`가 선언된 타입(`number`)으로 변환해 줍니다. `@Default`까지 붙이면 쿼리가 비어 있어도 값이 채워지므로 컨트롤러에서 분기할 일이 없습니다.

```ts
export class ListUsersQueryDto {
  @Query()
  @Default(1)
  @Min(1, 'page must be at least 1')
  page!: number;

  @Query()
  @Default(10)
  @Min(1, 'limit must be at least 1')
  @Max(100, 'limit must be at most 100')
  limit!: number;

  @Query()
  @Optional()
  search?: string;
}
```

`GET /api/v1/users`는 쿼리 없이 호출해도 `page=1&limit=10`으로 동작하고, `limit=1000`처럼 범위를 벗어나면 400을 반환합니다.

### 4. 검증 규칙은 DTO 한곳에

이메일(`@Email`), 비밀번호 길이(`@MinLength`/`@MaxLength`)와 정책(`@Regexp`), 경로 id 형식(`@Regexp`)까지 모두 DTO에 모여 있습니다. `@Transform`으로 이메일을 소문자로 정규화하는 것처럼 정제도 같은 자리에서 처리합니다.

> 회원가입(`CreateUserDto`)과 로그인(`LoginUserDto`)은 일부러 분리되어 있습니다. 로그인에 회원가입용 비밀번호 정책을 적용하면, 정책에 맞지 않는 비밀번호가 401이 아니라 400을 받아 정책이 노출되기 때문입니다. 로그인은 값의 존재 여부만 검증합니다.

### 5. 에러 응답

```jsonc
// POST /api/v1/auth/signup  { "email": "not-an-email", "password": "short" }
{
  "success": false,
  "error": {
    "code": 400,
    "message": "Validation failed",
    "timestamp": "2026-01-01T00:00:00.000Z",
    "path": "/api/v1/auth/signup",
    "details": [
      { "field": "email", "message": "Invalid email format" },
      { "field": "password", "message": "Password must be at least 8 characters long" }
    ]
  }
}
```

## 📋 API 엔드포인트

### 인증 (Authentication)

- `POST /api/v1/auth/signup` - 회원가입
- `POST /api/v1/auth/login` - 로그인 (JWT를 `Authorization` 쿠키로 발급)
- `POST /api/v1/auth/logout` - 로그아웃 (인증 필요)

### 사용자 관리 (Users)

- `GET /api/v1/users` - 사용자 목록 조회 (`page`, `limit`, `search`)
- `GET /api/v1/users/:id` - 특정 사용자 조회
- `POST /api/v1/users` - 사용자 생성
- `PUT /api/v1/users/:id` - 사용자 정보 수정
- `DELETE /api/v1/users/:id` - 사용자 삭제 (204 No Content)

### 예시 요청

```bash
# 회원가입
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{ "email": "user@example.com", "password": "password123" }'

# 목록 조회 (쿼리 생략 시 page=1, limit=10)
curl "http://localhost:3000/api/v1/users?page=1&limit=5&search=user"
```

사용자 ID는 `user_<uuid>` 형식이며, 형식이 맞지 않는 id는 바인딩 단계에서 400으로 거부됩니다.

## 🔒 환경 변수

`.env`(공통)를 먼저 읽고, `.env.{NODE_ENV}.local`이 있으면 덮어씁니다. `src/config/env.ts`가 시작 시점에 검증하며, 누락·형식 오류가 있으면 모아서 출력하고 프로세스를 종료합니다.

| 변수                          | 필수 | 설명                                     |
| ----------------------------- | ---- | ---------------------------------------- |
| `PORT`                        |      | 서버 포트 (기본 3000)                    |
| `SECRET_KEY`                  | ✅   | JWT 서명 키                              |
| `LOG_DIR` / `LOG_LEVEL`       | ✅   | 로그 디렉토리 / 레벨                     |
| `LOG_FORMAT`                  |      | morgan 포맷 (기본 `dev`)                 |
| `ORIGIN` / `CREDENTIALS`      | ✅   | CORS 기본 도메인 / 쿠키 허용 여부        |
| `CORS_ORIGINS`                |      | 추가 허용 도메인 목록 (쉼표 구분)        |
| `API_SERVER_URL`              |      | 외부 API 서버 URL                        |
| `SENTRY_DSN` / `REDIS_URL`    |      | 선택적 외부 서비스                       |

```
.env                     # 기본 개발 설정
.env.example             # 환경 변수 템플릿
.env.development.local   # 로컬 개발 전용
.env.production.local    # 프로덕션 전용
.env.test.local          # 테스트 전용
```

## 🏗️ 프로젝트 구조

```
src/
├── app.ts              # Express 앱 설정
├── server.ts           # 서버 시작점
├── config/
│   ├── container.ts    # tsyringe DI 컨테이너
│   └── env.ts          # 환경 변수 로드 및 검증
├── controllers/        # API 컨트롤러 (getCargo로 검증된 DTO 사용)
├── dtos/               # express-cargo 데코레이터 DTO
├── entities/           # 도메인 엔티티
├── exceptions/         # HttpException
├── interfaces/         # 공용 타입
├── middlewares/        # 인증 / 에러 / 404 미들웨어
├── repositories/       # 데이터 액세스 계층 (인메모리)
├── routes/             # 라우트 정의 (bindingCargo 등록)
├── services/           # 비즈니스 로직
└── utils/              # 로거, 해시, asyncHandler
```

## 📚 기술 스택

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js 5.x
- **Request Binding & Validation**: express-cargo 0.6.x
- **Authentication**: JWT (bcryptjs)
- **DI Container**: TSyringe
- **Logging**: Pino + Morgan
- **Security**: Helmet, CORS, hpp, express-rate-limit
- **Build**: tsc + tsc-alias
- **Development**: Nodemon + tsx

## 🔗 참고

- [express-cargo GitHub](https://github.com/Beyond-Imagination/express-cargo)
- [express-cargo npm](https://www.npmjs.com/package/express-cargo)

---
