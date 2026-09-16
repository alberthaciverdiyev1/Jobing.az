import { eq, like, or } from 'drizzle-orm';
import type { Express } from 'express';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { destroyDb, getDb } from '../src/Core/Database/index.js';
import { createApp } from '../src/Core/Http/App.js';
import { cities } from '../src/Modules/City/Configurations/CityConfiguration.js';
import { users } from '../src/Modules/User/Configurations/UserConfiguration.js';
import { canConnectToDatabase } from './helpers/database.js';

const dbAvailable = await canConnectToDatabase();

const adminEmail = `city-admin-${Date.now()}@example.com`;
const memberEmail = `city-member-${Date.now()}@example.com`;
const password = 'secret-password-123';

let app: Express;
let adminToken = '';
let memberToken = '';

async function createAccount(email: string): Promise<string> {
  const response = await request(app)
    .post('/api/v1/auth/register')
    .send({ name: 'City Tester', email, password });

  return response.body.data.token as string;
}

function auth(token: string): [string, string] {
  return ['Authorization', `Bearer ${token}`];
}

let bakuId = '';

beforeAll(async () => {
  app = await createApp();
  if (!dbAvailable) return;

  adminToken = await createAccount(adminEmail);
  memberToken = await createAccount(memberEmail);

  await getDb().update(users).set({ isAdmin: true }).where(eq(users.email, adminEmail));
});

afterAll(async () => {
  if (dbAvailable) {
    // Scoped to what this file creates — never a blanket DELETE.
    await getDb()
      .delete(cities)
      .where(or(like(cities.slug, 'baki%'), like(cities.slug, 'gence%')));
    await getDb()
      .delete(users)
      .where(or(like(users.email, 'city-admin-%'), like(users.email, 'city-member-%')));
  }
  await destroyDb();
});

describe('City API authorisation', () => {
  it('rejects anonymous writes', async () => {
    const response = await request(app)
      .post('/api/v1/cities')
      .send({ name: { az: 'Bakı' } });

    expect(response.status).toBe(401);
  });

  it.runIf(dbAvailable)('rejects non-admin writes', async () => {
    const response = await request(app)
      .post('/api/v1/cities')
      .set(...auth(memberToken))
      .send({ name: { az: 'Bakı' } });

    expect(response.status).toBe(403);
  });
});

describe.runIf(dbAvailable)('City API (requires PostgreSQL)', () => {
  it('validates the payload', async () => {
    const response = await request(app)
      .post('/api/v1/cities')
      .set(...auth(adminToken))
      .send({ name: { en: 'Baku' } });

    expect(response.status).toBe(422);
  });

  it('creates a city with a generated slug', async () => {
    const response = await request(app)
      .post('/api/v1/cities')
      .set(...auth(adminToken))
      .send({ name: { az: 'Bakı', en: 'Baku' }, position: 1 });

    expect(response.status).toBe(201);
    expect(response.body.data.city.slug).toBe('baki');
    expect(response.body.data.city.translations).toEqual({ az: 'Bakı', en: 'Baku' });

    bakuId = response.body.data.city.id as string;
  });

  it('appends a suffix when the slug is taken', async () => {
    const response = await request(app)
      .post('/api/v1/cities')
      .set(...auth(adminToken))
      .send({ name: { az: 'Bakı' } });

    expect(response.body.data.city.slug).toBe('baki-2');
    await getDb().delete(cities).where(eq(cities.id, response.body.data.city.id));
  });

  it('rejects a slug that cannot be built', async () => {
    const response = await request(app)
      .post('/api/v1/cities')
      .set(...auth(adminToken))
      .send({ name: { az: 'Гянджа' } });

    expect(response.status).toBe(422);
    expect(response.body.error.message).toContain('provide one explicitly');
  });

  it('accepts an explicit slug when the name is not Latin', async () => {
    const response = await request(app)
      .post('/api/v1/cities')
      .set(...auth(adminToken))
      .send({ name: { az: 'Гянджа', en: 'Ganja' }, slug: 'gence', position: 2 });

    expect(response.status).toBe(201);
    expect(response.body.data.city.slug).toBe('gence');
  });

  it('lists cities and hides inactive ones on request', async () => {
    const all = await request(app).get('/api/v1/cities');
    expect(all.body.data.cities).toHaveLength(2);

    await request(app)
      .patch(`/api/v1/cities/${bakuId}`)
      .set(...auth(adminToken))
      .send({ isActive: false });

    const active = await request(app).get('/api/v1/cities?active=true');
    expect(active.body.data.cities).toHaveLength(1);
    expect(active.body.data.cities[0].slug).toBe('gence');
  });

  it('searches by the primary locale name, case-insensitively', async () => {
    const response = await request(app).get('/api/v1/cities').query({ search: 'ГЯНДЖА' });

    expect(response.body.data.cities).toHaveLength(1);
    expect(response.body.data.cities[0].translations.az).toBe('Гянджа');
  });

  it('resolves the name for the requested locale', async () => {
    const english = await request(app).get('/api/v1/cities/baki').set('Cookie', 'lang=en');
    expect(english.body.data.city.name).toBe('Baku');

    const azerbaijani = await request(app).get('/api/v1/cities/baki');
    expect(azerbaijani.body.data.city.name).toBe('Bakı');

    const russian = await request(app).get('/api/v1/cities/baki').set('Cookie', 'lang=ru');
    expect(russian.body.data.city.name).toBe('Bakı');
  });

  it('returns 404 for an unknown slug', async () => {
    expect((await request(app).get('/api/v1/cities/naməlum')).status).toBe(404);
  });

  it('deletes a city', async () => {
    const removed = await request(app)
      .delete(`/api/v1/cities/${bakuId}`)
      .set(...auth(adminToken));

    expect(removed.status).toBe(204);
    expect((await request(app).get('/api/v1/cities/baki')).status).toBe(404);
  });
});
