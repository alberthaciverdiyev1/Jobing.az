<?php

namespace App\Modules\Home\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Home\Services\HomeService;
use Illuminate\View\View;

class HomeController extends Controller
{
    public function __construct(
        protected HomeService $homeService
    ) {}

    public function index(): View
    {
        $data = $this->homeService->getHomeData();

        return view('pages.home', $data);
    }

    public function about(): View
    {
        $stats = [
            'vacancies' => \App\Modules\Vacancy\Models\Vacancy::active()->count(),
            'companies' => \App\Modules\Company\Models\Company::count(),
            'resumes' => \App\Modules\Resume\Models\Resume::where('is_public', true)->count(),
            'jobSeekers' => \App\Modules\JobSeeker\Models\JobSeeker::published()->count(),
        ];

        return view('pages.about.index', compact('stats'));
    }
}
