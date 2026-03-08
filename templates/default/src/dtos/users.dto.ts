import { z } from 'zod';

// 이메일 스키마 - Entity의 검증 규칙과 일치
export const emailSchema = z
  .string()
  .min(1, { message: 'Email is required' })
  .max(254, { message: 'Email is too long (max 254 characters)' })
  .email({ message: 'Invalid email format' })
  .transform(email => email.toLowerCase().trim());

// 비밀번호 스키마 - Entity의 검증 규칙과 일치
export const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .max(128, { message: 'Password is too long (max 128 characters)' })
  .refine(password => /\d/.test(password) && /[a-zA-Z]/.test(password), {
    message: 'Password must contain at least one letter and one number',
  });

// 회원가입/로그인 DTO
export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

// 로그인 DTO (동일하지만 명시적으로 분리)
export const loginUserSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: 'Password is required' }), // 로그인시에는 기존 패스워드 검증 생략
});

export type LoginUserDto = z.infer<typeof loginUserSchema>;

// 수정 DTO (모든 필드 optional)
export const updateUserSchema = z.object({
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
