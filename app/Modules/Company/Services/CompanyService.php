<?php

namespace App\Modules\Company\Services;

use App\Modules\Company\Models\Company;
use App\Modules\Vacancy\Models\Vacancy;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class CompanyService
{
    public function getPaginatedCompanies(array $filters = [], int $perPage = 12): array
    {
        $query = Company::publicProfile()
            ->withCount(['vacancies' => fn ($q) => $q->active()])
            ->with(['city', 'vacancies' => fn ($q) => $q->active()->with(['company', 'city', 'jobType', 'workplaceType'])->orderByDesc('updated_at')->take(3)]);

        if (!empty($filters['q'])) {
            $search = trim($filters['q']);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhereHas('city', fn ($cq) => $cq->where('slug', 'ilike', "%{$search}%"))
                    ->orWhere('about', 'ilike', "%{$search}%");
            });
        }

        $sort = $filters['sort'] ?? 'latest';
        if ($sort === 'active_jobs') {
            $query->has('vacancies', '>=', 1, 'and', fn ($q) => $q->active())
                ->orderByDesc('vacancies_count')->latest('created_at');
        } elseif ($sort === 'verified_only') {
            $query->where('is_verified', true)->latest('created_at');
        } elseif ($sort === 'popular') {
            $query->orderByDesc('vacancies_count')->latest('created_at');
        } elseif ($sort === 'alphabetical') {
            $query->orderBy('name', 'asc');
        } else {
            $query->latest('created_at');
        }

        $companies = $query->paginate($perPage)->withQueryString();

        $stats = Cache::remember('companies.public.stats', 300, fn () => [
            'total_companies' => Company::publicProfile()->count(),
            'verified_companies' => Company::publicProfile()->where('is_verified', true)->count(),
            'active_vacancies' => Vacancy::active()->count(),
        ]);

        return [
            'companies' => $companies,
            'stats' => $stats,
            'filters' => $filters,
        ];
    }

    public function getCompanyBySlug(string $slug): Company
    {
        return Company::with(['vacancies' => fn ($q) => $q->active()->with(['company', 'city', 'category', 'jobType', 'workplaceType', 'experienceLevel'])->orderByDesc('updated_at')])
            ->where('slug', $slug)
            ->firstOrFail();
    }
}
