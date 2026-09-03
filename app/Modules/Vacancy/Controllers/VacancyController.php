<?php

namespace App\Modules\Vacancy\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Category\Models\Category;
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
        $data = $this->vacancyService->getPaginatedVacancies($request->query());

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
                    'message' => __('Siz artıq bu vakansiyaya müraciət etmisiniz.'),
                ], 422);
            }
            return back()->with('error', __('Siz artıq bu vakansiyaya müraciət etmisiniz.'));
        }

        // Misafir kullanıcılar için e-posta bazlı tekrar kontrolü (spam önleme)
        if (! auth()->check()) {
            $applicantEmail = mb_strtolower(trim((string) ($request->validated()['applicant_email'] ?? '')));
            if ($applicantEmail !== '' && \App\Modules\Application\Models\Application::where('vacancy_id', $vacancy->id)
                ->whereRaw('LOWER(applicant_email) = ?', [$applicantEmail])
                ->exists()) {
                $duplicateMsg = __('Bu e-poçt ünvanı ilə artıq bu vakansiyaya müraciət etmisiniz.');
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
            __('Vakansiya artıq mövcud deyil')
        );

        $application = $this->vacancyService->applyToVacancy(
            $vacancy,
            $request->validated(),
            $request->file('resume')
        );

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => __('Müraciətiniz uğurla göndərildi! İşəgötürən dəyərləndirmə prosesinə aldıqda sizinlə əlaqə saxlayacaq.'),
                'application_id' => $application->id,
            ]);
        }

        return back()->with('success', __('Müraciətiniz uğurla göndərildi!'));
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
            ->with('success', __('İş elanınız qəbul edildi! Admin tərəfindən təsdiqləndikdən sonra saytda yayımlanacaq.'));
    }
}
