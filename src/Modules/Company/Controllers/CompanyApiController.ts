import type { RequestHandler, Response } from 'express';
import { ValidationError } from '../../../Core/Http/Errors/index.js';
import { created, noContent, ok } from '../../../Core/Http/Responses.js';
import type { User } from '../../User/Entities/User.js';
import type { CompanyMediaKind } from '../Entities/CompanyMediaKind.js';
import type {
  CreateCompanyRequest,
  ListCompaniesRequest,
  UpdateCompanyRequest,
  UpdateCompanyStatusRequest,
} from '../Requests/index.js';
import { companyService } from '../Services/index.js';
import { transformCompanies, transformCompany } from '../Transformers/CompanyTransformer.js';

function localeOf(res: Response): string {
  return String(res.locals.locale ?? 'az');
}

function actorOf(req: { user?: User }): User {
  if (!req.user) throw new ValidationError('Authentication required');
  return req.user;
}

function uploadedBytes(req: { file?: Express.Multer.File }): Buffer {
  if (!req.file) {
    throw new ValidationError('Attach the image in a field named "file"');
  }
  return req.file.buffer;
}

export const index: RequestHandler = async (req, res) => {
  const query = (req.validated?.query ?? {}) as ListCompaniesRequest;

  const { companies, mediaByCompany } = await companyService.listWithMedia({
    ...(query.active === undefined ? {} : { onlyActive: query.active === 'true' }),
    ...(query.verified === undefined ? {} : { isVerified: query.verified === 'true' }),
    ...(query.cityId === undefined ? {} : { cityId: query.cityId }),
    ...(query.search === undefined ? {} : { search: query.search }),
  });

  ok(res, { companies: transformCompanies(companies, mediaByCompany, localeOf(res)) });
};

export const show: RequestHandler = async (req, res) => {
  const company = await companyService.getBySlug(String(req.params.slug));
  const media = await companyService.mediaFor(company.id);

  ok(res, { company: transformCompany(company, media, localeOf(res)) });
};

export const store: RequestHandler = async (req, res) => {
  const company = await companyService.create(
    actorOf(req),
    req.validated?.body as CreateCompanyRequest,
  );

  created(res, { company: transformCompany(company, [], localeOf(res)) });
};

export const update: RequestHandler = async (req, res) => {
  const company = await companyService.update(
    String(req.params.id),
    actorOf(req),
    req.validated?.body as UpdateCompanyRequest,
  );

  ok(res, {
    company: transformCompany(company, await companyService.mediaFor(company.id), localeOf(res)),
  });
};

export const updateStatus: RequestHandler = async (req, res) => {
  const company = await companyService.setStatus(
    String(req.params.id),
    req.validated?.body as UpdateCompanyStatusRequest,
  );

  ok(res, {
    company: transformCompany(company, await companyService.mediaFor(company.id), localeOf(res)),
  });
};

export const destroy: RequestHandler = async (req, res) => {
  await companyService.remove(String(req.params.id));
  noContent(res);
};

/** Shared by the logo and banner routes. */
export function uploadMedia(kind: CompanyMediaKind): RequestHandler {
  return async (req, res) => {
    const media = await companyService.setMedia(
      String(req.params.id),
      actorOf(req),
      kind,
      uploadedBytes(req),
    );

    ok(res, {
      media: { kind: media.kind, url: `/static/${media.path}`, byteSize: media.byteSize },
    });
  };
}

export function destroyMedia(kind: CompanyMediaKind): RequestHandler {
  return async (req, res) => {
    await companyService.removeMedia(String(req.params.id), actorOf(req), kind);
    noContent(res);
  };
}
