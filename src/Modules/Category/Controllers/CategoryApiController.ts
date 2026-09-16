import type { RequestHandler, Response } from 'express';
import { created, noContent, ok } from '../../../Core/Http/Responses.js';
import type {
  CreateCategoryRequest,
  ListCategoriesRequest,
  UpdateCategoryRequest,
} from '../Requests/index.js';
import { categoryService } from '../Services/index.js';
import { buildCategoryTree, findCategorySubtree } from '../Transformers/CategoryTree.js';
import { transformCategories, transformCategory } from '../Transformers/CategoryTransformer.js';

function localeOf(res: Response): string {
  return String(res.locals.locale ?? 'az');
}

export const index: RequestHandler = async (req, res) => {
  const query = (req.validated?.query ?? {}) as ListCategoriesRequest;
  const wantsTree = query.tree === 'true';

  const common = {
    ...(query.active === undefined ? {} : { onlyActive: query.active === 'true' }),
    ...(query.search === undefined ? {} : { search: query.search }),
  };

  // A tree needs the whole set: filtering by parent first would drop the children.
  const categories = await categoryService.list(
    wantsTree
      ? common
      : {
          ...common,
          ...(query.parentId === undefined
            ? {}
            : { parentId: query.parentId === 'root' ? null : query.parentId }),
        },
  );

  const resources = transformCategories(categories, localeOf(res));

  if (!wantsTree) {
    ok(res, { categories: resources });
    return;
  }

  const tree = buildCategoryTree(resources);
  const requestedRoot =
    typeof query.parentId === 'string' && query.parentId !== 'root'
      ? findCategorySubtree(tree, query.parentId)
      : undefined;

  ok(res, { categories: requestedRoot ? [requestedRoot] : tree });
};

export const show: RequestHandler = async (req, res) => {
  const category = await categoryService.getBySlug(String(req.params.slug));
  ok(res, { category: transformCategory(category, localeOf(res)) });
};

export const store: RequestHandler = async (req, res) => {
  const category = await categoryService.create(req.validated?.body as CreateCategoryRequest);
  created(res, { category: transformCategory(category, localeOf(res)) });
};

export const update: RequestHandler = async (req, res) => {
  const category = await categoryService.update(
    String(req.params.id),
    req.validated?.body as UpdateCategoryRequest,
  );

  ok(res, { category: transformCategory(category, localeOf(res)) });
};

export const destroy: RequestHandler = async (req, res) => {
  await categoryService.remove(String(req.params.id));
  noContent(res);
};
