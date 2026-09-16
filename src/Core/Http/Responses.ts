import type { Response } from 'express';

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiFailure {
  success: false;
  error: ApiErrorPayload;
}

/** Shorthand for templates that need the camelCase envelope contract. */
export function ok<T>(res: Response, data: T, status = 200): void {
  const body: ApiSuccess<T> = { success: true, data };
  res.status(status).json(body);
}

export function created<T>(res: Response, data: T): void {
  ok(res, data, 201);
}

export function noContent(res: Response): void {
  res.status(204).end();
}

export function paginated<T>(
  res: Response,
  items: T[],
  meta: { page: number; perPage: number; total: number },
): void {
  ok(res, {
    items,
    meta: {
      ...meta,
      totalPages: meta.perPage > 0 ? Math.ceil(meta.total / meta.perPage) : 0,
    },
  });
}
