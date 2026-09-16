import type { User } from '../Entities/User.js';
import type { PaginatedResult } from './PaginatedResult.js';
import type { RegisterInput } from './RegisterInput.js';

/**
 * Business contract for accounts.
 * Controllers depend on this interface, never on the concrete service.
 */
export interface UserServiceInterface {
  register(input: RegisterInput): Promise<User>;
  authenticate(email: string, password: string): Promise<User>;
  getById(id: string): Promise<User>;
  changePassword(id: string, currentPassword: string, newPassword: string): Promise<void>;
  list(page: number, perPage: number): Promise<PaginatedResult<User>>;
}
