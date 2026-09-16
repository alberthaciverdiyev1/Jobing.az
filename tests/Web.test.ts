import type { Express } from 'express';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/Core/Http/App.js';

let app: Express;

beforeAll(async () => {
  app = await createApp();
});

describe('GET /', () => {
  it('renders the home page in the default locale', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/html/);
    expect(response.text).toContain('Karyeranızda növbəti addımı atın');
    expect(response.text).toContain('<html lang="az">');
  });

  it('renders in the locale provided by the lang cookie', async () => {
    const response = await request(app).get('/').set('Cookie', 'lang=en');

    expect(response.text).toContain('Take the next step in your career');
    expect(response.text).toContain('<html lang="en">');
  });
});

describe('GET /lang/:locale', () => {
  it('stores the chosen locale in a cookie and redirects back', async () => {
    const response = await request(app).get('/lang/tr');

    expect(response.status).toBe(302);
    expect(response.headers['set-cookie']?.[0]).toContain('lang=tr');
  });

  it('rejects unsupported locales', async () => {
    const response = await request(app).get('/lang/de');

    expect(response.status).toBe(404);
  });
});

describe('error handling', () => {
  it('renders an HTML error page for page routes', async () => {
    const response = await request(app).get('/definitely-not-a-route');

    expect(response.status).toBe(404);
    expect(response.headers['content-type']).toMatch(/text\/html/);
    expect(response.text).toContain('Səhifə tapılmadı');
  });

  it('returns a JSON envelope for API routes', async () => {
    const response = await request(app).get('/api/v1/definitely-not-a-route');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });
});
