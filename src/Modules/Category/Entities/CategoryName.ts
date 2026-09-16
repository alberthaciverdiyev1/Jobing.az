/**
 * A category's name per locale.
 * Azerbaijani is the primary locale and the only one guaranteed to be present;
 * the others fall back to it when missing.
 */
export interface CategoryName {
  az: string;
  en?: string;
  ru?: string;
  tr?: string;
}
