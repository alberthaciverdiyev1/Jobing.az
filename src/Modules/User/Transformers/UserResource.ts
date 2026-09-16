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
