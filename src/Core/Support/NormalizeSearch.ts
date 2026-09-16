import { env } from '../../Config/Env.js';

/**
 * Normalises a search term so it matches what PostgreSQL's `lower()` produces.
 *
 * JavaScript's `toLowerCase()` turns `İ` into `i` **plus a combining dot**, which
 * never matches `lower('İ')` in the database — searching "ŞİRKƏT" would silently
 * find nothing. Turkish and Azerbaijani need the locale-aware variant.
 */
export function normalizeSearch(value: string): string {
  const trimmed = value.trim();

  try {
    return trimmed.toLocaleLowerCase(env.DEFAULT_LOCALE);
  } catch {
    return trimmed.toLowerCase();
  }
}
