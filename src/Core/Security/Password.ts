import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

/**
 * Password hashing on top of Node's built-in scrypt — no native dependency.
 * Stored format: `scrypt$<salt-hex>$<hash-hex>`.
 */
const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: string,
  keyLength: number,
) => Promise<Buffer>;

const KEY_LENGTH = 64;
const SALT_BYTES = 16;
const SCHEME = 'scrypt';

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES).toString('hex');
  const derived = await scrypt(password, salt, KEY_LENGTH);
  return `${SCHEME}$${salt}$${derived.toString('hex')}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, salt, hash] = stored.split('$');
  if (scheme !== SCHEME || !salt || !hash) return false;

  const expected = Buffer.from(hash, 'hex');
  if (expected.length !== KEY_LENGTH) return false;

  const derived = await scrypt(password, salt, KEY_LENGTH);
  return timingSafeEqual(expected, derived);
}
