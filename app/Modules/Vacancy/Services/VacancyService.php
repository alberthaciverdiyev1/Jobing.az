<?php

namespace App\Modules\Vacancy\Services;

use App\Modules\Application\Models\Application;
use App\Modules\Category\Models\Category;
use App\Modules\Company\Models\Company;
use App\Modules\JobAttribute\Models\City;
use App\Modules\JobAttribute\Models\ExperienceLevel;
use App\Modules\JobAttribute\Models\JobType;
use App\Modules\JobAttribute\Models\Skill;
use App\Modules\JobAttribute\Models\WorkplaceType;
use App\Modules\Vacancy\Models\Vacancy;
use App\Modules\Vacancy\Models\ScrapedVacancy;
use App\Modules\Vacancy\Support\ResumeSkillMatcher;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class VacancyService
{
    /**
     * Get paginated vacancies with filters, categories, and sidebar attributes.
     */
    public function getPaginatedVacancies(array $filters = [], int $perPage = 30, bool $includeScraped = false): array
    {
        // Ağır merge/sort nəticəsi imza üzrə keşlənir; yeni veri (FacetCache::bump) və ya TTL ilə yenilənir.
        $signatureFilters = $filters;
        ksort($signatureFilters);
        $signature = serialize([
            $signatureFilters, $perPage, $includeScraped,
            \Illuminate\Pagination\LengthAwarePaginator::resolveCurrentPage(), auth()->id(),
        ]);

        return \App\Modules\Vacancy\Support\FacetCache::rememberListing(
            $signature,
            fn () => $this->buildPaginatedVacancies($filters, $perPage, $includeScraped)
        );
    }

    private function buildPaginatedVacancies(array $filters = [], int $perPage = 30, bool $includeScraped = false): array
    {
        $query = Vacancy::with(['company', 'category', 'city', 'jobType', 'workplaceType', 'experienceLevel', 'skillRecords'])->active();

        // 1. Keyword search
        if (!empty($filters['q'])) {
            $search = $filters['q'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhereHas('city', fn ($cq) => $cq->where('slug', 'ilike', "%{$search}%"))
                    ->orWhereHas('company', fn ($cq) => $cq->where('name', 'ilike', "%{$search}%"));
            });
        }

        // Normalize filters to arrays for multi-select support (also accept single values)
        $selectedCategories = array_filter((array) ($filters['category'] ?? []));
        if (!empty($filters['subcategory'])) {
            $subcategories = array_filter((array) $filters['subcategory']);
            $selectedCategories = array_unique(array_merge($selectedCategories, $subcategories));
        }
        $selectedWorkplaces  = array_filter((array) ($filters['workplace'] ?? []));
        $selectedTypes       = array_filter((array) ($filters['type'] ?? []));
        $selectedExperiences = array_filter((array) ($filters['experience'] ?? []));

        // 2. Category / Subcategory (multi-select: if a child is selected, parent is excluded)
        // Nəticə memoizasiya olunur — eyni sorğuda facet sorguları üçün təkrar DB sorğusu olmasın.
        $resolveCategoryIdsCache = [];
        $resolveCategoryIds = function (array $catSlugs) use (&$resolveCategoryIdsCache): array {
            if (empty($catSlugs)) {
                return [];
            }

            $cacheKey = implode('|', $catSlugs);
            if (isset($resolveCategoryIdsCache[$cacheKey])) {
                return $resolveCategoryIdsCache[$cacheKey];
            }

            $cats = Category::with('children')->whereIn('slug', $catSlugs)->get();
            $parentIdsOfSelectedChildren = $cats->whereNotNull('parent_id')->pluck('parent_id')->unique()->all();

            $effectiveCats = $cats->reject(function ($cat) use ($parentIdsOfSelectedChildren) {
                return is_null($cat->parent_id) && in_array($cat->id, $parentIdsOfSelectedChildren, true);
            });

            $categoryIds = [];
            foreach ($effectiveCats as $cat) {
                $categoryIds[] = $cat->id;
                if ($cat->children->isNotEmpty()) {
                    foreach ($cat->children as $child) {
                        $categoryIds[] = $child->id;
                    }
                }
            }

            return $resolveCategoryIdsCache[$cacheKey] = array_unique($categoryIds);
        };

        if (!empty($selectedCategories)) {
            $categoryIds = $resolveCategoryIds($selectedCategories);
            if (!empty($categoryIds)) {
                $query->whereIn('category_id', $categoryIds);
            }
        }

        // 3. Workplace type (multi-select)
        if (!empty($selectedWorkplaces)) {
            $query->whereHas('workplaceType', fn ($wq) => $wq->whereIn('slug', $selectedWorkplaces));
        }

        // 4. Job type (multi-select)
        if (!empty($selectedTypes)) {
            $query->whereHas('jobType', fn ($jq) => $jq->whereIn('slug', $selectedTypes));
        }

        // 5. Experience level (multi-select)
        if (!empty($selectedExperiences)) {
            $query->whereHas('experienceLevel', fn ($eq) => $eq->whereIn('slug', $selectedExperiences));
        }

        // 5.5 City / Location (multi-select)
        $selectedCities = array_filter((array) ($filters['city'] ?? []));
        if (!empty($selectedCities)) {
            $query->whereHas('city', fn ($cq) => $cq->whereIn('slug', $selectedCities));
        }

        // 5.6 Skills Filter (multi-select)
        $selectedSkills = array_filter((array) ($filters['skills'] ?? []));
        if (!empty($selectedSkills)) {
            $skillIds = $this->resolveSkillIds($selectedSkills);
            $query->whereHas('skillRecords', fn ($skillQuery) => $skillQuery->whereIn('skills.id', $skillIds));
        }

        // 6. Salary Filter (Min & Max)
        if (!empty($filters['min_salary'])) {
            $minSalary = (float)$filters['min_salary'];
            $query->where(function ($q) use ($minSalary) {
                $q->where('salary_max', '>=', $minSalary)
                    ->orWhere('salary_min', '>=', $minSalary);
            });
        }
        if (!empty($filters['max_salary'])) {
            $maxSalary = (float)$filters['max_salary'];
            $query->where(function ($q) use ($maxSalary) {
                $q->where('salary_min', '<=', $maxSalary)
                    ->orWhere(function ($sub) use ($maxSalary) {
                        $sub->whereNull('salary_min')->where('salary_max', '<=', $maxSalary);
                    });
            });
        }

        // 7. Sort
        $sort = $filters['sort'] ?? 'latest';
        if ($sort === 'oldest') {
            $query->orderBy('is_featured', 'desc')->orderByRaw('vacancies.updated_at ASC');
        } elseif ($sort === 'salary_desc' || $sort === 'salary_high') {
            $query->orderBy('is_featured', 'desc')->orderByRaw('COALESCE(salary_max, salary_min) DESC NULLS LAST')->orderByRaw('vacancies.updated_at DESC');
        } elseif ($sort === 'salary_asc') {
            $query->orderBy('is_featured', 'desc')->orderByRaw('COALESCE(salary_min, salary_max) ASC NULLS LAST')->orderByRaw('vacancies.updated_at DESC');
        } elseif ($sort === 'views') {
            $query->orderBy('is_featured', 'desc')->orderByDesc('views_count')->orderByRaw('vacancies.updated_at DESC');
        } elseif ($sort === 'deadline') {
            $query->orderBy('is_featured', 'desc')->orderByRaw('deadline ASC NULLS LAST')->orderByRaw('vacancies.updated_at DESC');
        } elseif ($sort === 'featured') {
            $query->orderByDesc('is_featured')->orderByRaw('vacancies.updated_at DESC');
        } elseif ($sort === 'title_asc' || $sort === 'alphabetical') {
            $query->orderBy('title', 'asc');
        } elseif ($sort === 'title_desc') {
            $query->orderBy('title', 'desc');
        } else {
            // Default latest: Premium first, then latest bumped/created
            $query->orderBy('is_featured', 'desc')->orderByRaw('vacancies.updated_at DESC');
        }

        if (! $includeScraped) {
            // Normal siyahı: yalnız platforma vakansiyaları (vacancies cədvəli).
            $jobs = $query->paginate($perPage)->withQueryString();
        } else {
            $scrapedQuery = ScrapedVacancy::with(['category', 'city', 'jobType', 'workplaceType', 'experienceLevel'])->active();

            if (!empty($filters['q'])) {
                $search = $filters['q'];
                $scrapedQuery->where(function ($q) use ($search) {
                    $q->where('title', 'ilike', "%{$search}%")
                        ->orWhere('company_name', 'ilike', "%{$search}%")
                        ->orWhereHas('city', fn ($cityQuery) => $cityQuery->where('slug', 'ilike', "%{$search}%"));
                });
            }
            if (!empty($selectedCategories)) {
                $categoryIds = $resolveCategoryIds($selectedCategories);
                $scrapedQuery->whereIn('category_id', $categoryIds ?: [-1]);
            }
            if (!empty($selectedWorkplaces)) {
                $scrapedQuery->whereHas('workplaceType', fn ($q) => $q->whereIn('slug', $selectedWorkplaces));
            }
            if (!empty($selectedTypes)) {
                $scrapedQuery->whereHas('jobType', fn ($q) => $q->whereIn('slug', $selectedTypes));
            }
            if (!empty($selectedExperiences)) {
                $scrapedQuery->whereHas('experienceLevel', fn ($q) => $q->whereIn('slug', $selectedExperiences));
            }
            if (!empty($selectedCities)) {
                $scrapedQuery->whereHas('city', fn ($q) => $q->whereIn('slug', $selectedCities));
            }
            if (!empty($selectedSkills)) {
                $scrapedQuery->where(function ($q) use ($selectedSkills) {
                    foreach ($selectedSkills as $skill) {
                        $q->orWhereJsonContains('skills', $skill);
                    }
                });
            }
            if (!empty($filters['min_salary'])) {
                $minSalary = (float) $filters['min_salary'];
                $scrapedQuery->where(fn ($q) => $q->where('salary_max', '>=', $minSalary)->orWhere('salary_min', '>=', $minSalary));
            }
            if (!empty($filters['max_salary'])) {
                $maxSalary = (float) $filters['max_salary'];
                $scrapedQuery->where(function ($q) use ($maxSalary) {
                    $q->where('salary_min', '<=', $maxSalary)
                        ->orWhere(fn ($sub) => $sub->whereNull('salary_min')->where('salary_max', '<=', $maxSalary));
                });
            }

            // Platforma və xarici elanlar birlikdə, seçilmiş sıralamaya görə
            // qarışdırılır (native elanlar həmişə yuxarıda saxlanılmır).
            // SQL səviyyəsində UNION + ORDER BY + LIMIT/OFFSET: yalnız görünən səhifə hydrate olunur.
            $jobs = $this->paginateMergedListing($query, $scrapedQuery, $sort, $perPage);
        }

        $mainResume = null;
        if (auth()->check() && auth()->user()->isUser()) {
            $mainResume = auth()->user()->resumes()
                ->with('skillRecords:id,name,slug')
                ->where('is_default', true)
                ->first(['id', 'user_id']);
        }

        if ($mainResume?->skillRecords->isNotEmpty()) {
            $jobs->getCollection()->each(function ($job) use ($mainResume): void {
                $match = ResumeSkillMatcher::compare($mainResume->skillRecords, $job->skills);
                if ($match !== null) {
                    $job->setAttribute('match_percentage', $match['percentage']);
                    $job->setAttribute('matched_skill_count', $match['matched']);
                    $job->setAttribute('required_skill_count', $match['required']);
                }
            });
        }

        // Count scopes based on currently applied filters.
        // $attributeScope includes the selected category; $categoryCountScope does not
        // (so category counts reflect search/other filters but aren't narrowed by the category itself).
        $makeScope = function (bool $includeCategory) use ($selectedCategories, $selectedWorkplaces, $selectedTypes, $selectedExperiences, $selectedCities, $selectedSkills, $filters, $resolveCategoryIds) {
            return function ($q) use ($includeCategory, $selectedCategories, $selectedWorkplaces, $selectedTypes, $selectedExperiences, $selectedCities, $selectedSkills, $filters, $resolveCategoryIds) {
                $q->active();
                if ($includeCategory && !empty($selectedCategories)) {
                    $categoryIds = $resolveCategoryIds($selectedCategories);
                    if (!empty($categoryIds)) {
                        $q->whereIn('category_id', $categoryIds);
                    }
                }
                if (!empty($filters['q'])) {
                    $search = $filters['q'];
                    $q->where(function ($sub) use ($search) {
                        $sub->where('title', 'ilike', "%{$search}%")
                            ->orWhereHas('city', fn ($cq) => $cq->where('slug', 'ilike', "%{$search}%"))
                            ->orWhereHas('company', fn ($cq) => $cq->where('name', 'ilike', "%{$search}%"));
                    });
                }
                if (!empty($selectedWorkplaces)) {
                    $q->whereHas('workplaceType', fn ($wq) => $wq->whereIn('slug', $selectedWorkplaces));
                }
                if (!empty($selectedTypes)) {
                    $q->whereHas('jobType', fn ($jq) => $jq->whereIn('slug', $selectedTypes));
                }
                if (!empty($selectedExperiences)) {
                    $q->whereHas('experienceLevel', fn ($eq) => $eq->whereIn('slug', $selectedExperiences));
                }
                if (!empty($selectedCities)) {
                    $q->whereHas('city', fn ($cq) => $cq->whereIn('slug', $selectedCities));
                }
                if (!empty($selectedSkills)) {
                    $skillIds = $this->resolveSkillIds($selectedSkills);
                    $q->whereHas('skillRecords', fn ($skillQuery) => $skillQuery->whereIn('skills.id', $skillIds));
                }
                if (!empty($filters['min_salary'])) {
                    $minSalary = (float) $filters['min_salary'];
                    $q->where(function ($sub) use ($minSalary) {
                        $sub->where('salary_max', '>=', $minSalary)
                            ->orWhere('salary_min', '>=', $minSalary);
                    });
                }
                if (!empty($filters['max_salary'])) {
                    $maxSalary = (float) $filters['max_salary'];
                    $q->where(function ($sub) use ($maxSalary) {
                        $sub->where('salary_min', '<=', $maxSalary)
                            ->orWhere(function ($sub2) use ($maxSalary) {
                                $sub2->whereNull('salary_min')->where('salary_max', '<=', $maxSalary);
                            });
                    });
                }
            };
        };

        // Scraped elanlar üçün eyni filtr məntiqi (company_name və JSON skills fərqlidir).
        $makeScrapedScope = function (bool $includeCategory) use ($selectedCategories, $selectedWorkplaces, $selectedTypes, $selectedExperiences, $selectedCities, $selectedSkills, $filters, $resolveCategoryIds) {
            return function ($q) use ($includeCategory, $selectedCategories, $selectedWorkplaces, $selectedTypes, $selectedExperiences, $selectedCities, $selectedSkills, $filters, $resolveCategoryIds) {
                $q->active();
                if ($includeCategory && !empty($selectedCategories)) {
                    $categoryIds = $resolveCategoryIds($selectedCategories);
                    if (!empty($categoryIds)) {
                        $q->whereIn('category_id', $categoryIds);
                    }
                }
                if (!empty($filters['q'])) {
                    $search = $filters['q'];
                    $q->where(function ($sub) use ($search) {
                        $sub->where('title', 'ilike', "%{$search}%")
                            ->orWhere('company_name', 'ilike', "%{$search}%")
                            ->orWhereHas('city', fn ($cq) => $cq->where('slug', 'ilike', "%{$search}%"));
                    });
                }
                if (!empty($selectedWorkplaces)) {
                    $q->whereHas('workplaceType', fn ($wq) => $wq->whereIn('slug', $selectedWorkplaces));
                }
                if (!empty($selectedTypes)) {
                    $q->whereHas('jobType', fn ($jq) => $jq->whereIn('slug', $selectedTypes));
                }
                if (!empty($selectedExperiences)) {
                    $q->whereHas('experienceLevel', fn ($eq) => $eq->whereIn('slug', $selectedExperiences));
                }
                if (!empty($selectedCities)) {
                    $q->whereHas('city', fn ($cq) => $cq->whereIn('slug', $selectedCities));
                }
                if (!empty($selectedSkills)) {
                    $q->where(function ($sub) use ($selectedSkills) {
                        foreach ($selectedSkills as $skill) {
                            $sub->orWhereJsonContains('skills', $skill);
                        }
                    });
                }
                if (!empty($filters['min_salary'])) {
                    $minSalary = (float) $filters['min_salary'];
                    $q->where(function ($sub) use ($minSalary) {
                        $sub->where('salary_max', '>=', $minSalary)
                            ->orWhere('salary_min', '>=', $minSalary);
                    });
                }
                if (!empty($filters['max_salary'])) {
                    $maxSalary = (float) $filters['max_salary'];
                    $q->where(function ($sub) use ($maxSalary) {
                        $sub->where('salary_min', '<=', $maxSalary)
                            ->orWhere(function ($sub2) use ($maxSalary) {
                                $sub2->whereNull('salary_min')->where('salary_max', '<=', $maxSalary);
                            });
                    });
                }
            };
        };

        // Facet (say) sorğuları filtr imzasına görə keşlənir — ağır withCount subquery-ləri təkrarlanmasın.
        $facetSignature = serialize([
            $selectedCategories, $selectedWorkplaces, $selectedTypes,
            $selectedExperiences, $selectedCities, $selectedSkills,
            $filters['q'] ?? '', $filters['min_salary'] ?? '', $filters['max_salary'] ?? '',
            $includeScraped,
        ]);

        $facets = \App\Modules\Vacancy\Support\FacetCache::remember($facetSignature, function () use ($makeScope, $makeScrapedScope, $includeScraped) {
            $attributeScope = $makeScope(true);
            $categoryCountScope = $makeScope(false);

            if ($includeScraped) {
                // Facet sayıları: onlarca withCount yerine bir neçə GROUP BY sorğusu.
                $grouped = function (string $modelClass, string $fk, bool $includeCategory, bool $scraped) use ($makeScope, $makeScrapedScope) {
                    $scope = $scraped ? $makeScrapedScope($includeCategory) : $makeScope($includeCategory);
                    $builder = $modelClass::query();
                    $scope($builder); // scope closure mutasiya edir, dəyər qaytarmır
                    return $builder
                        ->selectRaw($fk . ' as k, count(*) as c')
                        ->groupBy($fk)
                        ->pluck('c', 'k');
                };

                $mergeMaps = function (...$maps): array {
                    $out = [];
                    foreach ($maps as $map) {
                        foreach ($map as $id => $count) {
                            $out[$id] = ($out[$id] ?? 0) + (int) $count;
                        }
                    }
                    return $out;
                };

                $catCounts = $mergeMaps(
                    $grouped(Vacancy::class, 'category_id', false, false),
                    $grouped(ScrapedVacancy::class, 'category_id', false, true),
                );

                $categories = Category::parents()->with('children')->get()
                    ->each(function ($cat) use ($catCounts) {
                        $cat->vacancies_count = (int) ($catCounts[$cat->id] ?? 0);
                        foreach ($cat->children as $child) {
                            $child->vacancies_count = (int) ($catCounts[$child->id] ?? 0);
                            $cat->vacancies_count += $child->vacancies_count;
                        }
                    });

                $attributeCounts = fn (string $fk): array => $mergeMaps(
                    $grouped(Vacancy::class, $fk, true, false),
                    $grouped(ScrapedVacancy::class, $fk, true, true),
                );
                $attachCounts = function ($models, array $counts) {
                    return $models->each(function ($model) use ($counts) {
                        $model->vacancies_count = (int) ($counts[$model->id] ?? 0);
                    });
                };

                $jobTypes = $attachCounts(JobType::active()->get(), $attributeCounts('job_type_id'));
                $workplaceTypes = $attachCounts(WorkplaceType::active()->get(), $attributeCounts('workplace_type_id'));
                $experienceLevels = $attachCounts(ExperienceLevel::active()->get(), $attributeCounts('experience_level_id'));
                $cities = $attachCounts(\App\Modules\JobAttribute\Models\City::active()->get(), $attributeCounts('city_id'));
            } else {
                $categories = Category::parents()
                    ->with(['children' => fn ($q) => $q->withCount(['vacancies' => $categoryCountScope])])
                    ->withCount(['vacancies' => $categoryCountScope])
                    ->get()
                    ->each(function ($cat) {
                        $cat->vacancies_count += $cat->children->sum('vacancies_count');
                    });

                $jobTypes = JobType::active()->withCount(['vacancies' => $attributeScope])->get();
                $workplaceTypes = WorkplaceType::active()->withCount(['vacancies' => $attributeScope])->get();
                $experienceLevels = ExperienceLevel::active()->withCount(['vacancies' => $attributeScope])->get();
                $cities = \App\Modules\JobAttribute\Models\City::active()->withCount(['vacancies' => $attributeScope])->get();
            }

            $categoryCounts = $categories->flatMap(function ($cat) {
                $map = [$cat->slug => $cat->vacancies_count];
                foreach ($cat->children as $child) {
                    $map[$child->slug] = $child->vacancies_count;
                }
                return $map;
            });

            $categoryParentMap = [];
            foreach ($categories as $parent) {
                foreach ($parent->children as $child) {
                    $categoryParentMap[$child->slug] = $parent->slug;
                }
            }

            return compact('categories', 'jobTypes', 'workplaceTypes', 'experienceLevels', 'categoryCounts', 'cities', 'categoryParentMap');
        });

        extract($facets);

        // Seçilmiş kateqoriyalar (filtrdən asılı — keşlənmir)
        $selectedCategoryModels = Category::with('parent')->whereIn('slug', $selectedCategories)->get();
        $companies = Company::withCount('vacancies')->orderByDesc('vacancies_count')->take(10)->get();

        return [
            'jobs' => $jobs,
            'categories' => $categories,
            'categoryParentMap' => $categoryParentMap,
            'parentCategorySlugs' => $categories->pluck('slug')->values()->all(),
            'citySlugs' => $cities->pluck('slug')->values()->all(),
            'jobTypes' => $jobTypes,
            'workplaceTypes' => $workplaceTypes,
            'experienceLevels' => $experienceLevels,
            'cities' => $cities,
            'categoryCounts' => $categoryCounts,
            'companies' => $companies,
            'selectedCategories' => $selectedCategoryModels,
            'selectedCategory' => $selectedCategoryModels->first(),
            'selectedSkills' => $selectedSkills,
        ];
    }

    /**
     * Get a single vacancy by slug with relations and increment view count.
     */
    /**
     * Native (vacancies) + xarici (scraped_vacancies) elanları SQL UNION ilə birləşdirir,
     * ORDER BY + LIMIT/OFFSET tətbiq edir və yalnız cari səhifəni hydrate edir.
     * (Bütün sətirləri PHP-yə çəkmək 10k+ gündəlik data ilə ölçəklənmir.)
     */
    private function paginateMergedListing($nativeQuery, $scrapedQuery, string $sort, int $perPage): LengthAwarePaginator
    {
        $columns = 'id, is_featured, updated_at, salary_min, salary_max, views_count, deadline, title';
        $nativeQuery->selectRaw("'v' as src, " . $columns);
        $scrapedQuery->selectRaw("'s' as src, " . $columns);

        $makeUnion = fn () => DB::query()
            ->fromSub($nativeQuery, 'v')
            ->unionAll(DB::query()->fromSub($scrapedQuery, 's'));

        $total = DB::query()->fromSub($makeUnion(), 'u')->count();
        $page = LengthAwarePaginator::resolveCurrentPage();

        $rows = DB::query()->fromSub($makeUnion(), 'u')
            ->orderByRaw($this->mergedOrderBy($sort))
            ->forPage($page, $perPage)
            ->get();

        $nativeIds = $rows->where('src', 'v')->pluck('id')->all();
        $scrapedIds = $rows->where('src', 's')->pluck('id')->all();

        $native = $nativeIds
            ? Vacancy::with(['company', 'category', 'city', 'jobType', 'workplaceType', 'experienceLevel', 'skillRecords'])->whereIn('id', $nativeIds)->get()->keyBy('id')
            : collect();
        $scraped = $scrapedIds
            ? ScrapedVacancy::with(['category', 'city', 'jobType', 'workplaceType', 'experienceLevel'])->whereIn('id', $scrapedIds)->get()->keyBy('id')
            : collect();

        $items = $rows->map(fn ($row) => $row->src === 'v' ? ($native[$row->id] ?? null) : ($scraped[$row->id] ?? null))
            ->filter()
            ->values();

        return new LengthAwarePaginator($items, $total, $perPage, $page, [
            'path' => request()->url(), 'query' => request()->query(),
        ]);
    }

    private function mergedOrderBy(string $sort): string
    {
        $featured = 'is_featured desc';
        return match ($sort) {
            'title_asc', 'alphabetical' => 'title asc',
            'title_desc' => 'title desc',
            'oldest' => "$featured, updated_at asc",
            'salary_desc', 'salary_high' => "$featured, coalesce(salary_max, salary_min) desc nulls last, updated_at desc",
            'salary_asc' => "$featured, coalesce(salary_min, salary_max) asc nulls last, updated_at desc",
            'views' => "$featured, views_count desc nulls last, updated_at desc",
            'deadline' => "$featured, deadline asc nulls last, updated_at desc",
            default => "$featured, updated_at desc",
        };
    }

    public function getVacancyDetails(string $slug): array
    {
        $job = Vacancy::with(['company', 'category', 'jobType', 'workplaceType', 'experienceLevel', 'skillRecords'])
            ->where('slug', $slug)
            ->firstOrFail();

        if (! is_bot_request()) {
            $job->increment('views_count');
        }

        $relatedJobs = Vacancy::with(['company', 'city', 'category', 'jobType', 'workplaceType', 'experienceLevel', 'skillRecords'])
            ->active()
            ->where('id', '!=', $job->id)
            ->where(function ($q) use ($job) {
                if ($job->category_id) {
                    $q->where('category_id', $job->category_id);
                }
            })
            ->orderByDesc('updated_at')
            ->take(4)
            ->get();

        $userResumes = auth()->check() ? auth()->user()->resumes()->latest()->get() : collect();

        $hasApplied = false;
        if (auth()->check()) {
            $hasApplied = \App\Modules\Application\Models\Application::where('vacancy_id', $job->id)
                ->where('user_id', auth()->id())
                ->exists();
        }

        return [
            'job' => $job,
            'relatedJobs' => $relatedJobs,
            'userResumes' => $userResumes,
            'hasApplied' => $hasApplied,
        ];
    }

    /**
     * Get data required for the create vacancy form.
     */
    public function getCreationFormData(): array
    {
        $categories = Category::cachedTree();
        $jobTypes = JobType::cachedActive();
        $workplaceTypes = WorkplaceType::cachedActive();
        $experienceLevels = ExperienceLevel::cachedActive();

        // Skills for the form's tag picker (fetched here, not in blade).
        $skills = Skill::cachedActive();

        // If the logged-in user is registered as a company, pass their info
        // through so the form can auto-fill the company details.
        $authCompany = null;
        if (auth()->check() && auth()->user()->company) {
            $authCompany = auth()->user()->company;
        }

        return [
            'categories' => $categories,
            'jobTypes' => $jobTypes,
            'workplaceTypes' => $workplaceTypes,
            'experienceLevels' => $experienceLevels,
            'skills' => $skills,
            'authCompany' => $authCompany,
            'cities' => City::cachedActive()->sortBy(fn ($c) => is_array($c->name) ? ($c->name['tr'] ?? reset($c->name)) : $c->name)->values(),
        ];
    }

    /**
     * City options for dropdowns and filters.
     */
    public static function cityOptions(): array
    {
        $cities = City::cachedActive()->map(function ($c) {
            return is_array($c->name) ? ($c->name['tr'] ?? reset($c->name)) : $c->name;
        })->filter()->unique()->values()->toArray();

        if (!empty($cities)) {
            return $cities;
        }

        return [
            'Lefkoşa',
            'Gönyeli',
            'Değirmenlik',
            'Girne',
            'Alsancak',
            'Lapta',
            'Çatalköy',
            'Karaoğlanoğlu',
            'Esentepe',
            'Dikmen',
            'Tatlısu',
            'Gazimağusa',
            'Maraş',
            'İskele',
            'Boğaz',
            'Yeniboğaziçi',
            'Geçitkale',
            'Akdoğan',
            'Serdarlı',
            'Beyarmudu',
            'Paşaköy',
            'Vadili',
            'Mehmetçik',
            'Yenierenköy',
            'Dipkarpaz',
            'Büyükkonuk',
            'Güzelyurt',
            'Kalkanlı',
            'Lefke',
            'Gemikonağı',
            'Ercan',
            'Uzaktan',
        ];
    }

    /**
     * Create a new vacancy along with resolving company and attributes.
     */
    public function createVacancy(array $data): Vacancy
    {
        // 1. Resolve City from company_location, city_id, or location
        $cityId = null;
        $locationInput = $data['company_location'] ?? $data['city_id'] ?? $data['location'] ?? null;
        if ($locationInput) {
            if (is_numeric($locationInput)) {
                $city = City::find($locationInput);
                $cityId = $city?->id;
            } else {
                $city = City::where('name->tr', $locationInput)
                    ->orWhere('name->en', $locationInput)
                    ->orWhere('slug', \Illuminate\Support\Str::slug($locationInput))
                    ->orWhere('name', 'ilike', '%' . $locationInput . '%')
                    ->first();
                $cityId = $city?->id;
            }
        }

        // 2. Resolve or create company
        $authCompany = auth()->check() ? auth()->user()->company : null;

        if ($authCompany) {
            // Logged-in company: reuse their record and keep it up to date.
            // Company name, email and website are ALWAYS taken from the linked
            // profile (never from the request), so a company cannot alter its
            // own identity by tampering with the posted form fields.
            $company = $authCompany;

            if ($cityId && empty($company->city_id)) {
                $company->city_id = $cityId;
                $company->save();
            }
        } else {
            // Unlinked users may only create a new company identity. Reusing an
            // existing record would allow a vacancy to impersonate that company.
            $company = Company::create([
                'name' => trim($data['company_name']),
                'email' => $data['company_email'] ?? $data['application_email'] ?? null,
                'website' => $data['company_website'] ?? null,
                'city_id' => $cityId,
                'is_verified' => false,
            ]);
        }

        // 3. Parse skills if string or array
        $skills = $data['skills'] ?? null;
        if (is_string($skills)) {
            $skills = array_filter(array_map('trim', explode(',', $skills)));
        } elseif (is_array($skills)) {
            $skills = array_values(array_filter(array_map('trim', $skills)));
        }

        // 4. Resolve attribute labels if IDs are provided
        $jobTypeId = $data['job_type_id'] ?? null;
        $workplaceTypeId = $data['workplace_type_id'] ?? null;
        $experienceLevelId = $data['experience_level_id'] ?? null;

        $jobTypeModel = $jobTypeId ? JobType::find($jobTypeId) : null;
        $workplaceTypeModel = $workplaceTypeId ? WorkplaceType::find($workplaceTypeId) : null;
        $experienceLevelModel = $experienceLevelId ? ExperienceLevel::find($experienceLevelId) : null;

        $canUseInternal = auth()->check() && (auth()->user()->isCompany() || auth()->user()->is_admin);
        $applicationType = $canUseInternal ? ($data['application_type'] ?? 'internal') : 'email';

        // 5. Create Vacancy
        $vacancy = Vacancy::create([
            'company_id' => $company->id,
            'category_id' => $data['category_id'] ?? null,
            'city_id' => $cityId ?? $company->city_id,
            'job_type_id' => $jobTypeId,
            'workplace_type_id' => $workplaceTypeId,
            'experience_level_id' => $experienceLevelId,
            'title' => $data['title'],
            'job_type' => $jobTypeModel?->name,
            'workplace_type' => $workplaceTypeModel?->name,
            'experience_level' => $experienceLevelModel?->name,
            'salary_min' => $data['salary_negotiable'] ?? false ? null : ($data['salary_min'] ?? null),
            'salary_max' => $data['salary_negotiable'] ?? false ? null : ($data['salary_max'] ?? null),
            'salary_negotiable' => $data['salary_negotiable'] ?? false,
            'currency' => $data['currency'] ?? 'TRY',
            'description' => $data['description'],
            'requirements' => $data['requirements'] ?? null,
            'benefits' => $data['benefits'] ?? null,
            'deadline' => $data['deadline'] ?? null,
            'application_type' => $applicationType,
            'application_email' => $data['application_email'] ?? $company->email,
            'application_fields' => $data['application_fields'] ?? ['phone', 'linkedin', 'portfolio', 'cover_letter'],
            'is_active' => false, // Requires admin approval before appearing publicly
            'is_featured' => false,
        ]);

        $vacancy->skillRecords()->sync($this->resolveSkillIds($skills ?? []));

        return $vacancy->load('skillRecords');
    }

    /** @return array<int, int> */
    private function resolveSkillIds(array $names): array
    {
        $normalized = array_map(fn ($name) => mb_strtolower(trim((string) $name)), $names);

        return Skill::cachedActive()
            ->filter(fn (Skill $skill) => in_array(mb_strtolower((string) $skill->name), $normalized, true))
            ->pluck('id')
            ->map(fn ($id) => (int) $id)
            ->values()
            ->all();
    }

    /**
     * Yerli (vacancies) və xarici (scraped_vacancies) elanları vahid siyahıda
     * seçilmiş sıralama ilə qarışdırır. Beləliklə platforma elanları həmişə
     * yuxarıda saxlanılmır — hamısı updated_at (və digər meyarlar) üzrə sıralanır.
     *
     * @param  \Illuminate\Support\Collection<int, \Illuminate\Database\Eloquent\Model>  $items
     */
    private function sortMergedListing(\Illuminate\Support\Collection $items, string $sort): \Illuminate\Support\Collection
    {
        $sort = $sort ?: 'latest';

        $compareNullable = static function (?float $a, ?float $b, bool $asc): int {
            if ($a === null && $b === null) {
                return 0;
            }
            // Null dəyərlər həmişə sona düşür.
            if ($a === null) {
                return 1;
            }
            if ($b === null) {
                return -1;
            }

            return $asc ? ($a <=> $b) : ($b <=> $a);
        };

        $salary = static function ($job, bool $preferMax): ?float {
            $min = $job->salary_min !== null ? (float) $job->salary_min : null;
            $max = $job->salary_max !== null ? (float) $job->salary_max : null;

            return $preferMax ? ($max ?? $min) : ($min ?? $max);
        };

        $updatedAt = static fn ($job): int => $job->updated_at ? $job->updated_at->getTimestamp() : 0;
        $deadlineAt = static fn ($job): ?int => $job->deadline ? $job->deadline->getTimestamp() : null;

        return $items->sort(function ($a, $b) use ($sort, $compareNullable, $salary, $updatedAt, $deadlineAt) {
            // Başlıq sıralaması premium vəziyyətindən asılı olmayaraq işləyir.
            if ($sort === 'title_asc' || $sort === 'alphabetical') {
                return strcasecmp((string) $a->title, (string) $b->title);
            }
            if ($sort === 'title_desc') {
                return strcasecmp((string) $b->title, (string) $a->title);
            }

            // Bütün digər sıralamalarda premium elanlar əvvəlcə gəlir.
            $featured = (int) ($b->is_featured ?? false) <=> (int) ($a->is_featured ?? false);
            if ($featured !== 0) {
                return $featured;
            }

            return match ($sort) {
                'oldest' => $updatedAt($a) <=> $updatedAt($b),
                'salary_desc', 'salary_high' => $compareNullable($salary($a, true), $salary($b, true), false) ?: ($updatedAt($b) <=> $updatedAt($a)),
                'salary_asc' => $compareNullable($salary($a, false), $salary($b, false), true) ?: ($updatedAt($b) <=> $updatedAt($a)),
                'views' => ((int) ($b->views_count ?? 0) <=> (int) ($a->views_count ?? 0)) ?: ($updatedAt($b) <=> $updatedAt($a)),
                'deadline' => $compareNullable(
                    $deadlineAt($a) !== null ? (float) $deadlineAt($a) : null,
                    $deadlineAt($b) !== null ? (float) $deadlineAt($b) : null,
                    true
                ) ?: ($updatedAt($b) <=> $updatedAt($a)),
                'featured' => $updatedAt($b) <=> $updatedAt($a),
                default => $updatedAt($b) <=> $updatedAt($a), // latest
            };
        })->values();
    }

    /**
     * Submit an application for a vacancy.
     */
    public function applyToVacancy(Vacancy $vacancy, array $data, ?UploadedFile $resumeFile = null): Application
    {
        $resumePath = null;
        if ($resumeFile) {
            $resumePath = $resumeFile->store('resumes', 'public');
        }

        $resume = !empty($data['resume_id']) ? \App\Modules\Resume\Models\Resume::find($data['resume_id']) : null;
        $applicantName = $data['applicant_name'] ?? ($resume ? trim($resume->first_name . ' ' . $resume->last_name) : auth()->user()?->name);
        $applicantEmail = $data['applicant_email'] ?? ($resume ? $resume->email : auth()->user()?->email);
        $applicantPhone = $data['applicant_phone'] ?? ($resume ? $resume->phone : null);

        return Application::create([
            'vacancy_id' => $vacancy->id,
            'user_id' => auth()->check() ? auth()->id() : null,
            'resume_id' => $data['resume_id'] ?? null,
            'applicant_name' => $applicantName ?: __('User'),
            'applicant_email' => $applicantEmail ?: 'user@kariyer.kibriskare.com',
            'applicant_phone' => $applicantPhone,
            'resume_path' => $resumePath,
            'portfolio_url' => $data['portfolio_url'] ?? ($resume ? $resume->portfolio_url : null),
            'linkedin_url' => $data['linkedin_url'] ?? ($resume ? $resume->linkedin_url : null),
            'cover_letter' => $data['cover_letter'] ?? null,
            'status' => Application::STATUS_PENDING,
        ]);
    }
}
