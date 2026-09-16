import type { TranslatedText } from '../../../Core/Localization/TranslatedText.js';

/** A company as sent to clients. */
export interface CompanyResource {
  id: string;
  ownerId: string | null;
  cityId: string | null;
  slug: string;
  /** Resolved for the request locale, falling back to Azerbaijani. */
  name: string;
  description: string | null;
  translations: { name: TranslatedText; description: TranslatedText | null };
  website: string | null;
  email: string | null;
  phone: string | null;
  isVerified: boolean;
  isPremium: boolean;
  isActive: boolean;
  /** Served straight from `public/images/…`; null when nothing was uploaded. */
  logoUrl: string | null;
  bannerUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
