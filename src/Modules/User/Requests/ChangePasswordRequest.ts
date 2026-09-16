import { z } from 'zod';
import { passwordField } from './Fields.js';

/** Changing the password of the signed-in account. */
export const changePasswordRequest = z.object({
  currentPassword: z.string().min(1, 'Enter your current password'),
  newPassword: passwordField,
});

export type ChangePasswordRequest = z.infer<typeof changePasswordRequest>;
