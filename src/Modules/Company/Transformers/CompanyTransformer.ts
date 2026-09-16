import { translateText } from '../../../Core/Localization/TranslateText.js';
import { imageUrl } from '../../../Core/Storage/ImageStorage.js';
import type { Company } from '../Entities/Company.js';
import type { CompanyMediaInfo } from '../Repositories/CompanyRepository.js';
import type { CompanyResource } from './CompanyResource.js';

function urlFor(media: CompanyMediaInfo[], kind: 'logo' | 'banner'): string | null {
  return imageUrl(media.find((entry) => entry.kind === kind)?.path ?? null);
}

export function transformCompany(
  company: Company,
  media: CompanyMediaInfo[],
  locale: string,
): CompanyResource {
  return {
    id: company.id,
    ownerId: company.ownerId ?? null,
    cityId: company.cityId ?? null,
    slug: company.slug,
    name: translateText(company.name, locale),
    description: company.description ? translateText(company.description, locale) : null,
    translations: { name: company.name, description: company.description ?? null },
    website: company.website ?? null,
    email: company.email ?? null,
    phone: company.phone ?? null,
    isVerified: company.isVerified,
    isPremium: company.isPremium,
    isActive: company.isActive,
    logoUrl: urlFor(media, 'logo'),
    bannerUrl: urlFor(media, 'banner'),
    createdAt: company.createdAt.toISOString(),
    updatedAt: company.updatedAt.toISOString(),
  };
}

export function transformCompanies(
  companies: Company[],
  mediaByCompany: Map<string, CompanyMediaInfo[]>,
  locale: string,
): CompanyResource[] {
  return companies.map((company) =>
    transformCompany(company, mediaByCompany.get(company.id) ?? [], locale),
  );
}
