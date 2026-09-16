import { ConflictError, ValidationError } from '../Http/Errors/index.js';
import { slugify } from './Slugify.js';

const MAX_ATTEMPTS = 50;

/**
 * Builds a free slug from `source`, appending `-2`, `-3`, … until `isTaken`
 * reports one that is available.
 *
 * Throws when the source yields nothing usable (a name written entirely in
 * Cyrillic, for example) or when every candidate is taken.
 */
export async function uniqueSlug(
  source: string,
  isTaken: (candidate: string) => Promise<boolean>,
): Promise<string> {
  const base = slugify(source);

  if (base.length === 0) {
    throw new ValidationError('Could not build a slug — provide one explicitly');
  }

  if (!(await isTaken(base))) return base;

  for (let suffix = 2; suffix <= MAX_ATTEMPTS; suffix += 1) {
    const candidate = `${base}-${suffix}`;
    if (!(await isTaken(candidate))) return candidate;
  }

  throw new ConflictError(`Could not find a free slug for "${base}"`);
}
