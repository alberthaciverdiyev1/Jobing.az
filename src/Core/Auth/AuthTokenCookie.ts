import type { Response } from 'express';
import { AUTH_COOKIE, authCookieOptions } from './AuthCookie.js';
import { signAuthToken, type AuthToken } from './Jwt.js';

/**
 * Signs a token for the account, stores it in the auth cookie and returns it.
 *
 * The cookie keeps the server-rendered pages working; the returned token is what
 * JSON API clients put in their `Authorization` header.
 */
export async function issueAuthToken(res: Response, userId: string): Promise<AuthToken> {
  const auth = await signAuthToken(userId);
  res.cookie(AUTH_COOKIE, auth.token, authCookieOptions(auth.expiresAt.getTime() - Date.now()));
  return auth;
}

export function clearAuthToken(res: Response): void {
  res.clearCookie(AUTH_COOKIE, authCookieOptions());
}
