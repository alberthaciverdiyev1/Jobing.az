import 'dotenv/config';
import { z } from 'zod';

/**
 * Environment schema.
 * Every variable the app depends on is validated here at boot.
 * Add new variables here (and to .env.example) — never read process.env directly.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // --- App ---
  APP_NAME: z.string().min(1).default('Jobing'),
  APP_URL: z.string().min(1).default('http://localhost:3000'),
  APP_SUFFIX: z.string().default(''),
  PORT: z.coerce.number().int().positive().default(3000),

  // --- Locales (comma separated) ---
  DEFAULT_LOCALE: z.string().min(2).default('az'),
  AVAILABLE_LOCALES: z
    .string()
    .default('az,en,ru,tr')
    .transform((value) =>
      value
        .split(',')
        .map((locale) => locale.trim())
        .filter((locale) => locale.length > 0),
    ),

  // --- Database (PostgreSQL) ---
  /** Full connection string. When set it wins over the discrete DB_* parts. */
  DB_URL: z.string().default(''),
  DB_HOST: z.string().default('127.0.0.1'),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_NAME: z.string().default('jobing'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default(''),
  DB_SSL: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  DB_POOL_MIN: z.coerce.number().int().min(0).default(1),
  DB_POOL_MAX: z.coerce.number().int().min(1).default(10),

  // --- Session / Cookies ---
  SESSION_SECRET: z.string().min(1).default('dev-session-secret'),
  SESSION_LIFETIME: z.coerce.number().int().positive().default(120),
  COOKIE_SECRET: z.string().min(1).default('dev-cookie-secret'),
  COOKIE_DOMAIN: z.string().default(''),

  // --- CORS (comma separated; falls back to APP_URL when empty) ---
  CORS_ORIGINS: z
    .string()
    .default('')
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter((origin) => origin.length > 0),
    ),

  // --- Logging ---
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info'),
  LOG_PRETTY: z
    .enum(['true', 'false'])
    .default('true')
    .transform((value) => value === 'true'),

  // --- Integrations ---
  TELEGRAM_BOT_TOKEN: z.string().default(''),
  TELEGRAM_CHAT_ID: z.string().default(''),
  MAIL_HOST: z.string().default(''),
  MAIL_PORT: z.coerce.number().int().positive().default(2525),
  MAIL_USER: z.string().default(''),
  MAIL_PASS: z.string().default(''),
  MAIL_FROM: z.string().default('hello@example.com'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('\n❌ Invalid environment variables:\n');
  for (const issue of parsed.error.issues) {
    console.error(`  • ${issue.path.join('.') || '(root)'}: ${issue.message}`);
  }
  console.error('\nCheck your .env file against .env.example.\n');
  process.exit(1);
}

export const env = Object.freeze(parsed.data);

export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';

export type Env = typeof env;
