# Jobing

Multilingual job-board platform built with **Express.js + TypeScript**.
Serves server-rendered pages and a JSON API from a single process, backed by
**PostgreSQL** through **Kysely**.

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
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:rollback` | Revert the last migration |
| `npm run db:status` | Show migration status |

## Routes

| Route | Kind | Description |
|---|---|---|
| `GET /` | page | Landing page |
| `GET /lang/:locale` | page | Switch language (sets cookie, redirects back) |
| `GET /api/v1/health` | API | Health check, includes database status |

## Architecture

- **Web + API**: `/api/v1/*` is JSON-only; every other route renders Handlebars.
- **Modular**: each domain is a folder under `src/Modules/`, owning its own
  `Routes/Web.ts` and/or `Routes/Api.ts`.
- **SQL-first data layer**: Kysely query builder over PostgreSQL, with typed tables
  and file-based migrations.
- **Validated config**: all environment access goes through `src/Config/Env.ts`.
- **Type-safe errors**: an `AppError` hierarchy maps to HTTP status codes.
- **Structured logging**: Pino with per-request correlation ids.
- **Four locales**: `az` (default), `tr`, `en`, `ru`.

See [CLAUDE.md](./CLAUDE.md) for the full guide and conventions.
