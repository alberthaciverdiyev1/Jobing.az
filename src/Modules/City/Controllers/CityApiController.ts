import type { RequestHandler, Response } from 'express';
import { created, noContent, ok } from '../../../Core/Http/Responses.js';
import type { CreateCityRequest, ListCitiesRequest, UpdateCityRequest } from '../Requests/index.js';
import { cityService } from '../Services/index.js';
import { transformCities, transformCity } from '../Transformers/CityTransformer.js';

function localeOf(res: Response): string {
  return String(res.locals.locale ?? 'az');
}

export const index: RequestHandler = async (req, res) => {
  const query = (req.validated?.query ?? {}) as ListCitiesRequest;

  const cities = await cityService.list({
    ...(query.active === undefined ? {} : { onlyActive: query.active === 'true' }),
    ...(query.search === undefined ? {} : { search: query.search }),
  });

  ok(res, { cities: transformCities(cities, localeOf(res)) });
};

export const show: RequestHandler = async (req, res) => {
  const city = await cityService.getBySlug(String(req.params.slug));
  ok(res, { city: transformCity(city, localeOf(res)) });
};

export const store: RequestHandler = async (req, res) => {
  const city = await cityService.create(req.validated?.body as CreateCityRequest);
  created(res, { city: transformCity(city, localeOf(res)) });
};

export const update: RequestHandler = async (req, res) => {
  const city = await cityService.update(
    String(req.params.id),
    req.validated?.body as UpdateCityRequest,
  );

  ok(res, { city: transformCity(city, localeOf(res)) });
};

export const destroy: RequestHandler = async (req, res) => {
  await cityService.remove(String(req.params.id));
  noContent(res);
};
