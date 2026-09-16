import type { UserRow } from '../Configurations/UserConfiguration.js';

/** Domain representation of an account. Never carries the password hash. */
export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Repository-internal shape — keeps the hash out of the domain type. */
export interface UserWithPassword extends User {
  passwordHash: string;
}

export interface CreateUserData {
  email: string;
  name: string;
  passwordHash: string;
  isAdmin?: boolean;
}

/** Maps a database row to the persistence-facing entity. */
export function toUserWithPassword(row: UserRow): UserWithPassword {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    isAdmin: row.isAdmin,
    passwordHash: row.passwordHash,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/** Drops the credential before the entity leaves the service layer. */
export function toUser(entity: UserWithPassword): User {
  const { passwordHash: _passwordHash, ...user } = entity;
  return user;
}

export type { UserRow };
