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
| ORM | **Drizzle ORM** (TypeScript schema, SQL-shaped queries) |
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
  Only `index.ts` and `*.test.ts` are exempt.
- **Functions, variables, object keys: `camelCase`** — `createApp()`, `registerViewEngine()`.
- **Types, interfaces, classes, enums: `PascalCase`** — `AppError`, `LocaleInfo`, `ApiSuccess`.
- **API response fields: `camelCase`** — `uptimeSeconds`, `statusCode`, `totalPages`.
- **Database columns: `snake_case`** — map them in `Core/Database/Types.ts`.

## Layout

```
src/
├── Config/             Env.ts (Zod-validated), Paths.ts, Locales.ts
├── Console/            CLI entrypoints (Sync.ts)
├── Core/Provider/      ModuleDiscovery.ts, ModuleProvider.ts — auto-registration
├── Core/
│   ├── Database/       Client.ts (Drizzle), AppDbContext.ts, Configurations/
│   ├── Http/           App.ts, Server.ts, ErrorHandler.ts, Errors.ts, Responses.ts
│   ├── Localization/   I18n.ts
│   ├── View/           Engine.ts, Helpers.ts
│   └── Logger.ts
├── Middlewares/        RequestId, Validate, ViewLocals, NotFound
├── Modules/            one folder per domain (see below)
├── Routes/             index.ts (root), Web.ts (page aggregator), Api.ts (API aggregator)
├── Types/              global type augmentation
└── index.ts            entrypoint

views/                  LAYOUT + shared partials + error pages only
├── Layouts/Main.hbs
├── Partials/           Head, Navbar, Footer, Flash, LanguageSwitcher
└── Pages/Errors/       NotFound, ServerError

locales/<lng>/translation.json
public/  tools/  tests/  old/
```

## Module anatomy

Each domain module is self-contained:

```
Modules/<Name>/
├── Controllers/
│   ├── <Name>WebController.ts    renders Handlebars, form posts, redirects
│   └── <Name>ApiController.ts    JSON in / JSON out
├── Entities/                     the entity, typed from its configuration
├── Interfaces/                   repository contracts (ports)
├── Repositories/                 Drizzle implementations + singleton instance
├── Services/                     business rules; depends on the interface only
├── Transformers/                 entity → client-safe resource
├── Requests/                     one request schema per endpoint
├── Middlewares/                  module-specific middleware (auth guards)
├── Configurations/               entity → table mapping (EF-style)
├── Routes/
│   ├── Web.ts                    exports `basePath` + `router`
│   └── Api.ts                    exports `basePath` + `router`
└── Views/                        the module's own .hbs templates
```

Layers are optional — a module with no tables skips Entities/Repositories/Migrations,
one with no pages skips `Routes/Web.ts` + `Views/`.

**Web and API always get separate controllers**, even when the logic looks similar.

### Dependency direction

```
Routes → Controller → Service → RepositoryInterface ← Repository → Drizzle
                          ↓
                     Transformer
```

Services never import Drizzle; they depend on the interface, which keeps them testable
with a fake repository.

### Entities

**The entity is derived from its configuration — never hand-written twice.**

```ts
// Entities/User.ts
export type User = UserRow;      // typeof users.$inferSelect
export type NewUser = NewUserRow; // typeof users.$inferInsert
```

Because the row type comes from the Drizzle table, the entity cannot drift from the
schema and no row mapper is needed: repositories return database rows directly.
`Entities/` may depend on `Configurations/` — that is the one accepted direction.

### Requests

**Every endpoint gets its own request schema**, like a Laravel Form Request:

```
Requests/
├── Fields.ts               reusable field rules (email, password, …)
├── RegisterRequest.ts      export const registerRequest = z.object({ … })
├── LoginRequest.ts
├── ChangePasswordRequest.ts
└── index.ts                barrel
```

```ts
// Requests/RegisterRequest.ts
export const registerRequest = z.object({
  email: emailField,
  name: nameField,
  password: passwordField,
});
export type RegisterRequest = z.infer<typeof registerRequest>;
```

- One file per request — never a single `Validators.ts` holding everything.
- Shared field rules live in `Fields.ts` so `email` means the same thing everywhere.
- The web controller calls `safeParse` itself and re-renders the form with
  `fieldErrors(error)`; the API mounts `validate({ body: registerRequest })` and gets
  a 422 envelope for free.
- Derive the input type with `z.infer` — do not declare a second interface.

### Transformers

Entities are internal. Anything leaving the server goes through a transformer:

```ts
// Transformers/UserTransformer.ts
export function transformUser(user: User): UserResource {
  return { ...user, createdAt: user.createdAt.toISOString() };
}
```

