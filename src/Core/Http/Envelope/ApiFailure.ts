import type { ApiErrorPayload } from './ApiErrorPayload.js';

/** A failed API response. */
export interface ApiFailure {
  success: false;
  error: ApiErrorPayload;
}
