import { ConflictError, NotFoundError, UnauthorizedError } from '../../../Core/Http/Errors.js';
import { hashPassword, verifyPassword } from '../../../Core/Security/Password.js';
import type { User } from '../Entities/User.js';
import type {
  PaginatedResult,
  UserRepositoryInterface,
} from '../Interfaces/UserRepositoryInterface.js';
import { userRepository } from '../Repositories/UserRepository.js';

export interface RegisterInput {
  email: string;
  name: string;
  password: string;
}

/**
 * Business rules for accounts. Returns entities; turning them into a client-safe
 * shape is the transformer's job.
 */
export class UserService {
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

export const userService = new UserService(userRepository);
