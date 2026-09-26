import { z } from "zod";

// 비밀번호 공통 스키마
export const passwordSchema = z
  .string()
  .min(9, { message: "Password must be at least 9 characters long." })
  .max(32, { message: "Password must be at most 32 characters long." });

// 회원가입 DTO
export const createUserSchema = z.object({
  email: z.string().email({ message: "Invalid email format." }),
  password: passwordSchema,
  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(50, { message: "Name must be at most 50 characters long." }),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

// 로그인 DTO
export const loginUserSchema = z.object({
  email: z.string().email({ message: "Invalid email format." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export type LoginUserDto = z.infer<typeof loginUserSchema>;

// 수정 DTO (모든 필드 optional)
export const updateUserSchema = createUserSchema.partial();

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
