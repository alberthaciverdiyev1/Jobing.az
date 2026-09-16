import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Edge } from 'edge.js';
import type { Response } from 'express';
import { paths } from '../../Config/Paths.js';

/**
 * Edge is the view engine. It has no Express adapter, so instead of
 * `app.set('view engine')` we render explicitly through `renderPage()`.
 */
export const edge = Edge.create();

edge.mount(pathToFileURL(paths.views + path.sep));

/* Global helpers — presentation only, available to every template. */
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

/**
 * Values every template can rely on, exposed to components as `shell`.
 * Edge templates are dynamically typed, so this stays permissive.
 */
export type PageShell = Record<string, unknown> & {
  t?: (key: string, options?: Record<string, unknown>) => string;
  flash?: unknown[];
};

export interface PageState extends Record<string, unknown> {
  pageTitle?: string;
  pageDescription?: string;
}

/**
 * Renders a view from the `views/` tree and sends it.
 *
 *   await renderPage(res, 'User/Login', { pageTitle: '…', errors: {} })
 *
 * The state is exposed twice: flattened at the top level so slot content can use
 * it directly, and as `shell` so components and partials can reach it after
 * crossing a template boundary.
 */
export async function renderPage(
  res: Response,
  view: string,
  state: PageState = {},
): Promise<void> {
  const locals = res.locals as Record<string, unknown>;
  const shell: PageShell = { ...locals, ...state };

  // Errors can surface before the view locals middleware has run.
  shell.t ??= (key: string) => key;
  shell.flash ??= [];

  const html = await edge.render(view, { ...shell, shell });
  res.type('html').send(html);
}
