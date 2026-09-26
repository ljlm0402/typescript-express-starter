import { z } from 'zod';

/**
 * 비밀번호 공통 스키마
 */
export const passwordSchema = z
  .string()
  .min(6, { message: 'Password must be at least 6 characters long' })
  .max(128, { message: 'Password must be at most 128 characters long' })
  .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, {
    message: 'Password must contain at least one letter and one number',
  });

/**
 * 회원가입 DTO 스키마
 */
export const signupSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email format' })
    .min(1, { message: 'Email is required' })
    .max(255, { message: 'Email must be at most 255 characters long' })
    .toLowerCase(),
  password: passwordSchema,
});

/**
 * 로그인 DTO 스키마
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email format' })
    .min(1, { message: 'Email is required' })
    .toLowerCase(),
  password: z.string().min(1, { message: 'Password is required' }),
});

/**
 * 타입 정의
 */
export type SignupDto = z.infer<typeof signupSchema>;
export type LoginDto = z.infer<typeof loginSchema>;

/**
 * 회원가입 응답 DTO
 */
export interface SignupResponseDto {
  data: {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
  message: 'signup';
}

/**
 * 로그인 응답 DTO
 */
export interface LoginResponseDto {
  data: {
    id: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
  message: 'login';
}

/**
 * 로그아웃 응답 DTO
 */
export interface LogoutResponseDto {
  message: 'logout';
}
