import type { Request, RequestHandler } from 'express';
import { AUTH_COOKIE, authCookieOptions } from '../../../Core/Auth/AuthCookie.js';
import { verifyAuthToken } from '../../../Core/Auth/Jwt.js';
import type { User } from '../Entities/User.js';
import { userService } from '../Services/index.js';
import { transformUser } from '../Transformers/UserTransformer.js';

/** Bearer header first (API clients), then the cookie (server-rendered pages). */
function tokenFrom(req: Request): string | undefined {
  const header = req.get('authorization');
  if (header?.toLowerCase().startsWith('bearer ')) {
    return header.slice(7).trim();
  }

  const cookie = req.cookies?.[AUTH_COOKIE];
  return typeof cookie === 'string' && cookie.length > 0 ? cookie : undefined;
}

/**
 * Resolves the access token into `req.user` (entity) and `currentUser`
 * (client-safe resource) for templates. Invalid or stale tokens are discarded.
 */
export const currentUser: RequestHandler = async (req, res, next) => {
  res.locals.currentUser = null;

  const token = tokenFrom(req);
  if (!token) {
    next();
    return;
  }

  const userId = await verifyAuthToken(token);
  if (!userId) {
    res.clearCookie(AUTH_COOKIE, authCookieOptions());
    next();
    return;
  }

  try {
    const user = await userService.getById(userId);
    req.user = user;
    res.locals.currentUser = transformUser(user);
  } catch {
    // The account is gone — treat the caller as anonymous.
    res.clearCookie(AUTH_COOKIE, authCookieOptions());
  }

  next();
};

declare module 'express-serve-static-core' {
  interface Request {
    /** Resolved from the access token by the currentUser middleware. */
    user?: User;
  }
}
