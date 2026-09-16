import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

/**
 * The equivalent of EF's `DbContext` on the tooling side: it gathers every
 * entity configuration in the repo and points drizzle-kit at them.
 *
 *   Core/Database/Configurations/*.ts   infrastructure tables
 *   Modules/<Name>/Configurations/*.ts  domain tables
 *
 * Adding a module means adding a folder — this file never changes.
 */
const credentials = process.env.DB_URL
  ? { url: process.env.DB_URL }
  : {
      host: process.env.DB_HOST ?? '127.0.0.1',
      port: Number(process.env.DB_PORT ?? 5432),
      user: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_NAME ?? 'jobing',
      ssl: process.env.DB_SSL === 'true',
    };

export default defineConfig({
  schema: ['./src/Core/Database/Configurations/*.ts', './src/Modules/*/Configurations/*.ts'],
  out: './drizzle',
  dialect: 'postgresql',
  strict: true,
  verbose: true,
  dbCredentials: credentials,
});