- The password hash and any other internal column must be dropped here.
- Timestamps become ISO strings so the JSON API and templates agree.
- `req.user` holds the **entity**; `res.locals.currentUser` holds the **resource**.
  Never put an entity into `res.locals` — templates would see every column.
- Add `transform<Entity>` and `transform<Entities>` (collection) per module.

## Module routes

**Routes are never listed by hand.** `Core/Provider` walks `Modules/` at boot and
mounts every `Routes/Web.*` / `Routes/Api.*` it finds. Adding a module means adding
a folder — nothing else to edit. Discovery logs what it registered:

```
Registered 3 web route module(s) -> ['Home/', 'Localization/', 'User/']
Registered 2 api route module(s) -> ['Health/health', 'User/auth']
```

A route file exports exactly two things (`basePath`, `router`) and optionally
`order` to control registration order:

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

## Database (Drizzle ORM + PostgreSQL)

**The schema is declared in TypeScript, never written by hand.** Each entity owns a
configuration file — the same idea as an EF Core entity configuration feeding
`AppDbContext`:

```ts
// Modules/User/Configurations/UserConfiguration.ts
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  isAdmin: boolean('is_admin').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;
```

### Where configurations live

| Location | Purpose |
|---|---|
| `Core/Database/Configurations/*.ts` | infrastructure tables (sessions, …) |
| `Modules/<Name>/Configurations/*.ts` | domain tables |

`drizzle.config.ts` collects both with globs, and `Core/Database/AppDbContext.ts`
does the same at runtime — **adding a module never requires editing either file.**

### Migrations

```bash
npm run db:generate   # diff the configurations, write drizzle/NNNN_*.sql
npm run db:migrate    # apply pending migrations
npm run db:push       # push the schema straight to the database (dev)
npm run db:studio     # browse the data
```

Generated SQL is committed under `drizzle/` and reviewed like any other change.

### Querying

- `const db = getDb()` from `Core/Database/index.js`.
- Prefer the query builder; `sql` tags are fine when you need raw SQL.
- Column names are snake_case in PostgreSQL, camelCase in TypeScript — Drizzle maps
  them, so `users.isAdmin` is the `is_admin` column.
- Repositories import their own module's table; no global schema import needed.

## Views & i18n

- Module templates: `res.render(moduleView('User', 'Login'), { ... })`. `moduleView()`
  resolves to `Modules/<Name>/Views` in both `src` and `dist` — templates are copied by
  `tools/CopyModuleViews.mjs` during `npm run build`.
- Global templates (layout, partials, error pages) stay in `views/` and render by
  relative path, e.g. `'Pages/Errors/NotFound'`.
- Every template receives: `t`, `locale`, `locales`, `appName`, `appSuffix`, `appUrl`,
  `currentUrl`, `year`, `isProduction` (set in `Middlewares/ViewLocals.ts`).
- Translate with `{{t "home.title"}}`. Add keys to **all four** files under `locales/`.
- Locale comes from the `lang` cookie, then `Accept-Language`, falling back to
  `DEFAULT_LOCALE`. `GET /lang/:locale` sets the cookie and redirects back.
- We own the language cookie — i18next's cookie cache is deliberately disabled.

## Auth, sessions and CSRF

- Sessions: `express-session` + `connect-pg-simple`, cookie `jobing.sid`
  (`httpOnly`, `sameSite: 'lax'`, `secure` in production). Table: `session`.
  Under `NODE_ENV=test` an in-memory store is used so the suite needs no database.
- `req.session.userId` is the only thing stored about the account.
  `Modules/User/Middlewares/CurrentUser.ts` resolves it into `req.user` +
  `currentUser` for templates; `RequireAuth.ts` guards protected routes.
- **CSRF is enforced on every web route** (`Middlewares/Csrf.ts`, applied in
  `Routes/Web.ts`). Forms must include `<input type="hidden" name="_csrf" value="{{csrfToken}}">`.
  The header `X-CSRF-Token` is accepted as an alternative. API routes rely on the
  `SameSite=Lax` cookie instead.
- Passwords are hashed with Node's built-in scrypt (`Core/Security/Password.ts`) —
  no native dependency. Format: `scrypt$<salt>$<hash>`.
- Login and registration regenerate the session id before storing `userId`.
- `addFlash(req, 'success' | 'error', message)` queues a one-shot message for the
  next rendered page (rendered by `views/Partials/Flash.hbs`).

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
npm run db:migrate # apply pending migrations
```

## Notes

- `.env` is gitignored; copy from `.env.example`.
- npm blocks install scripts by default. `esbuild` is approved via
  `npm install-scripts approve esbuild` (needed by tsx/vitest).
- Commit messages go in English.
