import { eq, like } from 'drizzle-orm';
import type { Express } from 'express';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { destroyDb, getDb } from '../src/Core/Database/index.js';
import { createApp } from '../src/Core/Http/App.js';
import { companies } from '../src/Modules/Company/Configurations/CompanyConfiguration.js';
import { users } from '../src/Modules/User/Configurations/UserConfiguration.js';
import { canConnectToDatabase } from './helpers/database.js';

const dbAvailable = await canConnectToDatabase();
const ownerEmail = `pages-owner-${Date.now()}@example.com`;

let app: Express;
/** Cleanup targets the row we created — a slug pattern would guess wrong. */
let createdCompanyId: string | null = null;

beforeAll(async () => {
  app = await createApp();
});

afterAll(async () => {
  if (dbAvailable) {
    if (createdCompanyId) {
      await getDb().delete(companies).where(eq(companies.id, createdCompanyId));
    }
    await getDb().delete(users).where(like(users.email, 'pages-owner-%'));
  }
  await destroyDb();
});

/**
 * Every template is rendered here. Edge compiles lazily, so a broken template
 * only fails at render time — without these, a typo turns into a silent 500.
 */
const pages = [
  { path: '/', marker: 'hero__title' },
  { path: '/categories', marker: 'page-title' },
  { path: '/cities', marker: 'page-title' },
  { path: '/companies', marker: 'page-title' },
  { path: '/register', marker: 'auth__title' },
  { path: '/login', marker: 'auth__title' },
];

describe('public pages render', () => {
  for (const { path, marker } of pages) {
    it(`renders ${path}`, async () => {
      const response = await request(app).get(path);

      expect(response.status).toBe(200);
      expect(response.text).toContain(marker);
      expect(response.text).not.toContain('EdgeError');
    });
  }

  it('renders the error page for an unknown route', async () => {
    const response = await request(app).get('/definitely-not-a-route');

    expect(response.status).toBe(404);
    expect(response.text).toContain('error-page__code');
  });
});

describe.runIf(dbAvailable)('detail pages render', () => {
  it('renders a company page', async () => {
    const token = (
      await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'Pages Tester', email: ownerEmail, password: 'secret-password-123' })
    ).body.data.token as string;

    const created = await request(app)
      .post('/api/v1/companies')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: { az: 'Pages Şirkət', en: 'Pages Company' }, description: { az: 'Təsvir' } });

    const slug = created.body.data.company.slug as string;
    createdCompanyId = created.body.data.company.id as string;

    const response = await request(app).get(`/companies/${slug}`);
    expect(response.status).toBe(200);
    expect(response.text).toContain('Pages Şirkət');

    const english = await request(app).get(`/companies/${slug}`).set('Cookie', 'lang=en');
    expect(english.text).toContain('Pages Company');
  });

  it('renders the not-found page for an unknown company', async () => {
    const response = await request(app).get('/companies/no-such-company');

    expect(response.status).toBe(404);
    expect(response.text).toContain('error-page__code');
  });

  it('renders the category page', async () => {
    const response = await request(app).get('/categories');

    expect(response.status).toBe(200);
    expect(response.text).not.toContain('EdgeError');
  });
});
