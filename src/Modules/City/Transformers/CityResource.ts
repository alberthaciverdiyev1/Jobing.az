import type { TranslatedText } from '../../../Core/Localization/TranslatedText.js';

/** A city as sent to clients. */
export interface CityResource {
  id: string;
  slug: string;
  /** Resolved for the request locale, falling back to Azerbaijani. */
  name: string;
  /** Every locale that has a value. */
  translations: TranslatedText;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
