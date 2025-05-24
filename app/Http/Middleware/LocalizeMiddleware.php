<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;
use Symfony\Component\HttpFoundation\Response;

class LocalizeMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
//        if (LaravelLocalization::getCurrentLocale() !== 'az') {
//            $locale = LaravelLocalization::getCurrentLocale();
//            $request->route()->setPrefix($locale);
//        }

        return $next($request);
    }
}
