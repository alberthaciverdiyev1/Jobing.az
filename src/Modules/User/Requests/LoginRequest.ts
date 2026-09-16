import { z } from 'zod';
import { emailField } from './Fields.js';

/** `POST /login` and `POST /api/v1/auth/login` */
export const loginRequest = z.object({
  email: emailField,
  password: z.string().min(1, 'Enter your password'),
});

export type LoginRequest = z.infer<typeof loginRequest>;
