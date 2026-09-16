import type { RequestHandler } from 'express';
import { renderPage } from '../../../Core/View/RenderPage.js';
import { categoryService } from '../Services/index.js';
import { buildCategoryTree } from '../Transformers/CategoryTree.js';
import { transformCategories } from '../Transformers/CategoryTransformer.js';

/** Public listing of every active category, nested one level deep. */
export const index: RequestHandler = async (_req, res) => {
  const categories = await categoryService.list({ onlyActive: true });
  const tree = buildCategoryTree(
    transformCategories(categories, String(res.locals.locale ?? 'az')),
  );

  await renderPage(res, 'Category/Index', {
    pageTitle: res.locals.t('category.title'),
    pageDescription: res.locals.t('category.subtitle'),
    categories: tree,
  });
};
