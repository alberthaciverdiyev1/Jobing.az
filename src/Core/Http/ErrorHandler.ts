import type { ErrorRequestHandler, Request } from 'express';
import { ZodError } from 'zod';
import { env, isProduction } from '../../Config/Env.js';
import { logger } from '../Logger.js';
import { AppError, isAppError } from './Errors.js';

interface ApiErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId?: string;
}

function toAppError(error: unknown): AppError {
  if (isAppError(error)) return error;

  if (error instanceof ZodError) {
    return new AppError('Validation failed', 422, 'VALIDATION_ERROR', error.issues);
  }

  // body-parser and other Express internals expose a numeric `status`.
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const { status, message } = error as { status?: unknown; message?: unknown };
    if (typeof status === 'number' && status >= 400 && status < 500) {
      return new AppError(
        typeof message === 'string' ? message : 'Request error',
        status,
        'BAD_REQUEST',
      );
    }
  }

  return new AppError('Internal server error', 500, 'INTERNAL_ERROR');
}

/**
 * `/api/*` always answers with JSON. Everything else is a page, so it renders
 * HTML unless the client explicitly asks for JSON via the Accept header.
 */
function prefersJson(req: Request): boolean {
  const fullPath = req.originalUrl.split('?')[0] ?? '';
  if (fullPath === '/api' || fullPath.startsWith('/api/')) return true;

  return req.accepts(['html', 'json']) === 'json';
}

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  const appError = toAppError(error);

  const logContext = {
    err: error,
    requestId: req.requestId,
    statusCode: appError.statusCode,
    method: req.method,
    url: req.originalUrl,
  };

  if (appError.statusCode >= 500) {
    logger.error(logContext, appError.message);
  } else {
    logger.warn(logContext, appError.message);
  }

  // Headers are already sent — nothing we can do but bail out.
  if (res.headersSent) {
    return;
  }

  const clientMessage =
    appError.statusCode >= 500 && isProduction ? 'Internal server error' : appError.message;

  if (!prefersJson(req)) {
    res.status(appError.statusCode).render(
      appError.statusCode === 404 ? 'Pages/Errors/NotFound' : 'Pages/Errors/ServerError',
      {
        pageTitle: appError.statusCode === 404 ? '404' : '500',
        statusCode: appError.statusCode,
        errorCode: appError.code,
        errorMessage: clientMessage,
        requestId: isProduction ? undefined : req.requestId,
      },
    );
    return;
  }

  const body: ApiErrorBody = {
    success: false,
    error: { code: appError.code, message: clientMessage },
  };

  if (appError.details !== undefined) {
    body.error.details = appError.details;
  }
  if (!isProduction) {
    body.requestId = req.requestId;
  }

  res.status(appError.statusCode).json(body);
};

/** Last-resort guards for errors that escape the request lifecycle. */
export function registerProcessErrorHandlers(): void {
  process.on('unhandledRejection', (reason) => {
    logger.error({ err: reason }, 'Unhandled promise rejection');
    if (env.NODE_ENV === 'production') process.exit(1);
  });

  process.on('uncaughtException', (error) => {
    logger.fatal({ err: error }, 'Uncaught exception — shutting down');
    process.exit(1);
  });
}
