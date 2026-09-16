/**
 * Base class for every error the application throws deliberately.
 *
 * Anything that is an `AppError` is considered operational: its status and
 * message are safe to expose to the client. Everything else becomes a 500.
 */
export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly isOperational = true;
  readonly details?: unknown;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', details?: unknown) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = code;
    if (details !== undefined) {
      this.details = details;
    }
    Error.captureStackTrace(this, new.target);
  }
}
