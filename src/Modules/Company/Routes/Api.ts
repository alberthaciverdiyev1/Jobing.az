import { Router } from 'express';
import { uploadImage } from '../../../Middlewares/UploadImage.js';
import { validate } from '../../../Middlewares/Validate.js';
import { requireAdmin } from '../../User/Middlewares/RequireAdmin.js';
import { requireAuth } from '../../User/Middlewares/RequireAuth.js';
import * as companyApiController from '../Controllers/CompanyApiController.js';
import {
  createCompanyRequest,
  listCompaniesRequest,
  updateCompanyRequest,
  updateCompanyStatusRequest,
} from '../Requests/index.js';

export const basePath = '/companies';

export const router = Router();

router.get('/', validate({ query: listCompaniesRequest }), companyApiController.index);
router.get('/:slug', companyApiController.show);

// Any signed-in account may register a company; it becomes its owner.
router.post('/', requireAuth, validate({ body: createCompanyRequest }), companyApiController.store);

// Profile edits belong to the owner (or an administrator) and are checked in the service.
router.patch(
  '/:id',
  requireAuth,
  validate({ body: updateCompanyRequest }),
  companyApiController.update,
);

// Verification and premium status are administrator decisions.
router.patch(
  '/:id/status',
  requireAuth,
  requireAdmin,
  validate({ body: updateCompanyStatusRequest }),
  companyApiController.updateStatus,
);
router.delete('/:id', requireAuth, requireAdmin, companyApiController.destroy);

router.put('/:id/logo', requireAuth, uploadImage, companyApiController.uploadMedia('logo'));
router.put('/:id/banner', requireAuth, uploadImage, companyApiController.uploadMedia('banner'));
router.delete('/:id/logo', requireAuth, companyApiController.destroyMedia('logo'));
router.delete('/:id/banner', requireAuth, companyApiController.destroyMedia('banner'));
