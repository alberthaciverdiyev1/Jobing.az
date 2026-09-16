import { CityRepository } from './CityRepository.js';

/** The shared instance. Import this rather than constructing the repository. */
export const cityRepository = new CityRepository();
