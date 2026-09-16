export {};

declare global {
  namespace Express {
    interface Request {
      /** Correlation id, echoed back as X-Request-Id. */
      requestId: string;
      /** Locale resolved by the i18n middleware. */
      locale: string;
      /** Result of the `validate()` middleware, if any. */
      validated?: {
        body?: unknown;
        query?: unknown;
        params?: unknown;
      };
    }
  }
}
