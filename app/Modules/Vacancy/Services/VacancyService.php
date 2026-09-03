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
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;

class VacancyService
{
    /**
     * Get paginated vacancies with filters, categories, and sidebar attributes.
     */
    public function getPaginatedVacancies(array $filters = [], int $perPage = 12): array
    {
        $query = Vacancy::with(['company', 'category', 'city', 'jobType', 'workplaceType', 'experienceLevel'])->active();

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
        $selectedWorkplaces  = array_filter((array) ($filters['workplace'] ?? []));
        $selectedTypes       = array_filter((array) ($filters['type'] ?? []));
        $selectedExperiences = array_filter((array) ($filters['experience'] ?? []));

        // 2. Category / Subcategory (multi-select, includes children of selected parents)
        if (!empty($selectedCategories)) {
            $categoryIds = [];
            foreach ($selectedCategories as $catSlug) {
                $categoryObj = Category::with('children')->where('slug', $catSlug)->first();
                if ($categoryObj) {
                    $categoryIds[] = $categoryObj->id;
                    foreach ($categoryObj->children as $child) {
                        $categoryIds[] = $child->id;
                    }
                }
            }
            $query->whereIn('category_id', array_unique($categoryIds));
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

        // 6. Min Salary
        if (!empty($filters['min_salary'])) {
            $minSalary = (float)$filters['min_salary'];
            $query->where(function ($q) use ($minSalary) {
                $q->where('salary_min', '>=', $minSalary)
                    ->orWhere('salary_max', '>=', $minSalary);
            });
        }

        // 7. Sort
        $sort = $filters['sort'] ?? 'latest';
        if ($sort === 'oldest') {
            $query->orderBy('is_featured', 'desc')->orderByRaw('COALESCE(vacancies.bumped_at, vacancies.created_at) ASC');
        } elseif ($sort === 'salary_desc') {
            $query->orderBy('is_featured', 'desc')->orderByRaw('COALESCE(salary_max, salary_min) DESC')->orderByRaw('COALESCE(vacancies.bumped_at, vacancies.created_at) DESC');
        } elseif ($sort === 'salary_asc') {
            $query->orderBy('is_featured', 'desc')->orderByRaw('COALESCE(salary_min, salary_max) ASC')->orderByRaw('COALESCE(vacancies.bumped_at, vacancies.created_at) DESC');
        } elseif ($sort === 'views') {
            $query->orderBy('is_featured', 'desc')->orderByDesc('views_count')->orderByRaw('COALESCE(vacancies.bumped_at, vacancies.created_at) DESC');
        } else {
            // Default latest: Premium first, then latest bumped/created
            $query->orderBy('is_featured', 'desc')->orderByRaw('COALESCE(vacancies.bumped_at, vacancies.created_at) DESC');
        }

        $jobs = $query->paginate($perPage)->withQueryString();

        // Count scopes based on currently applied filters.
        // $attributeScope includes the selected category; $categoryCountScope does not
        // (so category counts reflect search/other filters but aren't narrowed by the category itself).
        $makeScope = function (bool $includeCategory) use ($selectedCategories, $selectedWorkplaces, $selectedTypes, $selectedExperiences, $selectedCities, $filters) {
            return function ($q) use ($includeCategory, $selectedCategories, $selectedWorkplaces, $selectedTypes, $selectedExperiences, $selectedCities, $filters) {
                $q->active();
                if ($includeCategory && !empty($selectedCategories)) {
                    $categoryIds = [];
                    foreach ($selectedCategories as $catSlug) {
                        $cat = Category::with('children')->where('slug', $catSlug)->first();
                        if ($cat) {
                            $categoryIds[] = $cat->id;
                            foreach ($cat->children as $child) {
                                $categoryIds[] = $child->id;
                            }
                        }
                    }
                    $q->whereIn('category_id', array_unique($categoryIds));
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
                if (!empty($filters['min_salary'])) {
                    $minSalary = (float) $filters['min_salary'];
                    $q->where(function ($sub) use ($minSalary) {
                        $sub->where('salary_min', '>=', $minSalary)
                            ->orWhere('salary_max', '>=', $minSalary);
                    });
                }
            };
        };

        $attributeScope = $makeScope(true);
        $categoryCountScope = $makeScope(false);

        $categories = Category::parents()
            ->with(['children' => fn ($q) => $q->withCount(['vacancies' => $categoryCountScope])])
            ->withCount(['vacancies' => $categoryCountScope])
            ->get()
            ->each(function ($cat) {
                // Parent count includes its subcategories' vacancies
                $cat->vacancies_count += $cat->children->sum('vacancies_count');
            });

        $jobTypes = JobType::active()->withCount(['vacancies' => $attributeScope])->get();
        $workplaceTypes = WorkplaceType::active()->withCount(['vacancies' => $attributeScope])->get();
        $experienceLevels = ExperienceLevel::active()->withCount(['vacancies' => $attributeScope])->get();

        // Flat slug => count map for parent + subcategories (used by JS to update dynamically)
        $categoryCounts = $categories->flatMap(function ($cat) {
            $map = [$cat->slug => $cat->vacancies_count];
            foreach ($cat->children as $child) {
                $map[$child->slug] = $child->vacancies_count;
            }
            return $map;
        });

        $selectedCategoryModels = Category::with('parent')->whereIn('slug', $selectedCategories)->get();
        $companies = Company::withCount('vacancies')->orderByDesc('vacancies_count')->take(10)->get();

        // Cities derived from City model
        $cities = \App\Modules\JobAttribute\Models\City::active()->withCount(['vacancies' => $attributeScope])->get();

        return [
            'jobs' => $jobs,
            'categories' => $categories,
            'jobTypes' => $jobTypes,
            'workplaceTypes' => $workplaceTypes,
            'experienceLevels' => $experienceLevels,
            'cities' => $cities,
            'categoryCounts' => $categoryCounts,
            'companies' => $companies,
            'selectedCategories' => $selectedCategoryModels,
            'selectedCategory' => $selectedCategoryModels->first(),
        ];
    }

    /**
     * Get a single vacancy by slug with relations and increment view count.
     */
    public function getVacancyDetails(string $slug): array
    {
        $job = Vacancy::with(['company', 'category', 'jobType', 'workplaceType', 'experienceLevel'])
            ->where('slug', $slug)
            ->firstOrFail();

        $job->increment('views_count');

        $relatedJobs = Vacancy::with(['company', 'category', 'jobType', 'workplaceType', 'experienceLevel'])
            ->active()
            ->where('id', '!=', $job->id)
            ->where(function ($q) use ($job) {
                if ($job->category_id) {
                    $q->where('category_id', $job->category_id);
                }
            })
            ->latest()
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
        $categories = Category::parents()->with('children')->get();
        $jobTypes = JobType::active()->get();
        $workplaceTypes = WorkplaceType::active()->get();
        $experienceLevels = ExperienceLevel::active()->get();

        // Skills for the form's tag picker (fetched here, not in blade).
        $skills = Skill::active()->get()->sortBy('name')->values();

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
            'cities' => City::all()->sortBy(fn ($c) => is_array($c->name) ? ($c->name['az'] ?? reset($c->name)) : $c->name)->values(),
        ];
    }

    /**
     * City options for dropdowns and filters.
     */
    public static function cityOptions(): array
    {
        $cities = City::all()->map(function ($c) {
            return is_array($c->name) ? ($c->name['az'] ?? reset($c->name)) : $c->name;
        })->filter()->unique()->values()->toArray();

        if (!empty($cities)) {
            return $cities;
        }

        return [
            'Bakı',
            'Sumqayıt',
            'Gəncə',
            'Mingəçevir',
            'Xırdalan',
            'Şəki',
            'Lənkəran',
            'Quba',
            'Naxçıvan',
            'Şirvan',
            'Yevlax',
            'Göyçay',
            'Zaqatala',
            'Şamaxı',
            'İsmayıllı',
            'Tovuz',
            'Ağcabədi',
            'Bərdə',
            'İmişli',
            'Qazax',
            'Qax',
            'Balakən',
            'Remote (Məsafədən)',
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
                $city = City::where('name->az', $locationInput)
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
            $company = Company::firstOrCreate(
                ['name' => $data['company_name']],
                [
                    'email' => $data['company_email'] ?? $data['application_email'] ?? null,
                    'website' => $data['company_website'] ?? null,
                    'city_id' => $cityId,
                    'is_verified' => false,
                ]
            );
            if (empty($company->email) && !empty($data['application_email'])) {
                $company->email = $data['application_email'];
            }
            if ($cityId && empty($company->city_id)) {
                $company->city_id = $cityId;
            }
            $company->save();
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

        // 5. Create Vacancy
        return Vacancy::create([
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
            'currency' => $data['currency'] ?? 'AZN',
            'description' => $data['description'],
            'requirements' => $data['requirements'] ?? null,
            'benefits' => $data['benefits'] ?? null,
            'skills' => $skills,
            'deadline' => $data['deadline'] ?? null,
            'application_type' => $data['application_type'] ?? 'internal',
            'application_email' => $data['application_email'] ?? $company->email,
            'is_active' => false, // Requires admin approval before appearing publicly
            'is_featured' => false,
        ]);
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
            'applicant_name' => $applicantName ?: 'İstifadəçi',
            'applicant_email' => $applicantEmail ?: 'user@jobing.az',
            'applicant_phone' => $applicantPhone,
            'resume_path' => $resumePath,
            'portfolio_url' => $data['portfolio_url'] ?? ($resume ? $resume->portfolio_url : null),
            'linkedin_url' => $data['linkedin_url'] ?? ($resume ? $resume->linkedin_url : null),
            'cover_letter' => $data['cover_letter'] ?? null,
            'status' => 'Beklemede',
        ]);
    }
}
