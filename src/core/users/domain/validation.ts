import { z } from 'zod';

export const UserRoleSchema = z.enum(['USER', 'ADMIN']);

export const RegisterUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  avatar: z.string().url().optional().nullable(),
});

export const LoginSchema = z.object({
  email: z.string().trim().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterUserPayload = z.infer<typeof RegisterUserSchema>;
export type LoginPayload = z.infer<typeof LoginSchema>;
