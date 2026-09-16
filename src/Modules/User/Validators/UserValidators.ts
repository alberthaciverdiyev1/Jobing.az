import { z } from 'zod';

export const emailField = z.email('Enter a valid email address').max(255).toLowerCase();
export const nameField = z.string().trim().min(2, 'Name must be at least 2 characters').max(255);
export const passwordField = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long');

export const registerSchema = z.object({
  email: emailField,
  name: nameField,
  password: passwordField,
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Enter your password'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Enter your current password'),
  newPassword: passwordField,
});

export type RegisterInputSchema = z.infer<typeof registerSchema>;
export type LoginInputSchema = z.infer<typeof loginSchema>;
