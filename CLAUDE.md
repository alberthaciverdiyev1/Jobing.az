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
| Views | **Edge** (`edge.js`) |
| i18n | i18next + `i18next-http-middleware` + `i18next-fs-backend` |
| Dev runner | `tsx watch` |
| Build | `tsc` → `dist/` |
| Tests | Vitest + Supertest |
| Lint / Format | ESLint 9 (flat config) + Prettier |
| Auth | Stateless JWT (`jose`), no server-side sessions |
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
├── Core/
│   ├── Auth/           Jwt.ts, AuthCookie.ts, AuthTokenCookie.ts
│   ├── Database/       Client.ts (Drizzle), AppDbContext.ts, Configurations/
│   ├── Http/           App.ts, RootRouter.ts, Server.ts, ErrorHandler.ts,
│   │                   Responses.ts, RootRouter.ts, Envelope/, Errors/
│   ├── Localization/   I18n.ts
│   ├── Provider/       ModuleDiscovery.ts, ModuleProvider.ts — auto-registration
│   ├── View/           Edge.ts, RenderPage.ts, PageShell.ts, PageState.ts
│   └── Logger.ts
├── Middlewares/        RequestId, Validate, ViewLocals, NotFound, Csrf, Flash
├── Modules/            one folder per domain (see below)
├── Views/              every template, in one place
│   ├── Components/     Layout, Head, Navbar, Footer, Flash, LanguageSwitcher
│   ├── Errors/         NotFound, ServerError
│   ├── Home/           module pages, one folder per module
│   └── User/           Login, Register, Profile
└── index.ts            entrypoint

locales/<lng>/translation.json
public/  tools/  tests/  old/
```

There is **no top-level `src/Routes/`** — modules own their routes, and the root
router is part of the HTTP layer (`Core/Http/RootRouter.ts`).

## Module anatomy

Each domain module is self-contained:

```
Modules/<Name>/
├── Controllers/
│   ├── <Name>WebController.ts    renders Edge pages, form posts, redirects
│   └── <Name>ApiController.ts    JSON in / JSON out
├── Configurations/               entity → table mapping (EF-style)
├── Entities/                     User.ts, NewUser.ts — typed from the configuration
├── Interfaces/                   one contract per file (repository, service, DTOs)
├── Repositories/                 UserRepository.ts (class) + index.ts (instance)
├── Services/                     UserService.ts (class) + index.ts (instance)
├── Transformers/                 entity → client-safe resource
├── Requests/                     one request schema per endpoint
├── Middlewares/                  module-specific middleware (auth guards)
└── Routes/
    ├── Web.ts                    exports `basePath` + `router`
    └── Api.ts                    exports `basePath` + `router`
```

Example of the contract files:

```
Interfaces/
├── PaginatedResult.ts
├── RegisterInput.ts
├── UserRepositoryInterface.ts
└── UserServiceInterface.ts
```

Layers are optional — a module with no tables skips Configurations/Entities/Repositories,
one with no pages skips `Routes/Web.ts`.

**Web and API always get separate controllers**, even when the logic looks similar.

### Dependency direction

```
Routes → Controller → ServiceInterface ← Service → RepositoryInterface ← Repository → Drizzle
                            ↓
                       Transformer
