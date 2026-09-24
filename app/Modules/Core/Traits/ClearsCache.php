<?php

namespace App\Modules\Core\Traits;

use Closure;
use Illuminate\Support\Facades\Cache;


trait ClearsCache
{
    protected static function bootClearsCache(): void
    {
        static::saved(fn () => static::flushModelCache());
        static::deleted(fn () => static::flushModelCache());
    }

    
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
