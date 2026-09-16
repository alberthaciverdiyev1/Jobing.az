import type { Request, RequestHandler } from 'express';

type FlashType = 'success' | 'error';

interface FlashMessage {
  type: FlashType;
  message: string;
}

/** Queues a one-shot message for the next rendered page. */
export function addFlash(req: Request, type: FlashType, message: string): void {
  req.session.flash ??= [];
  req.session.flash.push({ type, message });
}

/** Moves queued messages into locals so the layout can render them once. */
export const flash: RequestHandler = (req, res, next) => {
  res.locals.flash = req.session.flash ?? [];
  delete req.session.flash;
  next();
};

declare module 'express-session' {
  interface SessionData {
    /** One-shot messages queued for the next rendered page. */
    flash?: FlashMessage[];
  }
}
