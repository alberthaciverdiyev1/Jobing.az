import type { City } from '../Entities/City.js';
import type { CityListFilters } from './CityListFilters.js';
import type { CreateCityInput } from './CreateCityInput.js';
import type { UpdateCityInput } from './UpdateCityInput.js';

/** Business contract for cities. Controllers depend on this, not the class. */
export interface CityServiceInterface {
  list(filters: CityListFilters): Promise<City[]>;
  getById(id: string): Promise<City>;
  getBySlug(slug: string): Promise<City>;
  create(input: CreateCityInput): Promise<City>;
  update(id: string, input: UpdateCityInput): Promise<City>;
  remove(id: string): Promise<void>;
}
