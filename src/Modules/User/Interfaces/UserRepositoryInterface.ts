import type { NewUser } from '../Entities/NewUser.js';
import type { User } from '../Entities/User.js';
import type { PaginatedResult } from './PaginatedResult.js';

/** Persistence contract for users. The service layer only knows this shape. */
export interface UserRepositoryInterface {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  existsByEmail(email: string): Promise<boolean>;
  create(data: NewUser): Promise<User>;
  updatePasswordHash(id: string, passwordHash: string): Promise<void>;
  paginate(page: number, perPage: number): Promise<PaginatedResult<User>>;
}
