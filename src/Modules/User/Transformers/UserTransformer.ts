import type { User } from '../Entities/User.js';

/**
 * The shape sent to clients.
 *
 * The password hash never leaves the server, and timestamps are serialised as
 * ISO strings so both the JSON API and the templates see the same values.
 */
export interface UserResource {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export function transformUser(user: User): UserResource {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export function transformUsers(users: User[]): UserResource[] {
  return users.map(transformUser);
}
