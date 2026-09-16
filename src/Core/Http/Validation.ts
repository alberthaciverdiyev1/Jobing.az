import type { ZodError } from 'zod';

/**
 * Flattens a Zod error into `{ field: message }` so templates can show the
 * first problem under each input.
 */
export function fieldErrors(error: ZodError): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join('.') : '_';
    errors[key] ??= issue.message;
  }

  return errors;
}
