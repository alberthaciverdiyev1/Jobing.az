/** A page of results plus the metadata needed to render pagination. */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
}
