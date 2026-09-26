import { z } from 'zod';

/**
 * 회원가입 DTO 스키마
 */
export const SignupSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format')
    .min(1, 'Email cannot be empty')
    .max(255, 'Email is too long'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters long')
    .max(128, 'Password is too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
});

/**
 * 로그인 DTO 스키마
 */
export const LoginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format')
    .min(1, 'Email cannot be empty'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(1, 'Password cannot be empty'),
});

/**
 * 회원가입 요청 타입
 */
export type SignupRequest = z.infer<typeof SignupSchema>;

/**
 * 로그인 요청 타입
 */
export type LoginRequest = z.infer<typeof LoginSchema>;

/**
 * 회원가입 응답 타입
 */
export interface SignupResponse {
  data: {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
  message: 'signup';
}

/**
 * 로그인 응답 타입
 */
export interface LoginResponse {
  data: {
    id: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
  message: 'login';
}

/**
 * 로그아웃 응답 타입
 */
export interface LogoutResponse {
  message: 'logout';
}
