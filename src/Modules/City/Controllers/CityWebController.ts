import type { RequestHandler } from 'express';
import { renderPage } from '../../../Core/View/RenderPage.js';
import { cityService } from '../Services/index.js';
import { transformCities } from '../Transformers/CityTransformer.js';

/** Public listing of every active city. */
export const index: RequestHandler = async (_req, res) => {
  const cities = await cityService.list({ onlyActive: true });

  await renderPage(res, 'City/Index', {
    pageTitle: res.locals.t('city.title'),
    pageDescription: res.locals.t('city.subtitle'),
    cities: transformCities(cities, String(res.locals.locale ?? 'az')),
  });
};
