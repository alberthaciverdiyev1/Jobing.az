import type { Express } from 'express';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { destroyDb, getDb } from '../src/Core/Database/index.js';
import { createApp } from '../src/Core/Http/App.js';
import { canConnectToDatabase } from './helpers/database.js';

const dbAvailable = await canConnectToDatabase();

const email = `vitest-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;
const password = 'secret-password-123';

let app: Express;
let agent: ReturnType<typeof request.agent>;

function extractCsrf(html: string): string {
  const match = /name="_csrf" value="([^"]+)"/.exec(html);
  if (!match?.[1]) throw new Error('CSRF token not found in the rendered form');
  return match[1];
}

beforeAll(async () => {
  app = await createApp();
  agent = request.agent(app);
});

afterAll(async () => {
  if (dbAvailable) {
    await getDb().deleteFrom('users').where('email', '=', email).execute();
  }
  await destroyDb();
});

describe('User web routes (no database required)', () => {
  it('renders the registration form with a CSRF token', async () => {
    const response = await request(app).get('/register');

    expect(response.status).toBe(200);
    expect(response.text).toContain('name="_csrf"');
    expect(response.text).toContain('Qeydiyyatdan keç');
  });

  it('rejects a form post without a CSRF token', async () => {
    const response = await request(app)
      .post('/register')
      .type('form')
      .send({ name: 'No Token', email: 'nope@example.com', password });

    expect(response.status).toBe(403);
  });

  it('redirects anonymous visitors away from the profile page', async () => {
    const response = await request(app).get('/profile');

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/login?next=%2Fprofile');
  });
});

describe('User API validation (no database required)', () => {
  it('rejects a malformed registration payload', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'not-an-email', name: 'x', password: 'short' });

    expect(response.status).toBe(422);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('requires authentication for the current user endpoint', async () => {
    const response = await request(app).get('/api/v1/auth/me');

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });
});

describe.runIf(dbAvailable)('User API (requires PostgreSQL)', () => {
  it('registers a new account and starts a session', async () => {
    const register = await agent
      .post('/api/v1/auth/register')
      .send({ name: 'Vitest User', email, password });

    expect(register.status).toBe(201);
    expect(register.body.data.user.email).toBe(email);
    expect(register.body.data.user).not.toHaveProperty('passwordHash');

    const me = await agent.get('/api/v1/auth/me');
    expect(me.status).toBe(200);
    expect(me.body.data.user.name).toBe('Vitest User');
  });

  it('refuses a duplicate email address', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Duplicate', email, password });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe('CONFLICT');
  });

  it('rejects a wrong password', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password: 'definitely-wrong' });

    expect(response.status).toBe(401);
  });

  it('signs an existing account in', async () => {
    const fresh = request.agent(app);
    const response = await fresh.post('/api/v1/auth/login').send({ email, password });

    expect(response.status).toBe(200);
    expect(response.body.data.user.email).toBe(email);

    const me = await fresh.get('/api/v1/auth/me');
    expect(me.status).toBe(200);
  });

  it('supports the full web flow with CSRF tokens', async () => {
    const webAgent = request.agent(app);

    const form = await webAgent.get('/login');
    const token = extractCsrf(form.text);

    const login = await webAgent
      .post('/login')
      .type('form')
      .send({ _csrf: token, email, password });

    expect(login.status).toBe(302);
    expect(login.headers.location).toBe('/profile');

    const profile = await webAgent.get('/profile');
    expect(profile.status).toBe(200);
    expect(profile.text).toContain('Vitest User');
  });
});
