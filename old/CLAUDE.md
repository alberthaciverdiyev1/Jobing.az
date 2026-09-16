# Jobing — Claude Code Project Guide

## Overview

**Jobing** is a multilingual (Azerbaijani, Turkish, English, Russian) job-board platform built on **Laravel 12** with **Filament 3** admin panel. It uses a **modular architecture** where each domain lives under `app/Modules/{ModuleName}/`.

**Stack:** PHP 8.2, Laravel 12, Filament 3, SQLite (dev) / PostgreSQL (prod), Tailwind CSS 4, Alpine.js, Vite.

---

## Modular Architecture

Each module follows a consistent structure. **Always place domain code inside its module — not in the global `app/` folder.**

```
app/Modules/
├── ActivityLog/     → Request/action audit trail (model, middleware, Filament resource)
├── Application/     → Job applications (models, Filament resource)
├── Blog/            → Career blog (translatable posts, controller, Filament resource, public pages)
├── Category/        → Categories & hierarchical subcategories (model, service, Filament)
├── Company/         → Companies (controller, model, service, Filament)
├── ContactReveal/   → Lead tracking: masked contact reveal (model, controller, Filament resource)
├── Core/            → Shared helpers + traits (HasSlug, generate_unique_slug()) + TelegramService
├── Faq/             → Frequently Asked Questions — model, controller, Filament resource, public page
├── Favorite/        → Saved jobs (Kaydedilen İlanlar) — model, controller, public page
├── Home/            → Landing page (controller, service, Filament widget)
├── Inquiry/         → Contact/lead submissions — model, controller, request, Filament resource, public page
├── JobAttribute/    → JobType, WorkplaceType, ExperienceLevel (models, Filament resources)
├── JobSeeker/       → "İş Arıyorum" candidate ads — model, enums, controller, request, Filament resource, public pages
├── Localization/    → Language switching, SetLocale middleware, HasTranslations trait
├── Seo/             → Per-page SEO (PageSeo model, Filament resource) injected into layouts head
├── Setting/         → Site-wide settings singleton (SiteSetting::current()) + Filament manage page
└── Vacancy/         → Job vacancies (controller, model, service, requests, Filament)
```

| Module | Models | Controllers | Services |
|---|---|---|---|
| ActivityLog | `ActivityLog` | — | — |
| Application | `Application` | — | — |
| Blog | `Blog` | `BlogController` | — |
| Category | `Category` | — | `CategoryService` |
| Company | `Company` | `CompanyController` | `CompanyService` |
| ContactReveal | `ContactReveal` | `ContactRevealController` | — |
| Faq | `Faq` | `FaqController` | — |
| Favorite | `Favorite` | `FavoriteController` | — |
| Inquiry | `Inquiry` | `InquiryController` | — |
| JobSeeker | `JobSeeker` | `JobSeekerController` | — |
| Seo | `PageSeo` | — | — (per-page SEO, cached) |
| Setting | `SiteSetting` | — | — (singleton, cache + memoized) |
| Home | — | `HomeController` | `HomeService` |
| JobAttribute | `JobType`, `WorkplaceType`, `ExperienceLevel` | — | — |
| Vacancy | `Vacancy` | `VacancyController` | `VacancyService` |
| Localization | — | `LanguageController` | `LanguageService` |
| Core | — | — | `TelegramService` (env: TELEGRAM_BOT_TOKEN/CHAT_ID) |

---

## Key Conventions

### Multilingual (JSON columns)
- Translatable columns are stored as **JSON** objects keyed by locale: `{"az": "...", "tr": "...", "en": "...", "ru": "..."}`.
- Models use the `HasTranslations` trait and declare a `$translatable` array.
- Accessing a translatable attribute returns the value **in the current locale** with fallback to `app.fallback_locale` (`az`).
- New locales must be registered in `config/app.php` → `available_locales` AND in the `lang/{az,tr,en,ru}.json` files.

### Slugs
- Models use the `HasSlug` trait (auto-generates unique slugs on `saving`).
- Configure via `$slugColumn` and `$slugSource` properties; defaults to `slug` column sourced from `title`/`name`.
- Global helper `generate_unique_slug($model, $title, $column, $ignoreId)` also exists in `app/Modules/Core/Helpers/helpers.php` (auto-loaded via composer `files`).

### Localization / Routes
- Locale is stored in session and set by `SetLocale` middleware (appended to `web` group in `bootstrap/app.php`).
- Route to switch: `GET /lang/{locale}` → `route('lang.switch', $locale)`.
- Supported locales: `az`, `tr`, `en`, `ru`. Default/fallback: `az`.

### Database
- **SQLite** at `database/database.sqlite` for dev; **PostgreSQL** for prod (`DB_CONNECTION` in `.env`).
- New tables: `companies`, `categories` (self-referencing `parent_id` for subcategories), `vacancies`, `applications`, `job_types`, `workplace_types`, `experience_levels`.

---

## Modular Routing

Routes are **auto-loaded per module** by `App\Providers\ModuleServiceProvider` (registered in `bootstrap/providers.php`). Each module that has a `Routes/web.php` gets its routes registered under the `web` middleware group. The root `routes/web.php` is intentionally empty (just a note). Jobing uses session-based locale switching, so there is **no `{locale}` URL prefix** (unlike Metraj).

Route files: `app/Modules/{Module}/Routes/web.php` for `Home`, `Localization`, `Auth`, `Vacancy`, `Company`, `Favorite`, `Faq`, `Inquiry`, `JobSeeker`, `ContactReveal`, `Blog`.

