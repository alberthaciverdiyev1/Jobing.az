<?php

namespace App\Modules\Vacancy\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Category\Models\Category;
use App\Modules\JobAttribute\Models\City;
use App\Modules\Vacancy\Models\Vacancy;
use App\Modules\Vacancy\Requests\ApplyVacancyRequest;
use App\Modules\Vacancy\Requests\StoreVacancyRequest;
use App\Modules\Vacancy\Services\VacancyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\View\View;

class VacancyController extends Controller
{
    public function __construct(
        protected VacancyService $vacancyService
    ) {}

    public function index(Request $request): View|JsonResponse|Response
    {
        $data = $this->vacancyService->getPaginatedVacancies($request->all());

        // Only return JSON if this is an explicit AJAX fetch call and not standard browser page navigation.
        // When navigating back, browsers send Accept: text/html, which must receive the full HTML view.
        $isAjax = ($request->ajax() || $request->header('X-Partial') || $request->wantsJson()) && !$request->acceptsHtml();

        if ($isAjax) {
            return response()->json([
                'html' => view('pages.jobs.partials.job-list', $data)->render(),
                'total' => $data['jobs']->total(),
                'selectedCategory' => $data['selectedCategory'] ? [
                    'name' => $data['selectedCategory']->name,
                    'slug' => $data['selectedCategory']->slug,
                ] : null,
                'selectedCategories' => $data['selectedCategories']->map(fn ($c) => [
                    'name' => $c->name,
                    'slug' => $c->slug,
                ])->values(),
                'counts' => [
                    'jobTypes' => $data['jobTypes']->pluck('vacancies_count', 'slug'),
                    'workplaceTypes' => $data['workplaceTypes']->pluck('vacancies_count', 'slug'),
                    'experienceLevels' => $data['experienceLevels']->pluck('vacancies_count', 'slug'),
                    'cities' => $data['cities']->pluck('vacancies_count', 'slug'),
                    'categories' => $data['categoryCounts'],
                ],
            ])
            ->header('Vary', 'X-Requested-With, Accept')
            ->header('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, private')
            ->header('Pragma', 'no-cache')
            ->header('Expires', '0');
        }

        return response()
            ->view('pages.jobs.index', $data)
            ->header('Vary', 'X-Requested-With, Accept');
    }

    public function show(string $slug): View
    {
        $data = $this->vacancyService->getVacancyDetails($slug);

        return view('pages.jobs.show', $data);
    }

    /**
     * Resolve single segment URL: /jobs/{slug}
     * Can match City, Category, or individual Vacancy.
     */
    public function resolveSlug(Request $request, string $slug): View|JsonResponse|Response
    {
        $cleanSlug = strtolower(trim($slug));

        // 1. Check if slug matches a City
        $city = City::where('slug', $cleanSlug)->first();
        if ($city) {
            $existingCities = (array) $request->input('city', []);
            if (!in_array($city->slug, $existingCities, true)) {
                $existingCities[] = $city->slug;
            }
            $request->merge(['city' => $existingCities]);

            return $this->index($request);
        }

        // 2. Check if slug matches a Category (parent or subcategory)
        $category = Category::where('slug', $cleanSlug)->first();
        if ($category) {
            $existingCats = array_filter((array) $request->input('category', []));
            if ($sub = $request->input('subcategory')) {
                $subCats = array_filter((array) $sub);
                $existingCats = array_unique(array_merge($existingCats, $subCats));
            }
            if (empty($existingCats)) {
                $existingCats = [$category->slug];
            }
            $request->merge(['category' => array_values($existingCats)]);

            return $this->index($request);
        }

        // 3. Check if slug matches a Vacancy (job detail)
        $vacancy = Vacancy::where('slug', $slug)->first();
        if ($vacancy) {
            return $this->show($slug);
        }

        abort(404);
    }

