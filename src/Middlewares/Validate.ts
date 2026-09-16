import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { ValidationError } from '../Core/Http/Errors/index.js';

interface ValidationSchemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

/** Parsed input, keyed by where in the request it came from. */
interface ValidatedInput {
  body?: unknown;
  query?: unknown;
  params?: unknown;
}

/**
 * Validates and replaces request input with parsed (and coerced) data.
 * Results land on `req.validated` so we never mutate Express 5's getter-only
 * `req.query`/`req.params`.
 */
export function validate(schemas: ValidationSchemas): RequestHandler {
  return (req, _res, next) => {
    const validated: ValidatedInput = {};

    for (const key of ['body', 'query', 'params'] as const) {
      const schema = schemas[key];
      if (!schema) continue;

      const result = schema.safeParse(req[key]);
      if (!result.success) {
        next(
          new ValidationError('Validation failed', {
            source: key,
            issues: result.error.issues.map((issue) => ({
              path: issue.path.join('.'),
              message: issue.message,
            })),
          }),
        );
        return;
      }
      validated[key] = result.data;
    }

    req.validated = validated;
    next();
  };
}

declare module 'express-serve-static-core' {
  interface Request {
    /** Parsed input from the validate() middleware, if any. */
    validated?: ValidatedInput;
  }
}
