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
        return view('pages.about.index', [
            'stats' => $this->homeService->getAboutStats(),
        ]);
    }
}
