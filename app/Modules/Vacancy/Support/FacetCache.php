<?php

namespace App\Modules\Vacancy\Support;

use Closure;
use Illuminate\Support\Facades\Cache;

/**
 * İş elanı filtri "facet"ları (kateqoriya/növ/iş rejimi/təcrübə/şəhər sayları)
 * üçün keş. Filtr imzasına görə saxlanır; vakansiya və ya referans məlumat
 * dəyişdikdə versiya artırılır və köhnə keşlər avtomatik etibarsız olur.
 *
 * Keş açarları APP_ENV ilə də prefikslənir: test (sqlite, boş data) keşi
 * lokal/production keşini zəhərləyə bilməsin.
 */
class FacetCache
{
    public const VERSION_KEY = 'vacancies.facets.version';

    protected static function environment(): string
    {
        return app()->environment();
    }

    protected static function versionKey(): string
    {
        return self::VERSION_KEY . '.' . self::environment();
    }

    public static function version(): int
    {
        return (int) (Cache::get(self::versionKey()) ?? 1);
    }

    public static function bump(): void
    {
        Cache::forever(self::versionKey(), self::version() + 1);
    }

    public static function remember(string $signature, Closure $callback, int $seconds = 3600): mixed
    {
        return Cache::remember(
            'vacancies.facets.' . self::environment() . '.' . self::version() . '.' . md5($signature),
            $seconds,
            $callback,
        );
    }

    /**
     * Siyahı (listing) cavabı üçün keş. Ağır merge/sort nəticəsini imza üzrə saxlayır;
     * yeni veri gələndə (FacetCache::bump) və ya TTL bitəndə yenilənir.
     */
    public static function rememberListing(string $signature, Closure $callback, int $seconds = 3600): mixed
    {
        return Cache::remember(
            'vacancies.listing.' . self::environment() . '.' . self::version() . '.' . md5($signature),
            $seconds,
            $callback,
        );
    }
}
