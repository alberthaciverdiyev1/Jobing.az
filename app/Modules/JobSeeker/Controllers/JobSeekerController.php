<?php

namespace App\Modules\JobSeeker\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Category\Models\Category;
use App\Modules\JobAttribute\Models\ExperienceLevel;
use App\Modules\JobAttribute\Models\JobType;
use App\Modules\JobAttribute\Models\WorkplaceType;
use App\Modules\JobSeeker\Models\JobSeeker;
use App\Modules\JobSeeker\Requests\StoreJobSeekerRequest;
use App\Modules\Vacancy\Services\VacancyService;
use Illuminate\Http\Request;
use Illuminate\View\View;

class JobSeekerController extends Controller
{
    public function index(Request $request): View
    {
        $query = JobSeeker::with(['category', 'jobType', 'workplaceType', 'experienceLevel'])
            ->published();

        // Search query
        if ($search = $request->input('q')) {
            $search = trim($search);
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhere('position', 'ilike', "%{$search}%")
                    ->orWhere('description', 'ilike', "%{$search}%")
                    ->orWhere('location', 'ilike', "%{$search}%")
                    ->orWhere('contact_name', 'ilike', "%{$search}%");
            });
        }

        // Category filter (array or single string)
        $selectedCategories = (array) $request->input('category', []);
        $selectedCategories = array_filter($selectedCategories);
        if (!empty($selectedCategories)) {
            $catIds = Category::whereIn('slug', $selectedCategories)
                ->orWhereHas('parent', fn ($p) => $p->whereIn('slug', $selectedCategories))
                ->pluck('id');
            $query->whereIn('category_id', $catIds);
        }

        // Job Type filter
        $selectedJobTypes = (array) $request->input('job_type', $request->input('type', []));
        $selectedJobTypes = array_filter($selectedJobTypes);
        if (!empty($selectedJobTypes)) {
            $query->whereHas('jobType', fn ($q) => $q->whereIn('slug', $selectedJobTypes));
        }

        // Workplace Type filter
        $selectedWorkplaces = (array) $request->input('workplace_type', []);
        $selectedWorkplaces = array_filter($selectedWorkplaces);
        if (!empty($selectedWorkplaces)) {
            $query->whereHas('workplaceType', fn ($q) => $q->whereIn('slug', $selectedWorkplaces));
        }

        // Experience Level filter
        $selectedExperiences = (array) $request->input('experience_level', []);
        $selectedExperiences = array_filter($selectedExperiences);
        if (!empty($selectedExperiences)) {
            $query->whereHas('experienceLevel', fn ($q) => $q->whereIn('slug', $selectedExperiences));
        }

        // City filter (supports array or single string)
        $selectedCities = (array) $request->input('city', []);
        $selectedCities = array_filter($selectedCities);
        if (!empty($selectedCities)) {
            $query->whereIn('location', $selectedCities);
        }

        // Sorting
        $sort = $request->input('sort', 'latest');
        if ($sort === 'salary_desc') {
            $query->orderBy('is_featured', 'desc')->orderByRaw('COALESCE(salary_max, salary_min, 0) DESC')->orderByRaw('COALESCE(job_seekers.bumped_at, job_seekers.created_at) DESC');
        } elseif ($sort === 'salary_asc') {
            $query->orderBy('is_featured', 'desc')->orderByRaw('COALESCE(salary_min, salary_max, 999999) ASC')->orderByRaw('COALESCE(job_seekers.bumped_at, job_seekers.created_at) DESC');
        } elseif ($sort === 'popular') {
            $query->orderBy('is_featured', 'desc')->orderByDesc('views_count')->orderByRaw('COALESCE(job_seekers.bumped_at, job_seekers.created_at) DESC');
        } else {
            // Default: Premium first, then latest bumped/created
            $query->orderBy('is_featured', 'desc')->orderByRaw('COALESCE(job_seekers.bumped_at, job_seekers.created_at) DESC');
        }

        $jobSeekers = $query->paginate(12)->withQueryString();

        $cityCounts = JobSeeker::published()
            ->reorder()
            ->whereNotNull('location')
            ->where('location', '!=', '')
            ->selectRaw('location, count(*) as count')
            ->groupBy('location')
            ->pluck('count', 'location')
            ->toArray();

        return view('pages.job-seekers.index', [
            'jobSeekers' => $jobSeekers,
            'categories' => Category::parents()->with('children')->withCount(['jobSeekers' => fn ($q) => $q->published()])->get(),
            'jobTypes' => JobType::active()->withCount(['jobSeekers' => fn ($q) => $q->published()])->get(),
            'workplaceTypes' => WorkplaceType::active()->withCount(['jobSeekers' => fn ($q) => $q->published()])->get(),
            'experienceLevels' => ExperienceLevel::active()->withCount(['jobSeekers' => fn ($q) => $q->published()])->get(),
            'cities' => VacancyService::cityOptions(),
            'cityCounts' => $cityCounts,
        ]);
    }

    public function create(): View
    {
        return view('pages.job-seekers.create', [
            'categories' => Category::parents()->with('children')->get(),
            'jobTypes' => JobType::active()->get(),
            'workplaceTypes' => WorkplaceType::active()->get(),
            'experienceLevels' => ExperienceLevel::active()->get(),
            'cities' => VacancyService::cityOptions(),
        ]);
    }

    public function store(StoreJobSeekerRequest $request)
    {
        $data = $request->validated();

        $skills = $data['skills'] ?? null;
        if (is_string($skills)) {
            $skills = array_filter(array_map('trim', explode(',', $skills)));
        }

        $jobSeeker = JobSeeker::create([
            'user_id' => auth()->id(),
            'title' => $data['title'],
            'position' => $data['position'] ?? null,
            'description' => $data['description'],
            'category_id' => $data['category_id'] ?? null,
            'job_type_id' => $data['job_type_id'] ?? null,
            'workplace_type_id' => $data['workplace_type_id'] ?? null,
            'experience_level_id' => $data['experience_level_id'] ?? null,
            'skills' => $skills,
            'salary_min' => ($data['salary_negotiable'] ?? false) ? null : ($data['salary_min'] ?? null),
            'salary_max' => ($data['salary_negotiable'] ?? false) ? null : ($data['salary_max'] ?? null),
            'salary_negotiable' => $data['salary_negotiable'] ?? false,
            'currency' => $data['currency'] ?? 'AZN',
            'location' => $data['location'] ?? null,
            'availability' => $data['availability'] ?? 'immediate',
            'contact_name' => $data['contact_name'],
            'contact_email' => $data['contact_email'] ?? null,
            'contact_phone' => $data['contact_phone'] ?? null,
            'status' => JobSeeker::STATUS_PENDING, // Admin onayı bekler; onaylanınca yayınlanır.
        ]);

        return redirect()->route('home')
            ->with('success', __('İş axtarış elanınız qəbul edildi və admin onayından sonra yayınlanacaq.'));
    }

    public function show(string $slug): View
    {
        $jobSeeker = JobSeeker::with(['category', 'jobType', 'workplaceType', 'experienceLevel'])
            ->where('slug', $slug)
            ->firstOrFail();

        if (! is_bot_request()) {
            $jobSeeker->increment('views_count');
        }

        return view('pages.job-seekers.show', [
            'jobSeeker' => $jobSeeker,
        ]);
    }
}
