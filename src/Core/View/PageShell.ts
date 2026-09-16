/**
 * Values every template can rely on, exposed to components as `shell`.
 * Edge templates are dynamically typed, so this stays permissive.
 */
export type PageShell = Record<string, unknown> & {
  t?: (key: string, options?: Record<string, unknown>) => string;
  flash?: unknown[];
};
