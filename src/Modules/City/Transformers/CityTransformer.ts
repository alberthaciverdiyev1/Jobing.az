import { translateText } from '../../../Core/Localization/TranslateText.js';
import type { City } from '../Entities/City.js';
import type { CityResource } from './CityResource.js';

export function transformCity(city: City, locale: string): CityResource {
  return {
    id: city.id,
    slug: city.slug,
    name: translateText(city.name, locale),
    translations: city.name,
    position: city.position,
    isActive: city.isActive,
    createdAt: city.createdAt.toISOString(),
    updatedAt: city.updatedAt.toISOString(),
  };
}

export function transformCities(cities: City[], locale: string): CityResource[] {
  return cities.map((city) => transformCity(city, locale));
}
