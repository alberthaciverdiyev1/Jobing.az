/**
 * User-facing text keyed by locale.
 *
 * Azerbaijani is the primary locale and the only one guaranteed to be present;
 * the others fall back to it when missing.
 */
export interface TranslatedText {
  az: string;
  en?: string;
  ru?: string;
  tr?: string;
}
