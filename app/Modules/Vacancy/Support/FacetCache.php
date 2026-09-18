<?php

namespace App\Modules\Vacancy\Support;

use Closure;
use Illuminate\Support\Facades\Cache;

/**
 * İş elanı filtri "facet"ları (kateqoriya/növ/iş rejimi/təcrübə/şəhər sayları)
 * üçün keş. Filtr imzasına görə saxlanır; vakansiya və ya referans məlumat
 * dəyişdikdə versiya artırılır və köhnə keşlər avtomatik etibarsız olur.
 */
class FacetCache
{
    public const VERSION_KEY = 'vacancies.facets.version';

    public static function version(): int
    {
        return (int) (Cache::get(self::VERSION_KEY) ?? 1);
    }

    public static function bump(): void
    {
        Cache::forever(self::VERSION_KEY, self::version() + 1);
    }

    public static function remember(string $signature, Closure $callback, int $seconds = 300): mixed
    {
        return Cache::remember(
            'vacancies.facets.' . self::version() . '.' . md5($signature),
            $seconds,
            $callback,
        );
    }
}
