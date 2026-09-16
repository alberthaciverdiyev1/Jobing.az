# Jobing — Claude Code Project Guide

## Overview

**Jobing** is a multilingual (Azerbaijani, Turkish, English, Russian) job-board platform.

> **One process, two audiences.** This app serves server-rendered pages *and* a JSON API.
> Keep that split in mind for every feature you add.

The previous Laravel implementation is preserved read-only under `old/` for reference —
**do not build on it, do not copy from it, and treat it as non-authoritative.**

## Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js >= 22 |
| Language | TypeScript (strict, ESM, `NodeNext`) |
| Framework | Express 5 |
| Database | PostgreSQL |
| Query layer | **Kysely** (typed SQL query builder — no ORM magic) |
| Driver | `pg` |
| Views | Handlebars (`express-handlebars`) |
| i18n | i18next + `i18next-http-middleware` + `i18next-fs-backend` |
| Dev runner | `tsx watch` |
| Build | `tsc` → `dist/` |
| Tests | Vitest + Supertest |
| Lint / Format | ESLint 9 (flat config) + Prettier |
| Logging | Pino + pino-http |
| Validation | Zod |

## Naming conventions

- **Files and folders: `PascalCase`** — `Core/Http/ErrorHandler.ts`, `Modules/Home/HomeController.ts`.
  Only `index.ts`, `*.test.ts` and timestamped migrations are exempt.
- **Functions, variables, object keys: `camelCase`** — `createApp()`, `registerViewEngine()`.
- **Types, interfaces, classes, enums: `PascalCase`** — `AppError`, `LocaleInfo`, `ApiSuccess`.
- **API response fields: `camelCase`** — `uptimeSeconds`, `statusCode`, `totalPages`.
- **Database columns: `snake_case`** — map them in `Core/Database/Types.ts`.

## Layout

```
src/
├── Config/             Env.ts (Zod-validated), Paths.ts, Locales.ts
├── Console/            CLI entrypoints (Migrate.ts)
├── Core/
│   ├── Database/       Client.ts, Types.ts, Migrator.ts, Migrations/
│   ├── Http/           App.ts, Server.ts, ErrorHandler.ts, Errors.ts, Responses.ts
│   ├── Localization/   I18n.ts
│   ├── View/           Engine.ts, Helpers.ts
│   └── Logger.ts
├── Middlewares/        RequestId, Validate, ViewLocals, NotFound
├── Modules/            one folder per domain
│   └── <Name>/
│       ├── Routes/     Web.ts and/or Api.ts  (always)
│       ├── <Name>Controller.ts
│       └── <Name>Service.ts
├── Routes/             index.ts (root), Web.ts (page aggregator), Api.ts (API aggregator)
├── Types/              global type augmentation
└── index.ts            entrypoint

views/  Layouts/ Partials/ Pages/
locales/<lng>/translation.json
public/  tests/  old/
```

## Module routes

**Every module owns its routes in `Modules/<Name>/Routes/`.** A route file exports
exactly two things:

```ts
// Modules/Vacancy/Routes/Api.ts
export const basePath = '/vacancies';
export const router = Router();
router.get('/', vacancyController.index);
```

Then register it in the matching aggregator:

- `Routes/Web.ts` → page routes (Handlebars)
- `Routes/Api.ts` → JSON routes

```ts
import * as vacancy from '../Modules/Vacancy/Routes/Api.js';
apiRouter.use(vacancy.basePath, vacancy.router);
```

A module with only pages has just `Routes/Web.ts`; API-only modules just `Routes/Api.ts`.

## Web / API split

| Branch | Mount | Behaviour |
|---|---|---|
| `Routes/Api.ts` | `/api/v1/*` | **Always** JSON, errors included. |
| `Routes/Web.ts` | `/` | Handlebars pages. |

The error handler picks the shape from the URL: `/api/*` → JSON; otherwise HTML unless
the client's `Accept` explicitly prefers JSON.

## Response envelope

```jsonc
{ "success": true, "data": { } }
{ "success": false, "error": { "code": "NOT_FOUND", "message": "…", "details": { } } }
```

Use `Core/Http/Responses.ts` — `ok`, `created`, `noContent`, `paginated`.

## Database (Kysely + PostgreSQL)

- Import the query builder with `const db = getDb()` from `Core/Database/index.js`.
- Never build raw SQL by string concatenation; use the Kysely builder or `sql` tags.
- Table types live in `Core/Database/Types.ts` and **must** stay in sync with migrations.
- Migrations live in `Core/Database/Migrations/` as
  `<timestamp>_<PascalCaseName>.ts`, each exporting `up(db)` and `down(db)`.

```bash
npm run db:migrate    # apply pending migrations
npm run db:rollback   # revert the last batch
npm run db:status     # list migrations and whether they ran
```

The connection is created lazily on first use (`getDb()`), so tests can run without a
database. `connectDatabase()` at boot only warns outside production.

## Views & i18n

- `res.render('Pages/Home', { ... })` — paths are relative to `views/`, PascalCase.
- Every template receives: `t`, `locale`, `locales`, `appName`, `appSuffix`, `appUrl`,
  `currentUrl`, `year`, `isProduction` (set in `Middlewares/ViewLocals.ts`).
- Translate with `{{t "home.title"}}`. Add keys to **all four** files under `locales/`.
- Locale comes from the `lang` cookie, then `Accept-Language`, falling back to
  `DEFAULT_LOCALE`. `GET /lang/:locale` sets the cookie and redirects back.
- We own the language cookie — i18next's cookie cache is deliberately disabled.

## General conventions

- **ESM only.** Relative imports carry the `.js` extension in `.ts` files.
- Type-only imports use `import type` (`verbatimModuleSyntax` is on).
- `process.env` is read **only** in `src/Config/Env.ts`. New variables go there *and* in `.env.example`.
- Errors: throw subclasses of `AppError`. Anything else becomes an opaque 500 in production.
- Every request gets `req.requestId`, echoed as `X-Request-Id`.
- Validate input with `validate()`; results land on `req.validated`
  (never mutate Express 5's getter-only `req.query`).

## Commands

```bash
npm run dev        # tsx watch
npm run build      # tsc -> dist/
npm start          # run built output
npm test           # vitest
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run format     # prettier
npm run db:migrate # apply migrations
```

## Notes

- `.env` is gitignored; copy from `.env.example`.
- npm blocks install scripts by default. `esbuild` is approved via
  `npm install-scripts approve esbuild` (needed by tsx/vitest).
- Commit messages go in English.
