import { AppError } from './AppError.js';

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
