import { z } from 'zod';

/**
 * Validation for translatable text. Azerbaijani is required, the rest optional.
 *
 *   translatedTextSchema()      names, titles      (255)
 *   translatedTextSchema(5000)  descriptions, body (5000)
 */
export function translatedTextSchema(maxLength = 255) {
  const primary = z.string().trim().min(1, 'Azerbaijani text is required').max(maxLength);
  const secondary = z.string().trim().min(1).max(maxLength).optional();

  return z.object({
    az: primary,
    en: secondary,
    ru: secondary,
    tr: secondary,
  });
}
