import { describe, expect, it } from 'vitest';
import { slugify } from '../src/Core/Support/Slugify.js';

describe('slugify', () => {
  it('transliterates Azerbaijani and Turkish letters', () => {
    expect(slugify('İş Elanları')).toBe('is-elanlari');
    expect(slugify('Mühasibat və Maliyyə')).toBe('muhasibat-ve-maliyye');
    expect(slugify('Çoxcəhətli Şey')).toBe('coxcehetli-sey');
    expect(slugify('Tibbi Xidmətlər')).toBe('tibbi-xidmetler');
  });

  it('collapses separators and trims them', () => {
    expect(slugify('  IT  &   Software  ')).toBe('it-software');
    expect(slugify('--a---b--')).toBe('a-b');
  });

  it('returns an empty string when nothing survives', () => {
    expect(slugify('Программист')).toBe('');
    expect(slugify('   ')).toBe('');
  });

  it('caps the length', () => {
    expect(slugify('a'.repeat(500)).length).toBe(200);
  });
});
