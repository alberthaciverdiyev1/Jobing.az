import type { Request, RequestHandler } from 'express';

export type FlashType = 'success' | 'error';

export interface FlashMessage {
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
