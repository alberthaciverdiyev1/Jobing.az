import { promises as fs } from 'node:fs';
import path from 'node:path';
import { eq, like, or } from 'drizzle-orm';
import type { Express } from 'express';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { destroyDb, getDb } from '../src/Core/Database/index.js';
import { createApp } from '../src/Core/Http/App.js';
import { paths } from '../src/Config/Paths.js';
import { companies } from '../src/Modules/Company/Configurations/CompanyConfiguration.js';
import { companyMedia } from '../src/Modules/Company/Configurations/CompanyMediaConfiguration.js';
import { cities } from '../src/Modules/City/Configurations/CityConfiguration.js';
import { users } from '../src/Modules/User/Configurations/UserConfiguration.js';
import { canConnectToDatabase } from './helpers/database.js';

const dbAvailable = await canConnectToDatabase();

const password = 'secret-password-123';
const stamp = Date.now();
const ownerEmail = `company-owner-${stamp}@example.com`;
const otherEmail = `company-other-${stamp}@example.com`;
const adminEmail = `company-admin-${stamp}@example.com`;

/** A buffer that starts with the real PNG signature. */
const PNG_BYTES = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  Buffer.alloc(64),
]);

let app: Express;
let ownerToken = '';
let otherToken = '';
let adminToken = '';
let companyId = '';
let cityId = '';

async function createAccount(email: string): Promise<string> {
  const response = await request(app)
    .post('/api/v1/auth/register')
    .send({ name: 'Company Tester', email, password });

  return response.body.data.token as string;
}

function auth(token: string): [string, string] {
  return ['Authorization', `Bearer ${token}`];
}

function mediaOf(id: string) {
  return getDb().select().from(companyMedia).where(eq(companyMedia.companyId, id));
}

beforeAll(async () => {
  app = await createApp();
  if (!dbAvailable) return;

  ownerToken = await createAccount(ownerEmail);
  otherToken = await createAccount(otherEmail);
  adminToken = await createAccount(adminEmail);

  await getDb().update(users).set({ isAdmin: true }).where(eq(users.email, adminEmail));

  const [city] = await getDb()
    .insert(cities)
    .values({ slug: `company-test-city-${stamp}`, name: { az: 'Bakı', en: 'Baku' } })
    .returning();
  cityId = city!.id;
});

afterAll(async () => {
  if (dbAvailable) {
    if (companyId) {
      await fs.rm(path.join(paths.public, 'images', 'companies', companyId), {
        recursive: true,
        force: true,
      });
    }

    // Scoped to what this file creates — never a blanket DELETE.
    await getDb().delete(companies).where(like(companies.slug, 'test-sirket%'));
    await getDb().delete(cities).where(like(cities.slug, 'company-test-city-%'));
    await getDb()
      .delete(users)
      .where(
        or(
          like(users.email, 'company-owner-%'),
          like(users.email, 'company-other-%'),
          like(users.email, 'company-admin-%'),
        ),
      );
  }
  await destroyDb();
});

describe('Company API authorisation', () => {
  it('rejects anonymous creation', async () => {
    const response = await request(app)
      .post('/api/v1/companies')
      .send({ name: { az: 'Anonim' } });

    expect(response.status).toBe(401);
  });

  it.runIf(dbAvailable)('refuses to change status for a non-admin', async () => {
    const response = await request(app)
      .patch(`/api/v1/companies/${companyId}/status`)
      .set(...auth(ownerToken))
      .send({ isVerified: true });

    expect(response.status).toBe(403);
  });
});

