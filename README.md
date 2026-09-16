# Jobing

Multilingual job-board platform, built with **Express.js + TypeScript**.

> The previous Laravel implementation lives in [`old/`](./old) for reference only.

## Requirements

- Node.js >= 22
- npm

## Getting started

```bash
npm install
cp .env.example .env
npm run dev          # http://localhost:3000
```

Health check: `GET /health`

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Dev server with hot reload (`tsx watch`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled server |
| `npm test` | Run Vitest test suite |
| `npm run typecheck` | Type-check without emitting |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Project structure

See [CLAUDE.md](./CLAUDE.md).

## Architecture

- **Modular**: every domain is a folder under `src/modules/`.
- **Validated config**: all environment access goes through `src/config/env.ts`.
- **Type-safe errors**: an `AppError` hierarchy maps to HTTP status codes.
- **Structured logging**: Pino, with per-request correlation ids.
