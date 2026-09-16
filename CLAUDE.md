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
  Only `index.ts` and `*.test.ts` are exempt.
- **Functions, variables, object keys: `camelCase`** — `createApp()`, `registerViewEngine()`.
- **Types, interfaces, classes, enums: `PascalCase`** — `AppError`, `LocaleInfo`, `ApiSuccess`.
- **API response fields: `camelCase`** — `uptimeSeconds`, `statusCode`, `totalPages`.

## Layout

```
src/
├── Config/             Env.ts (Zod-validated), Paths.ts, Locales.ts
├── Core/
│   ├── Database/       data-layer seam (driver TBD)
│   ├── Http/           App.ts, Server.ts, ErrorHandler.ts, Errors.ts, Responses.ts
│   ├── Localization/   I18n.ts
│   ├── View/           Engine.ts, Helpers.ts
│   └── Logger.ts
├── Middlewares/        RequestId, Validate, ViewLocals, NotFound
├── Modules/            one folder per domain
│   ├── Health/         HealthController.ts + HealthApiRoutes.ts
│   ├── Home/           HomeController.ts + HomeRoutes.ts
│   └── Localization/   LocalizationController.ts + LocalizationRoutes.ts
├── Routes/             index.ts (root), Web.ts (pages), Api.ts (JSON)
├── Types/              global type augmentation
└── index.ts            entrypoint

views/
├── Layouts/Main.hbs
├── Partials/           Head, Navbar, Footer, LanguageSwitcher
└── Pages/              Home, Errors/NotFound, Errors/ServerError

locales/<lng>/translation.json   public/   tests/   old/
```

## The Web / API split

Routing is two-branched, decided in `src/Routes/index.ts`:

| Branch | Mount | Purpose |
|---|---|---|
| `Api.ts` | `/api/v1/*` | JSON API. **Always** answers JSON, even on errors. |
| `Web.ts` | `/` | Server-rendered Handlebars pages. |

A module that needs both declares two route files: `<Name>Routes.ts` (web) and
`<Name>ApiRoutes.ts` (API), and registers each in `Web.ts` / `Api.ts`.

The error handler picks the response shape from the URL: `/api/*` → JSON; anything
else → HTML unless the client sends `Accept` that explicitly prefers JSON.

## Response envelope

```jsonc
// success
{ "success": true, "data": { } }

// failure
{ "success": false, "error": { "code": "NOT_FOUND", "message": "…", "details": { } } }
```

Use the helpers in `Core/Http/Responses.ts` (`ok`, `created`, `noContent`, `paginated`).

## Views & i18n

- `res.render('Pages/Home', { ... })` — paths are relative to `views/`, PascalCase.
- Every template receives: `t`, `locale`, `locales`, `appName`, `appSuffix`, `appUrl`,
  `currentUrl`, `year`, `isProduction` (set in `Middlewares/ViewLocals.ts`).
- Translate with `{{t "home.title"}}`. Add keys to **all four** files under `locales/`.
- Locale resolves from the `lang` cookie, then `Accept-Language`, falling back to
  `DEFAULT_LOCALE`. `GET /lang/:locale` sets the cookie and redirects back.

## Conventions

- **ESM only.** Relative imports carry the `.js` extension in `.ts` files.
- Type-only imports use `import type` (`verbatimModuleSyntax` is on).
- `process.env` is read **only** in `src/Config/Env.ts`. New variables go there *and* in `.env.example`.
- Errors: throw subclasses of `AppError` (`NotFoundError`, `ValidationError`, …).
  Anything else becomes an opaque 500 in production.
- Every request gets `req.requestId`, echoed as `X-Request-Id`.
- Validate input with the `validate()` middleware; results land on `req.validated`
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
```

## Notes

- `.env` is gitignored; copy from `.env.example`.
- npm blocks install scripts by default. `esbuild` is approved via
  `npm install-scripts approve esbuild` (needed by tsx/vitest).
- Commit messages go in English.
