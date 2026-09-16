import { getTableName } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';
import { appDbContext } from '../src/Core/Database/AppDbContext.js';
import { users } from '../src/Modules/User/Configurations/UserConfiguration.js';

describe('entity configuration', () => {
  it('maps the entity to its table and columns', () => {
    expect(getTableName(users)).toBe('users');

    expect(users.id.name).toBe('id');
    expect(users.id.primary).toBe(true);
    expect(users.id.hasDefault).toBe(true);

    expect(users.email.name).toBe('email');
    expect(users.email.notNull).toBe(true);
    expect(users.email.isUnique).toBe(true);
  });

  it('defaults boolean and timestamp columns', () => {
    expect(users.isAdmin.hasDefault).toBe(true);
    expect(users.createdAt.hasDefault).toBe(true);
    expect(users.createdAt.notNull).toBe(true);
  });
});

describe('AppDbContext', () => {
  it('discovers configurations from Core and every module', async () => {
    await appDbContext.load();

    const names = appDbContext.allTables.map((table) => getTableName(table));
    expect(names).toContain('users');
  });

  it('exposes the tables through a schema object', async () => {
    await appDbContext.load();

    expect(Object.keys(appDbContext.schema)).toEqual(['users']);
    expect(appDbContext.table('users')).toBe(users);
  });
});
