# Jobing.az Codex Guide

## Project

- This is a Laravel 12 application with Blade, Alpine.js, Tailwind CSS, Vite, PostgreSQL, and Filament.
- Keep user-facing copy localized. Azerbaijani is the default locale; do not introduce untranslated English text into Azerbaijani pages.
- Preserve the modular structure under `app/Modules` and keep module routes in each module's `Routes` directory.

## Development

- Preserve unrelated working-tree changes and inspect the diff before editing files that are already modified.
- Use existing models, scopes, services, components, translations, and cached reference-data helpers before adding new abstractions.
- Keep filter query-string parameters compatible with browser history, pagination, direct links, and AJAX responses.
- When changing a filter, verify both the Blade/Alpine state and the corresponding backend query.
- Do not modify production data or merge potentially duplicate records without explicit approval.

## Verification

- Run `npm run build` after changing JavaScript, Blade classes, or frontend assets.
- Run `php artisan test` after backend changes. If a required local PHP extension or service is unavailable, report the exact blocker.
- For filter changes, test direct query-string navigation and an AJAX interaction in the browser.

## Git

- Write commit messages in English.
- Do not commit secrets, generated assets, dependency directories, logs, local databases, or personal Codex overrides.
- Push only after relevant verification has completed.

## Code Review Rules

- Flag filters whose frontend parameter names differ from backend request keys.
- Flag category counts that do not use the same scope as the result query.
- Flag locale-dependent dates rendered with non-translated formatters.
- Flag JSON-array filters implemented as unbounded substring searches.
