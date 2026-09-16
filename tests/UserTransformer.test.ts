import { describe, expect, it } from 'vitest';
import type { User } from '../src/Modules/User/Entities/User.js';
import { transformUser, transformUsers } from '../src/Modules/User/Transformers/UserTransformer.js';

const user: User = {
  id: '2f1c9a44-4f4e-4a4d-9a1a-0f6a1d2c3b4e',
  email: 'ada@example.com',
  passwordHash: 'scrypt$deadbeef$cafebabe',
  name: 'Ada Lovelace',
  isAdmin: false,
  createdAt: new Date('2026-01-02T03:04:05Z'),
  updatedAt: new Date('2026-01-02T03:04:05Z'),
};

describe('UserTransformer', () => {
  it('never exposes the password hash', () => {
    const resource = transformUser(user);

    expect(resource).not.toHaveProperty('passwordHash');
    expect(Object.keys(resource).sort()).toEqual([
      'createdAt',
      'email',
      'id',
      'isAdmin',
      'name',
      'updatedAt',
    ]);
  });

  it('serialises timestamps as ISO strings', () => {
    const resource = transformUser(user);

    expect(resource.createdAt).toBe('2026-01-02T03:04:05.000Z');
    expect(resource.updatedAt).toBe('2026-01-02T03:04:05.000Z');
  });

  it('keeps the fields the templates rely on', () => {
    const resource = transformUser(user);

    expect(resource.name).toBe('Ada Lovelace');
    expect(resource.email).toBe('ada@example.com');
    expect(resource.isAdmin).toBe(false);
  });

  it('transforms a collection', () => {
    expect(transformUsers([user, user])).toHaveLength(2);
  });
});
