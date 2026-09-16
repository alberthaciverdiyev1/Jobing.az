# Jobing

Multilingual job-board platform built with **Express.js + TypeScript**.
Serves server-rendered pages and a JSON API from a single process, backed by
**PostgreSQL** through **Drizzle ORM**.

> The previous Laravel implementation lives in [`old/`](./old) for reference only.

## Requirements

- Node.js >= 22
- PostgreSQL

## Getting started

```bash
npm install
cp .env.example .env      # then fill in the DB_* values
npm run db:migrate
npm run dev
```

- Pages: <http://localhost:3000>
- API: <http://localhost:3000/api/v1/health>

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Dev server with hot reload (`tsx watch`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled server |
| `npm test` | Vitest test suite |
| `npm run typecheck` | Type-check without emitting |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run db:generate` | Generate migration SQL from the entity configurations |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:push` | Push the schema directly (development) |
| `npm run db:studio` | Browse the database |

## Routes

| Route | Kind | Description |
|---|---|---|
| `GET /` | page | Landing page |
| `GET /lang/:locale` | page | Switch language (sets cookie, redirects back) |
| `GET /register` · `POST /register` | page | Create an account |
| `GET /login` · `POST /login` | page | Sign in |
| `POST /logout` | page | Sign out |
| `GET /profile` | page | Current account (auth required) |
| `GET /api/v1/health` | API | Health check, includes database status |
| `POST /api/v1/auth/register` | API | Create an account |
| `POST /api/v1/auth/login` | API | Sign in |
| `POST /api/v1/auth/logout` | API | Sign out |
| `GET /api/v1/auth/me` | API | Current account (auth required) |

## Architecture

- **Web + API**: `/api/v1/*` is JSON-only; every other route renders Handlebars.
- **Modular and self-registering**: each domain is a folder under `src/Modules/`
  containing its own Entity, Repository, Interface, Service, Validators, Controllers
  (separate web and API), Routes, Configurations and Views. `Core/Provider`
  discovers them at boot — routes are never listed by hand.
- **Configuration-driven schema**: each entity declares its table in
  `Modules/<Name>/Configurations/<Name>Configuration.ts`; `AppDbContext` and
  `drizzle-kit` collect them automatically and generate migrations from the diff.
- **Typed data layer**: Drizzle ORM over PostgreSQL — column names are snake_case in
  the database and camelCase in TypeScript.
- **Validated config**: all environment access goes through `src/Config/Env.ts`.
- **Type-safe errors**: an `AppError` hierarchy maps to HTTP status codes.
- **Structured logging**: Pino with per-request correlation ids.
- **Sessions & CSRF**: PostgreSQL-backed sessions, scrypt password hashing, and
  CSRF-protected forms.
- **Four locales**: `az` (default), `tr`, `en`, `ru`.

See [CLAUDE.md](./CLAUDE.md) for the full guide and conventions.
