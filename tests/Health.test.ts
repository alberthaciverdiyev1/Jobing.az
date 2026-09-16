import type { Express } from 'express';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/Core/Http/App.js';

let app: Express;

beforeAll(async () => {
  app = await createApp();
});

describe('GET /api/v1/health', () => {
  it('reports the service as healthy', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('ok');
    expect(response.body.data.database.driver).toBeDefined();
  });

  it('answers with JSON even when the client prefers HTML', async () => {
    const response = await request(app).get('/api/v1/health').set('Accept', 'text/html');

    expect(response.headers['content-type']).toMatch(/application\/json/);
  });
});
