import { cityRepository } from '../Repositories/index.js';
import { CityService } from './CityService.js';

/** The shared instance. Controllers import this, never the class directly. */
export const cityService: CityService = new CityService(cityRepository);

export { CityService };
