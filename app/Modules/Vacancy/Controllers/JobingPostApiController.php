<?php

namespace App\Modules\Vacancy\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Category\Models\Category;
use App\Modules\Company\Models\Company;
use App\Modules\JobAttribute\Models\City;
use App\Modules\JobAttribute\Models\ExperienceLevel;
use App\Modules\JobAttribute\Models\JobType;
use App\Modules\JobAttribute\Models\Skill;
use App\Modules\JobAttribute\Models\WorkplaceType;
use App\Modules\Vacancy\Models\ScrapedVacancy;
use App\Modules\Vacancy\Models\Vacancy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class JobingPostApiController extends Controller
{
    public function health(): JsonResponse
    {
        return response()->json(['ok' => true]);
    }

    /**
     * Son ilanları öncelik sırasına göre döndürür.
     * Sıralama: teknoloji/SMM/mühasibat kategorileri önce, sonra maaşlı ilanlar.
     */
    public function candidates(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'limit' => ['nullable', 'integer', 'min:1', 'max:200'],
            'since_days' => ['nullable', 'integer', 'min:1', 'max:365'],
        ]);

        $limit = (int) ($validated['limit'] ?? 80);
        $sinceDays = (int) ($validated['since_days'] ?? 120);

        $query = ScrapedVacancy::query()
            ->with(['category', 'city', 'jobType', 'workplaceType', 'experienceLevel'])
            ->active()
            ->where('created_at', '>=', now()->subDays($sinceDays));

        if (! $query->exists()) {
            // Veri eskiyse son kayıtları yine de ver.
            $query = ScrapedVacancy::query()
                ->with(['category', 'city', 'jobType', 'workplaceType', 'experienceLevel'])
                ->active();
        }

        $vacancies = $this->sortByPriority(
            $query->orderByDesc('created_at')->get()
        )->take($limit);

        return response()->json([
            'data' => $vacancies->map(fn (ScrapedVacancy $vacancy) => $this->vacancySummary($vacancy))->values(),
            'meta' => [
                'count' => $vacancies->count(),
                'generated_at' => now()->toIso8601String(),
            ],
        ]);
    }

    public function candidate(int $id): JsonResponse
    {
        $vacancy = ScrapedVacancy::query()
            ->with(['category', 'city', 'jobType', 'workplaceType', 'experienceLevel'])
            ->active()
            ->findOrFail($id);

        return response()->json([
            'data' => array_merge($this->vacancySummary($vacancy), [
                'description_html' => $vacancy->description,
                'requirements_html' => $vacancy->requirements,
                'skills' => $vacancy->skills ?? [],
                'deadline' => $vacancy->deadline?->toDateString(),
            ]),
        ]);
    }

    /**
     * Onaylanan ilanı Jobing.az üzerinde native vakansiya olarak yayınlar.
     */
    public function storeVacancy(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'source_vacancy_id' => ['nullable', 'integer'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'requirements' => ['nullable', 'string'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'company_logo' => ['nullable', 'string', 'max:2048'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'category_slug' => ['nullable', 'string', 'max:255'],
            'category_name' => ['nullable', 'string', 'max:255'],
            'city_id' => ['nullable', 'integer', 'exists:cities,id'],
            'city_name' => ['nullable', 'string', 'max:255'],
            'job_type_id' => ['nullable', 'integer', 'exists:job_types,id'],
            'job_type_name' => ['nullable', 'string', 'max:255'],
            'workplace_type_id' => ['nullable', 'integer', 'exists:workplace_types,id'],
            'workplace_type_name' => ['nullable', 'string', 'max:255'],
            'experience_level_id' => ['nullable', 'integer', 'exists:experience_levels,id'],
            'experience_level_name' => ['nullable', 'string', 'max:255'],
            'salary_min' => ['nullable', 'numeric', 'min:0'],
            'salary_max' => ['nullable', 'numeric', 'min:0'],
            'salary_negotiable' => ['nullable', 'boolean'],
            'currency' => ['nullable', 'string', 'max:10'],
            'keep_original_description' => ['nullable', 'boolean'],
            'tag_ids' => ['nullable', 'array', 'max:30'],
            'tag_ids.*' => ['integer', 'exists:skills,id'],
            'tags' => ['nullable', 'array', 'max:30'],
            'tags.*' => ['string', 'max:100'],
        ]);

        // Elanda şirkət göstərilibsə, vakansiya Jobing.az adından deyil,
        // orijinal şirkətin öz adından yerləşdirilir.
        $company = $this->resolveCompany(
            $validated['company_name'] ?? null,
            $validated['company_logo'] ?? null,
        );

        if ($request->filled('source_vacancy_id')) {
            $existing = Vacancy::query()
                ->where('title', $validated['title'])
                ->where('company_id', $company->id)
                ->where('created_at', '>=', now()->subDays(60))
                ->first();

            if ($existing) {
                return response()->json([
                    'data' => $this->vacancyPayload($existing),
                    'meta' => ['duplicated' => true],
                ]);
            }
        }

        // Orijinal elanın təsvirini qoruyuruq: mənbə vakansiyanın mətni varsa,
        // AI tərəfindən yenidən yazılmış variant əvəzinə onu istifadə edirik.
        $description = $validated['description'];
        $requirements = $validated['requirements'] ?? null;

        if ($request->boolean('keep_original_description') && $request->filled('source_vacancy_id')) {
            $source = ScrapedVacancy::find($validated['source_vacancy_id']);

            if ($source) {
                $description = $source->description ?: $description;
                $requirements = $source->requirements ?: $requirements;
            }
        }

        $deadline = Carbon::now()->addDays(30)->toDateString();

        $vacancy = Vacancy::create([
            'company_id' => $company->id,
            'category_id' => $validated['category_id']
                ?? $this->resolveByName(Category::class, $validated['category_name'] ?? null, $validated['category_slug'] ?? null)?->id,
            'city_id' => $validated['city_id']
                ?? $this->resolveByName(City::class, $validated['city_name'] ?? null)?->id,
            'job_type_id' => $validated['job_type_id']
                ?? $this->resolveByName(JobType::class, $validated['job_type_name'] ?? null)?->id,
            'workplace_type_id' => $validated['workplace_type_id']
                ?? $this->resolveByName(WorkplaceType::class, $validated['workplace_type_name'] ?? null)?->id,
            'experience_level_id' => $validated['experience_level_id']
                ?? $this->resolveByName(ExperienceLevel::class, $validated['experience_level_name'] ?? null)?->id,
            'title' => $validated['title'],
            'salary_min' => $validated['salary_min'] ?? null,
            'salary_max' => $validated['salary_max'] ?? null,
            'salary_negotiable' => (bool) ($validated['salary_negotiable'] ?? false),
            'currency' => $validated['currency'] ?? 'AZN',
            'description' => $description,
            'requirements' => $requirements,
            'is_active' => true,
            'deadline' => $deadline,
            'application_type' => 'internal',
        ]);

        $vacancy->skillRecords()->sync($this->resolveSkillIdsForVacancy(
            $validated['tag_ids'] ?? [],
            $validated['tags'] ?? [],
        ));

        return response()->json([
            'data' => $this->vacancyPayload($vacancy),
            'meta' => ['duplicated' => false],
        ], 201);
    }

    /**
     * Etiketləri (bacarıqları) təmin edir: mövcud olanı qaytarır, olmayanı
     * 4 dildə (az, en, ru, tr) tərcüməsi ilə yaradır.
     *
     * Gövdə: {"tags":[{"name":"SEO","translations":{"az":"SEO","en":"SEO","ru":"SEO","tr":"SEO"},"category_slug":"..."}]}
     */
    public function storeTags(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tags' => ['required', 'array', 'min:1', 'max:30'],
            'tags.*.name' => ['required', 'string', 'max:100'],
            'tags.*.translations' => ['nullable', 'array'],
            'tags.*.translations.az' => ['nullable', 'string', 'max:100'],
            'tags.*.translations.en' => ['nullable', 'string', 'max:100'],
            'tags.*.translations.ru' => ['nullable', 'string', 'max:100'],
            'tags.*.translations.tr' => ['nullable', 'string', 'max:100'],
            'tags.*.category_slug' => ['nullable', 'string', 'max:255'],
        ]);

        $data = [];

        foreach ($validated['tags'] as $tag) {
            [$skill, $created] = $this->ensureSkill($tag);
            $data[] = $this->skillPayload($skill) + ['created' => $created];
        }

        return response()->json(['data' => $data]);
    }

    /**
     * Etiketi tərcümələri ilə tapır, tapılmasa yaradır.
     *
     * @param  array{name?: string, translations?: array<string, string>, category_slug?: string}  $tag
     * @return array{0: Skill, 1: bool}
     */
    private function ensureSkill(array $tag): array
    {
        $name = trim((string) ($tag['name'] ?? ''));

        $translations = [
            'az' => trim((string) ($tag['translations']['az'] ?? '')) ?: $name,
            'en' => trim((string) ($tag['translations']['en'] ?? '')) ?: $name,
            'ru' => trim((string) ($tag['translations']['ru'] ?? '')) ?: $name,
            'tr' => trim((string) ($tag['translations']['tr'] ?? '')) ?: $name,
        ];

        $skill = $this->findSkillByNames(array_values($translations));

        if ($skill) {
            return [$skill, false];
        }

        $categoryId = null;
        if (! empty($tag['category_slug'])) {
            $categoryId = $this->resolveByName(Category::class, null, $tag['category_slug'])?->id;
        }

        $skill = Skill::create([
            'name' => $translations,
            'category_id' => $categoryId,
            'is_active' => true,
        ]);

        return [$skill, true];
    }

    /**
     * @param  array<int, string>  $names
     */
    private function findSkillByNames(array $names): ?Skill
    {
        $names = array_values(array_filter(array_map(
            fn ($name) => trim((string) $name),
            $names,
        )));

        if ($names === []) {
            return null;
        }

        $slugs = array_unique(array_filter(array_map(fn (string $name) => Str::slug($name), $names)));

        return Skill::query()
            ->where(function ($query) use ($names, $slugs) {
                if ($slugs !== []) {
                    $query->orWhereIn('slug', $slugs);
                }

                foreach (['az', 'en', 'ru', 'tr'] as $locale) {
                    $query->orWhere(function ($q) use ($names, $locale) {
                        foreach ($names as $name) {
                            $q->orWhereRaw("LOWER(TRIM(name->>'{$locale}')) = LOWER(?)", [$name]);
                        }
                    });
                }
            })
            ->first();
    }

    /**
     * @param  array<int, int>  $ids
     * @param  array<int, string>  $names
     * @return array<int, int>
     */
    private function resolveSkillIdsForVacancy(array $ids, array $names): array
    {
        $skillIds = array_map('intval', $ids);

        foreach ($names as $name) {
            $name = trim((string) $name);
            if ($name === '') {
                continue;
            }

            [$skill] = $this->ensureSkill(['name' => $name]);
            $skillIds[] = (int) $skill->id;
        }

        return array_values(array_unique($skillIds));
    }

    private function skillPayload(Skill $skill): array
    {
        $translations = $skill->getRawOriginal('name');
        $translations = is_string($translations) ? (json_decode($translations, true) ?: []) : (array) $translations;

        return [
            'id' => (int) $skill->id,
            'slug' => $skill->slug,
            'name' => (string) $skill->name,
            'translations' => $translations,
        ];
    }

    /**
     * Orijinal şirkət adına uyğun şirkəti qaytarır, yoxdursa yaradır.
     */
    private function resolveCompany(?string $name, ?string $logo = null): Company
    {
        $name = trim((string) $name);

        if ($name === '') {
            return $this->jobingCompany();
        }

        $slug = Str::slug($name);

        $company = Company::query()
            ->where('slug', $slug)
            ->orWhereRaw('LOWER(name) = LOWER(?)', [$name])
            ->first();

        if ($company) {
            if ($logo && empty($company->logo)) {
                $company->update(['logo' => $logo]);
            }

            return $company;
        }

        return Company::create([
            'name' => $name,
            'slug' => $slug ?: null,
            'logo' => $logo ?: null,
            'is_verified' => false,
        ]);
    }

    /**
     * Aday listesini öncelik sırasına göre dizer.
     * Teknoloji/SMM/mühasibat kategorileri önce, ardından maaşı olan ilanlar.
     */
    private function sortByPriority($vacancies)
    {
        $tech = [
            'bilisim-teknolojileri-it', 'yazilim-gelistirme-programlama', 'sistem-yonetimi-devops',
            'veritabani-yonetimi-ve-gelistirme-dba', 'it-uzmani-bt-danismani', 'bt-proje-yonetimi-scrum-master',
            'donanim-ve-teknik-destek-uzmani', 'diger-bt-rolleri', 'web-tasarimi-ui-ux', 'grafik-tasarimci',
        ];
        $smm = ['smm-yoneticisi-sosyal-medya-uzmani', 'pazarlama-reklam-ve-pr', 'pazarlama-muduru-dijital-pazarlamaci', 'icerik-yoneticisi', 'metin-yazari-editor'];
        $accounting = ['finans-ve-muhasebe', 'muhasebeci', 'kredi-uzmani', 'denetci-denetmen', 'finansal-analist-yatirim-analisti', 'finans-muduru', 'mali-isler-direktoru-cfo'];

        return $vacancies->sortByDesc(function (ScrapedVacancy $vacancy) use ($tech, $smm, $accounting) {
            $slug = (string) ($vacancy->category?->slug ?? '');
            $priority = 0;
            if (in_array($slug, $tech, true)) {
                $priority = 30;
            } elseif (in_array($slug, $smm, true)) {
                $priority = 25;
            } elseif (in_array($slug, $accounting, true)) {
                $priority = 20;
            }

            $salary = ((float) $vacancy->salary_min > 0 || (float) $vacancy->salary_max > 0) ? 10 : 0;

            return $priority + $salary + ($vacancy->created_at?->timestamp ?? 0) / 1e12;
        })->values();
    }

    private function vacancySummary(ScrapedVacancy $vacancy): array
    {
        return [
            'id' => $vacancy->id,
            'title' => $vacancy->title,
            'company_name' => $vacancy->company_name,
            'company_logo' => $vacancy->company_logo,
            'source_url' => $vacancy->redirect_url,
            'source_name' => $vacancy->source_name,
            'category' => $vacancy->category ? [
                'id' => $vacancy->category->id,
                'slug' => $vacancy->category->slug,
                'name' => $vacancy->category->name,
            ] : null,
            'city' => $vacancy->city ? [
                'id' => $vacancy->city->id,
                'slug' => $vacancy->city->slug,
                'name' => $vacancy->city->name,
            ] : null,
            'job_type' => $vacancy->jobType ? ['id' => $vacancy->jobType->id, 'name' => $vacancy->jobType->name] : null,
            'workplace_type' => $vacancy->workplaceType ? ['id' => $vacancy->workplaceType->id, 'name' => $vacancy->workplaceType->name] : null,
            'experience_level' => $vacancy->experienceLevel ? ['id' => $vacancy->experienceLevel->id, 'name' => $vacancy->experienceLevel->name] : null,
            'salary_min' => $vacancy->salary_min,
            'salary_max' => $vacancy->salary_max,
            'salary_negotiable' => $vacancy->salary_negotiable,
            'currency' => $vacancy->currency,
            'formatted_salary' => $vacancy->formatted_salary,
            'created_at' => $vacancy->created_at?->toIso8601String(),
        ];
    }

    private function vacancyPayload(Vacancy $vacancy): array
    {
        return [
            'id' => $vacancy->id,
            'slug' => $vacancy->slug,
            'title' => $vacancy->title,
            'url' => route('jobs.show', $vacancy->slug),
            'company_id' => $vacancy->company_id,
        ];
    }

    /**
     * @param  class-string<\Illuminate\Database\Eloquent\Model>  $modelClass
     */
    private function resolveByName(string $modelClass, ?string $name, ?string $slug = null)
    {
        $name = trim((string) $name);
        $slug = trim((string) $slug);

        if ($slug !== '') {
            $found = $modelClass::query()->where('slug', $slug)->first();
            if ($found) {
                return $found;
            }
        }

        if ($name === '') {
            return null;
        }

        return $modelClass::query()
            ->where(function ($query) use ($name) {
                $query->whereRaw("LOWER(name->>'az') = LOWER(?)", [$name])
                    ->orWhereRaw("LOWER(name->>'tr') = LOWER(?)", [$name])
                    ->orWhereRaw("LOWER(name->>'en') = LOWER(?)", [$name])
                    ->orWhere('slug', Str::slug($name));
            })
            ->first();
    }

    private function jobingCompany(): Company
    {
        $companyId = config('services.jobing_post.company_id');

        if ($companyId) {
            $company = Company::find($companyId);
            if ($company) {
                return $company;
            }
        }

        return Company::firstOrCreate(
            ['slug' => 'jobing-az'],
            [
                'name' => 'Jobing.az',
                'website' => 'https://jobing.az',
                'is_verified' => true,
            ]
        );
    }
}
