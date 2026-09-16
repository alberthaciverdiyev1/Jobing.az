import type { User } from '../Entities/User.js';
import type { UserResource } from './UserResource.js';

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
