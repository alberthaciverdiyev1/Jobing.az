<?php

namespace App\Modules\Home\Services;

use App\Modules\Category\Models\Category;
use App\Modules\Company\Models\Company;
use App\Modules\Vacancy\Models\Vacancy;

class HomeService
{
    /**
     * Retrieve aggregated data for the homepage.
     *
     * @return array
     */
    public function getHomeData(): array
    {
        $latestJobs = Vacancy::with(['company', 'category', 'jobType', 'workplaceType', 'experienceLevel'])
            ->active()
            ->orderBy('is_featured', 'desc')
            ->orderByRaw('COALESCE(bumped_at, created_at) DESC')
            ->take(8)
            ->get();

        $categories = Category::withCount(['vacancies' => fn ($q) => $q->active()])
            ->orderByDesc('vacancies_count')
            ->take(8)
            ->get();

        $allCategories = Category::parents()
            ->withCount(['vacancies' => fn ($q) => $q->active()])
            ->orderByDesc('vacancies_count')
            ->take(9)
            ->get();

        $recentJobsCount = Vacancy::active()
            ->where('created_at', '>=', now()->subDays(7))
            ->count();

        // Verified companies for the "trusted companies" marquee (only verified companies)
        $topCompanies = Company::where('is_verified', true)
            ->withCount('vacancies')
            ->orderByDesc('vacancies_count')
            ->take(10)
            ->get();

        $stats = [
            'jobs' => Vacancy::active()->count(),
            'companies' => Company::count(),
            'verified_companies' => Company::where('is_verified', true)->count(),
            'categories' => Category::count(),
            'applications' => \App\Modules\Application\Models\Application::count(),
            'remote' => Vacancy::active()->whereHas('workplaceType', fn ($q) => $q->where('slug', 'remote')->orWhere('name', 'ilike', '%Uzaktan%')->orWhere('name', 'ilike', '%Məsafədən%'))->count(),
            'recent_7_days' => $recentJobsCount,
        ];

        return [
            'latestJobs' => $latestJobs,
            'categories' => $categories,
            'allCategories' => $allCategories,
            'topCompanies' => $topCompanies,
            'stats' => $stats,
        ];
    }
}