describe.runIf(dbAvailable)('Company API (requires PostgreSQL)', () => {
  it('validates the payload', async () => {
    const response = await request(app)
      .post('/api/v1/companies')
      .set(...auth(ownerToken))
      .send({ name: { en: 'No Azerbaijani name' } });

    expect(response.status).toBe(422);
  });

  it('rejects an unknown city', async () => {
    const response = await request(app)
      .post('/api/v1/companies')
      .set(...auth(ownerToken))
      .send({
        name: { az: 'Test Şirkət' },
        cityId: '00000000-0000-0000-0000-000000000000',
      });

    expect(response.status).toBe(422);
    expect(response.body.error.message).toContain('city');
  });

  it('creates a company owned by the caller', async () => {
    const response = await request(app)
      .post('/api/v1/companies')
      .set(...auth(ownerToken))
      .send({
        name: { az: 'Test Şirkət', en: 'Test Company' },
        description: { az: 'Təsvir', en: 'Description' },
        cityId,
        website: 'example.com',
      });

    expect(response.status).toBe(201);
    expect(response.body.data.company.slug).toBe('test-sirket');
    expect(response.body.data.company.website).toBe('https://example.com');
    expect(response.body.data.company.isVerified).toBe(false);
    expect(response.body.data.company.logoUrl).toBeNull();

    companyId = response.body.data.company.id as string;
  });

  it('allows one company per account', async () => {
    const response = await request(app)
      .post('/api/v1/companies')
      .set(...auth(ownerToken))
      .send({ name: { az: 'İkinci Şirkət' } });

    expect(response.status).toBe(409);
  });

  it('ignores verification flags sent to the profile endpoint', async () => {
    const response = await request(app)
      .patch(`/api/v1/companies/${companyId}`)
      .set(...auth(ownerToken))
      .send({ isVerified: true, isPremium: true, phone: '+994501112233' });

    expect(response.status).toBe(200);
    expect(response.body.data.company.isVerified).toBe(false);
    expect(response.body.data.company.isPremium).toBe(false);
    expect(response.body.data.company.phone).toBe('+994501112233');
  });

  it('refuses edits from another account', async () => {
    const response = await request(app)
      .patch(`/api/v1/companies/${companyId}`)
      .set(...auth(otherToken))
      .send({ phone: '+994500000000' });

    expect(response.status).toBe(403);
  });

  it('lets an administrator verify a company', async () => {
    const response = await request(app)
      .patch(`/api/v1/companies/${companyId}/status`)
      .set(...auth(adminToken))
      .send({ isVerified: true, isPremium: true });

    expect(response.status).toBe(200);
    expect(response.body.data.company.isVerified).toBe(true);
    expect(response.body.data.company.isPremium).toBe(true);
  });

  it('lists and filters companies', async () => {
    // Assertions are scoped to this file's company: other suites share the database.
    const slugsOf = async (query: Record<string, unknown>): Promise<string[]> => {
      const response = await request(app).get('/api/v1/companies').query(query);
      return (response.body.data.companies as { slug: string }[]).map((row) => row.slug);
    };

    expect(await slugsOf({})).toContain('test-sirket');
    expect(await slugsOf({ cityId })).toContain('test-sirket');
    expect(await slugsOf({ cityId: '00000000-0000-0000-0000-000000000000' })).not.toContain(
      'test-sirket',
    );
    expect(await slugsOf({ verified: 'true' })).toContain('test-sirket');
    // Uppercase with a dotted İ: the search must not be defeated by JS lowercasing.
    expect(await slugsOf({ search: 'ŞİRKƏT' })).toContain('test-sirket');
  });

  it('resolves the name for the requested locale', async () => {
    const english = await request(app)
      .get('/api/v1/companies/test-sirket')
      .set('Cookie', 'lang=en');
    expect(english.body.data.company.name).toBe('Test Company');

    const azerbaijani = await request(app).get('/api/v1/companies/test-sirket');
    expect(azerbaijani.body.data.company.name).toBe('Test Şirkət');
  });

  it('stores an uploaded logo under public/images', async () => {
    const response = await request(app)
      .put(`/api/v1/companies/${companyId}/logo`)
      .set(...auth(ownerToken))
      .attach('file', PNG_BYTES, 'logo.png');

    expect(response.status).toBe(200);
    expect(response.body.data.media.kind).toBe('logo');
    expect(response.body.data.media.url).toMatch(/^\/static\/images\/companies\//);

    const stored = await mediaOf(companyId);
    expect(stored).toHaveLength(1);
    expect(stored[0]?.mimeType).toBe('image/png');

    const onDisk = await fs.readFile(path.join(paths.public, stored[0]!.path));
    expect(onDisk.equals(PNG_BYTES)).toBe(true);
  });

  it('exposes the logo in the company resource', async () => {
    const response = await request(app).get('/api/v1/companies/test-sirket');

    expect(response.body.data.company.logoUrl).toMatch(/^\/static\/images\/companies\//);
  });

  it('deletes the previous file when the logo is replaced', async () => {
    const before = await mediaOf(companyId);
    const previousPath = before[0]!.path;

    const jpeg = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff]), Buffer.alloc(32)]);
    await request(app)
      .put(`/api/v1/companies/${companyId}/logo`)
      .set(...auth(ownerToken))
      .attach('file', jpeg, 'logo.jpg')
      .expect(200);

    await expect(fs.access(path.join(paths.public, previousPath))).rejects.toThrow();

    const after = await mediaOf(companyId);
    expect(after).toHaveLength(1);
    expect(after[0]!.mimeType).toBe('image/jpeg');
  });

  it('rejects a file that is not really an image', async () => {
    const response = await request(app)
      .put(`/api/v1/companies/${companyId}/banner`)
      .set(...auth(ownerToken))
      .attach('file', Buffer.from('definitely not an image'), 'evil.png');

    expect(response.status).toBe(422);
    expect(response.body.error.message).toContain('PNG, JPEG and WebP');
  });

  it('refuses uploads from another account', async () => {
    const response = await request(app)
      .put(`/api/v1/companies/${companyId}/logo`)
      .set(...auth(otherToken))
      .attach('file', PNG_BYTES, 'logo.png');

    expect(response.status).toBe(403);
  });

  it('removes a stored image and its file', async () => {
    const [stored] = await mediaOf(companyId);

    const response = await request(app)
      .delete(`/api/v1/companies/${companyId}/logo`)
      .set(...auth(ownerToken));
    expect(response.status).toBe(204);

    await expect(fs.access(path.join(paths.public, stored!.path))).rejects.toThrow();
    expect(await mediaOf(companyId)).toHaveLength(0);
  });

  it('deletes the company, its media rows and its files', async () => {
    const uploaded = await request(app)
      .put(`/api/v1/companies/${companyId}/banner`)
      .set(...auth(ownerToken))
      .attach('file', PNG_BYTES, 'banner.png')
      .expect(200);

    const bannerPath = (uploaded.body.data.media.url as string).replace('/static/', '');
    await expect(fs.access(path.join(paths.public, bannerPath))).resolves.toBeUndefined();

    const removed = await request(app)
      .delete(`/api/v1/companies/${companyId}`)
      .set(...auth(adminToken));
    expect(removed.status).toBe(204);

    expect((await request(app).get('/api/v1/companies/test-sirket')).status).toBe(404);
    expect(await mediaOf(companyId)).toHaveLength(0);

    // The row is gone; the file must not linger.
    await expect(fs.access(path.join(paths.public, bannerPath))).rejects.toThrow();
  });
});
