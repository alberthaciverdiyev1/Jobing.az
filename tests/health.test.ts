import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/core/http/app.js';

describe('GET /health', () => {
  it('reports the service as healthy', async () => {
    const response = await request(createApp()).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('ok');
  });
});

describe('unknown routes', () => {
  it('returns a structured 404 envelope', async () => {
    const response = await request(createApp()).get('/definitely-not-a-route');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });
});
