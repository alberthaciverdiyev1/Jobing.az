import { z } from 'zod';
import { emailField, nameField, passwordField } from './Fields.js';

/** `POST /register` and `POST /api/v1/auth/register` */
export const registerRequest = z.object({
  email: emailField,
  name: nameField,
  password: passwordField,
});

export type RegisterRequest = z.infer<typeof registerRequest>;
