import { count, desc, eq } from 'drizzle-orm';
import { getDb } from '../../../Core/Database/index.js';
import { users } from '../Configurations/UserConfiguration.js';
import {
  toUser,
  toUserWithPassword,
  type CreateUserData,
  type User,
  type UserWithPassword,
} from '../Entities/User.js';
import type {
  PaginatedResult,
  UserRepositoryInterface,
} from '../Interfaces/UserRepositoryInterface.js';

/** Emails are matched case-insensitively; store them normalised. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export class UserRepository implements UserRepositoryInterface {
  async findById(id: string): Promise<UserWithPassword | undefined> {
    const [row] = await getDb().select().from(users).where(eq(users.id, id)).limit(1);
    return row ? toUserWithPassword(row) : undefined;
  }

  async findByEmail(email: string): Promise<UserWithPassword | undefined> {
    const [row] = await getDb()
      .select()
      .from(users)
      .where(eq(users.email, normalizeEmail(email)))
      .limit(1);

    return row ? toUserWithPassword(row) : undefined;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const [row] = await getDb()
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, normalizeEmail(email)))
      .limit(1);

    return row !== undefined;
  }

  async create(data: CreateUserData): Promise<UserWithPassword> {
    const values = {
      email: normalizeEmail(data.email),
      name: data.name.trim(),
      passwordHash: data.passwordHash,
      ...(data.isAdmin === undefined ? {} : { isAdmin: data.isAdmin }),
    };

    const [row] = await getDb().insert(users).values(values).returning();
    if (!row) throw new Error('Insert did not return the created user');

    return toUserWithPassword(row);
  }

  async updatePasswordHash(id: string, passwordHash: string): Promise<void> {
    await getDb()
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, id));
  }

  async paginate(page: number, perPage: number): Promise<PaginatedResult<User>> {
    const offset = (page - 1) * perPage;

    const [rows, totals] = await Promise.all([
      getDb().select().from(users).orderBy(desc(users.createdAt)).limit(perPage).offset(offset),
      getDb().select({ total: count() }).from(users),
    ]);

    return {
      items: rows.map((row) => toUser(toUserWithPassword(row))),
      total: totals[0]?.total ?? 0,
      page,
      perPage,
    };
  }
}

export const userRepository = new UserRepository();
