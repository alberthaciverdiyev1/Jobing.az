import { CategoryRepository } from './CategoryRepository.js';

/** The shared instance. Import this rather than constructing the repository. */
export const categoryRepository = new CategoryRepository();
