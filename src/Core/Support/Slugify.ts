/**
 * Latin letters Azerbaijani and Turkish add on top of ASCII. Anything else is
 * stripped, so slugs are built from the primary locale (`az`), never Cyrillic.
 */
const TRANSLITERATION: Record<string, string> = {
  ə: 'e',
  ı: 'i',
  İ: 'i',
  ş: 's',
  ç: 'c',
  ğ: 'g',
  ö: 'o',
  ü: 'u',
  ñ: 'n',
  ą: 'a',
  ć: 'c',
  ę: 'e',
  ł: 'l',
  ń: 'n',
  ś: 's',
  ź: 'z',
  ż: 'z',
  å: 'a',
  æ: 'ae',
  ø: 'o',
  ß: 'ss',
};

/**
 * Turns a title into a URL-safe slug: `"İş Elanları"` becomes `"is-elanlari"`.
 *
 * The result can be empty (a name written entirely in Cyrillic, for example) —
 * callers decide what to do about that.
 */
export function slugify(value: string): string {
  const transliterated = Array.from(value.toLowerCase())
    .map((character) => TRANSLITERATION[character] ?? character)
    .join('');

  return transliterated
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200);
}
