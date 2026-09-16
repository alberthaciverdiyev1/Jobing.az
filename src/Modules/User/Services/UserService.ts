import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../../../Core/Http/Errors/index.js';
import { hashPassword, verifyPassword } from '../../../Core/Security/Password.js';
import type { User } from '../Entities/User.js';
import type { PaginatedResult } from '../../../Core/Database/PaginatedResult.js';
import type { RegisterInput } from '../Interfaces/RegisterInput.js';
import type { UserRepositoryInterface } from '../Interfaces/UserRepositoryInterface.js';
import type { UserServiceInterface } from '../Interfaces/UserServiceInterface.js';

/**
 * Business rules for accounts.
 *
 * Returns entities; turning them into a client-safe shape is the transformer's
 * job, and persistence is reached only through the repository interface.
 */
export class UserService implements UserServiceInterface {
  constructor(private readonly users: UserRepositoryInterface) {}

  async register(input: RegisterInput): Promise<User> {
    if (await this.users.existsByEmail(input.email)) {
      throw new ConflictError('This email address is already registered');
    }

    return this.users.create({
      email: input.email,
      name: input.name,
      passwordHash: await hashPassword(input.password),
    });
  }

  /** Throws `UnauthorizedError` for both unknown email and wrong password. */
  async authenticate(email: string, password: string): Promise<User> {
    const found = await this.users.findByEmail(email);
    const invalid = new UnauthorizedError('Invalid email or password');

    if (!found) throw invalid;
    if (!(await verifyPassword(password, found.passwordHash))) throw invalid;

    return found;
  }

  async getById(id: string): Promise<User> {
    const found = await this.users.findById(id);
    if (!found) throw new NotFoundError('User not found');
    return found;
  }

  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    const found = await this.users.findById(id);
    if (!found) throw new NotFoundError('User not found');

    if (!(await verifyPassword(currentPassword, found.passwordHash))) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    await this.users.updatePasswordHash(id, await hashPassword(newPassword));
  }

  async list(page: number, perPage: number): Promise<PaginatedResult<User>> {
    return this.users.paginate(page, perPage);
  }
}
