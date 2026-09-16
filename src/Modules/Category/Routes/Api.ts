import { Router } from 'express';
import { validate } from '../../../Middlewares/Validate.js';
import { requireAdmin } from '../../User/Middlewares/RequireAdmin.js';
import { requireAuth } from '../../User/Middlewares/RequireAuth.js';
import * as categoryApiController from '../Controllers/CategoryApiController.js';
import {
  createCategoryRequest,
  listCategoriesRequest,
  updateCategoryRequest,
} from '../Requests/index.js';

export const basePath = '/categories';

export const router = Router();

router.get('/', validate({ query: listCategoriesRequest }), categoryApiController.index);
router.get('/:slug', categoryApiController.show);

router.post(
  '/',
  requireAuth,
  requireAdmin,
  validate({ body: createCategoryRequest }),
  categoryApiController.store,
);
router.patch(
  '/:id',
  requireAuth,
  requireAdmin,
  validate({ body: updateCategoryRequest }),
  categoryApiController.update,
);
router.delete('/:id', requireAuth, requireAdmin, categoryApiController.destroy);
