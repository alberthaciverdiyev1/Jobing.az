import type { TranslatedText } from '../../../Core/Localization/TranslatedText.js';

export interface CreateCityInput {
  name: TranslatedText;
  /** Defaults to a slug built from the `az` name. */
  slug?: string;
  position?: number;
  isActive?: boolean;
}
