import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import type { RequestHandler } from 'express';
import { env, isProduction, isTest } from '../../Config/Env.js';
import { getPool } from '../Database/Client.js';

const PgSessionStore = connectPgSimple(session);

/**
 * Cookie-backed sessions.
 *
 * Persisted in PostgreSQL, except under test where the in-memory store keeps the
 * suite runnable without a database.
 */
export function createSessionMiddleware(): RequestHandler {
  const store = isTest
    ? undefined
    : new PgSessionStore({
        pool: getPool(),
        tableName: 'session',
        createTableIfMissing: false,
      });

  return session({
    name: 'jobing.sid',
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    ...(store ? { store } : {}),
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      maxAge: env.SESSION_LIFETIME * 60 * 1000,
      ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
    },
  });
}
