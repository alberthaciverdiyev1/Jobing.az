import type { Response } from 'express';
import { edge } from './Edge.js';
import type { PageShell } from './PageShell.js';
import type { PageState } from './PageState.js';

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
