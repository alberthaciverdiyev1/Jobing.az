import { eq, like, or } from 'drizzle-orm';
import type { Express } from 'express';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { destroyDb, getDb } from '../src/Core/Database/index.js';
import { createApp } from '../src/Core/Http/App.js';
import { categories } from '../src/Modules/Category/Configurations/CategoryConfiguration.js';
import { users } from '../src/Modules/User/Configurations/UserConfiguration.js';
import { canConnectToDatabase } from './helpers/database.js';

const dbAvailable = await canConnectToDatabase();

const adminEmail = `category-admin-${Date.now()}@example.com`;
const password = 'secret-password-123';

let app: Express;
let adminToken = '';
let memberToken = '';

async function createAccount(email: string): Promise<string> {
  const response = await request(app)
    .post('/api/v1/auth/register')
    .send({ name: 'Category Tester', email, password });

  return response.body.data.token as string;
}

function auth(token: string): [string, string] {
  return ['Authorization', `Bearer ${token}`];
}

let rootId = '';
let childId = '';
let grandChildId = '';

beforeAll(async () => {
  app = await createApp();
  if (!dbAvailable) return;

  adminToken = await createAccount(adminEmail);
  memberToken = await createAccount(`category-member-${Date.now()}@example.com`);

  await getDb().update(users).set({ isAdmin: true }).where(eq(users.email, adminEmail));
});

afterAll(async () => {
  if (dbAvailable) {
    // Scoped to what this file creates — never a blanket DELETE.
    await getDb()
      .delete(categories)
      .where(or(like(categories.slug, 'muhendislik%'), like(categories.slug, 'proqram-teminati')));

    await getDb()
      .delete(users)
      .where(
        or(
          eq(users.email, adminEmail),
          like(users.email, 'category-admin-%'),
          like(users.email, 'category-member-%'),
        ),
      );
  }
  await destroyDb();
});

describe('Category API authorisation', () => {
  it('rejects anonymous writes', async () => {
    const response = await request(app)
      .post('/api/v1/categories')
      .send({
        name: { az: 'Anonim' },
      });

    expect(response.status).toBe(401);
  });

  it.runIf(dbAvailable)('rejects non-admin writes', async () => {
    const response = await request(app)
      .post('/api/v1/categories')
      .set(...auth(memberToken))
      .send({ name: { az: 'Üzv' } });

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('FORBIDDEN');
  });
});

