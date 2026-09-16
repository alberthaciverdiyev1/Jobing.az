# Jobing — Claude Code Project Guide

## Overview

**Jobing** is a multilingual (Azerbaijani, Turkish, English, Russian) job-board platform.

This repository is being rebuilt with **Express.js + TypeScript**. The previous
Laravel implementation is preserved read-only under `old/` for reference — **do not
build on it, do not copy from it, and treat it as non-authoritative.**

## Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js >= 22 |
| Language | TypeScript (strict, ESM, `NodeNext`) |
| Framework | Express 5 |
| Dev runner | `tsx watch` |
| Build | `tsc` → `dist/` |
| Tests | Vitest + Supertest |
| Lint/Format | ESLint 9 (flat config) + Prettier |
| Logging | Pino + pino-http |
| Validation | Zod |
| Templating | **UNDECIDED (HBS vs EJS)** |

## Layout

```
src/
├── config/         env (Zod-validated) + paths — the only place process.env is read
├── core/
│   ├── database/   data-layer seam (driver TBD)
│   ├── http/       app factory, server, error handler, error classes
│   └── logger.ts   Pino instance
├── middlewares/    request-id, validate, not-found
├── modules/        feature modules (one folder per domain)
│   └── health/
├── routes/         root router — mounts every module router
├── types/          global type augmentation
└── index.ts        entrypoint

views/  locales/  public/   # runtime assets, NOT compiled by tsc
tests/                     # Vitest, mirrors src/
old/                       # previous Laravel app (reference only)
```

## Conventions

- **ESM only.** Relative imports must carry the `.js` extension (`./foo.js`), even in `.ts` files.
- Type-only imports must use `import type` (`verbatimModuleSyntax` is on).
- `process.env` is read **only** in `src/config/env.ts`. Add new variables to both
  the Zod schema there and to `.env.example`.
- Errors: throw subclasses of `AppError` (`NotFoundError`, `ValidationError`, …).
  Anything else becomes an opaque 500 in production.
- Every request gets `req.requestId`, echoed as `X-Request-Id`.
- Feature code lives in `src/modules/<domain>/` (`*.routes.ts`, `*.controller.ts`,
  `*.service.ts`, `*.schema.ts`), never loose in `src/`.

## Response envelope

Success: `{ "success": true, "data": ... }`
Error:   `{ "success": false, "error": { "code", "message", "details?" } }`

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
- Node/npm blocks install scripts by default. `esbuild` is approved via
  `npm install-scripts approve esbuild` — needed for tsx/vitest.
- Commit messages go in English.
