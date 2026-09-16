import type { City } from '../Entities/City.js';
import type { NewCity } from '../Entities/NewCity.js';
import type { CityListFilters } from './CityListFilters.js';

/** Persistence contract for cities. */
export interface CityRepositoryInterface {
  findById(id: string): Promise<City | undefined>;
  findBySlug(slug: string): Promise<City | undefined>;
  slugExists(slug: string, exceptId?: string): Promise<boolean>;
  list(filters: CityListFilters): Promise<City[]>;
  create(data: NewCity): Promise<City>;
  update(id: string, data: Partial<NewCity>): Promise<City | undefined>;
  delete(id: string): Promise<boolean>;
}