## Public Routes

| Route | Name | Description |
|---|---|---|
| `GET /` | `home` | Landing page |
| `GET /lang/{locale}` | `lang.switch` | Switch language |
| `GET /jobs` | `jobs.index` | List vacancies |
| `GET /jobs/create` | `jobs.create` | Post-a-job form |
| `POST /jobs` | `jobs.store` | Store vacancy |
| `GET /jobs/{slug}` | `jobs.show` | Vacancy detail |
| `POST /jobs/{slug}/apply` | `jobs.apply` | Submit application |
| `GET /isler/{category}` | `jobs.seo.category` | SEO category listing (pretty URL → index filters) |
| `GET /isler/{category}/{city}` | `jobs.seo.category-city` | SEO category + city listing |
| `GET /companies` | `companies.index` | List companies |
| `GET /companies/{slug}` | `companies.show` | Company detail |
| `GET /saved-jobs` | `favorites.index` | Saved jobs page (guest/session scoped) |
| `POST /api/favorites/toggle` | `favorites.toggle` | Toggle a saved job (AJAX, CSRF) |
| `GET /api/favorites/ids` | `favorites.ids` | Get saved job ids for current identity |
| `POST /api/favorites/clear` | `favorites.clear` | Clear all saved jobs |
| `GET /faq` | `faq.index` | FAQ page (grouped by category) |
| `GET /sikca-sorulan-sorular` | `faq.index` | FAQ alias |
| `GET /contact` | `contact.index` | Contact page (public form) |
| `POST /contact` | `contact.store` | Submit contact/lead (AJAX or normal) |
| `GET /iş-ariyorum` | `job-seekers.index` | Job-seeker ads list (also `/is-ariyorum`) |
| `GET /iş-ariyorum/elan-ver` | `job-seekers.create` | Post a job-seeking ad |
| `POST /iş-ariyorum/elan-ver` | `job-seekers.store` | Store job-seeker ad |
| `GET /iş-ariyorum/{slug}` | `job-seekers.show` | Job-seeker ad detail |
| `POST /api/reveal/job-seeker/{id}` | `contact-reveal.job-seeker` | Reveal job-seeker contact + log lead (throttled) |
| `POST /api/reveal/vacancy/{id}` | `contact-reveal.vacancy` | Reveal vacancy contact + log lead (throttled) |
| `GET /blog` | `blog.index` | Career blog list (category filter) |
| `GET /blog/{slug}` | `blog.show` | Blog post detail |

---

## Filament Admin

- Admin panel resources live under each module: `app/Modules/{Module}/Filament/Resources/`.
- Panel provider is auto-discovered via Filament (`filament:upgrade` runs on composer dump).
- Resources: `ApplicationResource`, `CategoryResource` (+ Subcategories relation manager), `CompanyResource`, `VacancyResource`, `JobTypeResource`, `WorkplaceTypeResource`, `ExperienceLevelResource`, and `StatsOverview` widget.
- Admin user seeded: `admin@jobing.com` / `password` (see `DatabaseSeeder`).

---

## Common Commands

```bash
# Setup
composer setup                          # install + .env + key + migrate + npm + build
composer dev                            # run server, queue, pail logs, vite concurrently

# Development
composer run dev                        # same as composer dev
npm run dev                             # Vite dev server only
npm run build                           # production asset build
php artisan serve                       # Laravel server only

# Database
php artisan migrate                     # run migrations
php artisan db:seed                     # seed categories/companies/vacancies
php artisan migrate:fresh --seed        # reset + seed

# Tests & Quality
composer test                           # run PHPUnit (clears config first)
./vendor/bin/pint                       # code style fixer (Laravel Pint)
```

---

## Testing

- PHPUnit (default Laravel). Tests in `tests/Unit` and `tests/Feature`.
- Run via `composer test` or `php artisan test`.

---

## Notifications & Logging

- **Telegram notifications:** `App\Modules\Core\Services\TelegramService` sends HTML messages to the admin chat on new `Application`, `Inquiry` (lead) and `JobSeeker` creation (wired via `booted()` model events). Configure `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in `.env`. When unset it silently skips (logs a warning).
- **Activity log:** The `LogActivity` middleware (appended to the `web` group in `bootstrap/app.php`) records GET page views into `activity_logs` with IP, device/browser/OS detection (from User-Agent). Also call `ActivityLog::record(action, model, ...)` directly for key actions. Viewable at admin → Analitika → Fəaliyyət Qeydləri.
- **Per-page SEO:** `App\Modules\Seo\Models\PageSeo` stores translatable title/description/keywords + canonical/og_image per page (keys: `home`, `jobs`, `companies`, `job_seekers`, `blog`, `faq`, `contact`). Managed in admin → SEO → Səhifə SEO. The `layouts.app` head resolves the current route's PageSeo and uses it as the fallback title/description (pages can still override via `@section`).

## Gotchas / Notes

- The default Laravel `README.md` is still the boilerplate — treat it as non-authoritative.
- `.env` currently uses PostgreSQL (`pgsql`) while migrations were written/tested against SQLite; verify the DB driver before running migrations on a fresh checkout.
- `composer.json` autoload includes `app/Modules/Core/Helpers/helpers.php` — any new global helper functions should live there.
- Job attribute tables (`job_types`, `workplace_types`, `experience_levels`) are the **source of truth** for those dropdowns in newer code; the older string columns on `vacancies` (`job_type`, `workplace_type`, `experience_level`) were kept but made nullable.

Her bir taski bitirdikden sonra benim adimdan ingilizce commit ile push et.
