import { NotFoundError } from '../../../Core/Http/Errors/index.js';
import { normalizeTranslation } from '../../../Core/Localization/TranslateText.js';
import type { TranslatedText } from '../../../Core/Localization/TranslatedText.js';
import { uniqueSlug } from '../../../Core/Support/UniqueSlug.js';
import type { City } from '../Entities/City.js';
import type { NewCity } from '../Entities/NewCity.js';
import type { CityListFilters } from '../Interfaces/CityListFilters.js';
import type { CityRepositoryInterface } from '../Interfaces/CityRepositoryInterface.js';
import type { CityServiceInterface } from '../Interfaces/CityServiceInterface.js';
import type { CreateCityInput } from '../Interfaces/CreateCityInput.js';
import type { UpdateCityInput } from '../Interfaces/UpdateCityInput.js';

/** Business rules for cities: unique slugs and translated names. */
export class CityService implements CityServiceInterface {
  constructor(private readonly cities: CityRepositoryInterface) {}

  async list(filters: CityListFilters): Promise<City[]> {
    return this.cities.list(filters);
  }

  async getById(id: string): Promise<City> {
    const found = await this.cities.findById(id);
    if (!found) throw new NotFoundError('City not found');
    return found;
  }

  async getBySlug(slug: string): Promise<City> {
    const found = await this.cities.findBySlug(slug);
    if (!found) throw new NotFoundError('City not found');
    return found;
  }

  async create(input: CreateCityInput): Promise<City> {
    const name = normalizeTranslation(input.name);

    return this.cities.create({
      slug: await this.freeSlug(input.slug, name),
      name,
      position: input.position ?? 0,
      isActive: input.isActive ?? true,
    });
  }

  async update(id: string, input: UpdateCityInput): Promise<City> {
    const existing = await this.getById(id);
    const name = input.name ? normalizeTranslation(input.name) : existing.name;
    const changes: Partial<NewCity> = {};

    if (input.name) changes.name = name;

    if (input.slug !== undefined) {
      changes.slug = await this.freeSlug(input.slug, name, id);
    }

    if (input.position !== undefined) changes.position = input.position;
    if (input.isActive !== undefined) changes.isActive = input.isActive;

    const updated = await this.cities.update(id, changes);
    if (!updated) throw new NotFoundError('City not found');

    return updated;
  }

  async remove(id: string): Promise<void> {
    const removed = await this.cities.delete(id);
    if (!removed) throw new NotFoundError('City not found');
  }

  private async freeSlug(
    candidate: string | undefined,
    name: TranslatedText,
    exceptId?: string,
  ): Promise<string> {
    return uniqueSlug(candidate?.trim() || name.az, (slug) =>
      this.cities.slugExists(slug, exceptId),
    );
  }
}