    /**
     * Resolve two segment URL: /jobs/{citySlug}/{categorySlug}
     * e.g. /jobs/baki/computer-science or /jobs/baki/computer-science?subcategory=backend
     */
    public function filterTwoParams(Request $request, string $param1, string $param2): View|JsonResponse|Response
    {
        $cleanParam1 = strtolower(trim($param1));
        $cleanParam2 = strtolower(trim($param2));

        // Case A: /jobs/{citySlug}/{categorySlug}
        $city = City::where('slug', $cleanParam1)->first();
        $category = Category::where('slug', $cleanParam2)->first();

        // Case B: /jobs/{categorySlug}/{citySlug} (fallback)
        if (!$city || !$category) {
            $categoryAlt = Category::where('slug', $cleanParam1)->first();
            $cityAlt = City::where('slug', $cleanParam2)->first();
            if ($categoryAlt && $cityAlt) {
                $category = $categoryAlt;
                $city = $cityAlt;
            }
        }

        if (!$city && !$category) {
            abort(404);
        }

        if ($city) {
            $existingCities = (array) $request->input('city', []);
            if (!in_array($city->slug, $existingCities, true)) {
                $existingCities[] = $city->slug;
            }
            $request->merge(['city' => $existingCities]);
        }

        if ($category) {
            $existingCats = array_filter((array) $request->input('category', []));
            if ($sub = $request->input('subcategory')) {
                $subCats = array_filter((array) $sub);
                $existingCats = array_unique(array_merge($existingCats, $subCats));
            }
            if (empty($existingCats)) {
                $existingCats = [$category->slug];
            }
            $request->merge(['category' => array_values($existingCats)]);
        }

        return $this->index($request);
    }

    /**
     * SEO-friendly category (and optional city) listing URL.
     * e.g. /isler/backend-developer or /isler/backend-developer/baki
     * Merges the path segments into the request so the existing index() renders them.
     */
    public function seo(Request $request, string $categorySlug, ?string $city = null): View|JsonResponse|Response
    {
        $category = Category::where('slug', $categorySlug)
            ->orWhereHas('parent', fn ($q) => $q->where('slug', $categorySlug))
            ->first();

        abort_unless($category, 404);

        $request->merge(['category' => [$category->slug]]);

        if ($city) {
            $request->merge(['city' => [$city]]);
        }

        return $this->index($request);
    }

    public function apply(ApplyVacancyRequest $request, string $slug): JsonResponse|RedirectResponse
    {
        $vacancy = Vacancy::where('slug', $slug)->firstOrFail();

        if (auth()->check() && \App\Modules\Application\Models\Application::where('vacancy_id', $vacancy->id)->where('user_id', auth()->id())->exists()) {
            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => __('You have already applied to this vacancy.'),
                ], 422);
            }
            return back()->with('error', __('You have already applied to this vacancy.'));
        }

        // Misafir kullanıcılar için e-posta bazlı tekrar kontrolü (spam önleme)
        if (! auth()->check()) {
            $applicantEmail = mb_strtolower(trim((string) ($request->validated()['applicant_email'] ?? '')));
            if ($applicantEmail !== '' && \App\Modules\Application\Models\Application::where('vacancy_id', $vacancy->id)
                ->whereRaw('LOWER(applicant_email) = ?', [$applicantEmail])
                ->exists()) {
                $duplicateMsg = __('You have already applied to this vacancy with this email address.');
                if ($request->wantsJson() || $request->ajax()) {
                    return response()->json(['success' => false, 'message' => $duplicateMsg], 422);
                }
                return back()->with('error', $duplicateMsg);
            }
        }

        // Reject applications for inactive or expired vacancies
        abort_unless(
            $vacancy->is_active && (!$vacancy->deadline || $vacancy->deadline->gte(today())),
            404,
            __('Vacancy no longer available')
        );

        $application = $this->vacancyService->applyToVacancy(
            $vacancy,
            $request->validated(),
            $request->file('resume')
        );

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => __('Your application was submitted successfully! The employer will contact you once your application is reviewed.'),
                'application_id' => $application->id,
            ]);
        }

        return back()->with('success', __('Your application was submitted successfully!'));
    }

    public function create(): View
    {
        $data = $this->vacancyService->getCreationFormData();

        return view('pages.jobs.create', $data);
    }

    public function store(StoreVacancyRequest $request): RedirectResponse
    {
        $vacancy = $this->vacancyService->createVacancy($request->validated());

        return redirect()->route('jobs.show', $vacancy->slug)
            ->with('success', __('Your job listing has been submitted! It will be published on the site after admin approval.'));
    }
}
