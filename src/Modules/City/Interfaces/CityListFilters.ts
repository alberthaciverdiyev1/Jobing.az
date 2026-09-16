/** Filters accepted when listing cities. */
export interface CityListFilters {
  onlyActive?: boolean;
  /** Case-insensitive match against the primary locale name. */
  search?: string;
}
