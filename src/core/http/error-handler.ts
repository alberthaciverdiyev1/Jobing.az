import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { env, isProduction } from '../../config/env.js';
import { logger } from '../logger.js';
import { AppError, isAppError } from './errors.js';

interface ErrorBody {
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

  // Body-parser / Express internals expose a numeric `status`.
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const { status, message } = error as { status?: unknown; message?: unknown };
    if (typeof status === 'number' && status >= 400 && status < 500) {
      return new AppError(typeof message === 'string' ? message : 'Request error', status, 'BAD_REQUEST');
    }
  }

  return new AppError('Internal server error', 500, 'INTERNAL_ERROR');
}

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  const appError = toAppError(error);

  const logPayload = {
    err: error,
    requestId: req.requestId,
    statusCode: appError.statusCode,
    method: req.method,
    url: req.originalUrl,
  };

  if (appError.statusCode >= 500) {
    logger.error(logPayload, appError.message);
  } else {
    logger.warn(logPayload, appError.message);
  }

  const body: ErrorBody = {
    success: false,
    error: {
      code: appError.code,
      message: appError.statusCode >= 500 && isProduction ? 'Internal server error' : appError.message,
    },
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
