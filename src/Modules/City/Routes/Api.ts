import { Router } from 'express';
import { validate } from '../../../Middlewares/Validate.js';
import { requireAdmin } from '../../User/Middlewares/RequireAdmin.js';
import { requireAuth } from '../../User/Middlewares/RequireAuth.js';
import * as cityApiController from '../Controllers/CityApiController.js';
import { createCityRequest, listCitiesRequest, updateCityRequest } from '../Requests/index.js';

export const basePath = '/cities';

export const router = Router();

router.get('/', validate({ query: listCitiesRequest }), cityApiController.index);
router.get('/:slug', cityApiController.show);

router.post(
  '/',
  requireAuth,
  requireAdmin,
  validate({ body: createCityRequest }),
  cityApiController.store,
);
router.patch(
  '/:id',
  requireAuth,
  requireAdmin,
  validate({ body: updateCityRequest }),
  cityApiController.update,
);
router.delete('/:id', requireAuth, requireAdmin, cityApiController.destroy);