```

Controllers depend on `UserServiceInterface`, the service depends on
`UserRepositoryInterface` — never on the concrete classes. Both layers are therefore
testable with a fake implementation.

### One declaration per file

- **One class per file.** Never two. `Core/Http/Errors/` is the reference: nine
  classes, nine files, plus an `index.ts` barrel.
- **One exported interface/type per file.** If a type is only used inside its own
  file, do not export it at all.
- A class file holds **only** the class. The shared instance lives in an `index.ts`
  next to it:

  ```ts
  // Repositories/index.ts
  import { UserRepository } from './UserRepository.js';
  export const userRepository = new UserRepository();
  ```

  Controllers import `userService` from `Services/index.js`, never the class.
- Helper functions that form one cohesive unit may share a file
  (`transformUser` + `transformUsers`).

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

A module with only pages has just `Routes/Web.ts`; API-only modules just `Routes/Api.ts`.

## Web / API split

| Branch | Mount | Behaviour |
|---|---|---|
| `Routes/Api.ts` | `/api/v1/*` | **Always** JSON, errors included. |
| `Routes/Web.ts` | `/` | Edge pages. |

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
| `Core/Database/Configurations/*.ts` | infrastructure tables |
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

## Views (Edge)

**Edge has no Express adapter**, so nothing is registered via `app.set('view engine')`.
Controllers render explicitly:

```ts
await renderPage(res, 'User/Login', { pageTitle: '…', errors: {}, values: {} });
```

`renderPage` (in `Core/View/Edge.ts`) merges `res.locals` with the given state and exposes
it twice: flattened at the top level — so slot content can use `t`, `currentUser`, … —
and as `shell`, so components and partials can still reach it after crossing a template
boundary.

### Template rules

- A page wraps itself in the layout component:

  ```edge
  @component('Components/Layout', { shell: shell })
    @slot('main')
      <h1>{{ t('home.title') }}</h1>
    @endslot
  @end
  ```

- Shared pieces use `@include`, which renders **in the parent's scope** and takes no
  state argument — so they read `shell.*`:

  ```edge
  @include('Components/Navbar')
  ```

- Every block tag (`@if` / `@else` / `@end`, `@each` / `@end`, `@component` / `@slot` /
  `@endslot`) must sit on its **own line**. Edge's lexer rejects them inline.
- `{{ }}` escapes, `{{{ }}}` is raw. The slot itself needs
  `{{{ await $slots.main() }}}`.
- Globals, callable in any template without a prefix: `asset`, `formatDate`, `truncate`,
  `uppercase`, `lowercase`, `json`.
- `t` is **not** a global — it is per-request state. Pages call `t('key')`, components
  and partials call `shell.t('key')`.
- `*.edge` is excluded from Prettier; it has no parser for it.

### i18n

- Locale resolves from the `lang` cookie, then `Accept-Language`, falling back to
  `DEFAULT_LOCALE`. `GET /lang/:locale` sets the cookie and redirects back.
- Add new keys to **all four** files under `locales/`.
- We own the language cookie — i18next's cookie cache is deliberately disabled.

## Auth: stateless JWT

**There is no server-side session.** The account id travels in a signed token.

| Where | How the token is carried |
|---|---|
| API clients | `Authorization: Bearer <token>` |
| Server-rendered pages | httpOnly cookie `jobing.token` (`SameSite=Lax`, `Secure` in prod) |

- `Core/Auth/Jwt.ts` — `signAuthToken()` / `verifyAuthToken()` (HS256, `JWT_SECRET`).
- `Core/Auth/AuthTokenCookie.ts` — `issueAuthToken(res, userId)` signs, sets the cookie
  and returns the token; `clearAuthToken(res)` removes it.
- `Modules/User/Middlewares/CurrentUser.ts` reads the Bearer header first, then the
  cookie, and resolves `req.user` (entity) + `currentUser` (resource). Invalid or
  stale tokens are discarded and the cookie cleared.
- `RequireAuth.ts` guards pages (redirect to `/login?next=…`) and API routes (401).
- `POST /api/v1/auth/login` returns `{ user, token, expiresAt }`; the same request also
  sets the cookie, so one endpoint serves both audiences.

### Things that used to live in the session

| Concern | Replacement |
|---|---|
| `req.session.userId` | the token's `sub` claim |
| CSRF token | **double-submit cookie** — `jobing.csrf` (httpOnly) must be echoed in the `_csrf` field or `X-CSRF-Token` header. Another origin can force a request but cannot read the cookie. |
| Flash messages | short-lived `jobing.flash` cookie holding a JSON array, read once and cleared |

### Deliberately absent

- **No refresh tokens.** Access tokens live `JWT_TTL` (default `7d`). Add refresh tokens
  (and a `refresh_tokens` table for revocation) if you need short-lived access plus
  long-lived sessions.
- **No server-side revocation.** Logout clears the cookie, but an already-issued token
  stays valid until it expires. Keep `JWT_TTL` modest if that matters.

## Type augmentation

Extensions to third-party types live **in the file that owns the field** — never in a
central `Types/` bucket:

```ts
// Middlewares/RequestId.ts
export const requestId: RequestHandler = (req, res, next) => {
  req.requestId = id;          // the value is written here…
  …
};

declare module 'express-serve-static-core' {
  interface Request {
    requestId: string;         // …and declared right next to it, so they cannot drift
  }
}
```

| Field | Declared in |
|---|---|
| `Request.requestId` | `Middlewares/RequestId.ts` |
| `Request.validated` | `Middlewares/Validate.ts` |
| `Request.user` | `Modules/User/Middlewares/CurrentUser.ts` |

Two rules that cost an afternoon if forgotten:

- Augment **`express-serve-static-core`** for `Request`, not the global `Express`
  namespace — and use a named type instead of `Express.Request['field']`, because the
  global namespace does not see module augmentations.
- A file with `declare module` / `declare global` must still be a module (have imports
  or exports), otherwise the declaration replaces the module instead of extending it.

There is deliberately **no `src/Types/`**: a shared bucket would have forced `Core` to
import from `Modules` (`Request.user` belongs to the User module).

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
