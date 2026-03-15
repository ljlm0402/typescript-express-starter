import { z } from 'zod';

export const CreateUserDto = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const UpdateUserDto = z.object({
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateUserRequest = z.infer<typeof CreateUserDto>;
export type UpdateUserRequest = z.infer<typeof UpdateUserDto>;
