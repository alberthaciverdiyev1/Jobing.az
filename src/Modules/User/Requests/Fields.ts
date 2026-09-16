import { z } from 'zod';

/**
 * Field rules shared by several requests.
 * Keep these here so `email` means the same thing everywhere.
 */
export const emailField = z.email('Enter a valid email address').max(255).toLowerCase();

export const nameField = z.string().trim().min(2, 'Name must be at least 2 characters').max(255);

export const passwordField = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long');
