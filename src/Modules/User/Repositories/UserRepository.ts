import { getDb } from '../../../Core/Database/index.js';
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
    const row = await getDb()
      .selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    return row ? toUserWithPassword(row) : undefined;
  }

  async findByEmail(email: string): Promise<UserWithPassword | undefined> {
    const row = await getDb()
      .selectFrom('users')
      .selectAll()
      .where('email', '=', normalizeEmail(email))
      .executeTakeFirst();

    return row ? toUserWithPassword(row) : undefined;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const row = await getDb()
      .selectFrom('users')
      .select('id')
      .where('email', '=', normalizeEmail(email))
      .executeTakeFirst();

    return row !== undefined;
  }

  async create(data: CreateUserData): Promise<UserWithPassword> {
    const row = await getDb()
      .insertInto('users')
      .values({
        email: normalizeEmail(data.email),
        name: data.name.trim(),
        passwordHash: data.passwordHash,
        ...(data.isAdmin === undefined ? {} : { isAdmin: data.isAdmin }),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return toUserWithPassword(row);
  }

  async updatePasswordHash(id: string, passwordHash: string): Promise<void> {
    await getDb()
      .updateTable('users')
      .set({ passwordHash, updatedAt: new Date() })
      .where('id', '=', id)
      .execute();
  }

  async paginate(page: number, perPage: number): Promise<PaginatedResult<User>> {
    const offset = (page - 1) * perPage;

    const [rows, countRow] = await Promise.all([
      getDb()
        .selectFrom('users')
        .selectAll()
        .orderBy('createdAt', 'desc')
        .limit(perPage)
        .offset(offset)
        .execute(),
      getDb().selectFrom('users').select(({ fn }) => fn.countAll<string>().as('total')).executeTakeFirst(),
    ]);

    return {
      items: rows.map((row) => toUser(toUserWithPassword(row))),
      total: Number(countRow?.total ?? 0),
      page,
      perPage,
    };
  }
}

export const userRepository = new UserRepository();
