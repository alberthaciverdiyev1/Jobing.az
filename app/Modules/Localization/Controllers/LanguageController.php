<?php

namespace App\Modules\Localization\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Localization\Services\LanguageService;
use Illuminate\Http\RedirectResponse;

class LanguageController extends Controller
{
    public function __construct(
        protected LanguageService $languageService
    ) {}

    public function switch(string $locale): RedirectResponse
    {
        $this->languageService->switchLocale($locale);

        return redirect()->back();
    }
}
