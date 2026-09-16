process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'silent';
process.env.LOG_PRETTY = 'false';
// Keep the suite hermetic: never depend on the developer's .env for this.
process.env.JWT_SECRET ??= 'vitest-secret-key-with-at-least-32-characters';
