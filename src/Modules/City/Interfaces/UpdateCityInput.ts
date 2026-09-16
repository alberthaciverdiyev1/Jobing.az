import type { TranslatedText } from '../../../Core/Localization/TranslatedText.js';

export interface UpdateCityInput {
  name?: TranslatedText;
  slug?: string;
  position?: number;
  isActive?: boolean;
}
