<?php

namespace App\Modules\Localization\Services;

use Illuminate\Support\Facades\Session;

class LanguageService
{
    /**
     * Switch application locale if it is within configured available locales.
     *
     * @param string $locale
     * @return bool
     */
    public function switchLocale(string $locale): bool
    {
        $supported = array_keys(config('app.available_locales', [
            'az' => [],
            'en' => [],
            'ru' => [],
            'tr' => [],
        ]));

        if (in_array($locale, $supported, true)) {
            Session::put('locale', $locale);
            return true;
        }

        return false;
    }
}
