<?php

namespace App\Modules\Core\Traits;

use Closure;
use Illuminate\Support\Facades\Cache;

/**
 * Referans (nadiren dəyişən) məlumatlar üçün keş idarəetməsi.
 * Model saved/deleted olduqda aid olduğu keş açarları avtomatik silinir,
 * növbəti sorğuda yenidən keşlənir. Admin paneldən məlumat əlavə/redaktə
 * edildikdə beləliklə köhnə keş qalmır.
 */
trait ClearsCache
{
    protected static function bootClearsCache(): void
    {
        static::saved(fn () => static::flushModelCache());
        static::deleted(fn () => static::flushModelCache());
    }

    /** Bu modelə aid keş açarları. */
    abstract public static function cacheKeys(): array;

    public static function flushModelCache(): void
    {
        foreach (static::cacheKeys() as $key) {
            Cache::forget($key);
        }
    }

    protected static function remember(string $key, Closure $callback, int $seconds = 3600): mixed
    {
        return Cache::remember($key, $seconds, $callback);
    }
}
