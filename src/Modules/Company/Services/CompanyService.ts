import path from 'node:path';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../../Core/Http/Errors/index.js';
import { normalizeTranslation } from '../../../Core/Localization/TranslateText.js';
import type { TranslatedText } from '../../../Core/Localization/TranslatedText.js';
import { deleteImage, storeImage } from '../../../Core/Storage/ImageStorage.js';
import { toImagePayload } from '../../../Core/Support/ImagePayload.js';
import { uniqueSlug } from '../../../Core/Support/UniqueSlug.js';
import { cityRepository } from '../../City/Repositories/index.js';
import type { User } from '../../User/Entities/User.js';
import type { Company } from '../Entities/Company.js';
import type { CompanyMediaKind } from '../Entities/CompanyMediaKind.js';
import type { NewCompany } from '../Entities/NewCompany.js';
import type {
  CompanyListFilters,
  CompanyMediaInfo,
  CompanyRepository,
} from '../Repositories/CompanyRepository.js';
import type {
  CreateCompanyRequest,
  UpdateCompanyRequest,
  UpdateCompanyStatusRequest,
} from '../Requests/index.js';

/** Adds a scheme so `example.com` is stored as a usable URL. */
function normalizeWebsite(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function normalizeOptional(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/**
 * Business rules for companies.
 *
 * Ownership is enforced here rather than in the routes: verification flags are
 * administrator-only, profile fields belong to the owner, and media uploads are
 * validated by their bytes.
 */
export class CompanyService {
  constructor(private readonly companies: CompanyRepository) {}

  async list(filters: CompanyListFilters): Promise<Company[]> {
    return this.companies.list(filters);
  }

  /**
   * A page of companies together with their media, fetched in one extra query
   * instead of one per company.
   */
  async listWithMedia(
    filters: CompanyListFilters,
  ): Promise<{ companies: Company[]; mediaByCompany: Map<string, CompanyMediaInfo[]> }> {
    const companies = await this.companies.list(filters);
    const mediaByCompany = await this.companies.listMediaForCompanies(
      companies.map((company) => company.id),
    );

    return { companies, mediaByCompany };
  }

  async getById(id: string): Promise<Company> {
    const found = await this.companies.findById(id);
    if (!found) throw new NotFoundError('Company not found');
    return found;
  }

  async getBySlug(slug: string): Promise<Company> {
    const found = await this.companies.findBySlug(slug);
    if (!found) throw new NotFoundError('Company not found');
    return found;
  }

  async mediaFor(companyId: string): Promise<CompanyMediaInfo[]> {
    return this.companies.listMedia(companyId);
  }

  async create(owner: User, input: CreateCompanyRequest): Promise<Company> {
    if (await this.companies.findByOwnerId(owner.id)) {
      throw new ConflictError('You already manage a company');
    }

    const name = normalizeTranslation(input.name);
    await this.assertCityExists(input.cityId ?? null);

    return this.companies.create({
      ownerId: owner.id,
      cityId: input.cityId ?? null,
      slug: await this.freeSlug(input.slug, name),
      name,
      description: input.description ? normalizeTranslation(input.description) : null,
      website: normalizeWebsite(input.website),
      email: normalizeOptional(input.email)?.toLowerCase() ?? null,
      phone: normalizeOptional(input.phone),
    });
  }

  async update(id: string, actor: User, input: UpdateCompanyRequest): Promise<Company> {
    const company = await this.getById(id);
    this.assertCanManage(company, actor);

    const name = input.name ? normalizeTranslation(input.name) : company.name;
    const changes: Partial<NewCompany> = {};

    if (input.name) changes.name = name;

    if (input.slug !== undefined) {
      changes.slug = await this.freeSlug(input.slug, name, id);
    }

    if (input.description !== undefined) {
      changes.description = input.description ? normalizeTranslation(input.description) : null;
    }

    if (input.cityId !== undefined) {
      await this.assertCityExists(input.cityId);
      changes.cityId = input.cityId;
    }

    if (input.website !== undefined) changes.website = normalizeWebsite(input.website);
    if (input.email !== undefined) {
      changes.email = normalizeOptional(input.email)?.toLowerCase() ?? null;
    }
    if (input.phone !== undefined) changes.phone = normalizeOptional(input.phone);
    if (input.isActive !== undefined) changes.isActive = input.isActive;

    const updated = await this.companies.update(id, changes);
    if (!updated) throw new NotFoundError('Company not found');

    return updated;
  }

  /** Administrators only — the route is behind `requireAdmin`. */
  async setStatus(id: string, input: UpdateCompanyStatusRequest): Promise<Company> {
    const changes: Partial<NewCompany> = {};

    if (input.isVerified !== undefined) changes.isVerified = input.isVerified;
    if (input.isPremium !== undefined) changes.isPremium = input.isPremium;
    if (input.isActive !== undefined) changes.isActive = input.isActive;

    const updated = await this.companies.update(id, changes);
    if (!updated) throw new NotFoundError('Company not found');

    return updated;
  }

  /**
   * Deletes the company and the files behind its images.
   *
   * The media rows disappear through `ON DELETE CASCADE`, but files on disk do
   * not — so their paths are collected first and removed afterwards.
   */
  async remove(id: string): Promise<void> {
    const media = await this.companies.listMedia(id);
    const removed = await this.companies.delete(id);

    if (!removed) throw new NotFoundError('Company not found');

    await Promise.all(media.map((entry) => deleteImage(entry.path)));
  }

  async mediaInfo(companyId: string): Promise<CompanyMediaInfo[]> {
    return this.companies.listMedia(companyId);
  }

  /**
   * Validates the upload, writes it under `public/images/companies/<id>/` and
   * records where it landed. Replacing an image deletes the previous file.
   */
  async setMedia(
    id: string,
    actor: User,
    kind: CompanyMediaKind,
    bytes: Buffer,
  ): Promise<CompanyMediaInfo> {
    const company = await this.getById(id);
    this.assertCanManage(company, actor);

    const image = toImagePayload(bytes);
    const previous = await this.companies.findMedia(id, kind);
    const storedPath = await storeImage(path.posix.join('companies', id), kind, image);

    await this.companies.upsertMedia(id, kind, {
      path: storedPath,
      mimeType: image.mimeType,
      byteSize: image.byteSize,
    });

    if (previous && previous.path !== storedPath) {
      await deleteImage(previous.path);
    }

    return {
      kind,
      path: storedPath,
      mimeType: image.mimeType,
      byteSize: image.byteSize,
      updatedAt: new Date(),
    };
  }

  async removeMedia(id: string, actor: User, kind: CompanyMediaKind): Promise<void> {
    const company = await this.getById(id);
    this.assertCanManage(company, actor);

    const existing = await this.companies.findMedia(id, kind);
    if (!existing) throw new NotFoundError('Image not found');

    await this.companies.deleteMedia(id, kind);
    await deleteImage(existing.path);
  }

  private assertCanManage(company: Company, actor: User): void {
    if (actor.isAdmin) return;
    if (company.ownerId !== null && company.ownerId === actor.id) return;

    throw new ForbiddenError('You do not manage this company');
  }

  private async assertCityExists(cityId: string | null): Promise<void> {
    if (cityId === null) return;

    if (!(await cityRepository.findById(cityId))) {
      throw new ValidationError('The selected city does not exist');
    }
  }

  private async freeSlug(
    candidate: string | undefined,
    name: TranslatedText,
    exceptId?: string,
  ): Promise<string> {
    return uniqueSlug(candidate?.trim() || name.az, (slug) =>
      this.companies.slugExists(slug, exceptId),
    );
  }
}
