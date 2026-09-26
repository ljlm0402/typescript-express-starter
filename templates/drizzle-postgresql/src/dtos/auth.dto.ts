import { z } from 'zod';
import type { UserResponse } from '@interfaces/user.interface';

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .max(254, 'Email is too long')
  .email('Invalid email format')
  .transform((email) => email.toLowerCase().trim());

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .refine((password) => /\d/.test(password) && /[a-zA-Z]/.test(password), {
    message: 'Password must contain at least one letter and one number',
  });

export const SignupDto = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const LoginDto = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type SignupRequest = z.infer<typeof SignupDto>;
export type LoginRequest = z.infer<typeof LoginDto>;

export interface AuthResponse {
  data: UserResponse;
  message: 'signup' | 'login';
}

export interface LogoutResponse {
  message: 'logout';
}
