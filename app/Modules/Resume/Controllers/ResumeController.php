<?php

namespace App\Modules\Resume\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\JobAttribute\Models\Skill;
use App\Modules\Resume\Models\Resume;
use App\Modules\Vacancy\Services\VacancyService;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ResumeController extends Controller
{
    public function index(Request $request): View
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
                    ->orWhereRaw("CAST(skills AS text) ILIKE ?", ["%{$search}%"])
                    ->orWhereRaw("CAST(work_experiences AS text) ILIKE ?", ["%{$search}%"]);
            });
        }

        // Skill filter
        $selectedSkills = (array) $request->input('skills', []);
        $selectedSkills = array_filter($selectedSkills);
        if (!empty($selectedSkills)) {
            $query->where(function ($q) use ($selectedSkills) {
                foreach ($selectedSkills as $s) {
                    $q->orWhereRaw("CAST(skills AS text) ILIKE ?", ["%{$s}%"]);
                }
            });
        }

        // City filter
        $selectedCities = (array) $request->input('city', []);
        $selectedCities = array_filter($selectedCities);
        if (!empty($selectedCities)) {
            $query->whereIn('location', $selectedCities);
        }

        // Sorting
        $sort = $request->input('sort', 'latest');
        if ($sort === 'alphabetical') {
            $query->orderBy('first_name', 'asc')->orderBy('last_name', 'asc');
        } else {
            $query->latest();
        }

        $resumes = $query->paginate(12)->withQueryString();

        $cityCounts = Resume::where('is_public', true)
            ->reorder()
            ->whereNotNull('location')
            ->where('location', '!=', '')
            ->selectRaw('location, count(*) as count')
            ->groupBy('location')
            ->pluck('count', 'location')
            ->toArray();

        $categories = \App\Modules\Category\Models\Category::parents()
            ->with(['skills' => fn ($q) => $q->active()])
            ->get();

        // Build array of skills grouped by category slug for seamless Alpine.js switching
        $categorySkillsMap = [];
        foreach ($categories as $cat) {
            $catSkills = [];
            foreach ($cat->skills as $sk) {
                $skillName = is_array($sk->name) ? ($sk->name['az'] ?? reset($sk->name)) : $sk->name;
                $catSkills[] = [
                    'id' => $sk->id,
                    'name' => $skillName,
                ];
            }
            $categorySkillsMap[$cat->slug] = $catSkills;
        }

        $popularSkills = Skill::active()->orderBy('order')->take(25)->get();

        return view('pages.resumes.index', [
            'resumes' => $resumes,
            'cities' => VacancyService::cityOptions(),
            'cityCounts' => $cityCounts,
            'categories' => $categories,
            'categorySkillsMap' => $categorySkillsMap,
            'popularSkills' => $popularSkills,
            'totalCount' => Resume::where('is_public', true)->count(),
        ]);
    }

    public function show(Resume $resume): View
    {
        $user = auth()->user();

        // 1. Owner can always view their own CV
        // 2. Admin can always view
        // 3. Logged-in Company accounts can view
        // 4. If public, anyone can view
        $isOwner = $user && $user->id === $resume->user_id;
        $isAdmin = $user && (bool) $user->is_admin;
        $isCompany = $user && ($user->isCompany() || $user->user_type === 'company');

        if (!$resume->is_public && !$isOwner && !$isAdmin && !$isCompany) {
            abort(403, __('Bu CV gizlidir və yalnız sahibi tərəfindən baxıla bilər.'));
        }

        $view = request()->boolean('print') ? 'pages.resumes.print' : 'pages.resumes.show';

        return view($view, [
            'resume' => $resume,
            'autoPrint' => request()->boolean('print'),
        ]);
    }
}
