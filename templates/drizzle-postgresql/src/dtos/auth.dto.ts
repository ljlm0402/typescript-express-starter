import { z } from 'zod';

export const SignupDto = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const LoginDto = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type SignupRequest = z.infer<typeof SignupDto>;
export type LoginRequest = z.infer<typeof LoginDto>;

export interface AuthResponse {
  data: {
    id: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
  message: 'signup' | 'login';
}

export interface LogoutResponse {
  message: 'logout';
}
