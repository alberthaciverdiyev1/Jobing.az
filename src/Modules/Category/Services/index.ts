import { categoryRepository } from '../Repositories/index.js';
import { CategoryService } from './CategoryService.js';

/** The shared instance. Controllers import this, never the class directly. */
export const categoryService: CategoryService = new CategoryService(categoryRepository);

export { CategoryService };
