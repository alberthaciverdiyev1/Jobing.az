/** A successful API response. */
export interface ApiSuccess<T> {
  success: true;
  data: T;
}
