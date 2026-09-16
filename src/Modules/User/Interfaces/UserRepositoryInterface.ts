import type {CreateUserData, User, UserWithPassword} from '../Entities/User.js';

export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    perPage: number;
}

/** Persistence contract for users. The service layer only knows this shape. */
export interface UserRepositoryInterface {
    findById(id: string): Promise<UserWithPassword | undefined>;

    findByEmail(email: string): Promise<UserWithPassword | undefined>;

    existsByEmail(email: string): Promise<boolean>;

    create(data: CreateUserData): Promise<UserWithPassword>;

    updatePasswordHash(id: string, passwordHash: string): Promise<void>;

    paginate(page: number, perPage: number): Promise<PaginatedResult<User>>;
}
