import {
  Body,
  Default,
  Email,
  Max,
  MaxLength,
  Min,
  MinLength,
  Optional,
  Params,
  Query,
  Regexp,
  Transform,
} from 'express-cargo';

// 저장 ID 형식: `user_<uuid>` — 경로 파라미터를 binding 계층에서 바로 검증
const USER_ID_PATTERN = /^user_[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
// 비밀번호 정책: 최소 한 개의 문자와 숫자 포함 (길이는 @MinLength/@MaxLength로 별도 검증)
const PASSWORD_RULE = /(?=.*[a-zA-Z])(?=.*\d)/;
const PASSWORD_RULE_MESSAGE = 'Password must contain at least one letter and one number';

// 회원가입 DTO - 비밀번호 정책까지 DTO에서 선언적으로 검증 (Body 바인딩)
export class CreateUserDto {
  @Body()
  @Email('Invalid email format')
  @Transform((email: string) => email.toLowerCase().trim())
  email!: string;

  @Body()
  @MinLength(8, 'Password must be at least 8 characters long')
  @MaxLength(128, 'Password is too long (max 128 characters)')
  @Regexp(PASSWORD_RULE, PASSWORD_RULE_MESSAGE)
  password!: string;
}

// 로그인 DTO - 인증은 비밀번호 강도 정책을 적용하지 않고 존재 여부만 확인
// (생성 정책으로 인증을 게이팅하면 정책 위반 비밀번호가 401이 아닌 400을 받게 됨)
export class LoginUserDto {
  @Body()
  @Email('Invalid email format')
  @Transform((email: string) => email.toLowerCase().trim())
  email!: string;

  @Body()
  @MinLength(1, 'Password is required')
  password!: string;
}

// 수정 DTO - 경로의 :id(Params)와 본문(Body)을 하나의 DTO로 멀티소스 바인딩
export class UpdateUserDto {
  @Params('id')
  @Regexp(USER_ID_PATTERN, 'Invalid user id format')
  id!: string;

  @Body()
  @Optional()
  @Email('Invalid email format')
  @Transform((email?: string) => email?.toLowerCase().trim())
  email?: string;

  @Body()
  @Optional()
  @MinLength(8, 'Password must be at least 8 characters long')
  @MaxLength(128, 'Password is too long (max 128 characters)')
  @Regexp(PASSWORD_RULE, PASSWORD_RULE_MESSAGE)
  password?: string;
}

// 목록 조회 쿼리 DTO
// - @Query()가 문자열을 선언 타입(number)으로 자동 변환/검증
// - @Default로 쿼리가 비어 있어도 항상 페이지네이션 (page=1, limit=10)
// - @Min/@Max로 범위를 강제해 잘못된 값은 400으로 거부
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

// 경로 파라미터 DTO - :id 바인딩 + 형식 검증을 binding 계층에서 처리
export class UserParamsDto {
  @Params('id')
  @Regexp(USER_ID_PATTERN, 'Invalid user id format')
  id!: string;
}