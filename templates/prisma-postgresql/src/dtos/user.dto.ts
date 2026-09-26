import { z } from 'zod';

/**
 * 사용자 생성 DTO 스키마
 */
export const CreateUserSchema = z.object({
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
 * 사용자 수정 DTO 스키마
 */
export const UpdateUserSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .min(1, 'Email cannot be empty')
    .max(255, 'Email is too long')
    .optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(128, 'Password is too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    )
    .optional(),
});

/**
 * URL 파라미터 스키마
 */
export const UserParamsSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
});

/**
 * 사용자 생성 요청 타입
 */
export type CreateUserRequest = z.infer<typeof CreateUserSchema>;

/**
 * 사용자 수정 요청 타입
 */
export type UpdateUserRequest = z.infer<typeof UpdateUserSchema>;

/**
 * URL 파라미터 타입
 */
export type UserParams = z.infer<typeof UserParamsSchema>;

/**
 * 사용자 응답 타입
 */
export interface UserResponse {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 사용자 목록 응답 타입
 */
export interface UsersResponse {
  data: UserResponse[];
  count: number;
}

/**
 * 단일 사용자 응답 타입
 */
export interface SingleUserResponse {
  data: UserResponse;
}
