import { z } from 'zod';

// 비밀번호 공통 스키마
export const passwordSchema = z
  .string()
  .min(9, { message: 'Password must be at least 9 characters long.' })
  .max(32, { message: 'Password must be at most 32 characters long.' });

// 회원가입 DTO (signup, login 공용)
export const createUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email format.' }),
  password: passwordSchema,
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

// 수정 DTO (패스워드만 optional)
export const updateUserSchema = createUserSchema.partial();

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
