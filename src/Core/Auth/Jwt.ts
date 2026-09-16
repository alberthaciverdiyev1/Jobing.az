import { SignJWT, decodeJwt, jwtVerify } from 'jose';
import { env } from '../../Config/Env.js';

const ALGORITHM = 'HS256';
const secret = new TextEncoder().encode(env.JWT_SECRET);

export interface AuthToken {
  token: string;
  userId: string;
  expiresAt: Date;
}

/** Issues a signed access token for the given account. */
export async function signAuthToken(userId: string): Promise<AuthToken> {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: ALGORITHM })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(env.JWT_TTL)
    .sign(secret);

  return { token, userId, expiresAt: expiryOf(token) };
}

/** Reads the `exp` claim without verifying — only for cookie lifetime. */
export function expiryOf(token: string): Date {
  const { exp } = decodeJwt(token);
  return new Date((exp ?? 0) * 1000);
}

/** Returns the account id, or `null` when the token is invalid or expired. */
export async function verifyAuthToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: [ALGORITHM] });
    return typeof payload.sub === 'string' && payload.sub.length > 0 ? payload.sub : null;
  } catch {
    return null;
  }
}
