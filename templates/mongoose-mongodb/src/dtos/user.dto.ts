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
 * 사용자 생성 DTO 스키마
 */
export const createUserSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email format' })
    .min(1, { message: 'Email is required' })
    .max(255, { message: 'Email must be at most 255 characters long' })
    .toLowerCase(),
  password: passwordSchema,
});

/**
 * 사용자 수정 DTO 스키마 (모든 필드 optional)
 */
export const updateUserSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email format' })
    .max(255, { message: 'Email must be at most 255 characters long' })
    .toLowerCase()
    .optional(),
  password: passwordSchema.optional(),
});

/**
 * 타입 정의
 */
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;

/**
 * 사용자 응답 DTO (비밀번호 제외)
 */
export interface UserResponseDto {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 모든 사용자 조회 응답 DTO
 */
export interface GetUsersResponseDto {
  data: UserResponseDto[];
  message: 'findAll';
}

/**
 * 특정 사용자 조회 응답 DTO
 */
export interface GetUserByIdResponseDto {
  data: UserResponseDto;
  message: 'findById';
}

/**
 * 사용자 생성 응답 DTO
 */
export interface CreateUserResponseDto {
  data: UserResponseDto;
  message: 'create';
}

/**
 * 사용자 수정 응답 DTO
 */
export interface UpdateUserResponseDto {
  data: UserResponseDto;
  message: 'update';
}

/**
 * 사용자 삭제 응답 DTO
 */
export interface DeleteUserResponseDto {
  message: 'delete';
}
