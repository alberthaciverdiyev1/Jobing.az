<?php

namespace App\Modules\Localization\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request and set the active locale.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $availableLocales = array_keys(config('app.available_locales', [
            'az' => [],
            'en' => [],
            'ru' => [],
            'tr' => [],
        ]));

        $locale = Session::get('locale', config('app.locale', 'az'));

        if (!in_array($locale, $availableLocales, true)) {
            $locale = config('app.fallback_locale', 'az');
        }

        App::setLocale($locale);

        return $next($request);
    }
}
