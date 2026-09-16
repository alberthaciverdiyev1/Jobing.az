/** Per-page values handed to `renderPage`, on top of the request locals. */
export interface PageState extends Record<string, unknown> {
  pageTitle?: string;
  pageDescription?: string;
}