describe.runIf(dbAvailable)('Category API (requires PostgreSQL)', () => {
  it('validates the payload', async () => {
    const response = await request(app)
      .post('/api/v1/categories')
      .set(...auth(adminToken))
      .send({ name: { en: 'No Azerbaijani name' } });

    expect(response.status).toBe(422);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('creates a root category with a generated slug', async () => {
    const response = await request(app)
      .post('/api/v1/categories')
      .set(...auth(adminToken))
      .send({ name: { az: 'Mühəndislik', en: 'Engineering' } });

    expect(response.status).toBe(201);
    expect(response.body.data.category.slug).toBe('muhendislik');
    expect(response.body.data.category.parentId).toBeNull();

    rootId = response.body.data.category.id as string;
  });

  it('appends a suffix when the slug is taken', async () => {
    const response = await request(app)
      .post('/api/v1/categories')
      .set(...auth(adminToken))
      .send({ name: { az: 'Mühəndislik' } });

    expect(response.status).toBe(201);
    expect(response.body.data.category.slug).toBe('muhendislik-2');

    await getDb().delete(categories).where(eq(categories.id, response.body.data.category.id));
  });

  it('creates nested categories', async () => {
    const child = await request(app)
      .post('/api/v1/categories')
      .set(...auth(adminToken))
      .send({ name: { az: 'Proqram təminatı', en: 'Software' }, parentId: rootId, position: 1 });
    childId = child.body.data.category.id as string;

    const grandChild = await request(app)
      .post('/api/v1/categories')
      .set(...auth(adminToken))
      .send({ name: { az: 'Frontend' }, parentId: childId });
    grandChildId = grandChild.body.data.category.id as string;

    expect(child.status).toBe(201);
    expect(grandChild.status).toBe(201);
    expect(grandChild.body.data.category.parentId).toBe(childId);
  });

  it('rejects a parent that does not exist', async () => {
    const response = await request(app)
      .post('/api/v1/categories')
      .set(...auth(adminToken))
      .send({ name: { az: 'Yetim' }, parentId: '00000000-0000-0000-0000-000000000000' });

    expect(response.status).toBe(422);
  });

  it('refuses to make a category its own parent', async () => {
    const response = await request(app)
      .patch(`/api/v1/categories/${rootId}`)
      .set(...auth(adminToken))
      .send({ parentId: rootId });

    expect(response.status).toBe(422);
  });

  it('refuses a move that would create a cycle', async () => {
    const response = await request(app)
      .patch(`/api/v1/categories/${rootId}`)
      .set(...auth(adminToken))
      .send({ parentId: grandChildId });

    expect(response.status).toBe(422);
    expect(response.body.error.message).toContain('inside this one');
  });

  it('lists every category and filters by parent', async () => {
    const all = await request(app).get('/api/v1/categories');
    expect(all.status).toBe(200);
    expect((all.body.data.categories as unknown[]).length).toBeGreaterThanOrEqual(3);

    const roots = await request(app).get('/api/v1/categories?parentId=root');
    expect(roots.body.data.categories).toHaveLength(1);
    expect(roots.body.data.categories[0].slug).toBe('muhendislik');

    const children = await request(app).get(`/api/v1/categories?parentId=${rootId}`);
    expect(children.body.data.categories).toHaveLength(1);
    expect(children.body.data.categories[0].slug).toBe('proqram-teminati');
  });

  it('returns a nested tree', async () => {
    const response = await request(app).get('/api/v1/categories?tree=true&parentId=root');

    const [root] = response.body.data.categories;
    expect(root.slug).toBe('muhendislik');
    expect(root.children).toHaveLength(1);
    expect(root.children[0].children[0].name).toBe('Frontend');
  });

  it('resolves the name for the requested locale', async () => {
    const english = await request(app)
      .get('/api/v1/categories/muhendislik')
      .set('Cookie', 'lang=en');
    expect(english.body.data.category.name).toBe('Engineering');
    expect(english.body.data.category.translations.az).toBe('Mühəndislik');

    const azerbaijani = await request(app).get('/api/v1/categories/muhendislik');
    expect(azerbaijani.body.data.category.name).toBe('Mühəndislik');

    const russian = await request(app)
      .get('/api/v1/categories/muhendislik')
      .set('Cookie', 'lang=ru');
    expect(russian.body.data.category.name).toBe('Mühəndislik');
  });

  it('searches by the primary locale name', async () => {
    const response = await request(app).get('/api/v1/categories?search=proqram');

    expect(response.body.data.categories).toHaveLength(1);
    expect(response.body.data.categories[0].slug).toBe('proqram-teminati');
  });

  it('updates a category', async () => {
    const response = await request(app)
      .patch(`/api/v1/categories/${childId}`)
      .set(...auth(adminToken))
      .send({ position: 5, isActive: false, name: { az: 'Proqram təminatı', tr: 'Yazılım' } });

    expect(response.status).toBe(200);
    expect(response.body.data.category.position).toBe(5);
    expect(response.body.data.category.isActive).toBe(false);
    expect(response.body.data.category.translations.tr).toBe('Yazılım');
  });

  it('returns 404 for an unknown slug', async () => {
    const response = await request(app).get('/api/v1/categories/yoxdur');

    expect(response.status).toBe(404);
  });

  it('deletes a category together with its subtree', async () => {
    const removed = await request(app)
      .delete(`/api/v1/categories/${rootId}`)
      .set(...auth(adminToken));
    expect(removed.status).toBe(204);

    const remaining = await getDb().select().from(categories);
    expect(remaining).toHaveLength(0);
  });
});
