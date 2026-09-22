<?php

namespace App\Modules\Resume\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\JobAttribute\Models\Skill;
use App\Modules\Resume\Models\Resume;
use App\Modules\Vacancy\Services\VacancyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\View\View;

class ResumeController extends Controller
{
    public function index(Request $request): View|\Illuminate\Http\JsonResponse
    {
        $query = Resume::where('is_public', true)->with('user');

        // Search query (title, name, summary, location, skills, experiences)
        if ($search = $request->input('q')) {
            $search = trim($search);
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhere('first_name', 'ilike', "%{$search}%")
                    ->orWhere('last_name', 'ilike', "%{$search}%")
                    ->orWhere('summary', 'ilike', "%{$search}%")
                    ->orWhere('location', 'ilike', "%{$search}%")
                    ->orWhereHas('skillRecords', fn ($skillQuery) => $skillQuery
                        ->whereRaw('CAST(skills.name AS text) ILIKE ?', ["%{$search}%"])
                        ->orWhere('skills.slug', 'ilike', "%{$search}%"))
                    ->orWhereRaw("CAST(work_experiences AS text) ILIKE ?", ["%{$search}%"]);
            });
        }

        // Category filter
        $selectedSkills = (array) $request->input('skills', []);
        $selectedSkills = array_filter($selectedSkills);
        if ($categorySlug = $request->input('category')) {
            $categoryModel = \App\Modules\Category\Models\Category::where('slug', $categorySlug)
                ->with(['skills' => fn ($q) => $q->active(), 'children.skills' => fn ($q) => $q->active()])
                ->first();
            if ($categoryModel) {
                $allSkills = $categoryModel->skills->merge($categoryModel->children->flatMap->skills);
                $catSkillIds = $allSkills->pluck('id')->unique()->values()->all();

                if (!empty($catSkillIds)) {
                    $query->whereHas('skillRecords', fn ($q) => $q->whereIn('skills.id', $catSkillIds));
                }
            }
        }

        // Skill filter
        if (!empty($selectedSkills)) {
            $selectedNormalized = collect($selectedSkills)->map(fn ($skill) => mb_strtolower(trim($skill)))->all();
            $selectedSkillIds = Skill::cachedActive()->filter(function (Skill $skill) use ($selectedNormalized) {
                $rawName = $skill->getRawOriginal('name');
                $translations = is_string($rawName) ? (json_decode($rawName, true) ?: []) : (array) $rawName;
                $names = array_values($translations);
                return collect([...$names, $skill->slug])
                    ->filter(fn ($name) => is_string($name))
                    ->contains(fn ($name) => in_array(mb_strtolower(trim($name)), $selectedNormalized, true));
            })->pluck('id');

            $query->whereHas('skillRecords', fn ($q) => $q->whereIn('skills.id', $selectedSkillIds));
        }

        // City filter
        $selectedCities = (array) $request->input('city', []);
        $selectedCities = array_filter($selectedCities);
        if (!empty($selectedCities)) {
            $query->whereIn('location', $selectedCities);
        }

        // Sorting
        $sort = $request->input('sort', 'latest');
        if ($sort === 'oldest') {
            $query->oldest();
        } elseif ($sort === 'alphabetical') {
            $query->orderBy('first_name', 'asc')->orderBy('last_name', 'asc');
        } elseif ($sort === 'alphabetical_desc') {
            $query->orderBy('first_name', 'desc')->orderBy('last_name', 'desc');
        } else {
            $query->latest();
        }

        $resumes = $query->paginate(12)->withQueryString();

        $facetQuery = (clone $query)->reorder();
        $cityCounts = (clone $facetQuery)
            ->reorder()
            ->whereNotNull('location')
            ->where('location', '!=', '')
            ->selectRaw('location, count(*) as count')
            ->groupBy('location')
            ->pluck('count', 'location')
            ->toArray();

        $categories = Cache::remember('ref.categories.with_skills', 3600, fn () => \App\Modules\Category\Models\Category::parents()
            ->with(['skills' => fn ($q) => $q->active(), 'children.skills' => fn ($q) => $q->active()])
            ->get());

        // Build array of skills and resume count per category
        $categorySkillsMap = [];
        $categorySkillIds = [];
        foreach ($categories as $cat) {
            $catSkills = [];
            $allSkills = $cat->skills->merge($cat->children->flatMap->skills);

            foreach ($allSkills->unique('id') as $sk) {
                $skillName = is_array($sk->name) ? ($sk->name['az'] ?? reset($sk->name)) : $sk->name;
                $catSkills[] = [
                    'id' => $sk->id,
                    'name' => $skillName,
                ];
            }
            $categorySkillsMap[$cat->slug] = $catSkills;

            $categorySkillIds[$cat->slug] = $allSkills->pluck('id')->unique()->values()->all();
        }

        $filterSignature = md5(json_encode($request->except(['page', 'category']), JSON_UNESCAPED_UNICODE));
        $categoryResumeCounts = Cache::remember(
            'resumes.category-counts.' . $filterSignature,
            300,
            function () use ($categorySkillIds, $facetQuery) {
                $counts = [];
                foreach ($categorySkillIds as $slug => $skillIds) {
                    if (empty($skillIds)) {
                        $counts[$slug] = 0;
                        continue;
                    }

                    $counts[$slug] = (clone $facetQuery)
                        ->whereHas('skillRecords', fn ($query) => $query->whereIn('skills.id', $skillIds))
                        ->count();
                }

                return $counts;
            }
        );

        $popularSkills = Cache::remember('ref.skills.popular', 3600, fn () => Skill::active()->orderBy('order')->take(25)->get());

        $isAjax = ($request->ajax() || $request->header('X-Partial') || $request->wantsJson()) && !$request->acceptsHtml();

        if ($isAjax) {
            return response()->json([
                'html' => view('pages.resumes.partials.resume-list', [
                    'resumes' => $resumes,
                ])->render(),
                'total' => $resumes->total(),
                'cityCounts' => $cityCounts,
                'categoryCounts' => $categoryResumeCounts,
            ])
            ->header('Vary', 'X-Requested-With, Accept')
            ->header('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, private');
        }

        return view('pages.resumes.index', [
            'resumes' => $resumes,
            'cities' => VacancyService::cityOptions(),
            'cityCounts' => $cityCounts,
            'categories' => $categories,
            'categorySkillsMap' => $categorySkillsMap,
            'categoryCounts' => $categoryResumeCounts,
            'popularSkills' => $popularSkills,
            'totalCount' => $resumes->total(),
        ]);
    }

    public function show(Resume $resume): View
    {
        $user = auth()->user();

        // 1. Owner can always view their own CV
        // 2. Admin can always view
        // 3. Logged-in Company accounts can view
        // 4. Company that received an application with this CV can view
        // 5. If public, anyone can view
        $isOwner = $user && $user->id === $resume->user_id;
        $isAdmin = $user && (bool) $user->is_admin;
        $isCompany = $user && ($user->isCompany() || $user->user_type === 'company' || (bool) $user->company_id);
        $hasApplicationToCompany = $user && $user->company_id && $resume->applications()->whereHas('vacancy', fn ($v) => $v->where('company_id', $user->company_id))->exists();

        if (!$resume->is_public && !$isOwner && !$isAdmin && !$isCompany && !$hasApplicationToCompany) {
            abort(403, __('This resume is private and can only be viewed by its owner.'));
        }

        $view = request()->boolean('print') ? 'pages.resumes.print' : 'pages.resumes.show';

        return view($view, [
            'resume' => $resume,
            'autoPrint' => request()->boolean('print'),
        ]);
    }
}
