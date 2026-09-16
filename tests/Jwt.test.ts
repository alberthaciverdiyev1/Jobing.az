import { describe, expect, it } from 'vitest';
import { signAuthToken, verifyAuthToken } from '../src/Core/Auth/Jwt.js';

const userId = '2f1c9a44-4f4e-4a4d-9a1a-0f6a1d2c3b4e';

describe('auth tokens', () => {
  it('round-trips the account id', async () => {
    const { token } = await signAuthToken(userId);

    await expect(verifyAuthToken(token)).resolves.toBe(userId);
  });

  it('reports an expiry in the future', async () => {
    const { expiresAt } = await signAuthToken(userId);

    expect(expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it('rejects a tampered token', async () => {
    const { token } = await signAuthToken(userId);
    const [header, payload] = token.split('.');
    const forged = `${header}.${payload}.deadbeef`;

    await expect(verifyAuthToken(forged)).resolves.toBeNull();
  });

  it('rejects garbage', async () => {
    await expect(verifyAuthToken('not-a-jwt')).resolves.toBeNull();
    await expect(verifyAuthToken('')).resolves.toBeNull();
  });
});
