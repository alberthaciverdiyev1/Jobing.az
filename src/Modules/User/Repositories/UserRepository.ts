import { count, desc, eq } from 'drizzle-orm';
import { getDb } from '../../../Core/Database/index.js';
import { users } from '../Configurations/UserConfiguration.js';
import type { NewUser } from '../Entities/NewUser.js';
import type { User } from '../Entities/User.js';
import type { PaginatedResult } from '../../../Core/Database/PaginatedResult.js';
import type { UserRepositoryInterface } from '../Interfaces/UserRepositoryInterface.js';

export class UserRepository implements UserRepositoryInterface {
  /** Emails are matched case-insensitively; store them normalised. */
  private static normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  async findById(id: string): Promise<User | undefined> {
    const [row] = await getDb().select().from(users).where(eq(users.id, id)).limit(1);
    return row;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const [row] = await getDb()
      .select()
      .from(users)
      .where(eq(users.email, UserRepository.normalizeEmail(email)))
      .limit(1);

    return row;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const [row] = await getDb()
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, UserRepository.normalizeEmail(email)))
      .limit(1);

    return row !== undefined;
  }

  async create(data: NewUser): Promise<User> {
    const [row] = await getDb()
      .insert(users)
      .values({
        ...data,
        email: UserRepository.normalizeEmail(data.email),
        name: data.name.trim(),
      })
      .returning();

    if (!row) throw new Error('Insert did not return the created user');
    return row;
  }

  async updatePasswordHash(id: string, passwordHash: string): Promise<void> {
    await getDb()
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, id));
  }

  async paginate(page: number, perPage: number): Promise<PaginatedResult<User>> {
    const offset = (page - 1) * perPage;

    const [items, totals] = await Promise.all([
      getDb().select().from(users).orderBy(desc(users.createdAt)).limit(perPage).offset(offset),
      getDb().select({ total: count() }).from(users),
    ]);

    return { items, total: totals[0]?.total ?? 0, page, perPage };
  }
}
