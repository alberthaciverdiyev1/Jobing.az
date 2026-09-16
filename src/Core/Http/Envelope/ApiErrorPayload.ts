/** The `error` object of a failed API response. */
export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: unknown;
}
