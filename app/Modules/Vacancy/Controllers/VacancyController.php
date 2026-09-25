<?php

namespace App\Modules\Vacancy\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Category\Models\Category;
use App\Modules\JobAttribute\Models\City;
use App\Modules\Vacancy\Models\Vacancy;
use App\Modules\Vacancy\Requests\ApplyVacancyRequest;
use App\Modules\Vacancy\Requests\StoreVacancyRequest;
use App\Modules\Vacancy\Services\VacancyService;
use App\Modules\Vacancy\Support\FacetCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
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
        $includeScraped = $request->boolean('include_scraped');

        return $this->listingResponse($request, $includeScraped);
    }

    public function external(Request $request): View|JsonResponse|Response
    {
        return $this->listingResponse($request, true);
    }

    private function listingResponse(Request $request, bool $includeScraped): View|JsonResponse|Response
    {
        $data = $this->vacancyService->getPaginatedVacancies($request->all(), 30, $includeScraped);
        $data['isExternal'] = $request->routeIs('jobs.external');
        $data['includeScraped'] = $includeScraped;

        $isAjax = ($request->ajax() || $request->header('X-Partial') || $request->wantsJson()) && ! $request->acceptsHtml();

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
                'includeScraped' => $includeScraped,
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

    public function resolveSlug(Request $request, string $slug): View|JsonResponse|Response
    {
        $cleanSlug = strtolower(trim($slug));

        $city = City::where('slug', $cleanSlug)->first();
        if ($city) {
            $existingCities = (array) $request->input('city', []);
            if (!in_array($city->slug, $existingCities, true)) {
                $existingCities[] = $city->slug;
            }
            $request->merge(['city' => $existingCities]);

            return $this->index($request);
        }

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

        $vacancy = Vacancy::where('slug', $slug)->first();
        if ($vacancy) {
            return $this->show($slug);
        }

        abort(404);
    }

    public function resolveListingSlug(Request $request, string $slug): View|JsonResponse|Response
    {
        $cleanSlug = strtolower(trim($slug));

        $city = City::where('slug', $cleanSlug)->first();
        if ($city) {
            $existingCities = (array) $request->input('city', []);
            if (! in_array($city->slug, $existingCities, true)) {
                $existingCities[] = $city->slug;
            }
            $request->merge(['city' => $existingCities]);

            return $this->index($request);
        }

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

        abort(404);
    }

    public function fallback(Request $request): View|JsonResponse|Response
    {
        if (! $request->isMethod('GET') && ! $request->isMethod('HEAD')) {
            abort(404);
        }

        $segments = array_values(array_filter(explode('/', trim($request->path(), '/'))));

        if (count($segments) === 2) {
            $a = strtolower(trim(urldecode($segments[0])));
            $b = strtolower(trim(urldecode($segments[1])));

            $isCityA = City::where('slug', $a)->exists();
            $isCatA = Category::where('slug', $a)->exists();
            $isCityB = City::where('slug', $b)->exists();
            $isCatB = Category::where('slug', $b)->exists();

            if (! (($isCityA && $isCatB) || ($isCatA && $isCityB))) {
                abort(404);
            }

            return $this->filterTwoParams($request, urldecode($segments[0]), urldecode($segments[1]));
        }

        if (count($segments) === 1) {
            return $this->resolveListingSlug($request, urldecode($segments[0]));
        }

        abort(404);
    }

    public function filterTwoParams(Request $request, string $param1, string $param2): View|JsonResponse|Response
    {
        $cleanParam1 = strtolower(trim($param1));
        $cleanParam2 = strtolower(trim($param2));

        $city = City::where('slug', $cleanParam1)->first();
        $category = Category::where('slug', $cleanParam2)->first();

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
            ->with('success', __(__('Your job listing has been submitted! It will be published on the site after admin approval.')));
    }
}
