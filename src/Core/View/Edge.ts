import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Edge } from 'edge.js';
import { paths } from '../../Config/Paths.js';

/**
 * Edge is the view engine.
 *
 * It has no Express adapter, so nothing is registered with `app.set('view engine')`
 * — controllers render through `renderPage()` in `RenderPage.ts`.
 */
export const edge = Edge.create();

edge.mount(pathToFileURL(paths.views + path.sep));

/* Global helpers — presentation only, callable in any template without a prefix. */
edge.global('asset', (assetPath: unknown): string => {
  const clean = String(assetPath ?? '').replace(/^\/+/, '');
  return `/static/${clean}`;
});

edge.global('uppercase', (value: unknown): string => String(value ?? '').toUpperCase());
edge.global('lowercase', (value: unknown): string => String(value ?? '').toLowerCase());
edge.global('json', (value: unknown): string => JSON.stringify(value) ?? '');

edge.global('truncate', (value: unknown, length: number): string => {
  const text = String(value ?? '');
  const max = length > 0 ? length : 120;
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
});

edge.global('formatDate', (value: unknown, locale: string): string => {
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat(locale || 'az', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
});
