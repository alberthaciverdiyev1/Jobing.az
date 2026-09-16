import type { CookieOptions, Request, RequestHandler, Response } from 'express';
import { isProduction } from '../Config/Env.js';

type FlashType = 'success' | 'error';

interface FlashMessage {
  type: FlashType;
  message: string;
}

const COOKIE = 'jobing.flash';
const MAX_MESSAGES = 5;

/** A session cookie: it disappears on its own if the message is never read. */
const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: isProduction,
  path: '/',
};

function isFlashMessage(value: unknown): value is FlashMessage {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    'message' in value &&
    typeof (value as FlashMessage).message === 'string'
  );
}

function readMessages(req: Request): FlashMessage[] {
  const raw = req.cookies?.[COOKIE];
  if (typeof raw !== 'string') return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isFlashMessage) : [];
  } catch {
    return [];
  }
}

/** Queues a one-shot message for the next rendered page. */
export function addFlash(res: Response, type: FlashType, message: string): void {
  const messages = readMessages(res.req);
  messages.push({ type, message });

  res.cookie(COOKIE, JSON.stringify(messages.slice(-MAX_MESSAGES)), cookieOptions);
}

/** Moves queued messages into locals so the layout can render them once. */
export const flash: RequestHandler = (req, res, next) => {
  const messages = readMessages(req);

  if (messages.length > 0) {
    res.clearCookie(COOKIE, cookieOptions);
  }

  res.locals.flash = messages;
  next();
};
