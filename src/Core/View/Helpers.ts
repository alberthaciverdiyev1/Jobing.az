import type { HelperDelegate } from 'handlebars';

/**
 * Global Handlebars helpers.
 * Keep these logic-less and presentation-only — domain logic belongs in services.
 */
export const helpers: Record<string, HelperDelegate> = {
  eq: (a: unknown, b: unknown): boolean => a === b,

  ne: (a: unknown, b: unknown): boolean => a !== b,

  gt: (a: unknown, b: unknown): boolean => Number(a) > Number(b),

  hasItems: (value: unknown): boolean => Array.isArray(value) && value.length > 0,

  json: (value: unknown): string => JSON.stringify(value) ?? '',

  uppercase: (value: unknown): string => String(value ?? '').toUpperCase(),

  lowercase: (value: unknown): string => String(value ?? '').toLowerCase(),

  /** Builds a URL for a file inside `public/`. */
  asset: (assetPath: unknown): string => {
    const clean = String(assetPath ?? '').replace(/^\/+/, '');
    return `/static/${clean}`;
  },

  truncate: (value: unknown, length: unknown): string => {
    const text = String(value ?? '');
    const max = Number(length) > 0 ? Number(length) : 120;
    return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
  },

  formatDate: (value: unknown, locale: unknown): string => {
    const date = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat(String(locale || 'az'), {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  },
};
