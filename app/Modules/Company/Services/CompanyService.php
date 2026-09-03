<?php

namespace App\Modules\Company\Services;

use App\Modules\Company\Models\Company;
use App\Modules\Vacancy\Models\Vacancy;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CompanyService
{
    /**
     * Get paginated companies with active vacancy counts, recent open jobs, and filters.
     *
     * @param array $filters
     * @param int $perPage
     * @return array
     */
    public function getPaginatedCompanies(array $filters = [], int $perPage = 12): array
    {
        $query = Company::publicProfile()
            ->withCount(['vacancies' => fn ($q) => $q->active()])
            ->with(['city', 'vacancies' => fn ($q) => $q->active()->with(['jobType', 'workplaceType'])->latest()->take(3)]);

        // Search query (name, city, about)
        if (!empty($filters['q'])) {
            $search = trim($filters['q']);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhereHas('city', fn ($cq) => $cq->where('slug', 'ilike', "%{$search}%"))
                    ->orWhere('about', 'ilike', "%{$search}%");
            });
        }

        // Verified filter
        if (!empty($filters['verified']) && ($filters['verified'] === '1' || $filters['verified'] === 'true')) {
            $query->where('is_verified', true);
        }

        // Only with active jobs filter
        if (!empty($filters['has_jobs']) && ($filters['has_jobs'] === '1' || $filters['has_jobs'] === 'true')) {
            $query->has('vacancies', '>=', 1, 'and', fn ($q) => $q->active());
        }

        // Location filter
        if (!empty($filters['location'])) {
            $loc = trim($filters['location']);
            $query->whereHas('city', fn ($cq) => $cq->where('slug', 'ilike', "%{$loc}%"));
        }

        // Sorting (Default: created_at desc)
        $sort = $filters['sort'] ?? 'latest';
        if ($sort === 'popular') {
            $query->orderByDesc('vacancies_count')->latest('created_at');
        } elseif ($sort === 'alphabetical') {
            $query->orderBy('name', 'asc');
        } elseif ($sort === 'verified') {
            $query->orderByDesc('is_verified')->latest('created_at');
        } else {
            $query->latest('created_at');
        }

        $companies = $query->paginate($perPage)->withQueryString();

        $stats = [
            'total_companies' => Company::count(),
            'verified_companies' => Company::where('is_verified', true)->count(),
            'active_vacancies' => Vacancy::active()->count(),
        ];

        return [
            'companies' => $companies,
            'stats' => $stats,
            'filters' => $filters,
        ];
    }

    /**
     * Find company by slug with active vacancies.
     *
     * @param string $slug
     * @return Company
     */
    public function getCompanyBySlug(string $slug): Company
    {
        return Company::with(['vacancies' => fn ($q) => $q->active()->with(['category', 'jobType', 'workplaceType', 'experienceLevel'])->latest()])
            ->where('slug', $slug)
            ->firstOrFail();
    }
}
