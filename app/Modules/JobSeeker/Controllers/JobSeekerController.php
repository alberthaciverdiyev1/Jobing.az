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
use Illuminate\Support\Facades\Cache;
use Illuminate\View\View;

class JobSeekerController extends Controller
{
    public function index(Request $request): View|\Illuminate\Http\JsonResponse
    {
        $query = JobSeeker::with(['category', 'jobType', 'workplaceType', 'experienceLevel'])
            ->published();

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

        $selectedCategories = (array) $request->input('category', []);
        if ($request->filled('subcategory')) {
            $selectedCategories = array_merge($selectedCategories, (array) $request->input('subcategory'));
        }
        $selectedCategories = array_filter($selectedCategories);
        if (!empty($selectedCategories)) {
            $catIds = Category::whereIn('slug', $selectedCategories)
                ->orWhereHas('parent', fn ($p) => $p->whereIn('slug', $selectedCategories))
                ->pluck('id');
            $query->whereIn('category_id', $catIds);
        }

        $selectedJobTypes = (array) $request->input('job_type', $request->input('type', []));
        $selectedJobTypes = array_filter($selectedJobTypes);
        if (!empty($selectedJobTypes)) {
            $query->whereHas('jobType', fn ($q) => $q->whereIn('slug', $selectedJobTypes));
        }

        $selectedWorkplaces = (array) $request->input('workplace_type', []);
        $selectedWorkplaces = array_filter($selectedWorkplaces);
        if (!empty($selectedWorkplaces)) {
            $query->whereHas('workplaceType', fn ($q) => $q->whereIn('slug', $selectedWorkplaces));
        }

        $selectedExperiences = (array) $request->input('experience_level', []);
        $selectedExperiences = array_filter($selectedExperiences);
        if (!empty($selectedExperiences)) {
            $query->whereHas('experienceLevel', fn ($q) => $q->whereIn('slug', $selectedExperiences));
        }

        $selectedCities = (array) $request->input('city', []);
        $selectedCities = array_filter($selectedCities);
        if (!empty($selectedCities)) {
            $query->whereIn('location', $selectedCities);
        }

        $selectedSkills = (array) $request->input('skills', []);
        $selectedSkills = array_filter($selectedSkills);
        if (!empty($selectedSkills)) {
            $query->where(function ($q) use ($selectedSkills) {
                foreach ($selectedSkills as $s) {
                    $q->orWhereJsonContains('skills', $s);
                }
            });
        }

        if ($minSalary = $request->input('min_salary')) {
            $minSalary = (float) $minSalary;
            $query->where(function ($q) use ($minSalary) {
                $q->where('salary_max', '>=', $minSalary)
                    ->orWhere('salary_min', '>=', $minSalary);
            });
        }

        if ($maxSalary = $request->input('max_salary')) {
            $maxSalary = (float) $maxSalary;
            $query->where(function ($q) use ($maxSalary) {
                $q->where('salary_min', '<=', $maxSalary)
                    ->orWhere(function ($sub) use ($maxSalary) {
                        $sub->whereNull('salary_min')->where('salary_max', '<=', $maxSalary);
                    });
            });
        }

        $sort = $request->input('sort', 'latest');
        if ($sort === 'oldest') {
            $query->orderBy('is_featured', 'desc')->orderByRaw('job_seekers.updated_at ASC');
        } elseif ($sort === 'salary_desc') {
            $query->orderBy('is_featured', 'desc')->orderByRaw('COALESCE(salary_max, salary_min, 0) DESC NULLS LAST')->orderByRaw('job_seekers.updated_at DESC');
        } elseif ($sort === 'salary_asc') {
            $query->orderBy('is_featured', 'desc')->orderByRaw('COALESCE(salary_min, salary_max, 999999) ASC NULLS LAST')->orderByRaw('job_seekers.updated_at DESC');
        } elseif ($sort === 'popular') {
            $query->orderBy('is_featured', 'desc')->orderByDesc('views_count')->orderByRaw('job_seekers.updated_at DESC');
        } elseif ($sort === 'featured') {
            $query->orderByDesc('is_featured')->orderByRaw('job_seekers.updated_at DESC');
        } elseif ($sort === 'alphabetical') {
            $query->orderBy('title', 'asc');
        } else {
            $query->orderBy('is_featured', 'desc')->orderByRaw('job_seekers.updated_at DESC');
        }

        $jobSeekers = $query->paginate(12)->withQueryString();

        $facetQuery = (clone $query)->reorder();
        $cityCounts = (clone $facetQuery)
            ->reorder()
            ->whereNotNull('location')
            ->where('location', '!=', '')
            ->selectRaw('location, count(*) as count')
            ->groupBy('location')
            ->pluck('count', 'location')
            ->toArray();

        $categories = Cache::remember('ref.categories.job-seekers', 3600, fn () => Category::parents()->with('children')->get());

        $countsByCategory = (clone $facetQuery)
            ->whereNotNull('category_id')
            ->selectRaw('category_id, count(*) as count')
            ->groupBy('category_id')
            ->pluck('count', 'category_id');

        $categoryCounts = [];
        $categoryChildrenMap = [];
        $categoryParentMap = [];
        foreach ($categories as $cat) {
            $familyIds = $cat->children->pluck('id')->push($cat->id);
            $categoryCounts[$cat->slug] = $familyIds->sum(fn ($id) => (int) ($countsByCategory[$id] ?? 0));
            $categoryChildrenMap[$cat->slug] = $cat->children->pluck('slug')->values()->all();
            foreach ($cat->children as $child) {
                $categoryParentMap[$child->slug] = $cat->slug;
                $categoryCounts[$child->slug] = (int) ($countsByCategory[$child->id] ?? 0);
            }
        }

        $isAjax = ($request->ajax() || $request->header('X-Partial') || $request->wantsJson()) && !$request->acceptsHtml();

        if ($isAjax) {
            return response()->json([
                'html' => view('pages.job-seekers.partials.seeker-list', [
                    'jobSeekers' => $jobSeekers,
                ])->render(),
                'total' => $jobSeekers->total(),
                'cityCounts' => $cityCounts,
                'categoryCounts' => $categoryCounts,
            ])
            ->header('Vary', 'X-Requested-With, Accept')
            ->header('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, private');
        }

        $requestedCategories = (array) $request->input('category', []);
        $activeParentCategories = $categories->filter(function ($c) use ($requestedCategories) {
            if (in_array($c->slug, $requestedCategories)) {
                return true;
            }
            if ($c->children && $c->children->isNotEmpty()) {
                return $c->children->contains(fn ($child) => in_array($child->slug, $requestedCategories));
            }
            return false;
        })->pluck('slug')->values()->all();

        return view('pages.job-seekers.index', [
            'jobSeekers' => $jobSeekers,
            'categories' => $categories,
            'categoryChildrenMap' => $categoryChildrenMap,
            'categoryParentMap' => $categoryParentMap,
            'categoryCounts' => $categoryCounts,
            'activeParentCategories' => $activeParentCategories,
            'jobTypes' => Cache::remember('ref.job-types.job-seekers', 3600, fn () => JobType::active()->withCount(['jobSeekers' => fn ($q) => $q->published()])->get()),
            'workplaceTypes' => Cache::remember('ref.workplace-types.job-seekers', 3600, fn () => WorkplaceType::active()->withCount(['jobSeekers' => fn ($q) => $q->published()])->get()),
            'experienceLevels' => Cache::remember('ref.experience-levels.job-seekers', 3600, fn () => ExperienceLevel::active()->withCount(['jobSeekers' => fn ($q) => $q->published()])->get()),
            'cities' => VacancyService::cityOptions(),
            'cityCounts' => $cityCounts,
            'selectedSkills' => $selectedSkills,
        ]);
    }

    public function create(): \Illuminate\Http\RedirectResponse
    {
        $user = auth()->user();

        if (! $user) {
            return redirect()->guest(route('login'));
        }

        if ($user->is_admin) {
            return redirect()->to(route('filament.admin.resources.job-seekers.create'));
        }

        if ($user->isCompany()) {
            return redirect()->to(route('filament.company.resources.company-job-seekers.index'));
        }

        return redirect()->to(route('filament.user.resources.my-job-seekers.create'));
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
            'status' => JobSeeker::STATUS_PENDING,
        ]);

        return redirect()->route('jobs.index')
            ->with('success', __('Your job seeking listing has been submitted and will be published after admin approval.'));
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
