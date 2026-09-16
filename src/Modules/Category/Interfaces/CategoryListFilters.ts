/** Filters accepted when listing categories. */
export interface CategoryListFilters {
  /** `undefined` = all, `null` = roots only, a string = that parent's children. */
  parentId?: string | null;
  onlyActive?: boolean;
  /** Case-insensitive match against the primary locale name. */
  search?: string;
}
