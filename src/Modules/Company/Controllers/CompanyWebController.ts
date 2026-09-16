import type { RequestHandler } from 'express';
import { translateText } from '../../../Core/Localization/TranslateText.js';
import { renderPage } from '../../../Core/View/RenderPage.js';
import { cityService } from '../../City/Services/index.js';
import { companyService } from '../Services/index.js';
import { transformCompanies, transformCompany } from '../Transformers/CompanyTransformer.js';

/** Public directory of active companies. */
export const index: RequestHandler = async (_req, res) => {
  const { companies, mediaByCompany } = await companyService.listWithMedia({ onlyActive: true });

  await renderPage(res, 'Company/Index', {
    pageTitle: res.locals.t('company.title'),
    pageDescription: res.locals.t('company.subtitle'),
    companies: transformCompanies(companies, mediaByCompany, String(res.locals.locale ?? 'az')),
  });
};

/** A single company page. */
export const show: RequestHandler = async (req, res) => {
  const locale = String(res.locals.locale ?? 'az');
  const company = await companyService.getBySlug(String(req.params.slug));
  const media = await companyService.mediaFor(company.id);

  // Only the detail page needs the city name, so it is not worth a join.
  const city = company.cityId
    ? await cityService.getById(company.cityId).catch(() => undefined)
    : undefined;

  await renderPage(res, 'Company/Show', {
    pageTitle: company.name.az,
    pageDescription: company.description?.az ?? undefined,
    company: transformCompany(company, media, locale),
    cityName: city ? translateText(city.name, locale) : null,
  });
};
