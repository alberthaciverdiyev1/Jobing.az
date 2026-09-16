import type { TranslatedText } from '../../../Core/Localization/TranslatedText.js';

export interface CreateCategoryInput {
  name: TranslatedText;
  /** Defaults to a slug built from the `az` name. */
  slug?: string;
  parentId?: string | null;
  position?: number;
  isActive?: boolean;
}
