import { describe, expect, it } from 'vitest';
import { loginRequest, registerRequest } from '../src/Modules/User/Requests/index.js';

const validRegistration = {
  email: 'Ada@Example.com',
  name: 'Ada Lovelace',
  password: 'supersecret',
};

describe('RegisterRequest', () => {
  it('accepts a valid payload', () => {
    expect(registerRequest.safeParse(validRegistration).success).toBe(true);
  });

  it('normalises the email to lower case', () => {
    expect(registerRequest.parse(validRegistration).email).toBe('ada@example.com');
  });

  it('trims the name', () => {
    const parsed = registerRequest.parse({ ...validRegistration, name: '  Ada  ' });
    expect(parsed.name).toBe('Ada');
  });

  it('rejects an invalid email', () => {
    expect(registerRequest.safeParse({ ...validRegistration, email: 'nope' }).success).toBe(false);
  });

  it('rejects a short password', () => {
    expect(registerRequest.safeParse({ ...validRegistration, password: 'short' }).success).toBe(
      false,
    );
  });

  it('rejects a one-character name', () => {
    expect(registerRequest.safeParse({ ...validRegistration, name: 'A' }).success).toBe(false);
  });
});

describe('LoginRequest', () => {
  it('accepts an email and any non-empty password', () => {
    const parsed = loginRequest.parse({ email: 'ada@example.com', password: 'x' });
    expect(parsed.email).toBe('ada@example.com');
  });

  it('rejects an empty password', () => {
    expect(loginRequest.safeParse({ email: 'ada@example.com', password: '' }).success).toBe(false);
  });
});
